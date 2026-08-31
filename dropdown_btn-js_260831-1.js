(function() {
  function renderVArrowWidgets() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
      if (node.textContent.includes('[V]') && !node.parentNode.closest('.v-arrow-btn')) {
        nodesToReplace.push(node);
      }
    }

    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const rawText = textNode.textContent;
      const parts = rawText.split('[V]');
      const fragment = document.createDocumentFragment();

      parts.forEach((part, index) => {
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }

        if (index < parts.length - 1) {
          const btn = document.createElement('span');
          btn.className = 'v-arrow-btn';
          btn.innerHTML = `
            <svg viewBox="0 0 10 6">
              <path d="M1 1L5 5L9 1" stroke="#37352f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          `;
          fragment.appendChild(btn);
        }
      });

      parent.replaceChild(fragment, textNode);
    });
  }

  document.addEventListener('DOMContentLoaded', renderVArrowWidgets);
  setInterval(renderVArrowWidgets, 500);
})();
