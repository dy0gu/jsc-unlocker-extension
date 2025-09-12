import { defineConfig } from "wxt";
import { version } from "./package.json";

export const url = "https://www.jogossantacasa.pt/";

export const manifest = {
	name: "JSC Unlocker",
	version: version,
	description: "Bypasses the forced virtual keyboard in the JSC website.",
	permissions: [],
	host_permissions: [url],
	browser_specific_settings: {
		gecko: {
			id: "jsc@dy0gu.com",
		},
	},
};

/**
 * @see https://wxt.dev/api/config.html
 */
export default defineConfig({
	srcDir: "src",
	entrypointsDir: "entrypoints",
	webExt: {
		startUrls: [url],
	},
	manifest: manifest,
});
