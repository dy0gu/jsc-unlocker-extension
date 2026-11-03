import { defineConfig } from 'wxt';
// biome-ignore lint/style/noRestrictedImports: WXT loads this config before its aliases are available.
import { version } from './package.json';

export const url = 'https://www.jogossantacasa.pt/';

// biome-ignore-start lint/style/useNamingConvention: WebExtension manifest keys use snake_case.
export const manifest = {
  browser_specific_settings: {
    gecko: {
      data_collection_permissions: {
        required: ['none'],
      },
      id: 'jsc@dy0gu.com',
    },
  },
  description: 'Bypasses the forced virtual keyboard in the JSC website.',
  host_permissions: [url],
  name: 'JSC Unlocker',
  permissions: [],
  version: version,
};
// biome-ignore-end lint/style/useNamingConvention: WebExtension manifest keys use snake_case.

/**
 * @see https://wxt.dev/api/config.html
 */
export default defineConfig({
  entrypointsDir: 'entrypoints',
  manifest: manifest,
  srcDir: 'src',
  webExt: {
    startUrls: [url],
  },
  zip: {
    excludeSources: [
      'test/**',
      'test-report/**',
      'test-results/**',
      'playwright-report/**',
      'playwright.config.ts',
      'biome.jsonc',
      'release.json',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
    ],
  },
});
