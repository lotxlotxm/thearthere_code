function renderDynamicTicketWidget() {
  // 노션 인라인 코드 블록([style*="background"])이나 일반 텍스트 노드 중에서 트리거 검색
  const elements = document.querySelectorAll('code, span, div');
  
  elements.forEach(el => {
    // 텍스트 내용 확인 (예: [TICKET_WIDGET:12345])
    if (el.textContent.includes('[TICKET_WIDGET:') && !el.closest('.rendered-ticket-widget')) {
      const rawText = el.textContent;
      
      // 정규식으로 내부의 고유 ID 값만 추출
      const match = rawText.match(/\[TICKET_WIDGET:(.*?)\]/);
      if (!match) return;
      
      const museumId = match[1].trim(); // 노션에 적어둔 고유 ID 추출
      const parent = el.parentNode;
      if (!parent) return;

      // 🚨 트래블페이아웃 기본 베이스 스크립트 템플릿 (ID 부분만 동적 치환)
      // 아래 주소 구조는 예시이므로, 본인의 실제 발급 코드 주소 형태(shmarker 등)에 맞게 tru_id 부분만 ${museumId}로 매칭해두면 됩니다.
      const widgetHTML = `
        <div class="rendered-ticket-widget" style="width:100%; margin: 15px 0;">
          <script src="https://tp.media/content?currency=eur&tru_id=${museumId}&shmarker=YOUR_MARKER_ID&show_border=false"></script>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.className = "rendered-ticket-widget";
      wrapper.innerHTML = widgetHTML;
      
      // 노션 트리거 텍스트를 위젯 컴포넌트로 완전히 치환 (그리드 100% 일치)
      parent.replaceChild(wrapper, el);
      
      // 동적 스크립트 강제 로드 및 실행 트리거
      const scripts = wrapper.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = document.createElement('script');
        script.src = scripts[i].src;
        if(scripts[i].innerHTML) script.innerHTML = scripts[i].innerHTML;
        scripts[i].parentNode.replaceChild(script, scripts[i]);
      }
    }
  });
}

// SPA 구조 대응을 위한 무한 추적 로직 (페이지 이동 시에도 철저하게 추적)
setInterval(() => {
  renderDynamicTicketWidget();
}, 500);
