function renderDynamicTicketWidget() {
  // 화면의 모든 텍스트 노드를 탐색하는 TreeWalker 구동
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  const nodesToReplace = [];

  // [TICKET_WIDGET:숫자] 형태의 순수 텍스트가 포함된 노드만 안전하게 수집
  while (node = walker.nextNode()) {
    if (node.textContent.includes('[TICKET_WIDGET:') && !node.parentNode.closest('.rendered-ticket-widget')) {
      nodesToReplace.push(node);
    }
  }

  // 수집한 텍스트 노드들을 실제 트래블페이아웃 달력 위젯으로 치환
  nodesToReplace.forEach(textNode => {
    const parent = textNode.parentNode;
    if (!parent) return;

    const rawText = textNode.textContent;
    const match = rawText.match(/\[TICKET_WIDGET:(.*?)\]/);
    if (!match) return;

    const museumId = match[1].trim(); // promo_id 숫값 추출 (예: 3984)

    // 🚨 본인의 실제 트래블페이아웃 스크립트 구조에 맞춰 파라미터(shmarker 등)를 최종 세팅하세요!
    // 디자이너님이 발견하신 promo_id=${museumId} 구조로 동적 매칭됩니다.
    const widgetHTML = `
      <div class="rendered-ticket-widget" style="width:100%; margin: 15px 0;">
        <script src="https://tp.media/content?currency=eur&promo_id=${museumId}&shmarker=YOUR_MARKER_ID&show_border=false"></script>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = "rendered-ticket-widget";
    wrapper.innerHTML = widgetHTML;

    // 기존 텍스트 노드를 위젯 박스로 완전 교체
    parent.replaceChild(wrapper, textNode);

    // 동적 자바스크립트 강제 로드 및 실행 트리거 (Super 환경 필수 로직)
    const scripts = wrapper.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const script = document.createElement('script');
      script.src = scripts[i].src;
      if (scripts[i].innerHTML) script.innerHTML = scripts[i].innerHTML;
      scripts[i].parentNode.replaceChild(script, scripts[i]);
    }
  });
}

// 무한 추적 타이머 (뒤로가기, 홈 이동 등 SPA 라우팅 완벽 대응)
setInterval(() => {
  renderDynamicTicketWidget();
}, 500);
