/히어로 사진 내부의 알약형 좋아요 버튼 / 
/깃허브 방식으로 바꿔야함/
  
<style>
/* ===알약 스타일 투명 좋아요 버튼*/
.custom-like-container {
  /* 📌 크기 및 스타일 조절 변수 */
  --btn-height: 32px;   /* 버튼 높이 */
  --btn-padding-x: 14px;   /* 버튼 좌우 여백 */
  --font-size: 13px;  /* 글자 및 카운트 크기 */
  --heart-size: 14px; /* 하트 아이콘 크기 */
  --border-width: 1px;   
  --border-color: #ffffff; 
  --gap: 6px; /* 하트와 숫자 사이 간격 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  vertical-align: middle;
}
/* 알약 모양 투명 버튼 기본 스타일 */
.pill-like-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap);
  height: var(--btn-height);
  padding: 0 var(--btn-padding-x);
  background: transparent !important;
  border: var(--border-width) solid var(--border-color) !important;
  border-radius: 9999px !important;
  color: var(--border-color) !important;
  font-size: var(--font-size);
  font-weight: 600;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(4px);
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
  line-height: 1;
}
.pill-like-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-1px);
}
.pill-like-btn:active {
  transform: translateY(0);
}
/* 하트 SVG 아이콘 스타일 */
.heart-icon {
  width: var(--heart-size);
  height: var(--heart-size);
  fill: transparent;
  stroke: var(--border-color);
  stroke-width: 2;
  transition: fill 0.2s ease, transform 0.2s ease;
}
/* 클릭 후 (active 상태): 화이트 채워진 하트 */
.pill-like-btn.is-liked .heart-icon {
  fill: #ffffff !important;
  stroke: #ffffff !important;
  transform: scale(1.1);
}
.pill-like-btn:disabled {
  cursor: default;
}
</style>
<script>
(function() {
  function renderLikeButtons() {
    const pageId = window.location.pathname.replace(/[^a-zA-Z0-9]/g, "_") || "home";
    const storageKey = `liked_${pageId}`;

    // code 및 .notion-inline-code 요소 탐색
    const codeElements = document.querySelectorAll("code, .notion-inline-code");

    codeElements.forEach((el) => {
      // 이미 치환된 버튼이거나 텍스트가 [like]가 아닌 경우 패스
      if (el.dataset.rendered === "true") return;
      if (el.textContent.trim() !== "[like]") return;

      el.dataset.rendered = "true";

      const wrapper = document.createElement("div");
      wrapper.className = "custom-like-container";
      wrapper.innerHTML = `
        <button class="pill-like-btn" id="like-trigger">
          <svg class="heart-icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="like-count" id="like-count">207</span>
        </button>
      `;
      el.parentNode.replaceChild(wrapper, el);

      const btn = wrapper.querySelector("#like-trigger");
      const countEl = wrapper.querySelector("#like-count");
      // 1. 초기 CountAPI 수치 불러오기
      fetch(`https://api.countapi.xyz/get/thearthere_${pageId}/like`)
        .then(r => r.json())
        .then(d => {
          if (d && typeof d.value === "number") {
            countEl.textContent = d.value.toLocaleString();
          }
        })
        .catch(() => {});
      // 2. 기존 좋아요 누른 상태 확인 및 표시
      if (localStorage.getItem(storageKey) === "true") {
        btn.classList.add("is-liked");
      }
      // 3. 토글 클릭 이벤트
      btn.addEventListener("click", () => {
        const isLiked = btn.classList.contains("is-liked");
        const currentCount = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 0;
        if (isLiked) {
          // 이미 좋아요 상태일 때 -> 취소
          btn.classList.remove("is-liked");
          const nextCount = Math.max(0, currentCount - 1);
          countEl.textContent = nextCount.toLocaleString();
          localStorage.removeItem(storageKey);

          // API 수치 차감 (amount=-1)
          fetch(`https://api.countapi.xyz/update/thearthere_${pageId}/like?amount=-1`)
            .then(r => r.json())
            .then(d => {
              if (d && typeof d.value === "number") {
                countEl.textContent = d.value.toLocaleString();
              }
            })
            .catch(() => {});
        } else {
          // 좋아요 안 한 상태일 때 -> 좋아요
          btn.classList.add("is-liked");
          countEl.textContent = (currentCount + 1).toLocaleString();
          localStorage.setItem(storageKey, "true");

          // API 수치 증가
          fetch(`https://api.countapi.xyz/hit/thearthere_${pageId}/like`)
            .then(r => r.json())
            .then(d => {
              if (d && typeof d.value === "number") {
                countEl.textContent = d.value.toLocaleString();
              }
            })
            .catch(() => {});
        }
      });
    });
  }
  // 1. 즉시 및 DOMContentLoaded 시점 실행
  renderLikeButtons();
  document.addEventListener("DOMContentLoaded", renderLikeButtons);
  // 2. 비동기로 렌더링되는 노션 블록 감지 (MutationObserver)
  const observer = new MutationObserver(() => {
    renderLikeButtons();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
</script>
