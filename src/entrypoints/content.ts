import { log } from '~/helpers/logger';

export default defineContentScript({
  main: (_ctx) => {
    class VirtualKeyboardBypass {
      private virtualButtons: Map<string, HTMLInputElement> = new Map();
      private observedIframes = new WeakSet<HTMLIFrameElement>();
      private initializedDocuments = new WeakSet<Document>();
      constructor(private readonly container: Document) {
        this.injectStyling(this.container);
        this.mapVirtualKeyboard(this.container);
        this.addFieldEventListeners(this.container);
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType !== Node.ELEMENT_NODE) return;
              const element = node as Element;
              if (element.tagName === 'IFRAME') {
                this.observeIframe(element as HTMLIFrameElement);
              }
              element.querySelectorAll('iframe').forEach((iframe) => {
                this.observeIframe(iframe);
              });
            });
          }
        });
        observer.observe(this.container.body, {
          childList: true,
          subtree: true,
        });
        this.container.querySelectorAll('iframe').forEach((iframe) => {
          this.observeIframe(iframe);
        });
      }

      private observeIframe(iframe: HTMLIFrameElement): void {
        if (this.observedIframes.has(iframe)) return;
        this.observedIframes.add(iframe);

        const initialize = () => {
          try {
            const container = iframe.contentDocument;
            if (container?.body && !this.initializedDocuments.has(container)) {
              this.initializedDocuments.add(container);
              log.info('IFRAME DETECTED - STARTING VIRTUAL KEYBOARD BYPASS DETECTOR INSIDE');
              new VirtualKeyboardBypass(container);
            }
          } catch (_e) {
            log.warn('CANNOT ACCESS IFRAME CONTENT DUE TO CROSS-ORIGIN RESTRICTIONS');
          }
        };

        iframe.addEventListener('load', initialize);
        if (iframe.contentDocument?.readyState === 'complete') initialize();
      }

      private injectStyling(container: Document): void {
        const keyboard = container.querySelector('.blockKeyboard');
        if (keyboard) {
          (keyboard as HTMLElement).style.visibility = 'hidden';
        }

        const observer = new MutationObserver(() => {
          container.querySelectorAll('.errorMsg').forEach((msg) => {
            const text = msg.textContent?.trim();
            if (
              text === 'Por favor utilize o teclado virtual.' ||
              text === "Clique em 'limpar' no teclado virtual"
            ) {
              (msg as HTMLElement).style.visibility = 'hidden';
            } else {
              (msg as HTMLElement).style.visibility = '';
            }
          });
        });
        observer.observe(container.body, { childList: true, subtree: true });
      }

      private mapVirtualKeyboard(container: Document): void {
        this.virtualButtons.clear();
        const keyboardContainer = container.querySelector('.bgColorKeyboardBox');
        const buttons =
          keyboardContainer?.querySelectorAll<HTMLInputElement>("input[type='button']");

        buttons?.forEach((button) => {
          const name = button.getAttribute('name');
          const value = button.getAttribute('value');
          if (name && value) {
            this.virtualButtons.set(name, button);
          }
        });

        if (this.virtualButtons.size === 0) {
          log.warn('NO VIRTUAL KEYBOARD FOUND ON CURRENT PAGE');
          return;
        }
        log.info(`MAPPED ${this.virtualButtons.size} VIRTUAL KEYBOARD BUTTONS`);
      }

      private addFieldEventListeners(container: Document): void {
        const userInput = container.querySelector("input[name='user']");
        if (userInput && userInput instanceof HTMLInputElement) {
          userInput.autocomplete = 'username';
        }

        const passwordInputSelectors = [
          "input[name='newPass']",
          "input[name='confPass']",
          "input[name='password']",
        ];
        passwordInputSelectors.forEach((selector) => {
          const fields = container.querySelectorAll<HTMLInputElement>(selector);
          fields.forEach((field) => {
            // Add typing possibility
            field.readOnly = false;
            // Add password manager support by restoring autocomplete (only on login)
            if (field.name === 'password') {
              field.autocomplete = 'current-password';
            }
            // When typing on input, press the equivalent virtual key
            field.addEventListener('keydown', (e) => {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
                return;
              }
              log.info(`KEY PRESSED: ${e.key}`);
              if (this.virtualButtons.has(e.key)) {
                e.preventDefault();
                this.simulateVirtualInput(e.key);
              }
              if (e.key === 'Backspace') {
                const clearButton =
                  container.querySelector<HTMLInputElement>("input[value='Limpar']");
                if (clearButton) {
                  clearButton.click();
                }
              }
            });
            // Detect if input values changes but not from user, e.g password manager
            field.addEventListener('input', (e) => {
              const target = e.target as HTMLInputElement;
              e.preventDefault();

              const text = target.value;
              target.value = '';
              log.info(`HANDLING AUTO INPUT EVENT`);
              this.simulateVirtualInput(text);
            });
            // Handle pasting text into input
            field.addEventListener('paste', (e) => {
              e.preventDefault();
              if (e.clipboardData == null) return;
              const paste = e.clipboardData.getData('text');
              log.info(`HANDLING PASTED TEXT`);
              this.simulateVirtualInput(paste);
            });
          });
        });
      }

      private simulateVirtualInput(text: string): void {
        for (const char of text) {
          log.info(`VIRTUAL KEY CLICKED: ${char}`);
          const button = this.virtualButtons.get(char);
          if (button) {
            button.click();
          }
        }
      }
    }

    log.info('STARTING VIRTUAL KEYBOARD BYPASS DETECTOR');
    new VirtualKeyboardBypass(document);
  },
  matches: ['https://www.jogossantacasa.pt/*'],
  runAt: 'document_end',
});
