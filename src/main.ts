interface VirtualKeyButton extends HTMLElement {
    name?: string;
    value?: string;
}

class VirtualKeyboardBypass {
    private virtualButtons: Map<string, VirtualKeyButton> = new Map();
    private container: Document;

    constructor(container: Document) {
        this.container = container;
        this.injectCSS(this.container);
        this.mapVirtualKeyboard(this.container);
        this.addFieldEventListeners(this.container);
        // Watch for new iframe (login popup) to reapply bypass
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "IFRAME") {
                        const iframe = node as HTMLIFrameElement;
                        iframe.addEventListener('load', () => {
                            try {
                                const container = iframe.contentDocument;
                                if (container) {
                                    console.log('IFRAME DETECTED - REAPPLYING VIRTUAL KEYBOARD BYPASS');
                                    // Create an instance of this class inside the iframe
                                    new VirtualKeyboardBypass(container);
                                }
                            } catch (e) {
                                console.warn('CANNOT ACCESS IFRAME CONTENT DUE TO CROSS-ORIGIN RESTRICTIONS');
                            }
                        });
                    }
                });
            }
        });
        observer.observe(this.container.body, { childList: true, subtree: true });
    }

    private injectCSS(container: Document): void {
        const style = container.createElement("style");
        style.textContent = `
            .blockKeyboard, .blockKeyboard * {
                background-color: transparent !important;
                background: none !important;
                color: transparent !important;
                border-color: transparent !important;
                box-shadow: none !important;
                text-shadow: none !important;
                outline: none !important;
                pointer-events: none !important;
                user-select: none !important;
            }
            `;
        container.head.appendChild(style);

        const observer = new MutationObserver(() => {
            container.querySelectorAll(".errorMsg").forEach(elem => {
                if (
                    elem.textContent?.trim() === "Por favor utilize o teclado virtual."
                    || elem.textContent?.trim() === "Clique em 'limpar' no teclado virtual"
                ) {
                    (elem as HTMLElement).style.color = "transparent";
                }
                else {
                    (elem as HTMLElement).style.color = "";
                }
            });
        });
        observer.observe(container.body, { childList: true, subtree: true });
    }

    private mapVirtualKeyboard(container: Document): void {
        this.virtualButtons.clear();
        const keyboardContainer = container.querySelector('.bgColorKeyboardBox');
        const buttons = keyboardContainer
            ? Array.from(keyboardContainer.querySelectorAll<VirtualKeyButton>("input[type='button']")) : [];

        buttons.forEach(button => {
            const name = button.getAttribute("name");
            const value = button.getAttribute("value");
            if (name && value) {
                this.virtualButtons.set(name, button);
            }
        });

        console.log(`MAPPED ${this.virtualButtons.size} VIRTUAL KEYBOARD BUTTONS`);
    }

    private addFieldEventListeners(container: Document): void {
        const userInput = container.querySelector("input[name='user']");
        if (userInput && userInput instanceof HTMLInputElement) {
            userInput.autocomplete = "username"
        }

        const passwordInputSelectors = [
            "input[name='newPass']",
            "input[name='confPass']",
            "input[name='password']",
        ];
        passwordInputSelectors.forEach(selector => {
            const fields = container.querySelectorAll<HTMLInputElement>(selector);
            fields.forEach(field => {
                // Add typing possibility
                field.readOnly = false;
                // Add password manager support by restoring autocomplete (only on login) and detecting paste
                if (field.name === "password") {
                    field.autocomplete = "current-password";
                }

                // Detect if input values changes but not from user, e.g password manager
                field.addEventListener("input", (e) => {
                    const target = e.target as HTMLInputElement;
                    e.preventDefault();

                    const text = target.value;
                    target.value = "";
                    console.log(`HANDLING AUTO INPUT EVENT`);
                    this.simulateVirtualInput(text);
                });
                field.addEventListener("paste", (e) => {
                    e.preventDefault();
                    if (e.clipboardData == null) return;
                    let paste = (e.clipboardData).getData("text");
                    console.log(`HANDLING PASTED TEXT`);
                    this.simulateVirtualInput(paste);
                });
                // When typing on input, press the equivalent virtual key
                field.addEventListener("keydown", (e) => {
                    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
                        return;
                    }
                    console.log(`KEY PRESSED`);
                    if (this.virtualButtons.has(e.key)) {
                        e.preventDefault();
                        this.simulateVirtualInput(e.key);
                    }
                    if (e.key === "Backspace") {
                        const clearButton = container.querySelector("input[value='Limpar']") as HTMLButtonElement;
                        if (clearButton) {
                            clearButton.click();
                        }
                    }
                });
            });
        });

    }

    private simulateVirtualInput(text: string): void {
        for (const char of text) {
            console.log(`VIRTUAL KEY CLICKED`);
            const button = this.virtualButtons.get(char);
            if (button) {
                button.click();
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOCUMENT LOADED - APPLYING VIRTUAL KEYBOARD BYPASS");
    new VirtualKeyboardBypass(document);
});
