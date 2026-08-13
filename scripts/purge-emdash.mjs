// One-off: purge em-dashes (—) from i18n content per taste-skill hard rule.
// Transforms only string VALUES (keys/structure untouched). Numeric ranges
// become en-dashes; all other em-dashes become commas, with punctuation cleanup.
import fs from 'node:fs';

const files = [
  'src/locales/en/translation.json',
  'src/locales/pl/translation.json',
  'src/locales/cs/translation.json',
];

function fix(s) {
  let t = s;
  t = t.replace(/(\d)\s*—\s*(\d)/g, '$1–$2'); // numeric range -> en-dash
  t = t.replace(/^\s*—\s*/, '');               // leading em-dash -> drop
  t = t.replace(/\s*—\s*$/, '');               // trailing em-dash -> drop
  t = t.replace(/\s*—\s*/g, ', ');             // remaining -> comma
  t = t.replace(/\s+,/g, ',');                 // space before comma
  t = t.replace(/,\s*,/g, ',');                // doubled comma
  t = t.replace(/,\s*([.!?;:])/g, '$1');       // comma before terminal punct
  t = t.replace(/ {2,}/g, ' ');                // collapse double spaces
  return t;
}

function walk(node) {
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (typeof v === 'string') node[k] = fix(v);
    else if (v && typeof v === 'object') walk(v);
  }
}

function countKeys(node) {
  let n = 0;
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (v && typeof v === 'object') n += countKeys(v);
    else n += 1;
  }
  return n;
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const before = (raw.match(/—/g) || []).length;
  const obj = JSON.parse(raw);
  const keysBefore = countKeys(obj);
  walk(obj);
  const keysAfter = countKeys(obj);
  const out = JSON.stringify(obj, null, 2) + '\n';
  const after = (out.match(/—/g) || []).length;
  fs.writeFileSync(file, out);
  console.log(`${file}: em-dash ${before} -> ${after} | keys ${keysBefore} -> ${keysAfter}`);
}
