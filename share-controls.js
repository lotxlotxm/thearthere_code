(function() {
    function initButtons() {
      const container = document.getElementById('super-custom-controls');
      if (!container) return;
      document.body.appendChild(container);

      const topBtn = document.getElementById('top-btn-action');
      const shareBtn = document.getElementById('share-btn-action');

      if (topBtn) {
        topBtn.onclick = function(e) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
      }

      if (shareBtn) {
        shareBtn.onclick = function() {
          const url = window.location.href;
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          // 모바일 기기이고 공유 API를 지원하는 경우
          if (isMobile && navigator.share) {
            navigator.share({
              title: document.title,
              url: url
            }).catch((error) => {
              // 취소했을 때(AbortError)는 아무것도 하지 않음
              if (error.name !== 'AbortError') {
                copyText(url);
              }
            });
          } else {
            // PC 환경은 바로 링크 복사
            copyText(url);
          }
        };
      }
    }
    function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          alert("Link copied to clipboard.");
        }).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    }
    function fallbackCopy(text) {
      const input = document.createElement('input');
      input.value = text;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.focus();
      input.select();
      try {
        document.execCommand('copy');
        alert("Link copied to clipboard.");
      } catch (err) {}
      document.body.removeChild(input);
    }

    if (document.readyState === 'complete') {
      initButtons();
    } else {
      window.addEventListener('load', initButtons);
    }
  })();
