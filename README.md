# Virtual Keyboard Bypass Extension

This browser extension allows you to bypass the virtual keyboard login on [jogossantacasa.pt](https://www.jogossantacasa.pt/), making the password field editable and allowing password managers to autofill.

## Features

- Makes the password field editable
- Hides the virtual keyboard
- Works on Chrome and Firefox (Manifest V3)
- Written in TypeScript

## Installation

1. Clone or download this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to compile TypeScript.
4. Load the extension in your browser:
   - **Chrome**: Go to `chrome://extensions`, enable Developer mode, click "Load unpacked" and select the `dist` folder.
   - **Firefox**: Go to `about:debugging`, click "This Firefox" > "Load Temporary Add-on" and select the `manifest.json` file from the `dist` folder.

## Development

- Source files are in `src/` (TypeScript).
- Compiled files are in `dist/`.
- Lint with `npm run lint`.
- Package with `npm run zip`.

## License

MIT
