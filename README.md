# JSC Unlocker 🍀🔒

Removes the annoying (and arguably useless from a security standpoint) virtual keyboard required for login/register on [jogossantacasa.pt](https://www.jogossantacasa.pt/), making password fields manually editable and allowing password managers to auto-fill them.

## Download 📂

You can download the latest release for:

- **Firefox** from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/jsc-unlocker/)
- **Chrome** from the [Chrome Web Store](https://chromewebstore.google.com/detail/jsc-unlocked/ekeehglopcojnbieeopijckckabkpbfj).
- **Safari**, I won't be paying the 100$/year fee that Apple requires to publish on their store. **See the next section for instructions on how to build the extension yourself from the source code here.** Then lookup how to load a local extension into Safari.
- **Opera** from [Opera Add-ons](https://addons.opera.com/en/extensions/details/jsc-unlocker/).
- **Edge** from the [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/jsc-unlocker).

## Development 🛠️

### Requirements 📋

- Node.js [(version)](./package.json#L4)

_With all requirements ready:_

- Clone or download this repository.

- Open a terminal in the directory containing the `package.json` file and install project dependencies using:

    ```shell
    npm install
    ```

- Continue to the next step if you want to alter the extension code. If you just want to build it run:

    ```shell
    npm run build
    # The output will be in the `.output` folder!
    ```

- To see live changes _(hot reload)_ when the extension code is updated, start a development session, which will automatically open a configured browser window. Refer to the `scripts` field in the `package.json` file for more details:

    ```shell
    npm run dev:chrome
    npm run dev:firefox
    npm run dev:safari
    ```

- Note that the **Chrome** version of the extension will also work in **Edge** and **Opera**, as these share the same browser engine, **Chromium**. This applies to any other _Chromium-based_ browser as well. Same goes for the **Firefox** version, which will also work in all _Firefox-based_ browsers.

#### Tooling 🧰

- Biome is used as a linter and formatter:

    ```shell
    npm run check
    ```

- After running `npm install` pre-commit hooks will be automatically installed to format code before a commit. If for some reason the hooks do not install correctly, instal them manually using:

    ```shell
    npx lefthook install
    ```

- When using pre-commit hooks, git commands will fail if any files are checked with errors. Changed files must be added to the staged area and commited again to apply fixes
