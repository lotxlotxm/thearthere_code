<style>
/* ====== 📌 공통 및 1번 원형 공유(Share) 버튼 */
.custom-share-container {
  /* 📌 크기 및 스타일 조절 변수 (1번 원형 전용) */
  --btn-size: 32px;      /* 버튼 지름 */
  --icon-size: 14px;       /* 아이콘 크기 */
  --border-width: 1px;     /* 테두리 두께 */
  --border-color: #ffffff;     /* 테두리 및 아이콘 색상 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 6px;           
  vertical-align: middle;
}

/* 정원형 투명 버튼 스타일 (1번) */
.circle-share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-size);
  height: var(--btn-size);
  padding: 0;
  background: transparent !important;
  border: var(--border-width) solid var(--border-color) !important;
  border-radius: 50% !important; 
  color: var(--border-color) !important;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(4px);
  line-height: 1;
}
.circle-share-btn:active {
  transform: translateY(0);
}

/* 1번 공유 아이콘 SVG */
.share-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  fill: none;
  stroke: var(--border-color);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ====== 📌 2번 스타일 (원 없이 아이콘만, 24x24 영역) */
.icon-only-share-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  transition: opacity 0.2s ease-in-out !important;
  line-height: 1 !important;
}
.icon-only-share-btn:active {
  transform: translateY(0) !important;
}

.share-icon-v2 {
  width: 24px !important;
  height: 24px !important;
  fill: none !important;
  stroke: #ffffff !important;
  stroke-width: 1.5 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
</style>

<script>
(function() {
  function renderShareButtons() {
    // code 및 .notion-inline-code 요소 탐색
    const codeElements = document.querySelectorAll("code, .notion-inline-code");
    codeElements.forEach((el) => {
      if (el.dataset.rendered === "true") return;

      const text = el.textContent.trim();
      if (text !== "[share]" && text !== "[share2]") return;

      el.dataset.rendered = "true";
      const isType2 = text === "[share2]";

      const wrapper = document.createElement("div");
      wrapper.className = "custom-share-container";

      if (isType2) {
        // 2번 스타일: 원형 없이 24x24 아이콘 단독 노출
        wrapper.innerHTML = `
          <button class="icon-only-share-btn share-trigger" aria-label="Share">
            <svg class="share-icon-v2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        `;
      } else {
        // 1번 스타일: 기존 원형 버튼
        wrapper.innerHTML = `
          <button class="circle-share-btn share-trigger" aria-label="Share">
            <svg class="share-icon" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        `;
      }

      el.parentNode.replaceChild(wrapper, el);

      const btn = wrapper.querySelector(".share-trigger");
      btn.addEventListener("click", () => {
        // 현재 페이지 URL 복사 후 팝업 띄우기
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Link copied to clipboard.");
          }).catch(() => {
            fallbackCopy();
          });
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          const tempInput = document.createElement("input");
          tempInput.value = window.location.href;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          alert("Link copied to clipboard.");
        }
      });
    });
  }

  // 1. 즉시 및 DOMContentLoaded 시점 실행
  renderShareButtons();
  document.addEventListener("DOMContentLoaded", renderShareButtons);

  // 2. 비동기 렌더링 노션 블록 감지 
  const observer = new MutationObserver(() => {
    renderShareButtons();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
</script>
