/* 요일 모달 v1 - 예외 날짜 없음 */
/깃허브 용으로 바꿔야함/ 

<!--📌요일 표 모달-->
<style>
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
/* 호버 시 화살표 SVG 선 색상 흰색 변경 */
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
/* SVG stroke 색상 트랜지션 추가 */
.hours-trigger-arrow svg path {
  stroke: #37352f;
  transition: stroke 0.15s ease;
}
</style>
<script>
(function() {
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
  /* 나라/도시 커스텀 입력을 IANA 표준 타임존으로 자동 변환하는 매핑 테이블 */
  function normalizeTimezone(inputTz) {
    if (!inputTz) return null;
    const clean = inputTz.trim().toLowerCase();
    const tzMap = {
      // 영국 / 런던
      'uk/london': 'Europe/London',
      'england/london': 'Europe/London',
      // 프랑스 / 파리
      'france/paris': 'Europe/Paris',
      // 네덜란드 / 암스테르담
      'netherlands/amsterdam': 'Europe/Amsterdam',
      // 미국 / 주요 도시
      'us/new_york': 'America/New_York',
      'usa/new_york': 'America/New_York',
      'us/chicago': 'America/Chicago',
      'us/los_angeles': 'America/Los_Angeles',
      // 이탈리아 / 로마
      'italy/rome': 'Europe/Rome',
      // 스페인 / 마드리드
      'spain/madrid': 'Europe/Madrid',
      // 한국 / 서울
      'korea/seoul': 'Asia/Seoul',
      // 일본 / 도쿄
      'japan/tokyo': 'Asia/Tokyo'
    };
    return tzMap[clean] || inputTz.trim();
  }
  /* 타임존 파싱 및 데이터 분리 */
  function parseHoursData(rawString) {
    const hoursData = {};
    let rawTimezone = null;
    const items = rawString.split('/');
    items.forEach(item => {
      const trimmed = item.trim();
      if (trimmed.startsWith('TIMEZONE:')) {
        rawTimezone = trimmed.replace('TIMEZONE:', '').trim();
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
    return { hoursData, timezone };
  }
  /* 현지 타임존 기준 요일 구하기 함수 */
  function getTodayInTimezone(timeZone) {
    const now = new Date();
    if (!timeZone) {
      return daysShortMap[now.getDay()];
    }
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        weekday: 'short'
      });
      return formatter.format(now);
    } catch (e) {
      return daysShortMap[now.getDay()];
    }
  }
  function renderHoursWidgets() {
    ensureHoursModalExists();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];
    while (node = walker.nextNode()) {
      if (node.textContent.includes('[HOURS:') && !node.parentNode.closest('.hours-trigger-btn')) {
        nodesToReplace.push(node);
      }
    }
    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;
      const rawText = textNode.textContent;
      const match = rawText.match(/\[HOURS:(.*?)\]/);
      if (!match) return;
      const { hoursData, timezone } = parseHoursData(match[1]);
      /* 현지 시간 기준 요일 산출 */
      const todayDayStr = getTodayInTimezone(timezone);
      const todayTime = hoursData[todayDayStr] || 'Closed';
      const isClosed = todayTime.toLowerCase() === 'closed';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hours-trigger-btn';
      /* 호버 시 밑줄이 연결되는 구조 */
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
            const row = document.createElement('div');
            const isToday = dayKey === todayDayStr;
            row.className = `hours-item ${isToday ? 'today' : ''}`;
            row.innerHTML = `
              <span class="hours-day">${fullDayNames[dayKey]} ${isToday ? '(Today)' : ''}</span>
              <span class="hours-time">${hoursData[dayKey]}</span>
            `;
            container.appendChild(row);
          }
        });
        document.getElementById('hoursModal').classList.add('active');
      };
      parent.replaceChild(btn, textNode);
    });
  }
  document.addEventListener('DOMContentLoaded', renderHoursWidgets);
  setInterval(renderHoursWidgets, 500);
})();
</script>
