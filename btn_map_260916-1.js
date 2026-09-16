(function() {
  const MAP_PIN_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1789535980/map-pin_owrby8.svg';

  // 스타일 주입
  function injectStyle() {
    if (document.getElementById('map-pin-style')) return;
    const style = document.createElement('style');
    style.id = 'map-pin-style';
    style.innerHTML = `
      img.map-pin-img {
        all: unset !important;
        display: inline-block !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        vertical-align: middle !important;
        margin-left: 4px !important;
        margin-right: 2px !important;
        margin-top: -3px !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        object-fit: contain !important;
        text-decoration: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // [MAP] 치환 실행 함수
  function renderMapPinWidgets() {
    injectStyle();

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // 이미 변환된 이미지 내부나 부모 노드는 제외
          if (node.parentNode && node.parentNode.closest && node.parentNode.closest('.map-pin-img')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.textContent && node.textContent.includes('[MAP]')) {
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

      const rawText = textNode.textContent;
      const isInsideLink = parent.closest('a') !== null;

      const parts = rawText.split('[MAP]');
      const fragment = document.createDocumentFragment();

      parts.forEach((part, index) => {
        if (part) {
          if (isInsideLink) {
            const textSpan = document.createElement('span');
            textSpan.className = 'map-pin-text-target';
            textSpan.textContent = part;
            fragment.appendChild(textSpan);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        }

        // [MAP] 위치에 아이콘 이미지 생성
        if (index < parts.length - 1) {
          const img = document.createElement('img');
          img.src = MAP_PIN_IMAGE_URL;
          img.alt = 'map-pin';
          img.className = 'map-pin-img';
          fragment.appendChild(img);
        }
      });

      parent.replaceChild(fragment, textNode);
    });
  }

  // 초기 실행 및 주기적 스캔
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMapPinWidgets);
  } else {
    renderMapPinWidgets();
  }
  
  setInterval(renderMapPinWidgets, 500);
})();
