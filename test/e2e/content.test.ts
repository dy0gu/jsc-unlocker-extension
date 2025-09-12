import fs from "node:fs";
import path from "node:path";
import { expect, test } from "../../test/fixtures";
import { manifest, url } from "../../wxt.config";

test.describe("Extension", () => {
	test("should have valid manifest", async () => {
		const buildPath = path.join(__dirname, "..", "..", ".output", "chrome-mv3");
		const buildManifestPath = path.join(buildPath, "manifest.json");

		expect(fs.existsSync(buildPath)).toBeTruthy();
		expect(fs.existsSync(buildManifestPath)).toBeTruthy();

		const buildManifest = JSON.parse(
			fs.readFileSync(buildManifestPath, "utf8"),
		);
		expect(buildManifest.name).toBe(manifest.name);
		expect(buildManifest.version).toBe(manifest.version);
		expect(buildManifest.description).toBe(manifest.description);
	});

	test("should load respective service worker", async ({ id }) => {
		expect(id).toBeTruthy();
	});

	test("should not interfere with normal page functionality", async ({
		page,
	}) => {
		// Check for any console errors that might indicate extension interference
		const logs: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") {
				logs.push(msg.text());
			}
		});

		await page.goto(url);
		await page.waitForLoadState("domcontentloaded");

		const body = page.locator("body");
		await expect(body).toBeVisible();

		// Filter out errors that aren't related to our extension
		const extensionErrors = logs.filter((log) => log.includes("extension"));

		expect(extensionErrors).toStrictEqual([]);
	});
	test("should allow for register without virtual keyboard", async ({
		page,
	}) => {
		await page.goto(`${url}/web/ContaRegistar/`);
		await page.waitForLoadState("domcontentloaded");

		const userInput = page.locator("#user");
		const passInput = page.locator("#newPass");
		const confirmPassInput = page.locator("#confPass");

		await expect(userInput).toBeVisible();
		await userInput.click();
		await userInput.pressSequentially("us3rH4s1sUniqu3");

		await expect(passInput).toBeVisible();
		await passInput.click();
		// Make mistake on purpose to ensure deletion works correctly
		await passInput.pressSequentially("testPasswso");
		await passInput.press("Backspace");
		await passInput.pressSequentially("testPassword");

		await expect(confirmPassInput).toBeVisible();
		await confirmPassInput.click();
		await confirmPassInput.pressSequentially("testPassword");

		const nextButton = page.locator('input[name="btnValidateStepOne"]');
		await expect(nextButton).toBeVisible();
		await nextButton.click();

		const stepIndicator = page.locator("li.selected > a.step2Link");
		await stepIndicator.waitFor();
		await expect(stepIndicator).toBeVisible();
	});

	test("should handle iframe content (login popup)", async ({ page }) => {
		await page.goto(url);
		await page.waitForLoadState("domcontentloaded");

		await page.click(".login.loginPopup.redirect-to-self.cboxElement");

		// Wait for iframe to load
		const loginIframe = page.frameLocator(".cboxIframe");
		await loginIframe.locator("form").waitFor();

		const userInput = loginIframe.locator('input[name="txtUser"]');
		const passInput = loginIframe.locator('input[name="password"]');

		await expect(userInput).toBeVisible();
		await userInput.click();
		await userInput.pressSequentially("us3rH4s1sUniqu3");

		await expect(passInput).toBeVisible();
		await passInput.click();
		// Make mistake on purpose to ensure deletion works correctly
		await passInput.pressSequentially("testPasswso");
		await passInput.press("Backspace");
		await passInput.fill("testPassword");

		const loginButton = loginIframe.locator('input[name="next"]');
		await expect(loginButton).toBeVisible();
		await loginButton.click();

		// Expect to get error about wrong credentials but not any other
		const errorMsg = loginIframe.locator(".errorMsg");
		await errorMsg.waitFor();
		await expect(errorMsg).toBeVisible();
		await expect(errorMsg).toHaveText(
			"O utilizador ou password que introduziu não estão corretos.",
		);
	});
});
