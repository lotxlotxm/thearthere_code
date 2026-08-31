(function () {
  const ICON_URL =
    "https://res.cloudinary.com/dwtaoukfu/image/upload/v1788166395/hero_dropdown_btn_ywudft.png";

  const ICON_WIDTH = 40;
  const ICON_HEIGHT = 32;

  function replaceV() {
    // 페이지 안의 모든 텍스트 노드 탐색
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // 이미 아이콘으로 교체된 영역은 제외
          if (
            node.parentElement &&
            node.parentElement.closest(".v-icon-replaced")
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // [V]가 없는 텍스트는 제외
          if (!node.nodeValue.includes("[V]")) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // 찾은 텍스트 노드 처리
    textNodes.forEach(function (textNode) {
      const text = textNode.nodeValue;

      if (!text.includes("[V]")) return;

      const fragment = document.createDocumentFragment();

      const parts = text.split("[V]");

      parts.forEach(function (part, index) {
        // 기존 텍스트
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }

        // [V] 위치에 아이콘 삽입
        if (index < parts.length - 1) {
          const img = document.createElement("img");

          img.src = ICON_URL;
          img.alt = "";
          img.width = ICON_WIDTH;
          img.height = ICON_HEIGHT;

          // CSS 파일 없이 JS에서 직접 크기 지정
          img.style.width = ICON_WIDTH + "px";
          img.style.height = ICON_HEIGHT + "px";

          // 텍스트와 같은 줄에 배치
          img.style.display = "inline-block";
          img.style.verticalAlign = "middle";

          // 이미지가 [V]처럼 취급되도록 설정
          img.style.objectFit = "contain";

          // 중복 치환 방지
          img.classList.add("v-icon-replaced");

          fragment.appendChild(img);
        }
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  // 최초 실행
  replaceV();

  // Super/Notion에서 늦게 로딩되는 블록 대응
  const observer = new MutationObserver(function () {
    replaceV();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
