(function () {
  const COOLDOWN_MS = 2500;
  let lastClick = 0;
  let isDivWrapperAdded = false;
  let continueCount = 0;

  function updateContinueLabel() {
    const label = document.querySelector('label[for="continue-checkbox"]');
    if (label) {
      label.textContent = `Auto-Continue (${continueCount})`;
    }
  }

  function incrementContinueCount() {
    continueCount++;
    updateContinueLabel();
    console.log(`[auto] Continue count increased to: ${continueCount}`);
  }

  function addDivWrapper() {
    if (isDivWrapperAdded) return;

    const chatInputToolbars = document.querySelector('.chat-input-container .chat-input-toolbars');
    if (chatInputToolbars) {
      const divWrapper = document.createElement('div');
      divWrapper.style.width = '130px';
      divWrapper.style.height = '20px';
      divWrapper.style.background = '#202020ff';
      divWrapper.style.position = 'relative';
      divWrapper.style.borderRadius = '5px';
      divWrapper.style.color = 'white';
      divWrapper.style.fontSize = '12px';
      divWrapper.style.display = 'flex';
      divWrapper.style.alignItems = 'center';
      divWrapper.style.justifyContent = 'center';
      divWrapper.style.gap = '5px';

      // Создаем checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'continue-checkbox';
      checkbox.style.margin = '0';

      // Добавляем обработчик события для checkbox
      checkbox.addEventListener('change', function () {
        if (!checkbox.checked) {
          continueCount = 0;
          updateContinueLabel();
          console.log('[auto] Continue count reset');
        }
      });

      // Создаем label для checkbox
      const label = document.createElement('label');
      label.htmlFor = 'continue-checkbox';
      label.textContent = `Auto-Continue (${continueCount})`;
      label.style.color = 'white';
      label.style.fontSize = '12px';
      label.style.cursor = 'pointer';

      // Добавляем checkbox и label в div
      divWrapper.appendChild(checkbox);
      divWrapper.appendChild(label);

      // Добавляем div после найденного элемента
      chatInputToolbars.parentNode.insertBefore(divWrapper, chatInputToolbars.nextSibling);
      isDivWrapperAdded = true;
      console.log('[auto] Continue checkbox added after .chat-input-container .chat-input-toolbars');
    }
  }

  function clickIfFound() {
    addDivWrapper();

    // Проверяем, включен ли checkbox
    const checkbox = document.querySelector('#continue-checkbox');
    if (checkbox && checkbox.checked) {
      const now = Date.now();
      if (now - lastClick < COOLDOWN_MS) return;

      // Continue
      const continueBtn = Array.from(
        document.querySelectorAll('a.monaco-button[role="button"], button.monaco-button')
      ).find(el => /continue/i.test(el.textContent?.trim()));
      if (continueBtn) {
        continueBtn.click();
        lastClick = now;
        incrementContinueCount();
        console.log('[auto] Clicked Continue');
      }

      // Keep
      const keepBtn = Array.from(
        document.querySelectorAll('a.action-label[role="button"]')
      ).find(el => /^keep$/i.test(el.textContent?.trim()));
      if (keepBtn) {
        keepBtn.click();
        lastClick = now;
        incrementContinueCount();
        console.log('[auto] Clicked Keep');
      }
    }
  }

  // Попытка добавить div при инициализации
  addDivWrapper();

  const intervalId = setInterval(clickIfFound, 1000);
  const observer = new MutationObserver(clickIfFound);
  observer.observe(document.body, { childList: true, subtree: true });

  window.stopAutoContinue = () => {
    clearInterval(intervalId);
    observer.disconnect();
    console.log('[auto] stopped.');
  };

  window.incrementContinueCount = incrementContinueCount;
})();
