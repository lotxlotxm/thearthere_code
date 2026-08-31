(function() {
  const V_ARROW_IMAGE_URL = 'https://res.cloudinary.com/dwtaoukfu/image/upload/v1788166395/hero_dropdown_btn_ywudft.png';

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

  function renderVArrowWidgets() {
    injectStyle();

    // Notion/Super 블록 내 텍스트 감싸는 요소 전체 검색
    const targets = document.querySelectorAll('.notion-semantic-string, p, span, h1, h2, h3, li');
    
    targets.forEach(el => {
      // 자식 요소 중 이미지 치환이 완료되지 않았고 [V] 글자가 포함된 경우
      if (el.innerHTML.includes('[V]') && !el.querySelector('.v-arrow-img')) {
        const imgTag = `<img src="${V_ARROW_IMAGE_URL}" alt="arrow" class="v-arrow-img" />`;
        
        // [V] 텍스트를 이미지 태그로 일괄 치환
        el.innerHTML = el.innerHTML.replace(/\[V\]/g, imgTag);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', renderVArrowWidgets);
  setInterval(renderVArrowWidgets, 500);
})();
