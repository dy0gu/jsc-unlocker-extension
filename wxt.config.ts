import { defineConfig } from "wxt";
import { version } from "./package.json";

const url = "https://www.jogossantacasa.pt/";

// https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
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
	},
	webExt: {
		startUrls: [url],
	},
});
