import { log } from "../helpers/logger";

export default defineContentScript({
	matches: ["https://www.jogossantacasa.pt/*"],
	runAt: "document_end",
	main(_ctx) {
		interface VirtualKeyButton extends HTMLElement {
			name?: string;
			value?: string;
		}

		class VirtualKeyboardBypass {
			private virtualButtons: Map<string, VirtualKeyButton> = new Map();
			private container: Document;

			constructor(container: Document) {
				this.container = container;
				this.injectStyling(this.container);
				this.mapVirtualKeyboard(this.container);
				this.addFieldEventListeners(this.container);
				// Watch for new iframe (login popup) to reapply bypass
				const observer = new MutationObserver((mutations) => {
					for (const mutation of mutations) {
						mutation.addedNodes.forEach((node) => {
							if (
								node.nodeType === Node.ELEMENT_NODE &&
								(node as Element).tagName === "IFRAME"
							) {
								const iframe = node as HTMLIFrameElement;
								iframe.addEventListener("load", () => {
									try {
										const container = iframe.contentDocument;
										if (container) {
											log.info(
												"IFRAME DETECTED - STARTING VIRTUAL KEYBOARD BYPASS DETECTOR INSIDE",
											);
											// Create an instance of this class inside the iframe
											new VirtualKeyboardBypass(container);
										}
									} catch (_e) {
										log.warn(
											"CANNOT ACCESS IFRAME CONTENT DUE TO CROSS-ORIGIN RESTRICTIONS",
										);
									}
								});
							}
						});
					}
				});
				observer.observe(this.container.body, {
					childList: true,
					subtree: true,
				});
			}

			private injectStyling(container: Document): void {
				const keyboard = container.querySelector(".blockKeyboard");
				if (keyboard) {
					(keyboard as HTMLElement).style.visibility = "hidden";
				}

				const observer = new MutationObserver(() => {
					container.querySelectorAll(".errorMsg").forEach((msg) => {
						if (
							msg.textContent?.trim() ===
								"Por favor utilize o teclado virtual." ||
							msg.textContent?.trim() ===
								"Clique em 'limpar' no teclado virtual"
						) {
							(msg as HTMLElement).style.visibility = "hidden";
						} else {
							(msg as HTMLElement).style.visibility = "";
						}
					});
				});
				observer.observe(container.body, { childList: true, subtree: true });
			}

			private mapVirtualKeyboard(container: Document): void {
				this.virtualButtons.clear();
				const keyboardContainer = container.querySelector(
					".bgColorKeyboardBox",
				);
				const buttons = keyboardContainer
					? Array.from(
							keyboardContainer.querySelectorAll<VirtualKeyButton>(
								"input[type='button']",
							),
						)
					: [];

				buttons.forEach((button) => {
					const name = button.getAttribute("name");
					const value = button.getAttribute("value");
					if (name && value) {
						this.virtualButtons.set(name, button);
					}
				});

				if (this.virtualButtons.size === 0) {
					log.warn("NO VIRTUAL KEYBOARD FOUND ON CURRENT PAGE");
					return;
				}
				log.info(`MAPPED ${this.virtualButtons.size} VIRTUAL KEYBOARD BUTTONS`);
			}

			private addFieldEventListeners(container: Document): void {
				const userInput = container.querySelector("input[name='user']");
				if (userInput && userInput instanceof HTMLInputElement) {
					userInput.autocomplete = "username";
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
						if (field.name === "password") {
							field.autocomplete = "current-password";
						}
						// When typing on input, press the equivalent virtual key
						field.addEventListener("keydown", (e) => {
							if (
								(e.ctrlKey || e.metaKey) &&
								(e.key === "c" || e.key === "v")
							) {
								return;
							}
							log.info(`KEY PRESSED: ${e.key}`);
							if (this.virtualButtons.has(e.key)) {
								e.preventDefault();
								this.simulateVirtualInput(e.key);
							}
							if (e.key === "Backspace") {
								const clearButton = container.querySelector(
									"input[value='Limpar']",
								) as HTMLButtonElement;
								if (clearButton) {
									clearButton.click();
								}
							}
						});
						// Detect if input values changes but not from user, e.g password manager
						field.addEventListener("input", (e) => {
							const target = e.target as HTMLInputElement;
							e.preventDefault();

							const text = target.value;
							target.value = "";
							log.info(`HANDLING AUTO INPUT EVENT`);
							this.simulateVirtualInput(text);
						});
						// Handle pasting text into input
						field.addEventListener("paste", (e) => {
							e.preventDefault();
							if (e.clipboardData == null) return;
							const paste = e.clipboardData.getData("text");
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

		log.info("STARTING VIRTUAL KEYBOARD BYPASS DETECTOR");
		new VirtualKeyboardBypass(document);
	},
});
