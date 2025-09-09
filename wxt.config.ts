import { defineConfig } from "wxt";

const url = "https://www.jogossantacasa.pt/";

// https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		name: "JSC Unlocker",
		version: "1.0.2",
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
