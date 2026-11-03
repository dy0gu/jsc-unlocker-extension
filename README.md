# JSC Unlocker 🍀🔒

Removes the annoying (and arguably useless from a security standpoint) virtual keyboard required for login/register on [jogossantacasa.pt](https://www.jogossantacasa.pt/), making password fields manually editable and allowing password managers to auto-fill them.

Promotional video: <https://www.youtube.com/watch?v=uwbOnJTvUUI>

## Download 📂

You can download the latest release for:

- **Firefox** from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/jsc-unlocker/)

- **Google Chrome** from the [Chrome Web Store](https://chromewebstore.google.com/detail/jsc-unlocked/ekeehglopcojnbieeopijckckabkpbfj).

- **Safari**: download the Safari ZIP from the [latest release](https://github.com/dy0gu/jsc-unlocker-extension/releases/latest).

## Release 🚀

When a release is created, GitHub Actions builds the extension and automatically submits updates to Firefox Add-ons and the Chrome Web Store.

## Development 🛠️

### Requirements 📋

- Node.js [(version)](./package.json#L4)

_With all requirements ready:_

- Clone or download this repository.

- Open a terminal in the directory containing the `package.json` file and install project dependencies using:

    ```shell
    npm install
    ```

- Continue to the next step if you want to alter the extension code. If you just want to build it, run the respective script:

    ```shell
    npm run build
    # The results will be in the `.output` folder!
    ```

- To see live changes _(hot reload)_ when the extension code is updated, start a development session, which will automatically open a pre-configured window of your preferred browser. Refer to the `scripts` field in the `package.json` file for more details:

    ```shell
    npm run dev:chrome
    npm run dev:firefox
    npm run dev:safari
    ```

- Note that the **Google Chrome** version of the extension is the same one used for **Edge** and **Opera**, as these share the same browser engine, **Chromium**. This applies to any other _Chromium-based_ browser as well. Same goes for the **Firefox** version, which will also work in all _Firefox-based_ browsers.

### Tooling 🧰

- Biome is used as a linter _and_ formatter:

    ```shell
    npm run lint
    ```
