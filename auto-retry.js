(function () {
  const COOLDOWN_MS = 5000;
  let lastClick = 0;
  let testDivAdded = false;
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

  function addTestDiv() {
    if (testDivAdded) return;

    const chatInputToolbars = document.querySelector('.chat-input-container .chat-input-toolbars');
    if (chatInputToolbars) {
      const testDiv = document.createElement('div');
      testDiv.style.width = '110px';
      testDiv.style.height = '20px';
      testDiv.style.background = '#202020ff';
      testDiv.style.position = 'relative';
      testDiv.style.borderRadius = '5px';
      testDiv.style.color = 'white';
      testDiv.style.fontSize = '12px';
      testDiv.style.display = 'flex';
      testDiv.style.alignItems = 'center';
      testDiv.style.justifyContent = 'center';
      testDiv.style.gap = '5px';

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
      testDiv.appendChild(checkbox);
      testDiv.appendChild(label);

      // Добавляем div после найденного элемента
      chatInputToolbars.parentNode.insertBefore(testDiv, chatInputToolbars.nextSibling);
      testDivAdded = true;
      console.log('[auto] Test div with retry checkbox added after .chat-input-container .chat-input-toolbars');
    }
  }

  function clickIfFound() {
    addTestDiv();
    console.log("TEST")
  }

  // Попытка добавить тестовый div при инициализации
  addTestDiv();

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
