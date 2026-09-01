(function() {
  /* 이미지 및 스타일 설정 */
  const V_ARROW_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788244841/hero_dropdown_btn_ujyo5l.svg';
  const V_ARROW_HOVER_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788244844/hero_dropdown_btn-hover_nusz1l.svg';

  /* 호버 이미지 깜빡임 방지를 위한 프리로드 */
  const preloadHoverImg = new Image();
  preloadHoverImg.src = V_ARROW_HOVER_IMAGE_URL;

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
        transition: content 0.15s ease;
      }
      /* 이미지 자체에 마우스를 올렸을 때 */
      .v-arrow-img:hover,
      /* 이미지를 감싸고 있는 부모 링크(a 태그)에 마우스를 올렸을 때도 화살표 변경 */
      a:hover .v-arrow-img {
        content: url('${V_ARROW_HOVER_IMAGE_URL}') !important;
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
