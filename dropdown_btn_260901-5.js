(function() {
  const V_ARROW_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788244032/hero_dropdown_btn_izm3qo.svg';
  const V_ARROW_HOVER_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788244048/hero_dropdown_btn-hover_udv68a.svg';

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
        text-decoration: none !important;
      }
      
      /* 마우스 호버 시 화살표 이미지 교체 */
      .v-arrow-img:hover,
      a:hover .v-arrow-img {
        content: url('${V_ARROW_HOVER_IMAGE_URL}') !important;
      }

      /* 부모 링크 호버 시 텍스트 밑줄 추가 */
      a:hover {
        text-decoration: underline !important;
        text-underline-offset: 3px;
      }

      /* Admission 라벨 전용 볼드 스타일 */
      .admission-label-bold {
        font-weight: 700 !important;
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

      let rawText = textNode.textContent;
      
      /* 링크 내부이면서 Admission: 문구가 포함된 경우만 볼드 태그 추가 */
      const isInsideLink = parent.closest('a') !== null;

      if (isInsideLink && rawText.includes('Admission:')) {
        const wrapper = document.createElement('span');
        const parts = rawText.split('[V]');
        
        let formattedText = parts[0].replace(
          'Admission:', 
          '<span class="admission-label-bold">Admission:</span>'
        );
        
        wrapper.innerHTML = formattedText;
        
        if (parts.length > 1) {
          const img = document.createElement('img');
          img.src = V_ARROW_IMAGE_URL;
          img.alt = 'arrow';
          img.className = 'v-arrow-img';
          wrapper.appendChild(img);
        }
        
        parent.replaceChild(wrapper, textNode);
      } else {
        /* 그 외 일반 [V] 치환 (일반 텍스트 및 Admission 없는 링크) */
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
      }
    });
  }

  document.addEventListener('DOMContentLoaded', renderVArrowWidgets);
  setInterval(renderVArrowWidgets, 500);
})();
