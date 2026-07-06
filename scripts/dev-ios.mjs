import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { access, readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';
import { networkInterfaces } from 'node:os';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { APPLE_DEVELOPMENT_TEAM_ID, IOS_APP_BUNDLE_ID } from './consts.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const iosProjectDir = resolve(root, 'ios/App');
const iosCapConfigPath = resolve(iosProjectDir, 'App/capacitor.config.json');
const defaultPort = 5173;
const readyTimeoutMs = 90_000;
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

let devServer;
let devServerExit;
let liveReloadConfigBackup;
let shuttingDown = false;

process.on('exit', restoreLiveReloadConfigSync);
process.on('SIGINT', () => {
  shutdown('SIGINT');
  process.exit(130);
});
process.on('SIGTERM', () => {
  shutdown('SIGTERM');
  process.exit(143);
});

try {
  loadLocalEnv();
  const options = parseArgs(process.argv.slice(2));
  await main(options);
} catch (error) {
  shutdown('SIGINT');
  console.error(`[ios:dev] ${error instanceof Error ? error.message : error}`);
  process.exitCode = process.exitCode || 1;
}

async function main(options) {
  if (options.listTargets) {
    await run(npx, ['cap', 'run', 'ios', ...options.nativeArgs], { env: process.env });
    return;
  }

  const nativeOptions = resolveDevelopmentTeam(parseNativeOptions(options.nativeArgs));

  if (options.standalone) {
    await runStandaloneIOSApp(nativeOptions);
    return;
  }

  const host = options.host ?? detectLanHost();
  const devUrl = `http://${host}:${options.port}`;
  const localReadyUrl = `http://127.0.0.1:${options.port}`;

  await ensureNativeWebDir();

  console.log(`[ios:dev] Starting React Router dev server for native mode on ${devUrl}`);
  console.log('[ios:dev] Keep your iPhone on the same Wi-Fi as this Mac.');

  devServer = spawn(
    npx,
    [
      'react-router',
      'dev',
      '--host',
      options.bindHost,
      '--port',
      String(options.port),
      '--strictPort',
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        VITE_BUILD_TARGET: 'native',
        VITE_BUILD_LANG: process.env.VITE_BUILD_LANG ?? 'en',
      },
      stdio: 'inherit',
    },
  );

  devServer.on('exit', (code, signal) => {
    devServerExit = { code, signal };
    if (!shuttingDown) {
      console.error(`[ios:dev] Dev server exited (${formatExit(code, signal)}).`);
      shutdown('SIGINT');
    }
  });

  await waitForServer(localReadyUrl, readyTimeoutMs);
  if (shuttingDown) {
    return;
  }

  await run(npx, ['cap', 'sync', 'ios', '--inline'], { env: process.env });
  await writeLiveReloadConfig(devUrl);

  const appPath = await buildIOSApp(nativeOptions);
  await run(npx, ['native-run', 'ios', '--app', appPath, ...nativeRunTargetArgs(nativeOptions)], { env: process.env });

  console.log(`[ios:dev] App installed on iPhone with live reload at ${devUrl}. Press Ctrl+C to stop.`);
  await sleepForever();
}

function parseArgs(args) {
  let host = process.env.IOS_DEV_HOST ?? process.env.CAP_DEV_HOST;
  let port = parsePort(process.env.IOS_DEV_PORT ?? process.env.CAP_DEV_PORT ?? process.env.PORT);
  let bindHost = process.env.IOS_DEV_BIND_HOST ?? '0.0.0.0';
  let standalone = false;
  const nativeArgs = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--host') {
      host = readValue(args, ++i, arg);
      continue;
    }

    if (arg.startsWith('--host=')) {
      host = arg.slice('--host='.length);
      continue;
    }

    if (arg === '--port') {
      port = parsePort(readValue(args, ++i, arg));
      continue;
    }

    if (arg.startsWith('--port=')) {
      port = parsePort(arg.slice('--port='.length));
      continue;
    }

    if (arg === '--bind') {
      bindHost = readValue(args, ++i, arg);
      continue;
    }

    if (arg.startsWith('--bind=')) {
      bindHost = arg.slice('--bind='.length);
      continue;
    }

    if (arg === '--standalone' || arg === '--offline') {
      standalone = true;
      continue;
    }

    nativeArgs.push(arg);
  }

  return {
    bindHost,
    host,
    listTargets: nativeArgs.includes('--list'),
    nativeArgs,
    port: port ?? defaultPort,
    standalone,
  };
}

