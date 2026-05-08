
  (function() {
    function initButtons() {
      const container = document.getElementById('super-custom-controls');
      if (!container) return;

      // 모바일/태블릿 부모 레이어에 가두기 해제하고 Body 직속으로 완전히 구출
      if (document.body && container.parentElement !== document.body) {
        document.body.appendChild(container);
      }

      const topBtn = document.getElementById('top-btn-action');
      const shareBtn = document.getElementById('share-btn-action');

      // 모바일/아이패드 터치 고유 지연현상 방지 유틸리티
      function bindFastClick(element, action) {
        if (!element) return;
        
        let moved = false;
        element.addEventListener('touchstart', function() {
          moved = false;
        }, { passive: true });

        element.addEventListener('touchmove', function() {
          moved = true;
        }, { passive: true });

        element.addEventListener('touchend', function(e) {
          if (!moved) {
            e.preventDefault();
            action();
          }
        });

        // PC 동시 작동 호환성 유지
        element.addEventListener('click', function(e) {
          e.preventDefault();
          if (e.screenX === 0 && e.screenY === 0) return; 
          action();
        });
      }

      if (topBtn) {
        bindFastClick(topBtn, function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      if (shareBtn) {
        bindFastClick(shareBtn, function() {
          const url = window.location.href;
          const isMobileOrTablet = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
          
          if (isMobileOrTablet && navigator.share) {
            navigator.share({
              title: document.title,
              url: url
            }).catch((error) => {
              if (error.name !== 'AbortError') {
                copyText(url);
              }
            });
          } else {
            copyText(url);
          }
        });
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

    // Super 비동기식 돔 변화 대응 이중 대기 리스너
    if (document.readyState === 'complete') {
      initButtons();
    } else {
      window.addEventListener('load', initButtons);
      document.addEventListener('DOMContentLoaded', initButtons);
    }

    // 사라짐 현상 및 타 스타일 덮어쓰기 방지를 위한 1초 주기 이중 상시 검증 엔진
    let checkTimer = setInterval(function() {
      const container = document.getElementById('super-custom-controls');
      if (container) {
        // 스타일 강제 재확보
        container.style.setProperty('display', 'flex', 'important');
        container.style.setProperty('opacity', '1', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        
        // 뼈대 재이동 처리
        if (container.parentElement !== document.body) {
          document.body.appendChild(container);
          initButtons();
        }
      }
    }, 1000);

    setTimeout(function() {
      clearInterval(checkTimer);
    }, 12000);
  })();
