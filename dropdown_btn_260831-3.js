(function() {
  const V_ARROW_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788166395/hero_dropdown_btn_ywudft.png';

  /* CSS 스타일 자동 주입 */
  function injectStyle() {
    if (document.getElementById('v-arrow-style')) return;
    const style = document.createElement('style');
    style.id = 'v-arrow-style';
    style.innerHTML = `
      img.v-arrow-img {
        display: inline-block !important;
        width: 40px !important;
        height: 32px !important;
        vertical-align: middle !important;
        margin-left: 4px !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
      }
      img.v-arrow-img:hover {
        opacity: 0.8 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function replaceVText() {
    injectStyle();

    /* 모든 텍스트 노드 탐색 */
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // 이미 치환된 이미지 내부는 제외
          if (node.parentNode && node.parentNode.closest('.v-arrow-img')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.nodeValue && node.nodeValue.includes('[V]')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      },
      false
    );

    const nodesToReplace = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
      nodesToReplace.push(currentNode);
    }

    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const text = textNode.nodeValue;
      const parts = text.split('[V]');
      const fragment = document.createDocumentFragment();

      parts.forEach((part, index) => {
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }

        if (index < parts.length - 1) {
          const img = document.createElement('img');
          img.src = V_ARROW_IMAGE_URL;
          img.alt = 'dropdown arrow';
          img.className = 'v-arrow-img';
          fragment.appendChild(img);
        }
      });

      parent.replaceChild(fragment, textNode);
    });
  }

  /* DOM 변화 감지기 (MutationObserver) - Notion 반응형 렌더링 무력화 */
  function initObserver() {
    replaceVText();

    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          shouldRun = true;
          break;
        }
      }
      if (shouldRun) {
        observer.disconnect(); // 반복 재귀 실행 방지
        replaceVText();
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }
})();
