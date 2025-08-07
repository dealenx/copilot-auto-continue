(function () {
    const CONTINUE_COOLDOWN_MS = 10000;
    const RETRY_COOLDOWN_MS = 10000;
    let lastContinueClick = 0;
    let lastRetryClick = 0;
    let isDivWrapperAdded = false;
    let continueCount = 0;
    let retryCount = 0;

    function updateContinueLabel() {
        const label = document.querySelector('label[for="continue-checkbox"]');
        if (label) {
            label.textContent = `Auto-Continue (${continueCount})`;
        }
    }

    function updateRetryLabel() {
        const label = document.querySelector('label[for="retry-checkbox"]');
        if (label) {
            label.textContent = `Auto-Retry (${retryCount})`;
        }
    }

    function incrementContinueCount() {
        continueCount++;
        updateContinueLabel();
        console.log(`[auto] Continue count increased to: ${continueCount}`);
    }

    function incrementRetryCount() {
        retryCount++;
        updateRetryLabel();
        console.log(`[auto] Retry count increased to: ${retryCount}`);
    }

    function addDivWrapper() {
        if (isDivWrapperAdded) return;

        const chatInputToolbars = document.querySelector('.chat-input-container .chat-input-toolbars');
        if (chatInputToolbars) {
            // Контейнер для обоих чекбоксов
            const containerDiv = document.createElement('div');
            containerDiv.style.display = 'flex';
            containerDiv.style.gap = '10px';

            // Continue checkbox wrapper
            const continueWrapper = document.createElement('div');
            continueWrapper.style.width = '130px';
            continueWrapper.style.height = '20px';
            continueWrapper.style.background = '#202020ff';
            continueWrapper.style.position = 'relative';
            continueWrapper.style.borderRadius = '5px';
            continueWrapper.style.color = 'white';
            continueWrapper.style.fontSize = '12px';
            continueWrapper.style.display = 'flex';
            continueWrapper.style.alignItems = 'center';
            continueWrapper.style.justifyContent = 'center';
            continueWrapper.style.gap = '5px';

            // Continue checkbox
            const continueCheckbox = document.createElement('input');
            continueCheckbox.type = 'checkbox';
            continueCheckbox.id = 'continue-checkbox';
            continueCheckbox.style.margin = '0';

            continueCheckbox.addEventListener('change', function () {
                if (!continueCheckbox.checked) {
                    continueCount = 0;
                    updateContinueLabel();
                    console.log('[auto] Continue count reset');
                }
            });

            // Continue label
            const continueLabel = document.createElement('label');
            continueLabel.htmlFor = 'continue-checkbox';
            continueLabel.textContent = `Auto-Continue (${continueCount})`;
            continueLabel.style.color = 'white';
            continueLabel.style.fontSize = '12px';
            continueLabel.style.cursor = 'pointer';

            continueWrapper.appendChild(continueCheckbox);
            continueWrapper.appendChild(continueLabel);

            // Retry checkbox wrapper
            const retryWrapper = document.createElement('div');
            retryWrapper.style.width = '110px';
            retryWrapper.style.height = '20px';
            retryWrapper.style.background = '#202020ff';
            retryWrapper.style.position = 'relative';
            retryWrapper.style.borderRadius = '5px';
            retryWrapper.style.color = 'white';
            retryWrapper.style.fontSize = '12px';
            retryWrapper.style.display = 'flex';
            retryWrapper.style.alignItems = 'center';
            retryWrapper.style.justifyContent = 'center';
            retryWrapper.style.gap = '5px';

            // Retry checkbox
            const retryCheckbox = document.createElement('input');
            retryCheckbox.type = 'checkbox';
            retryCheckbox.id = 'retry-checkbox';
            retryCheckbox.style.margin = '0';

            retryCheckbox.addEventListener('change', function () {
                if (!retryCheckbox.checked) {
                    retryCount = 0;
                    updateRetryLabel();
                    console.log('[auto] Retry count reset');
                }
            });

            // Retry label
            const retryLabel = document.createElement('label');
            retryLabel.htmlFor = 'retry-checkbox';
            retryLabel.textContent = `Auto-Retry (${retryCount})`;
            retryLabel.style.color = 'white';
            retryLabel.style.fontSize = '12px';
            retryLabel.style.cursor = 'pointer';

            retryWrapper.appendChild(retryCheckbox);
            retryWrapper.appendChild(retryLabel);

            // Добавляем оба wrapper'а в контейнер
            containerDiv.appendChild(continueWrapper);
            containerDiv.appendChild(retryWrapper);

            // Добавляем контейнер после найденного элемента
            chatInputToolbars.parentNode.insertBefore(containerDiv, chatInputToolbars.nextSibling);
            isDivWrapperAdded = true;
            console.log('[auto] Combined checkboxes added after .chat-input-container .chat-input-toolbars');
        }
    }

    function clickIfFound() {
        addDivWrapper();

        // Проверяем Continue checkbox
        const continueCheckbox = document.querySelector('#continue-checkbox');
        if (continueCheckbox && continueCheckbox.checked) {
            const now = Date.now();
            if (now - lastContinueClick >= CONTINUE_COOLDOWN_MS) {
                // Continue
                const continueBtn = Array.from(
                    document.querySelectorAll('a.monaco-button[role="button"], button.monaco-button')
                ).find(el => /continue/i.test(el.textContent?.trim()));
                if (continueBtn) {
                    continueBtn.click();
                    lastContinueClick = now;
                    incrementContinueCount();
                    console.log('[auto] Clicked Continue');
                }

                // Keep
                const keepBtn = Array.from(
                    document.querySelectorAll('a.action-label[role="button"]')
                ).find(el => /^keep$/i.test(el.textContent?.trim()));
                if (keepBtn) {
                    keepBtn.click();
                    lastContinueClick = now;
                    incrementContinueCount();
                    console.log('[auto] Clicked Keep');
                }
            }
        }

        // Проверяем Retry checkbox
        const retryCheckbox = document.querySelector('#retry-checkbox');
        if (retryCheckbox && retryCheckbox.checked) {
            // Проверяем, нет ли элемента остановки
            const stopElement = document.querySelector('.action-container .action-label.codicon-stop-circle');
            if (!stopElement) {
                const retryButton = document.querySelector('.chat-footer-toolbar .actions-container .action-item.menu-entry a[aria-label="Retry"]');
                if (retryButton) {
                    const now = Date.now();
                    if (now - lastRetryClick >= RETRY_COOLDOWN_MS) {
                        retryButton.click();
                        lastRetryClick = now;
                        incrementRetryCount();
                        console.log('[auto] Retry button clicked');
                    }
                }
            } else {
                console.log('[auto] Retry skipped - stop element present');
            }
        }
    }

    // Попытка добавить UI при инициализации
    addDivWrapper();

    const intervalId = setInterval(clickIfFound, 1000);
    const observer = new MutationObserver(clickIfFound);
    observer.observe(document.body, { childList: true, subtree: true });

    window.stopAutoClicker = () => {
        clearInterval(intervalId);
        observer.disconnect();
        console.log('[auto] stopped.');
    };

    window.incrementContinueCount = incrementContinueCount;
    window.incrementRetryCount = incrementRetryCount;
})();
