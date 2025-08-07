(function () {
  const COOLDOWN_MS = 5000;
  let lastClick = 0;
  let isDivWrapperAdded = false;
  let retryCount = 0;

  function updateRetryLabel() {
    const label = document.querySelector('label[for="retry-checkbox"]');
    if (label) {
      label.textContent = `Auto-Retry (${retryCount})`;
    }
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
      const divWrapper = document.createElement('div');
      divWrapper.style.width = '110px';
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
      checkbox.id = 'retry-checkbox';
      checkbox.style.margin = '0';

      // Добавляем обработчик события для checkbox
      checkbox.addEventListener('change', function () {
        if (!checkbox.checked) {
          retryCount = 0;
          updateRetryLabel();
          console.log('[auto] Retry count reset');
        }
      });

      // Создаем label для checkbox
      const label = document.createElement('label');
      label.htmlFor = 'retry-checkbox';
      label.textContent = `Auto-Retry (${retryCount})`;
      label.style.color = 'white';
      label.style.fontSize = '12px';
      label.style.cursor = 'pointer';

      // Добавляем checkbox и label в div
      divWrapper.appendChild(checkbox);
      divWrapper.appendChild(label);

      // Добавляем div после найденного элемента
      chatInputToolbars.parentNode.insertBefore(divWrapper, chatInputToolbars.nextSibling);
      isDivWrapperAdded = true;
      console.log('[auto] Test div with retry checkbox added after .chat-input-container .chat-input-toolbars');
    }
  }

  function clickIfFound() {
    addDivWrapper();

    // Проверяем, включен ли checkbox
    const checkbox = document.querySelector('#retry-checkbox');
    if (checkbox && checkbox.checked) {
      // Проверяем наличие кнопки Retry
      const retryButton = document.querySelector('.chat-footer-toolbar .actions-container .action-item.menu-entry a[aria-label="Retry"]');
      if (retryButton) {
        // Проверяем cooldown
        const now = Date.now();
        if (now - lastClick >= COOLDOWN_MS) {
          retryButton.click();
          lastClick = now;
          incrementRetryCount();
          console.log('[auto] Retry button clicked');
        }
      }
    }
  }

  // Попытка добавить тестовый div при инициализации
  addDivWrapper();

  const intervalId = setInterval(clickIfFound, 1000);
  const observer = new MutationObserver(clickIfFound);
  observer.observe(document.body, { childList: true, subtree: true });

  window.stopAutoContinue = () => {
    clearInterval(intervalId);
    observer.disconnect();
    console.log('[auto] stopped.');
  };

  window.incrementRetryCount = incrementRetryCount;
})();
