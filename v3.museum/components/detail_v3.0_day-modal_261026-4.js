/*!
 * 📌 Opening Hours Modal (요일 표 모달)
 * - [HOURS: ...] 텍스트를 "Open Today" 버튼 + 요일 표 모달로 치환
 * - 지원 항목: 요일(Mon~Sun) / TIMEZONE: / CLOSED: / NOTE: / VERIFIED:
 * - 사용법: Super.so > Code > Head 또는 Body에
 *   <script src="https://cdn.jsdelivr.net/gh/<깃허브아이디>/<저장소>@main/hours-modal.js" defer></script>
 */
(function() {
  if (window.__hoursModalLoaded) return;   // 중복 로드 방지
  window.__hoursModalLoaded = true;

  /* CSS 주입 */
  function injectStyles() {
    if (document.getElementById('hours-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'hours-modal-styles';
    style.textContent = `
/* 관람시간 모달 레이어 */
.hours-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100svh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  padding: 16px;
  box-sizing: border-box;
}
.hours-modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}
.hours-modal-content {
  background: #ffffff;
  width: 100%;
  max-width: 360px;
  max-height: calc(100svh - 32px);   /* 특수상황 글이 길어도 화면 밖으로 안 넘치게 */
  overflow-y: auto;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: scale(0.95);
  transition: transform 0.2s ease;
  box-sizing: border-box;
  color: #37352f;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
}
.hours-modal-overlay.active .hours-modal-content {
  transform: scale(1);
}
.hours-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.hours-modal-header h3.hours-modal-title {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #37352f !important;
  margin: 0 !important;
  line-height: 1.2 !important;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif !important;
}
.hours-modal-close {
  width: 28px;
  height: 28px;
  background: #f4f4f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  color: #37352f;
  border: none;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
}
/* 요일별 테이블 스타일 */
.hours-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #37352f;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
}
.hours-item.today {
  background-color: #F8F9A7;
  border: 0px solid #C9FF6B;
}
.hours-day {
  font-weight: 600;
  color: #37352f;
}
.hours-time {
  color: #37352f;
  font-weight: 500;
}

/* ✨ 특수상황 안내 영역 (NOTE가 있을 때만 표시) */
.hours-note-wrap {
  display: none;
}
.hours-note-wrap.has-note {
  display: block;
}
.hours-note {
  margin-top: 14px;            /* 요일 표 ↔ NOTE 간격 */
  font-size: 12px;
  line-height: 1.4;
  color: #5f5e5b;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
.hours-note ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hours-note li {
  position: relative;
  padding-left: 12px;          /* 점과 문장 사이 간격 */
  margin: 0 0 6px 0;
}
.hours-note li:last-child {
  margin-bottom: 0;
}
.hours-note li::before {
  content: "·";
  position: absolute;
  left: 0;
  top: 0;
  font-weight: 700;
  color: #37352f;
}

/* 모달 안 링크: 평소/호버 밑줄을 똑같이 고정
   (사이트 전역 a:hover 스타일이 밑줄 간격·두께를 바꾸지 못하게) */
.hours-note a,
.hours-note a:hover,
.hours-verified a,
.hours-verified a:hover {
  color: inherit !important;
  text-decoration-line: underline !important;
  text-decoration-style: solid !important;
  text-decoration-thickness: 1px !important;
  text-underline-offset: 2px !important;
  text-decoration-color: currentColor !important;
  border: none !important;
  box-shadow: none !important;
  background: none !important;
  padding: 0 !important;
}
.hours-note a:hover,
.hours-verified a:hover {
  color: #37352f !important;      /* 호버 시 글자색만 진하게 */
}

/* ✨ VERIFIED 확인일 + 출처 (작은 글씨) */
.hours-verified {
  display: none;
  margin-top: 16px;            /* NOTE(또는 요일 표) ↔ 구분선 간격 */
  padding-top: 12px;           /* 구분선 ↔ Verified 글자 간격 */
  border-top: 1px solid #f0f0f0;
  font-size: 10px;
  line-height: 1.5;
  color: #9b9a97;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
}
.hours-verified.has-verified {
  display: block;
}

/* 본문용 관람시간 트리거 버튼 */
.hours-trigger-btn {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  font-family: 'Google Sans Flex', -apple-system, BlinkMacSystemFont, sans-serif;
  text-align: left;
  color: #37352f;
}
.hours-trigger-sub {
  font-size: 16px;
  display: flex;
  gap: 6px;
  align-items: center;
}
/* Open Today 라벨 스타일 */
.hours-trigger-label {
  color: #D34A45;
  font-weight: 600;
  text-decoration: none;
  text-underline-offset: 3px;
}
/* 치환되는 시간 값 스타일 */
.hours-trigger-value {
  color: #ffffff;
  font-weight: 400;
  text-decoration: none;
  text-underline-offset: 3px;
}
/* Closed 강조 스타일 */
.hours-trigger-closed {
  color: #D34A45;
  font-weight: 600;
  text-decoration: none;
  text-underline-offset: 3px;
}
/* 호버 시 텍스트 영역 전체 밑줄 적용 */
.hours-trigger-btn:hover .hours-trigger-label,
.hours-trigger-btn:hover .hours-trigger-value,
.hours-trigger-btn:hover .hours-trigger-closed {
  text-decoration: underline;
}
/* 호버 시 화살표 박스 배경 및 테두리 반응 */
.hours-trigger-btn:hover .hours-trigger-arrow {
  border-color: #F8F9A7;
  background-color: #F8F9A7;
}
.hours-trigger-btn:hover .hours-trigger-arrow svg path {
  stroke: #37352f;
}
/* 드롭다운 화살표 스타일 (사각 테두리 적용) */
.hours-trigger-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: #ffffff;
  margin-left: 2px;
  line-height: 1;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.hours-trigger-arrow svg {
  width: 10px;
  height: 10px;
}
.hours-trigger-arrow svg path {
  stroke: #37352f;
  transition: stroke 0.15s ease;
}
`;
    document.head.appendChild(style);
  }

  function ensureHoursModalExists() {
    if (document.getElementById('hoursModal')) return;
    const modalHtml = `
      <div id="hoursModal" class="hours-modal-overlay">
        <div class="hours-modal-content">
          <div class="hours-modal-header">
            <h3 class="hours-modal-title">Opening Hours</h3>
            <button class="hours-modal-close" id="closeHoursModal">&times;</button>
          </div>
          <div class="hours-list" id="hoursListContainer"></div>
          <div class="hours-note-wrap" id="hoursNoteWrap">
            <div class="hours-note" id="hoursNoteContainer"></div>
            <div class="hours-verified" id="hoursVerifiedContainer"></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('hoursModal');
    const closeBtn = document.getElementById('closeHoursModal');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
      };
    }
  }

  const daysShortMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = {
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday'
  };

  /* 특수상황 글을 안전하게 화면에 넣기 위한 이스케이프 */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 타임존 변환 매핑 */
  function normalizeTimezone(inputTz) {
    if (!inputTz) return null;
    const clean = inputTz.trim().toLowerCase();
    const tzMap = {
      'uk/london': 'Europe/London',
      'england/london': 'Europe/London',
      'france/paris': 'Europe/Paris',
      'netherlands/amsterdam': 'Europe/Amsterdam',
      'us/new_york': 'America/New_York',
      'usa/new_york': 'America/New_York',
      'us/chicago': 'America/Chicago',
      'us/los_angeles': 'America/Los_Angeles',
      'italy/rome': 'Europe/Rome',
      'spain/madrid': 'Europe/Madrid',
      'korea/seoul': 'Asia/Seoul',
      'japan/tokyo': 'Asia/Tokyo'
    };
    return tzMap[clean] || inputTz.trim();
  }

  /* 노션에서 링크를 건 글자를 실제 링크로 바꿔주기
     links: [{ text: '링크 걸린 글자', href: '주소' }] */
  function linkify(text, links) {
    let html = escapeHtml(text);
    links.forEach(link => {
      const safeText = escapeHtml(link.text);
      if (!safeText || !html.includes(safeText)) return;
      const label = safeText.includes('↗') ? safeText : `${safeText} ↗`;
      const anchor = `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      html = html.replace(safeText, anchor);
    });
    return html;
  }

  /* 타임존 + CLOSED + NOTE + VERIFIED 파싱
     '/' 는 다음 항목이 요일·TIMEZONE:·CLOSED:·NOTE:·VERIFIED: 로 시작할 때만 구분자로 인식
     → "UK/London" 이나 특수상황 글 안의 "/" 가 잘리지 않음 */
  function parseHoursData(rawString) {
    const hoursData = {};
    let rawTimezone = null;
    const closedDates = [];
    const notes = [];
    let verified = null;

    const items = rawString.split(/\s*\/\s*(?=(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b|TIMEZONE:|CLOSED:|NOTE:|VERIFIED:)/);
    items.forEach(item => {
      const trimmed = item.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('TIMEZONE:')) {
        rawTimezone = trimmed.replace('TIMEZONE:', '').trim();
      } else if (trimmed.startsWith('CLOSED:')) {
        const datesStr = trimmed.replace('CLOSED:', '').trim();
        datesStr.split(',').forEach(d => {
          if (d.trim()) closedDates.push(d.trim());
        });
      } else if (trimmed.startsWith('NOTE:')) {
        const note = trimmed.replace('NOTE:', '').trim();
        if (note) notes.push(note);   // NOTE를 여러 개 쓰면 · 목록으로 나뉨
      } else if (trimmed.startsWith('VERIFIED:')) {
        verified = trimmed.replace('VERIFIED:', '').trim() || null;
      } else {
        const parts = trimmed.split(' ');
        const day = parts[0];
        const time = parts.slice(1).join(' ');
        if (day && time) {
          hoursData[day.trim()] = time.trim();
        }
      }
    });

    const timezone = normalizeTimezone(rawTimezone);
    return { hoursData, timezone, closedDates, notes, verified };
  }

  /* 현지 타임존 기준 현재 정보(요일 및 MM-DD 포맷 날짜) 가져오기 */
  function getTodayInfoInTimezone(timeZone) {
    const now = new Date();
    try {
      const opts = { timeZone: timeZone || undefined };
      const dayStr = new Intl.DateTimeFormat('en-US', { ...opts, weekday: 'short' }).format(now);
      const yyyy = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric' }).format(now);
      const mm = new Intl.DateTimeFormat('en-US', { ...opts, month: '2-digit' }).format(now);
      const dd = new Intl.DateTimeFormat('en-US', { ...opts, day: '2-digit' }).format(now);

      return {
        dayStr: dayStr,
        mmdd: `${mm}-${dd}`,
        yyyymmdd: `${yyyy}-${mm}-${dd}`
      };
    } catch (e) {
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      return {
        dayStr: daysShortMap[now.getDay()],
        mmdd: `${mm}-${dd}`,
        yyyymmdd: `${now.getFullYear()}-${mm}-${dd}`
      };
    }
  }

  /* 문단(block) 안에서 글자 위치 start~end 를 DOM 범위로 변환
     (링크 때문에 여러 조각으로 나뉜 텍스트도 한 덩어리로 다룸) */
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

  function renderHoursWidgets() {
    ensureHoursModalExists();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const blocks = new Set();
    while (node = walker.nextNode()) {
      const el = node.parentElement;
      if (!el || el.closest('.hours-trigger-btn') || el.closest('#hoursModal')) continue;
      if (node.textContent.includes('[HOURS:')) {
        /* 링크가 섞여 있어도 문단 전체를 기준으로 읽기 */
        blocks.add(el.closest('.notion-text, p, li') || el);
      }
    }

    blocks.forEach(block => {
      const fullText = block.textContent;
      const match = fullText.match(/\[HOURS:(.*?)\]/);
      if (!match) return;

      /* HOURS 범위 안에 있는 노션 링크 수집 */
      const range = makeRangeByOffsets(block, match.index, match.index + match[0].length);
      if (!range) return;
      const links = [...block.querySelectorAll('a[href]')]
        .filter(a => range.intersectsNode(a))
        .map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));

      const { hoursData, timezone, closedDates, notes, verified } = parseHoursData(match[1]);

      const todayInfo = getTodayInfoInTimezone(timezone);
      const todayDayStr = todayInfo.dayStr;

      const isSpecialClosed = closedDates.some(d => d === todayInfo.mmdd || d === todayInfo.yyyymmdd);

      let todayTime = hoursData[todayDayStr] || 'Closed';
      if (isSpecialClosed) {
        todayTime = 'Closed';
      }

      const isClosed = todayTime.toLowerCase() === 'closed';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hours-trigger-btn';
      btn.innerHTML = `
        <span class="hours-trigger-sub">
          ${
            isClosed
              ? `<span class="hours-trigger-closed">Closed Today</span>`
              : `<span class="hours-trigger-label">Open Today:</span><span class="hours-trigger-value">${todayTime}</span>`
          }
          <span class="hours-trigger-arrow">
            <svg viewBox="0 0 10 6">
              <path d="M1 1L5 5L9 1" stroke="#37352f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
          </span>
        </span>
      `;

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const container = document.getElementById('hoursListContainer');
        if (!container) return;
        container.innerHTML = '';
        const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        daysOrder.forEach(dayKey => {
          if (hoursData[dayKey]) {
            const isToday = dayKey === todayDayStr;
            const displayTime = (isToday && isSpecialClosed) ? 'Closed' : hoursData[dayKey];

            const row = document.createElement('div');
            row.className = `hours-item ${isToday ? 'today' : ''}`;
            row.innerHTML = `
              <span class="hours-day">${fullDayNames[dayKey]} ${isToday ? '(Today)' : ''}</span>
              <span class="hours-time">${displayTime}</span>
            `;
            container.appendChild(row);
          }
        });

        /* ✨ 특수상황 안내 + VERIFIED: 이 페이지에 있을 때만 구분선과 함께 표시 */
        const noteWrap = document.getElementById('hoursNoteWrap');
        const noteContainer = document.getElementById('hoursNoteContainer');
        const verifiedContainer = document.getElementById('hoursVerifiedContainer');
        if (noteWrap && noteContainer && verifiedContainer) {
          noteContainer.innerHTML = notes.length
            ? `<ul>${notes.map(n => `<li>${linkify(n, links)}</li>`).join('')}</ul>`
            : '';

          if (verified) {
            verifiedContainer.innerHTML = `Verified ${linkify(verified, links)}`;
            verifiedContainer.classList.add('has-verified');
          } else {
            verifiedContainer.innerHTML = '';
            verifiedContainer.classList.remove('has-verified');
          }

          noteWrap.classList.toggle('has-note', notes.length > 0 || !!verified);
        }

        document.getElementById('hoursModal').classList.add('active');
      };

      /* HOURS 텍스트(링크 포함)를 통째로 버튼으로 교체 */
      range.deleteContents();
      range.insertNode(btn);
    });
  }

  function start() {
    injectStyles();
    renderHoursWidgets();
    setInterval(renderHoursWidgets, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
