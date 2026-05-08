(function () {

  // 버튼 생성
  function createControls() {

    // 이미 있으면 제거 후 재생성
    const old = document.getElementById('super-custom-controls');

    if (old) {
      old.remove();
    }

    const container = document.createElement('div');

    container.id = 'super-custom-controls';

    container.innerHTML = `
      <button class="control-btn share" id="share-btn-action" title="공유하기">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
      </button>

      <a href="#" class="control-btn top" id="top-btn-action">
        TOP
      </a>
    `;

    document.body.appendChild(container);

    bindEvents();
  }

  // 이벤트 연결
  function bindEvents() {

    const topBtn = document.getElementById('top-btn-action');
    const shareBtn = document.getElementById('share-btn-action');

    // TOP
    if (topBtn) {

      topBtn.onclick = function (e) {

        e.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      };

    }

    // SHARE
    if (shareBtn) {

      shareBtn.onclick = async function (e) {

        e.preventDefault();

        const url = window.location.href;

        const isTouchApple =
          navigator.maxTouchPoints > 1 &&
          /MacIntel/.test(navigator.platform);

        const isMobileOrTablet =
          /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
          || isTouchApple;

        if (isMobileOrTablet && navigator.share) {

          try {

            await navigator.share({
              title: document.title,
              url: url
            });

          } catch (error) {

            if (error.name !== 'AbortError') {
              copyText(url);
            }

          }

        } else {

          copyText(url);

        }

      };

    }

  }

  // 복사
  function copyText(text) {

    if (navigator.clipboard && window.isSecureContext) {

      navigator.clipboard.writeText(text)
        .then(function () {
          alert('Link copied to clipboard.');
        })
        .catch(function () {
          fallbackCopy(text);
        });

    } else {

      fallbackCopy(text);

    }

  }

  // fallback
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
      alert('Link copied to clipboard.');

    } catch (err) {}

    document.body.removeChild(input);

  }

  // Super / 모바일 / 아이패드 대응
  function boot() {

    createControls();

    setTimeout(createControls, 300);
    setTimeout(createControls, 1000);
    setTimeout(createControls, 2000);

  }

  // 실행
  if (document.readyState === 'complete') {

    boot();

  } else {

    window.addEventListener('load', boot);

  }

})();
