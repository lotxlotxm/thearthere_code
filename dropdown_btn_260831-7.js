(function() {
  /* 이미지 및 스타일 설정 */
  const V_ARROW_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788167916/hero_dropdown_btn_qzjwo9.svg';

  function injectStyle() {
    if (document.getElementById('v-arrow-style')) return;
    const style = document.createElement('style');
    style.id = 'v-arrow-style';
    style.innerHTML = `
      .v-arrow-img {
        display: inline-block !important;
        width: 20px !important;
        height: 16px !important;
        vertical-align: middle !important;
        margin-left: 4px !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
      }
      .v-arrow-img:hover {
        opacity: 0.8 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function renderVArrowWidgets() {
    injectStyle();

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
      if (node.textContent.includes('[V]') && !node.parentNode.closest('.v-arrow-img')) {
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
          const img = document.createElement('img');
          img.src = V_ARROW_IMAGE_URL;
          img.alt = 'arrow';
          img.className = 'v-arrow-img';
          fragment.appendChild(img);
        }
      });

      parent.replaceChild(fragment, textNode);
    });
  }

  document.addEventListener('DOMContentLoaded', renderVArrowWidgets);
  setInterval(renderVArrowWidgets, 500);
})();