function parseNativeOptions(args) {
  let configuration = 'Debug';
  let scheme = 'App';
  let team = process.env.IOS_DEVELOPMENT_TEAM || APPLE_DEVELOPMENT_TEAM_ID;
  let target;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--configuration') {
      configuration = readValue(args, ++i, arg);
      continue;
    }

    if (arg.startsWith('--configuration=')) {
      configuration = arg.slice('--configuration='.length);
      continue;
    }

    if (arg === '--scheme') {
      scheme = readValue(args, ++i, arg);
      continue;
    }

    if (arg.startsWith('--scheme=')) {
      scheme = arg.slice('--scheme='.length);
      continue;
    }

    if (arg === '--team') {
      team = readValue(args, ++i, arg);
      continue;
    }

    if (arg.startsWith('--team=')) {
      team = arg.slice('--team='.length);
      continue;
    }

    if (arg === '--target') {
      target = readValue(args, ++i, arg);
      continue;
    }

    if (arg.startsWith('--target=')) {
      target = arg.slice('--target='.length);
      continue;
    }

    if (arg === '--target-name' || arg.startsWith('--target-name=')) {
      throw new Error('ios:dev uses xcodebuild directly; pass a device ID with --target instead of --target-name.');
    }
  }

  return { configuration, scheme, target, team };
}

function resolveDevelopmentTeam(nativeOptions) {
  if (nativeOptions.team) {
    return nativeOptions;
  }

  const detectedTeam = detectDevelopmentTeam();
  if (detectedTeam) {
    console.log(`[ios:dev] Using Apple development team ${detectedTeam} from the local signing identity.`);
    return { ...nativeOptions, team: detectedTeam };
  }

  ensureDevelopmentTeam(nativeOptions);
  return nativeOptions;
}

function ensureDevelopmentTeam({ team }) {
  if (team) {
    return;
  }

  throw new Error(
    'Missing Apple development team. Set IOS_DEVELOPMENT_TEAM in .env.local or pass --team <team-id>. ' +
      'Find the team ID in Xcode under Settings > Accounts > Team ID.',
  );
}

function detectDevelopmentTeam() {
  const result = spawnSync('security', ['find-identity', '-v', '-p', 'codesigning'], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return undefined;
  }

  const teams = new Set();
  const pattern = /"(?:Apple Development|iPhone Developer): [^"]+ \(([A-Z0-9]{10})\)"/g;
  let match;

  while ((match = pattern.exec(result.stdout)) !== null) {
    teams.add(match[1]);
  }

  if (teams.size === 1) {
    return [...teams][0];
  }

  return undefined;
}

function loadLocalEnv() {
  const shellEnv = new Set(Object.keys(process.env));

  for (const file of ['.env', '.env.local']) {
    try {
      const contents = readFileSync(resolve(root, file), 'utf8');
      applyDotEnv(contents, shellEnv);
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

function applyDotEnv(contents, shellEnv) {
  for (const line of contents.split(/\r?\n/)) {
    const parsed = parseDotEnvLine(line);
    if (!parsed || shellEnv.has(parsed.key)) {
      continue;
    }

    process.env[parsed.key] = parsed.value;
  }
}

function parseDotEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return undefined;
  }

  const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed);
  if (!match) {
    return undefined;
  }

  let value = match[2].trim();
  const quote = value[0];
  if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
    value = value.slice(1, -1);
  } else {
    const commentIndex = value.search(/\s#/);
    if (commentIndex >= 0) {
      value = value.slice(0, commentIndex).trim();
    }
  }

  return { key: match[1], value };
}

