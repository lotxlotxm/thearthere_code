function renderFinalFixedBanner() {
  const placeholder = "[BANNER_MAIN]";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  const nodesToReplace = [];

  while(node = walker.nextNode()) {
    if (node.textContent.includes(placeholder)) {
      nodesToReplace.push(node);
    }
  }

  nodesToReplace.forEach(textNode => {
    const parent = textNode.parentNode;
    if (!parent) return;

    // 이미 배너가 성공적으로 적용되어 감싸진 상태라면 중복 렌더링 실행 방지
    if (parent.classList.contains('banner-container-wrapper') || parent.closest('.banner-container-wrapper')) {
      return;
    }

    const bannerHTML = `
      <div class="final-hero-banner">
        <div class="banner-inner-text">
          <h2 class="b-title">A Curated Guide to Iconic Art Museums</h2>
          <p class="b-subtitle">The Art Here is your curated guide to the world’s most iconic Art museums <br>and the masterpieces within them.</p>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = "banner-container-wrapper";
    wrapper.innerHTML = bannerHTML;
    parent.replaceChild(wrapper, textNode);
  });
}

// 렌더링 시점 안정화 필터링
window.addEventListener('DOMContentLoaded', renderFinalFixedBanner);
window.addEventListener('load', renderFinalFixedBanner);

// 타이머를 파괴하지 않고, 페이지 전환 시 나타나는 트리거 단어를 무한 추적
setInterval(() => {
  renderFinalFixedBanner();
}, 500);
