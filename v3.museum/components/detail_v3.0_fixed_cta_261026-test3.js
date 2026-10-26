/*!
 * 📍 하단 FIXED CTA (v2: 유료/무료 치환 + LABEL 덮어쓰기)
 *
 * 노션 사용법 (하단 보라색 콜아웃 안)
 *   [TICKET_PAID_FIXED: 상품ID/vertical/subID]                         → Book Tickets ↗
 *   [TICKET_FREE_FIXED: 상품ID/vertical/subID]                         → Book a Tour ↗
 *   [TICKET_FREE_FIXED: 상품ID/vertical/subID / LABEL: Get Audio Guide] → Get Audio Guide ↗
 *   [TICKET_POPUP_FIXED: ...]  (예전 방식)                              → Book Tickets ↗ 로 계속 동작
 *   ※ 하단바 안에서는 _FIXED 없이 [TICKET_FREE: ...] 처럼 써도 텍스트형 버튼으로 나옴
 *   ※ 모달 제목 = 버튼 문구 (화살표 제외)
 *   ※ [TICKET_WIDGET: ...] 은 인트로 CTA 스크립트가 처리 (중복 삽입 방지를 위해 여기선 제외)
 */
(function() {
  if (window.__affiliateFixedLoaded) return;   // 중복 로드 방지
  window.__affiliateFixedLoaded = true;

  /* 🎨 버튼 기본 문구 (인트로 CTA 스크립트의 CTA_LABELS 와 같게 유지) */
  const CTA_LABELS = {
    PAID: 'Book Tickets',
    FREE: 'Book a Tour'
  };
  const FIXED_ARROW = '';   // 하단바 버튼 뒤 화살표 (없애려면 '' 로)

  // 1. CSS 스타일 동적 주입 (디자인 변경 없음)
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .affiliate-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      height: 100svh;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 12px;
      box-sizing: border-box;
    }
    .affiliate-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .affiliate-modal-content {
      background: #ffffff;
      width: fit-content;
      max-width: 340px;
      max-height: 88vh;
      max-height: 85vh;
      border-radius: 16px;
      padding: 16px;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
      box-sizing: border-box;
    }
    .affiliate-modal-overlay.active .affiliate-modal-content {
      transform: scale(1);
    }
    .affiliate-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
    .affiliate-modal-header-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .affiliate-modal-title {
      font-size: 16px;
      font-weight: 700;
      color: #111111;
      margin: 0;
      line-height: 1.2;
    }
    .affiliate-modal-subtitle {
      font-size: 11px;
      font-weight: 400;
      color: #71717a;
      margin: 0;
      line-height: 1.3;
    }
    .affiliate-modal-close {
      width: 28px;
      height: 28px;
      background: #f2f2f2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      color: #333333;
      border: none;
      line-height: 1;
      flex-shrink: 0;
    }
    #affiliateWidgetContainer {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      padding: 4px;
      box-sizing: border-box;
    }
    #affiliateWidgetContainer * {
      box-shadow: none !important;
    }
    @media (min-width: 640px) {
      .affiliate-modal-content {
        max-width: 440px;
        padding: 20px;
        border-radius: 20px;
      }
    }
    @media (max-width: 639px) {
      #affiliateWidgetContainer > * {
        zoom: 0.77 !important;
        margin: 0 auto !important;
      }
    }

    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 999999 !important;
      background-color: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list))::before {
      content: "" !important;
      position: absolute !important;
      top: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      background-color: #000000 !important;
      z-index: -1 !important;
      pointer-events: none !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) > .notion-callout__content {
      position: relative !important;
      z-index: 12 !important;
      width: 100% !important;
      max-width: var(--notion-max-width, var(--super-max-width, 1110px)) !important;
      margin: 0 auto !important;
      background-color: #000000 !important;
      box-sizing: border-box !important;
      padding-top: 16px !important;
      padding-bottom: 16px !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) blockquote,
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) ol:first-of-type,
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-numbered-list:first-of-type,
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-callout__icon {
      display: none !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-column-list {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      grid-template-columns: none !important;
      gap: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-row {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-column {
      display: flex !important;
      align-items: center !important;
      width: auto !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-text {
      margin: 0 !important;
      padding: 0 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) code {
      background: none !important;
      border: none !important;
      padding: 0 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-semantic-string,
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-semantic-string * {
      color: #F8F9A7 !important;
    }
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .color-brown code a,
    .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .color-brown_background code a {
      color: #ffffff !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      text-decoration: none !important;
    }

    /* 텍스트형 버튼 디자인 적용 */
    .ticket-popup-fixed-btn {
      display: inline !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      color: #F8F9A7 !important;
      font-family: var(--font-main) !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      text-decoration: none !important;
      cursor: pointer !important;
      line-height: inherit !important;
      transition: opacity 0.2s ease !important;
    }
    .ticket-popup-fixed-btn:hover {
      opacity: 0.8 !important;
    }

    @media (max-width: 768px) {
      .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) > .notion-callout__content {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }
      .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-column-list,
      .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-row {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
      }
      .notion-callout[class*="purple"]:has(blockquote):is(:has(ol), :has(.notion-numbered-list)) .notion-column {
        width: auto !important;
      }
      .ticket-popup-fixed-btn {
        font-size: 16px !important;
      }
    }
    @media (max-width: 380px) {
      .ticket-popup-fixed-btn {
        font-size: 14px !important;
      }
    }

    /* ↕ 모바일 전용: CTA 글자를 아이콘 높이에 맞춰 아래로 살짝 내림
       - 레이아웃은 그대로 두고 글자만 이동 (transform)
       - 값이 클수록 아래로, 작을수록 위로 (예: 4px, 6px) */
    :root {
      --fixed-cta-nudge-mobile: 5px;
    }
    @media (max-width: 768px) {
      .notion-callout[class*="purple"]:has(blockquote) .ticket-popup-fixed-btn {
        transform: translateY(var(--fixed-cta-nudge-mobile)) !important;
      }
    }

    /* 안전장치: 하단바 안에서는 알약 버튼도 글자형으로 표시 (스크립트 교체 전 깜빡임 방지) */
    .notion-callout[class*="purple"]:has(blockquote) .ticket-popup-btn {
      display: inline !important;
      background: none !important;
      background-color: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      color: #F8F9A7 !important;
      font-size: 18px !important;
    }
  `;
  document.head.appendChild(styleElement);

  // 2. 공통 함수
  function widgetSrc(productId, orientation, subId) {
    return `https://tpwgts.com/content?currency=USD&trs=528770&shmarker=728332.${encodeURIComponent(subId)}&product=${encodeURIComponent(productId)}&language=en&layout=full&orientation=${encodeURIComponent(orientation)}&powered_by=false&campaign_id=89&promo_id=3984`;
  }

  /* "상품ID/vertical/subID / LABEL: 문구" 파싱 */
  function parseTicketParams(raw) {
    let label = null;
    let main = raw;
    const labelMatch = raw.match(/\/\s*LABEL:\s*(.+)$/i);
    if (labelMatch) {
      label = labelMatch[1].trim() || null;
      main = raw.slice(0, labelMatch.index);
    }
    const params = main.split('/').map(p => p.trim()).filter(Boolean);
    if (params.length < 3) return null;
    return { productId: params[0], orientation: params[1], subId: params[2], label };
  }

  /* 위젯 내용이 넘칠 때만 스크롤 (모달 생성 시점에 연결) */
  function setupOverflowWatch(container) {
    if (!container || !window.ResizeObserver) return;
    const observer = new ResizeObserver(() => {
      const content = container.firstElementChild;
      if (content) {
        const isOverflowing = content.getBoundingClientRect().height > container.clientHeight;
        container.style.overflowY = isOverflowing ? 'auto' : 'hidden';
      }
    });
    observer.observe(container);
    const mutationObserver = new MutationObserver(() => {
      if (container.firstElementChild) observer.observe(container.firstElementChild);
    });
    mutationObserver.observe(container, { childList: true, subtree: true });
  }

  // 3. 모달 (인트로 CTA 스크립트와 같은 구조 → 어느 쪽이 먼저 만들어도 제목이 바뀜)
  function ensureModalExists() {
    if (document.getElementById('affiliateModal')) return;
    const modalHtml = `
      <div id="affiliateModal" class="affiliate-modal-overlay">
        <div class="affiliate-modal-content">
          <div class="affiliate-modal-header">
            <div class="affiliate-modal-header-text">
              <h3 class="affiliate-modal-title" id="affiliateModalTitle">${CTA_LABELS.PAID}</h3>
              <span class="affiliate-modal-subtitle">Bookings are handled through our partner.</span>
            </div>
            <button class="affiliate-modal-close" id="closeAffiliateModal">&times;</button>
          </div>
          <div id="affiliateWidgetContainer"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('affiliateModal');
    const closeBtn = document.getElementById('closeAffiliateModal');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
      };
    }
    setupOverflowWatch(document.getElementById('affiliateWidgetContainer'));
  }

  function openTicketModal(productId, orientation, subId, title) {
    ensureModalExists();
    const modal = document.getElementById('affiliateModal');
    const container = document.getElementById('affiliateWidgetContainer');
    const titleEl = document.getElementById('affiliateModalTitle')
                 || (modal && modal.querySelector('.affiliate-modal-title'));

    if (titleEl) titleEl.textContent = title || CTA_LABELS.PAID;

    if (container) {
      container.innerHTML = '';
      const script = document.createElement('script');
      script.async = true;
      script.charset = 'utf-8';
      script.src = widgetSrc(productId, orientation, subId);
      container.appendChild(script);
    }
    if (modal) modal.classList.add('active');
  }

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.ticket-popup-fixed-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    openTicketModal(
      btn.getAttribute('data-product'),
      btn.getAttribute('data-orientation'),
      btn.getAttribute('data-subid'),
      btn.getAttribute('data-title')
    );
  }, true);

  // 4. 치환 로직 (보이는 글자 기준 → 노션 서식 조각에 영향 없음)
  function makeRangeByOffsets(block, start, end) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
    const range = document.createRange();
    let pos = 0, n, startSet = false;
    while (n = walker.nextNode()) {
      const len = n.textContent.length;
      if (!startSet && start <= pos + len) {
        range.setStart(n, start - pos);
        startSet = true;
      }
      if (startSet && end <= pos + len) {
        range.setEnd(n, end - pos);
        return range;
      }
      pos += len;
    }
    return null;
  }

  function makeFixedButton(type, p) {
    const label = p.label || CTA_LABELS[type] || CTA_LABELS.PAID;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ticket-popup-fixed-btn';
    btn.setAttribute('data-product', p.productId);
    btn.setAttribute('data-orientation', p.orientation);
    btn.setAttribute('data-subid', p.subId);
    btn.setAttribute('data-title', label);
    btn.setAttribute('data-type', type.toLowerCase());
    btn.textContent = label + FIXED_ARROW;
    /* 글자형 고정: 알약 CSS가 어디서 오든 덮어쓰지 못하게 인라인 !important */
    const set = (prop, val) => btn.style.setProperty(prop, val, 'important');
    set('display', 'inline');
    set('background', 'none');
    set('background-color', 'transparent');
    set('border', 'none');
    set('border-radius', '0');
    set('padding', '0');
    set('margin', '0');
    set('box-shadow', 'none');
    set('color', '#F8F9A7');
    set('-webkit-text-fill-color', '#F8F9A7');
    return btn;
  }

  /* _FIXED 토큰: 어디서든 하단바 버튼으로 처리
     일반 토큰([TICKET_FREE: ...] 등): 하단 고정바 안에 있을 때만 하단바 버튼으로 처리 */
  const FIXED_TOKEN_RE = /\[TICKET_(PAID|FREE|POPUP)_FIXED:([^\]]*)\]/;
  const ANY_TOKEN_RE = /\[TICKET_(PAID|FREE|POPUP)(?:_FIXED)?:([^\]]*)\]/;

  function isInFixedBar(el) {
    const bar = el.closest('.notion-callout[class*="purple"]');
    return !!(bar && bar.querySelector('blockquote'));
  }

  /* 안전장치: 다른 스크립트가 하단바 안에 알약 버튼(.ticket-popup-btn)을 만들었으면
     텍스트형 버튼(.ticket-popup-fixed-btn)으로 바꿔치기 */
  function convertStrayPillButtons() {
    document.querySelectorAll('.ticket-popup-btn').forEach(old => {
      if (!isInFixedBar(old)) return;
      const label = old.getAttribute('data-title') || old.textContent.trim() || CTA_LABELS.PAID;
      const type = (old.getAttribute('data-type') || 'paid').toUpperCase();
      const btn = makeFixedButton(type === 'FREE' ? 'FREE' : 'PAID', {
        productId: old.getAttribute('data-product'),
        orientation: old.getAttribute('data-orientation'),
        subId: old.getAttribute('data-subid'),
        label: label
      });
      old.replaceWith(btn);
    });
  }

  function renderFixedTicketButtons() {
    convertStrayPillButtons();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const blocks = new Map();   // block → 이 블록에 쓸 정규식
    let node;
    while (node = walker.nextNode()) {
      const el = node.parentElement;
      if (!el || el.closest('#affiliateModal, .ticket-popup-fixed-btn, .ticket-popup-btn, script, style')) continue;
      const text = node.textContent;
      if (!text.includes('[TICKET_') && !text.includes('_FIXED:')) continue;
      const block = el.closest('.notion-text, p, li') || el;
      if (isInFixedBar(el)) blocks.set(block, ANY_TOKEN_RE);
      else if (text.includes('_FIXED:') && !blocks.has(block)) blocks.set(block, FIXED_TOKEN_RE);
    }

    blocks.forEach((re, block) => {
      let guard = 0;
      let match;
      while ((match = block.textContent.match(re)) && guard++ < 10) {
        const p = parseTicketParams(match[2]);
        const range = makeRangeByOffsets(block, match.index, match.index + match[0].length);
        if (!p || !range) break;
        range.deleteContents();
        range.insertNode(makeFixedButton(match[1] === 'FREE' ? 'FREE' : 'PAID', p));
      }
    });
  }

  function start() {
    ensureModalExists();
    renderFixedTicketButtons();
    setInterval(renderFixedTicketButtons, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
