import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Native App shell config. The App is the native distribution of the same Tools
 * as the web Site (see CONTEXT.md "Distribution" + docs/adr/0002): one bilingual
 * binary that loads the React Router client bundle (build/client) off the device.
 *
 * Colours are the Greenroom design tokens converted to hex (native config can't
 * read the OKLCH @theme in index.css):
 *   ink-fill (dark launch)  oklch(0.075 0.015 155) ≈ #0B0E0B
 *   surface-2 (light canvas) oklch(0.975 0.012 155) ≈ #F4F6F2
 */
const config: CapacitorConfig = {
  appId: 'com.improvtoolbox.app',
  appName: 'Improv Toolbox',
  webDir: 'build/client',
  // WebView background while the bundle loads — dark ink avoids a white flash on
  // the (dark) launcher masthead the app opens onto.
  backgroundColor: '#0B0E0B',
  android: {
    // Dark background behind the WebView to match the launch splash.
    backgroundColor: '#0B0E0B',
  },
  plugins: {
    SplashScreen: {
      // We hide the splash from JS once the app has mounted (src/native/init.ts),
      // so users never see a blank frame between splash and first paint.
      launchAutoHide: false,
      backgroundColor: '#0B0E0B',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      // Light glyphs over the dark launch/masthead; flipped at runtime per theme.
      style: 'LIGHT',
      backgroundColor: '#0B0E0B',
    },
  },
};

export default config;
