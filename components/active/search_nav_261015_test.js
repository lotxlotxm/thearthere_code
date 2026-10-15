/* =========================================================
   네비 통합검색 (#search) - 수정본 (모바일 X버튼 좌측 위치 정렬 포함)
   ========================================================= */
(function () {
    if (window.__navSearchLoaded) return;
    window.__navSearchLoaded = true;

    const SELECTOR     = 'a[href$="#search"]';   
    const JSON_URL     = "https://cdn.jsdelivr.net/gh/lotxlotxm/thearthere_code@main/json/relation-keyword_261009.json";
    const BACKUP_URL   = "https://raw.githubusercontent.com/lotxlotxm/thearthere_code/main/json/relation-keyword_261009.json";
    const TARGET_URL   = "https://thearthere.com/find/art-museums";   
    const PLACEHOLDER  = "Search cities, art museums, or artworks...";
    const MAX_RESULTS  = 15;
    const PANEL_COLOR  = "#35342d";              
    const ICON_SEARCH  = "https://res.cloudinary.com/dwtaoukfu/image/upload/v1788758564/icon_search_wh_num0y9.png";
    const SUGGEST = [                             
        { label: "Cities",  terms: ["Paris", "Amsterdam", "New York", "Washington, D.C."] },
        { label: "Artists", terms: ["Claude Monet", "Vincent van Gogh", "Edgar Degas"] }
    ];

const X_ICON = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><path d='M4 4L18 18M18 4L4 18' stroke='white' stroke-width='2' stroke-linecap='round'/></svg>";

const styleEl = document.createElement('style');

styleEl.textContent = `
    ${SELECTOR} {
        display: inline-block !important;
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        padding: 0 !important;
        font-size: 0 !important;
        line-height: 0 !important;
        color: transparent !important;
        -webkit-text-fill-color: transparent !important;
        text-decoration: none !important;

        background-image: none !important;
        background-color: #37352F !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 22px 22px !important;

        -webkit-mask-image: url("${ICON_SEARCH}") !important;
        mask-image: url("${ICON_SEARCH}") !important;
        -webkit-mask-position: center !important;
        mask-position: center !important;
        -webkit-mask-repeat: no-repeat !important;
        mask-repeat: no-repeat !important;
        -webkit-mask-size: 22px 22px !important;
        mask-size: 22px 22px !important;

        cursor: pointer !important;
    }

    html body .super-navbar ${SELECTOR},
    html body .super-navbar ${SELECTOR}.is-search-open {
        transition: none !important;
        animation: none !important;
        transform: none !important;
    }

    ${SELECTOR} * {
        display: none !important;
    }

    html[data-nav-search="light"] ${SELECTOR} {
        background-color: #FFFFFF !important;
    }

    html[data-nav-search] ${SELECTOR}.is-search-open {
        background-image: url("${X_ICON}") !important;
        background-color: transparent !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
    }

    html[data-search-open] .super-navbar.super-navbar.super-navbar {
        background-color: #37352F !important;
        transition: none !important;
    }

    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__menu-item,
    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__item,
    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__button,
    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__menu-item > a,
    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__menu-item span,
    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__list {
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
    }

    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__button svg,
    html[data-search-open] .super-navbar.super-navbar.super-navbar .super-navbar__button svg * {
        fill: #ffffff !important;
        stroke: #ffffff !important;
        color: #ffffff !important;
    }

    html[data-search-open] .super-navbar.super-navbar.super-navbar img[alt="Logo"] {
        filter: brightness(0) invert(1) !important;
    }

    /* 모바일 메가메뉴 열렸을 때 검색 아이콘 무조건 흰색으로 강제 노출 */
    @media (max-width: 768px) {
        html[data-search-open] .super-navbar ${SELECTOR} {
            background-color: #ffffff !important;
        }
    }
`;

document.head.appendChild(styleEl);

const HERO_PATHS       = [/^\/$/, /^\/art-museums\/[^/]+$/];   
const SCROLL_THRESHOLD = 100;                                    

function isHeroPage() {
    const p = location.pathname.replace(/\/+$/, '') || '/';
    return HERO_PATHS.some(re => re.test(p));
}

function updateIconTone() {
    const light = isHeroPage() && window.scrollY <= SCROLL_THRESHOLD;
    document.documentElement.setAttribute('data-nav-search', light ? 'light' : 'dark');
}

let toneTicking = false;
window.addEventListener('scroll', () => {
    if (!toneTicking) {
        toneTicking = true;
        requestAnimationFrame(() => { updateIconTone(); toneTicking = false; });
    }
}, { passive: true });

window.addEventListener('popstate', updateIconTone);

['pushState', 'replaceState'].forEach(fn => {
    const orig = history[fn];
    history[fn] = function () {
        const r = orig.apply(this, arguments);
        setTimeout(updateIconTone, 0);
        return r;
    };
});

updateIconTone();

    const PANEL_CSS = `
        :host { all: initial; }
        * { box-sizing: border-box; }
        .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.55); }
        .panel {
            position: relative; max-height: 100%; overflow-y: auto;
            background: ${PANEL_COLOR}; color: #ffffff;
            font-family: 'Google Sans Flex','Noto Sans KR',sans-serif;
            box-shadow: 0 12px 30px rgba(0,0,0,.25);
        }
        .inner { width: min(1100px, calc(100vw - 48px)); margin: 0 auto; padding: 28px 0 36px; }
        .field { position: relative; }
        .q {
            width: 100%; padding: 10px 90px 12px 0; margin: 0;
            border: none; border-bottom: 3px solid #ffffff; border-radius: 0; outline: none;
            background: transparent; color: #ffffff; -webkit-text-fill-color: #ffffff; caret-color: #ffffff;
            font-family: inherit; font-size: 28px; font-weight: 600; line-height: 1.4; letter-spacing: -0.02em;
        }
        .q::placeholder { color: rgba(255,255,255,.55); -webkit-text-fill-color: rgba(255,255,255,.55); }
        .icon { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; pointer-events: none; }
        .clear {
            display: none; position: absolute; right: 36px; top: 50%; transform: translateY(-50%);
            width: 18px; height: 18px; padding: 0; border: 1.5px solid #ffffff; border-radius: 50%;
            background: transparent; cursor: pointer; align-items: center; justify-content: center; opacity: .85;
        }
        .clear.show { display: flex; }
        .label { margin: 28px 0 6px; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #888888; }
        .sug { display: flex; flex-wrap: wrap; gap: 4px 28px; }
        .sug button {
            all: unset; cursor: pointer; padding: 4px 0;
            font-family: inherit; font-size: 16px; font-weight: 600; color: #ffffff;
        }
        .sug button:hover { text-decoration: underline; }
        .row {
            display: flex; justify-content: space-between; align-items: center; gap: 16px;
            padding: 16px 0; margin: 0; color: #ffffff; text-decoration: none; cursor: pointer;
            border-bottom: 1px solid rgba(255,255,255,.14);
        }
        .row:hover, .row.active { background: rgba(255,255,255,.06); }
        .t { font-size: 18px; font-weight: 600; line-height: 1.3; }
        .s { margin-top: 4px; font-size: 13px; color: #888888; line-height: 1.3; }
        .arrow { color: #ffffff; font-size: 20px; }
        .more { display: inline-block; margin-top: 22px; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: underline; cursor: pointer; }
        .empty { padding: 20px 0 4px; font-size: 15px; color: #F8F9A7; }
        @media (max-width: 768px) {
            .inner { padding: 18px 0 28px; }
            .q { font-size: 16px; }        
            .t { font-size: 16px; }
        }
    `;

    let host, input, bodyEl, clearBtn;
    let isOpen = false, activeIndex = -1, currentMatches = [], triggerEl = null;
    let searchData = [], dataPromise = null, gaTimer = null, prevOverflow = '';

    function esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
    }
    function norm(s) {
        return String(s || "").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    function track(name, params) {
        try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {}
    }

    function loadData() {
        if (dataPromise) return dataPromise;
        dataPromise = fetch(JSON_URL)
            .then(r => { if (!r.ok) throw new Error('bad response'); return r.json(); })
            .catch(() => fetch(BACKUP_URL).then(r => r.json()))
            .then(d => { searchData = Array.isArray(d) ? d : []; return searchData; })
            .catch(e => { console.error('JSON 로드 실패:', e); dataPromise = null; return []; });
        return dataPromise;
    }

    function findMatches(query) {
        const q = norm(query.trim());
        if (!q) return [];
        return searchData
            .filter(item => norm((item.title || "") + " " + (item.sub || "") + " " + (item.museum || "")).includes(q))
            .sort((a, b) => (a.type === 'Art Museum' ? 0 : 1) - (b.type === 'Art Museum' ? 0 : 1))
            .slice(0, MAX_RESULTS);
    }

    function navBottom() {
        const t = triggerEl || document.querySelector(SELECTOR);
        let best = null;
        for (let el = t; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
            const r = el.getBoundingClientRect();
            if (r.width >= window.innerWidth * 0.9 && r.top <= 2 && r.height > 24 && r.height < 220) best = r;
        }
        return best ? Math.max(0, best.bottom) : 80;
    }
    function positionHost() {
        if (host) host.style.top = navBottom() + 'px';
    }

    function buildHost() {
        if (host) return;
        host = document.createElement('div');
        host.id = 'nav-search-host';
        host.style.cssText = 'display:none; position:fixed; left:0; right:0; bottom:0; z-index:2147483000;';
        const root = host.attachShadow({ mode: 'open' });
        root.innerHTML = `
            <style>${PANEL_CSS}</style>
            <div class="backdrop"></div>
            <div class="panel" role="dialog" aria-label="Search">
                <div class="inner">
                    <div class="field">
                        <input class="q" type="text" placeholder="${esc(PLACEHOLDER)}" autocomplete="off" enterkeyhint="search" aria-label="Search cities, art museums, or artworks">
                        <button class="clear" type="button" aria-label="Clear search">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 1L7 7M1 7L7 1" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/></svg>
                        </button>
                        <img class="icon" src="${ICON_SEARCH}" alt="">
                    </div>
                    <div class="body"></div>
                </div>
            </div>`;
        document.body.appendChild(host);

        input = root.querySelector('.q');
        bodyEl = root.querySelector('.body');
        clearBtn = root.querySelector('.clear');

        root.querySelector('.backdrop').addEventListener('click', close);
        clearBtn.addEventListener('click', () => { input.value = ''; renderBody(''); input.focus(); });

        input.addEventListener('input', () => {
            renderBody(input.value);
            const q = input.value.trim();
            clearTimeout(gaTimer);
            if (q) gaTimer = setTimeout(() => track('view_search_results', { search_term: q.toLowerCase() }), 800);
        });

        input.addEventListener('keydown', e => {
            const rows = Array.from(bodyEl.querySelectorAll('.row'));
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                if (!rows.length) return;
                e.preventDefault();
                const step = e.key === 'ArrowDown' ? 1 : -1;
                setActive((activeIndex + step + rows.length) % rows.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const row = rows[activeIndex];
                track('select_search_result', { search_term: input.value.trim().toLowerCase(), result_path: row ? row.getAttribute('href') : TARGET_URL });
                location.href = row ? row.getAttribute('href') : TARGET_URL;
            } else if (e.key === 'Escape') {
                close();
            }
        });

        bodyEl.addEventListener('click', e => {
            const termBtn = e.target.closest('[data-term]');
            if (termBtn) {
                input.value = termBtn.dataset.term;
                renderBody(input.value);
                track('view_search_results', { search_term: input.value.toLowerCase() });
                input.focus();
                return;
            }
            const row = e.target.closest('.row');
            if (row) track('select_search_result', { search_term: input.value.trim().toLowerCase(), result_path: row.getAttribute('href') });
        });
    }

    function setActive(i) {
        const rows = bodyEl.querySelectorAll('.row');
        rows.forEach((r, idx) => r.classList.toggle('active', idx === i));
        activeIndex = i;
        if (rows[i]) rows[i].scrollIntoView({ block: 'nearest' });
    }

    function suggestionsHtml() {
        return SUGGEST.map(g => `
            <div class="label">${esc(g.label)}</div>
            <div class="sug">${g.terms.map(t => `<button type="button" data-term="${esc(t)}">${esc(t)}</button>`).join('')}</div>
        `).join('');
    }

    function renderBody(value) {
        const query = value.trim();
        clearBtn.classList.toggle('show', value.length > 0);
        activeIndex = -1;

        if (!query) {
            currentMatches = [];
            bodyEl.innerHTML = suggestionsHtml();
            return;
        }

        const matches = findMatches(query);
        currentMatches = matches;

        if (!matches.length) {
            bodyEl.innerHTML = `
                <div class="empty">No results for “${esc(query)}”.</div>
                <a class="more" href="${esc(TARGET_URL)}">Browse all art museums →</a>`;
            return;
        }

        const museums = matches.filter(m => m.type === 'Art Museum');
        const works = matches.filter(m => m.type !== 'Art Museum');
        const rows = list => list.map(item => `
            <a class="row" href="${esc(item.url || item.path || '#')}">
                <div>
                    <div class="t">${esc(item.title || "")}</div>
                    <div class="s">${esc(item.sub || "")}</div>
                </div>
                <span class="arrow">→</span>
            </a>`).join('');

        let html = '';
        if (museums.length) html += `<div class="label">Art Museums</div>` + rows(museums);
        if (works.length)   html += `<div class="label">Artworks</div>` + rows(works);
        html += `<a class="more" href="${esc(TARGET_URL)}">View all art museums →</a>`;
        bodyEl.innerHTML = html;
    }

    function closeOtherMenus() {
        try { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); } catch (e) {}
        if (window.innerWidth <= 768) {
            const t = document.querySelector('[aria-expanded="true"][aria-label*="menu" i]');
            if (t) t.click();
        }
    }

    function setTriggerState(on) {
        document.querySelectorAll(SELECTOR).forEach(a => a.classList.toggle('is-search-open', on));
        if (on) document.documentElement.setAttribute('data-search-open', '');
        else document.documentElement.removeAttribute('data-search-open');
    }

    function open(trigger) {
        triggerEl = trigger || document.querySelector(SELECTOR);
        closeOtherMenus();
        buildHost();
        positionHost();
        host.style.display = 'block';
        isOpen = true;
        setTriggerState(true);
        prevOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        renderBody(input.value);
        loadData().then(() => { if (isOpen) renderBody(input.value); });
        setTimeout(() => input.focus(), 30);
        track('search_panel_open');
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        host.style.display = 'none';
        setTriggerState(false);
        document.documentElement.style.overflow = prevOverflow;
    }

    document.addEventListener('click', e => {
        const t = e.target && e.target.closest ? e.target.closest(SELECTOR) : null;
        if (t) {
            e.preventDefault();
            e.stopPropagation();
            isOpen ? close() : open(t);
            return;
        }
        if (isOpen && host && !host.contains(e.target)) close();   
    }, true);

    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
    window.addEventListener('resize', () => { if (isOpen) positionHost(); });
    window.addEventListener('scroll', () => { if (isOpen) positionHost(); }, { passive: true });

    function checkHash() {
        if (location.hash === '#search') {
            history.replaceState(null, '', location.pathname + location.search);
            open();
        }
    }
    window.addEventListener('hashchange', checkHash);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkHash);
    else checkHash();
})();
