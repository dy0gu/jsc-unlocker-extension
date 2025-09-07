# JSC Unlocker 🍀🔒

Removes the virtual keyboard login/register on [jogossantacasa.pt](https://www.jogossantacasa.pt/), making the password fields editable and allowing password managers to autofill them. The virtual keyboard also becomes invisible.

**BONUS: Copy & Paste also works when using this extension!**

## Download

You can download the latest release for **Firefox** from the [Add-on Browser](https://addons.mozilla.org/en-US/firefox/addon/jsc-unlocker/) or for **Chrome** ~~from the [Chrome Web Store](https://chrome.google.com/webstore/detail/jsc-unlocker/).~~ SOON!

## Build from Source

1. Clone or download this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to compile TypeScript.
4. Load the generated zip file in `web-ext-artifacts/` into your browser as an unpacked extension.

## Development

1. With the repository cloned and dependencies installed, run `npm run dev` to open a Firefox and Chrome window with automatic hot reloading/installing when the extension code is changed.
2. Run `npm run lint` to check for linting errors specific to browser extensions.
3. Create the final build ready for publishing using `npm run build`.
