import path from "node:path";
import { type BrowserContext, test as base, chromium } from "@playwright/test";

// Chromium only for now, since it's the most stable for extension testing with Playwright
export const test = base.extend<{
	context: BrowserContext;
	id: string;
}>({
	context: async ({ javaScriptEnabled }, use) => {
		const pathToExtension = path.join(__dirname, "..", ".output", "chrome-mv3");
		const context = await chromium.launchPersistentContext("", {
			channel: "chromium",
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
				"--disable-web-security",
				"--disable-dev-shm-usage",
				"--no-sandbox",
			],
		});
		javaScriptEnabled = true;
		await use(context);
		await context.close();
	},
	id: async ({ context }, use) => {
		let [serviceWorker] = context.serviceWorkers();
		if (!serviceWorker) {
			serviceWorker = await context.waitForEvent("serviceworker");
		}
		const id = serviceWorker.url().split("/")[2];
		await use(id);
	},
});

export const expect = test.expect;
