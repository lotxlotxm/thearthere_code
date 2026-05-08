<!----------[TOP 공유 버튼 제어]----------->
<div id="super-custom-controls">
    <button class="control-btn share" id="share-btn-action" title="공유하기">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
    </button>
    <a href="#" class="control-btn top" id="top-btn-action">TOP</a>
</div>
<style>
  #super-custom-controls {
    position: fixed !important;
    bottom: 30px !important;
    right: 30px !important;
    z-index: 99999999 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    opacity: 1 !important;
  }
  .control-btn {
    width: 45px !important;
    height: 45px !important;
    background-color: #ffffff !important;
    border: 1px solid #c9c9c9 !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: transform 0.2s ease !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
    padding: 0 !important;
    outline: none !important;
    -webkit-tap-highlight-color: transparent;
  }
  .control-btn.top {
    font-size: 13px !important;
    font-weight: bold !important;
    color: #777777 !important;
    line-height: 1.1 !important;
    text-decoration: none !important;
  }
  .control-btn.share svg {
    width: 20px !important;
    height: 20px !important;
    fill: #777777 !important;
  }
  .control-btn:hover {
    transform: scale(1.1) !important;
  }
</style>
<script>
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
</script>
