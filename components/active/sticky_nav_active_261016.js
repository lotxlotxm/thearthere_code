(function () {
  // 1. 동적 스타일(CSS) 주입
  var styleId = 'sticky-tabs-injected-style';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* ==========================================================================
      📌 점프 스티키바 탭 디자인 및 활성화(is-active) 스타일
      ========================================================================== */
      
      /* 스티키바 탭 기본 스타일 (필요에 따라 자유롭게 수정 가능) */
      .notion-callout[class*="orange"] code {
        cursor: pointer;
        transition: all 0.2s ease;
      }

      /* 활성화된 탭(is-active) 스타일 지정 */
      .notion-callout[class*="orange"] code.is-active {
        font-weight: 700 !important;
        /* 예시: 밑줄 또는 강조 효과를 원하실 경우 아래 주석을 해제하여 사용하세요 */
        /* border-bottom: 2px solid #37352f !important; */
      }
    `;
    document.head.appendChild(style);
  }

  // 2. 점프 스티키바 활성화 액션 로직
  var TAB_BAR = '.notion-callout[class*="orange"]';
  var TOLERANCE = 24;      // 도착 판정 여유(px)
  var activeIdx = -1;      // 현재 활성 탭 번호
  var pick = null;         // 클릭한 탭 {idx, landedY}
  var idleTimer = null;

  function norm(s) { return (s || '').replace(/[↓↑←→]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function strip(id) { return (id || '').replace(/-/g, ''); }

  function findBar() {
    var bars = document.querySelectorAll(TAB_BAR);
    for (var i = 0; i < bars.length; i++) {
      if (bars[i].querySelector('code') && !bars[i].querySelector('.notion-collection-gallery')) return bars[i];
    }
    return null;
  }

  function findTarget(code) {
    var a = code.querySelector('a') || code.closest('a');
    if (a) {
      var hash = '';
      try { hash = new URL(a.getAttribute('href'), location.href).hash; } catch (e) {}
      if (hash.length > 1) {
        var id = decodeURIComponent(hash.slice(1));
        var el = document.getElementById(id);
        if (el) return el;
        var blocks = document.querySelectorAll('[data-block-id]');
        for (var i = 0; i < blocks.length; i++) {
          if (strip(blocks[i].getAttribute('data-block-id')) === strip(id)) return blocks[i];
        }
      }
    }
    var label = norm(code.textContent);
    var heads = document.querySelectorAll('h1, h2, h3');
    for (var j = 0; j < heads.length; j++) {
      if (norm(heads[j].textContent) === label) return heads[j];
    }
    return null;
  }

  function render() {
    var bar = findBar();
    if (!bar) return;
    var codes = bar.querySelectorAll('code');
    for (var i = 0; i < codes.length; i++) codes[i].classList.toggle('is-active', i === activeIdx);
  }

  function compute() {
    var bar = findBar();
    if (!bar) return -1;
    var codes = bar.querySelectorAll('code');
    var line = bar.getBoundingClientRect().bottom + TOLERANCE;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    var idx = -1;
    for (var k = 0; k < codes.length; k++) {
      var t = findTarget(codes[k]);
      if (t && t.getBoundingClientRect().top <= line) idx = k;
    }
    if (atBottom && codes.length) idx = codes.length - 1;
    return idx;
  }

  function land() { if (pick) pick.landedY = window.scrollY; }

  function onScroll() {
    if (pick) {
      if (pick.landedY === null) {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(land, 180);
        return;
      }
      if (Math.abs(window.scrollY - pick.landedY) > 60) pick = null;
      else return;
    }
    activeIdx = compute();
    render();
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener('resize', function () { if (!pick) { activeIdx = compute(); render(); } });

  document.addEventListener('click', function (e) {
    var code = e.target.closest && e.target.closest(TAB_BAR + ' code');
    if (!code) return;
    var codes = code.closest(TAB_BAR).querySelectorAll('code');
    var idx = Array.prototype.indexOf.call(codes, code);
    if (idx < 0) return;
    pick = { idx: idx, landedY: null };
    activeIdx = idx;
    render();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(land, 300);
  });

  setInterval(render, 400);
  activeIdx = compute();
  render();
})();
