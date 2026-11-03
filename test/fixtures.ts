import path from 'node:path';
import { type BrowserContext, test as base, chromium } from '@playwright/test';

// Chromium only for now, since it's the most stable for extension testing with Playwright
export const test = base.extend<{
  context: BrowserContext;
  id: string;
}>({
  context: async ({ javaScriptEnabled }, use) => {
    const pathToExtension = path.join(__dirname, '..', '.output', 'chrome-mv3');
    const context = await chromium.launchPersistentContext('', {
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
      channel: 'chromium',
    });
    javaScriptEnabled = true;
    await use(context);
    await context.close();
  },
  id: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }
    const id = new URL(serviceWorker.url()).hostname;
    if (!id) {
      throw new Error(
        `Cannot determine extension ID from service worker URL: ${serviceWorker.url()}`,
      );
    }
    await use(id);
  },
});

export const expect = test.expect;
