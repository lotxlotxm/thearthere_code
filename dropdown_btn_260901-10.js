(function() {
  const V_ARROW_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788245360/hero_dropdown_btn_ipipww.svg';
  const V_ARROW_HOVER_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788245356/hero_dropdown_btn-hover_scjcj6.svg';

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
      
      /* 마우스 호버 시 화살표 이미지 교체 (단독 [↓] 및 링크 내 [↓] 공통) */
      .v-arrow-img:hover,
      a:hover .v-arrow-img {
        content: url('${V_ARROW_HOVER_IMAGE_URL}') !important;
      }

      /* admission-text-target 좌측 패딩 제거 추가 */
      .admission-text-target {
        padding-left: 0 !important;
      }

      /* 링크 호버 시 글자 영역에만 밑줄 적용 (버튼 제외) */
      a:hover .admission-text-target,
      a:hover {
        text-decoration: underline !important;
        text-underline-offset: 3px;
      }

      /* Admission 라벨 전용 볼드 스타일 */
      .admission-label-bold {
        font-weight: 600 !important;
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
      if (node.textContent.includes('[↓]') && !node.parentNode.closest('.v-arrow-img')) {
        nodesToReplace.push(node);
      }
    }

    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      let rawText = textNode.textContent;
      const isInsideLink = parent.closest('a') !== null;

      /* 조건 1: 링크 내부이면서 Admission: 문구가 포함된 경우 */
      if (isInsideLink && rawText.includes('Admission:')) {
        const wrapper = document.createElement('span');
        const parts = rawText.split('[↓]');
        
        // Admission: 은 볼드 처리하고, 전체 텍스트 영역을 하나로 감싸 호버 밑줄 대상 지정
        let formattedText = parts[0].replace(
          'Admission:', 
          '<span class="admission-label-bold">Admission:</span>'
        );
        
        wrapper.innerHTML = `<span class="admission-text-target">${formattedText}</span>`;
        
        if (parts.length > 1) {
          const img = document.createElement('img');
          img.src = V_ARROW_IMAGE_URL;
          img.alt = 'arrow';
          img.className = 'v-arrow-img';
          wrapper.appendChild(img);
        }
        
        parent.replaceChild(wrapper, textNode);
      } else {
        /* 조건 2: Admission 없는 일반 링크, 또는 [↓] 단독 사용 */
        const parts = rawText.split('[↓]');
        const fragment = document.createDocumentFragment();

        parts.forEach((part, index) => {
          if (part) {
            // 글자 부분이 있을 경우 링크 호버 밑줄을 위해 스팬 처리
            if (isInsideLink) {
              const textSpan = document.createElement('span');
              textSpan.className = 'admission-text-target';
              textSpan.textContent = part;
              fragment.appendChild(textSpan);
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
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
