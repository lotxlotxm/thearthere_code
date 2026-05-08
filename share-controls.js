(function() {
  function initButtons() {
    let container = document.getElementById('super-custom-controls');
    if (!container) return;

    // [1] 모바일/아이패드에서 노션 부모 상자 안에 갇혀 소멸하는 버그 방지 (Body 직속으로 완전 이동)
    if (document.body && container.parentElement !== document.body) {
      document.body.appendChild(container);
    }

    const topBtn = document.getElementById('top-btn-action');
    const shareBtn = document.getElementById('share-btn-action');

    // [2] 모바일 및 터치 디바이스(아이패드 등) 터치 즉시 반응 유틸리티
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

      // 마우스 클릭도 정상 동시 지원 (PC 대응)
      element.addEventListener('click', function(e) {
        e.preventDefault();
        // 터치 이벤트가 이미 실행된 경우 중복 실행 방지
        if (e.screenX === 0 && e.screenY === 0) return; 
        action();
      });
    }

    // TOP 버튼 작동 정의
    if (topBtn) {
      bindFastClick(topBtn, function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 공유하기 버튼 작동 정의
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

  // [3] Super 환경의 지연 로딩 대응: 주기적 감시(Interval) 및 상태별 다중 실행 보증
  if (document.readyState === 'complete') {
    initButtons();
  } else {
    window.addEventListener('load', initButtons);
    document.addEventListener('DOMContentLoaded', initButtons);
  }

  // Super 엔진이 비동기로 돔을 여러 번 리빌딩할 때 사라지는 문제를 방지하기 위해 1초 간격으로 검증
  let checkTimer = setInterval(function() {
    const container = document.getElementById('super-custom-controls');
    if (container && container.parentElement !== document.body) {
      initButtons();
    }
  }, 1000);

  // 최대 10초 후에 타이머 소멸 처리 (리소스 점유 방지)
  setTimeout(function() {
    clearInterval(checkTimer);
  }, 10000);
})();