function readValue(args, index, flag) {
  const value = args[index];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePort(value) {
  if (!value) {
    return undefined;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid port: ${value}`);
  }
  return port;
}

function detectLanHost() {
  const candidates = [];
  const ignoredInterface = /^(lo|awdl|llw|utun|gif|stf|bridge|ap|vboxnet|vmnet)/;

  for (const [name, entries] of Object.entries(networkInterfaces())) {
    for (const entry of entries ?? []) {
      const family = typeof entry.family === 'string' ? entry.family : `IPv${entry.family}`;
      if (family !== 'IPv4' || entry.internal || entry.address.startsWith('169.254.')) {
        continue;
      }

      candidates.push({
        address: entry.address,
        ignored: ignoredInterface.test(name),
        name,
        preferred: name === 'en0' || name === 'en1',
      });
    }
  }

  const selected =
    candidates.find((candidate) => candidate.preferred && !candidate.ignored) ??
    candidates.find((candidate) => !candidate.ignored) ??
    candidates[0];

  if (!selected) {
    throw new Error(
      'Could not find a LAN IPv4 address. Pass one explicitly with --host 192.168.x.x or IOS_DEV_HOST=192.168.x.x.',
    );
  }

  return selected.address;
}

async function ensureNativeWebDir() {
  try {
    await access(resolve(root, 'build/client/index.html'));
  } catch {
    console.log('[ios:dev] build/client is missing. Building the native web bundle once for Capacitor sync.');
    await run(npm, ['run', 'build:native'], {
      env: {
        ...process.env,
        VITE_BUILD_TARGET: 'native',
        VITE_BUILD_LANG: process.env.VITE_BUILD_LANG ?? 'en',
      },
    });
  }
}

async function runStandaloneIOSApp(nativeOptions) {
  console.log('[ios:standalone] Building bundled native app. It will not depend on the dev server after install.');

  await run(npm, ['run', 'build:native'], {
    env: {
      ...process.env,
      VITE_BUILD_TARGET: 'native',
      VITE_BUILD_LANG: process.env.VITE_BUILD_LANG ?? 'en',
      VITE_RC_USE_TEST_STORE: process.env.VITE_RC_USE_TEST_STORE ?? 'true',
    },
  });
  await run(npx, ['cap', 'sync', 'ios', '--inline'], { env: process.env });

  const appPath = await buildIOSApp(nativeOptions);
  await run(npx, ['native-run', 'ios', '--app', appPath, ...nativeRunTargetArgs(nativeOptions)], { env: process.env });

  console.log('[ios:standalone] App installed with bundled assets. You can disconnect from the Mac/dev server now.');
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (devServerExit) {
      throw new Error(`Dev server exited before it was ready (${formatExit(devServerExit.code, devServerExit.signal)})`);
    }

    if (shuttingDown) {
      return;
    }

    if (await canReach(url)) {
      return;
    }
    await delay(500);
  }

  throw new Error(`Dev server did not respond at ${url} within ${timeoutMs / 1000}s`);
}

function canReach(url) {
  return new Promise((resolveReachable) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolveReachable(response.statusCode < 500);
    });

    request.on('error', () => resolveReachable(false));
    request.setTimeout(1000, () => {
      request.destroy();
      resolveReachable(false);
    });
  });
}

async function writeLiveReloadConfig(serverUrl) {
  const rawConfig = await readFile(iosCapConfigPath, 'utf8');
  liveReloadConfigBackup = rawConfig;

  const config = JSON.parse(rawConfig);
  config.server = {
    ...config.server,
    url: serverUrl,
  };

  await writeFile(iosCapConfigPath, `${JSON.stringify(config, null, '\t')}\n`);
}

async function buildIOSApp({ configuration, scheme, target, team }) {
  const derivedDataPath = resolve(root, 'ios/DerivedData', target ?? 'ios-dev');
  const destination = target ? `id=${target}` : 'generic/platform=iOS';
  const buildSettings = team ? [`DEVELOPMENT_TEAM=${team}`] : [];

  const xcodebuildArgs = [
    'xcodebuild',
    '-project',
    'App.xcodeproj',
    '-scheme',
    scheme,
    '-configuration',
    configuration,
    '-destination',
    destination,
    '-derivedDataPath',
    derivedDataPath,
    ...buildSettings,
    '-allowProvisioningUpdates',
    '-allowProvisioningDeviceRegistration',
  ];

  await runXcodebuild(
    'xcrun',
    xcodebuildArgs,
    { cwd: iosProjectDir, env: process.env },
    { bundleId: IOS_APP_BUNDLE_ID, team },
  );

  return resolve(derivedDataPath, 'Build/Products', `${configuration}-iphoneos`, `${scheme}.app`);
}

function nativeRunTargetArgs({ target }) {
  return target ? ['--target', target] : ['--device'];
}

function run(command, args, optionsForRun) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    ...optionsForRun,
  });

  return waitForExit(child).then(({ code, signal }) => {
    if (code === 0) {
      return;
    }

    throw new Error(`${command} ${args.join(' ')} failed (${formatExit(code, signal)})`);
  });
}

async function runXcodebuild(command, args, optionsForRun, signingContext) {
  try {
    await runStreamingCapture(command, args, optionsForRun);
  } catch (error) {
    const output = error && typeof error === 'object' && 'output' in error ? error.output : '';
    if (typeof output === 'string' && isAppleAgreementFailure(output)) {
      throw new Error(formatAppleAgreementFailure(signingContext));
    }

    if (typeof output === 'string' && isXcodeSigningFailure(output)) {
      throw new Error(formatXcodeSigningFailure(signingContext));
    }

    throw error;
  }
}

function runStreamingCapture(command, args, optionsForRun) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    ...optionsForRun,
  });

  let output = '';

  child.stdout?.on('data', (chunk) => {
    process.stdout.write(chunk);
    output += chunk;
  });

  child.stderr?.on('data', (chunk) => {
    process.stderr.write(chunk);
    output += chunk;
  });

  return waitForExit(child).then(({ code, signal }) => {
    if (code === 0) {
      return;
    }

    const error = new Error(`${command} ${args.join(' ')} failed (${formatExit(code, signal)})`);
    error.output = output;
    throw error;
  });
}

function isAppleAgreementFailure(output) {
  return /PLA Update available|Program License Agreement|agree to the latest/i.test(output);
}

function isXcodeSigningFailure(output) {
  return /No Account for Team|No profiles for|requires a provisioning profile/.test(output);
}

function formatAppleAgreementFailure({ team }) {
  return [
    `Apple Developer Program terms must be accepted for team ${team}.`,
    '',
    'Fix it once with the Apple account holder:',
    '1. Sign in at https://developer.apple.com/account with the account holder Apple ID.',
    '2. Review and accept the latest Apple Developer Program License Agreement.',
    '3. Reopen Xcode > Settings > Accounts, select the Apple ID, and refresh/download signing assets if needed.',
    '',
    'Then rerun this command.',
  ].join('\n');
}

function formatXcodeSigningFailure({ bundleId, team }) {
  return [
    `Xcode signing is not configured for team ${team}.`,
    '',
    'Fix it once in Xcode:',
    '1. Open Xcode > Settings > Accounts and sign in to the Apple ID that has access to this team.',
    `2. Open ios/App/App.xcodeproj, select the App target, then Signing & Capabilities.`,
    `3. Set Team to ${team} and let Xcode create/download a development profile for ${bundleId}.`,
    '4. If this is a free Personal Team and that bundle id is unavailable, use a unique development bundle id or a team that owns it.',
    '',
    'Then rerun this command.',
  ].join('\n');
}

function waitForExit(child) {
  return new Promise((resolveExit, rejectExit) => {
    child.on('error', rejectExit);
    child.on('exit', (code, signal) => resolveExit({ code, signal }));
  });
}

function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  restoreLiveReloadConfigSync();
  devServer?.kill(signal);
}

function restoreLiveReloadConfigSync() {
  if (!liveReloadConfigBackup) {
    return;
  }

  try {
    const currentConfig = readFileSync(iosCapConfigPath, 'utf8');
    if (currentConfig !== liveReloadConfigBackup) {
      writeFileSync(iosCapConfigPath, liveReloadConfigBackup);
    }
  } catch {
    // Nothing useful to do during process shutdown.
  } finally {
    liveReloadConfigBackup = undefined;
  }
}

function sleepForever() {
  return new Promise(() => {
    setInterval(() => {
      // Keep the dev server alive for live reload until the user presses Ctrl+C.
    }, 1000);
  });
}

function formatExit(code, signal) {
  if (signal) {
    return `signal ${signal}`;
  }
  return `exit ${code}`;
}

function printHelp() {
  console.log(`Run the Capacitor iOS app on a device with React Router live reload.

Usage:
  npm run ios:dev
  npm run ios:standalone
  npm run ios:dev -- --target <device-id>
  npm run ios:dev -- --host 192.168.1.20 --port 5173

Options handled by this script:
  --standalone     Build and install bundled assets instead of live reload.
                    Use this when testing disconnect/offline behavior.
  --host <ip>       LAN IP your iPhone can reach. Defaults to auto-detected IPv4.
  --port <port>     Dev-server and Capacitor live-reload port. Defaults to 5173.
  --bind <host>     Dev-server bind host. Defaults to 0.0.0.0.
  --team <id>       Override the default Apple development team for local signing.
                    Can also be set with IOS_DEVELOPMENT_TEAM.

Other args are used for the native build/deploy. Supported native args are
--target, --scheme, --configuration, and --team. Run "npm run ios:devices" to list targets.`);
}
