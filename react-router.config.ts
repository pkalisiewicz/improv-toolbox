import type { Config } from '@react-router/dev/config';
import { warmupEntryPaths } from './src/seo/warmupEntries';

export default {
  // Keep all existing source under src/ (library→framework upgrade path).
  appDirectory: 'src',
  // SPA: no runtime server. Routes listed in `prerender` are emitted as static
  // HTML at build time; everything else is served via the SPA fallback.
  ssr: false,
  // Static landing + one indexable Entry page per warmup game. Other content
  // types (formats, principles) and aggregate Entries follow the same pattern.
  async prerender() {
    return ['/', '/privacy', ...warmupEntryPaths()];
  },
} satisfies Config;
