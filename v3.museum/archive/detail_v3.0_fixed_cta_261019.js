(function() {
  // 1. CSS 스타일 동적 주입 (알약 스타일 제거 및 텍스트형 스타일 적용)
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
  `;
  document.head.appendChild(styleElement);

  // 2. 위젯 스크롤 옵저버 설정
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('affiliateWidgetContainer');
    if (!container) return;
    const observer = new ResizeObserver(() => {
      const content = container.firstElementChild;
      if (content) {
        const isOverflowing = content.getBoundingClientRect().height > container.clientHeight;
        container.style.overflowY = isOverflowing ? 'auto' : 'hidden';
      }
    });
    observer.observe(container);
    const mutationObserver = new MutationObserver(() => {
      if (container.firstElementChild) {
        observer.observe(container.firstElementChild);
      }
    });
    mutationObserver.observe(container, { childList: true, subtree: true });
  });

  // 3. 모달 및 치환 로직 (FIXED 버전)
  function ensureModalExists() {
    if (document.getElementById('affiliateModal')) return;
    const modalHtml = `
      <div id="affiliateModal" class="affiliate-modal-overlay">
        <div class="affiliate-modal-content">
          <div class="affiliate-modal-header">
            <div class="affiliate-modal-header-text">
              <h3 class="affiliate-modal-title">Plan your visit</h3>
              <span class="affiliate-modal-subtitle">Bookings are handled through our partner.</span>
            </div>
            <button class="affiliate-modal-close" id="closeAffiliateModal">&times;</button>
          </div>
          <div id="affiliateWidgetContainer"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    setupModalEvents();
  }

  function setupModalEvents() {
    const modal = document.getElementById('affiliateModal');
    const closeBtn = document.getElementById('closeAffiliateModal');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('active');
    }
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
      };
    }
  }

  function openTicketModal(productId, orientation, subId) {
    ensureModalExists();
    const modal = document.getElementById('affiliateModal');
    const container = document.getElementById('affiliateWidgetContainer');
    if (container) {
      container.innerHTML = '';
      const script = document.createElement('script');
      script.async = true;
      script.charset = "utf-8";
      script.src = `https://tpwgts.com/content?currency=USD&trs=528770&shmarker=728332.${subId}&product=${productId}&language=en&layout=full&orientation=${orientation}&powered_by=false&campaign_id=89&promo_id=3984`;
      container.appendChild(script);
    }
    if (modal) {
      modal.classList.add('active');
    }
  }

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.ticket-popup-fixed-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const productId = btn.getAttribute('data-product');
    const orientation = btn.getAttribute('data-orientation');
    const subId = btn.getAttribute('data-subid');
    openTicketModal(productId, orientation, subId);
  }, true);

  function renderAllTicketWidgets() {
    const elements = document.querySelectorAll('p, span, code, a, li');
    elements.forEach(el => {
      if (el.dataset.ticketFixedProcessed) return;
      const html = el.innerHTML;
      if (html.includes('[TICKET_POPUP_FIXED:') || html.includes('[TICKET_WIDGET:')) {
        if (html.includes('[TICKET_POPUP_FIXED:')) {
          const match = html.match(/\[TICKET_POPUP_FIXED:(.*?)\]/);
          if (match) {
            const params = match[1].split('/');
            if (params.length >= 3) {
              const productId = params[0].trim();
              const orientation = params[1].trim();
              const subId = params[2].trim();
              const btn = document.createElement('button');
              btn.type = 'button';
              btn.className = 'ticket-popup-fixed-btn';
              btn.setAttribute('data-product', productId);
              btn.setAttribute('data-orientation', orientation);
              btn.setAttribute('data-subid', subId);
              btn.innerHTML = `Book Your Tickets ↗`;
              el.innerHTML = html.replace(match[0], '');
              el.appendChild(btn);
              el.dataset.ticketFixedProcessed = 'true';
            }
          }
        }
        if (html.includes('[TICKET_WIDGET:')) {
          const match = html.match(/\[TICKET_WIDGET:(.*?)\]/);
          if (match) {
            const params = match[1].split('/');
            if (params.length >= 3) {
              const productId = params[0].trim();
              const orientation = params[1].trim();
              const subId = params[2].trim();
              const container = document.createElement('div');
              container.className = "widget-container";
              container.style.width = "100%";
              container.style.margin = "15px 0";
              const script = document.createElement('script');
              script.async = true;
              script.charset = "utf-8";
              script.src = `https://tpwgts.com/content?currency=USD&trs=528770&shmarker=728332.${subId}&product=${productId}&language=en&layout=full&orientation=${orientation}&powered_by=false&campaign_id=89&promo_id=3984`;
              container.appendChild(script);
              el.innerHTML = html.replace(match[0], '');
              el.appendChild(container);
              el.dataset.ticketFixedProcessed = 'true';
            }
          }
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', ensureModalExists);
  setInterval(renderAllTicketWidgets, 500);
})();
