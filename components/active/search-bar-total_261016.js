/* -------- 랜딩 통합 검색바 (JSON 연관검색어 + X 버튼 + 메가메뉴 자동 숨김) -------- */
(function() {
    // 1. CSS 스타일 동적 주입
    const cssContent = `
        /* 히어로 배너 카드 기준점 설정 */
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection-card {
            position: relative !important;
        }

        /* 부모 컨테이너 overflow 해제 (드롭다운 가림 방지) */
        .search-wrapper,
        .notion-callout[class*="orange"],
        .notion-collection-card {
            overflow: visible !important;
        }

        /* 🔎 [통합검색] 드롭다운 크롭 방지 */
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) :has(.autocomplete-dropdown[style*="display: block"]),
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-callout__content:has(.autocomplete-dropdown[style*="display: block"]),
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection:has(.autocomplete-dropdown[style*="display: block"]),
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection-gallery:has(.autocomplete-dropdown[style*="display: block"]),
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection-card:has(.autocomplete-dropdown[style*="display: block"]) {
            overflow: visible !important;
        }

        /* 검색 결과가 히어로 배너 아래 콘텐츠에 가려지지 않도록 */
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection-gallery:has(.autocomplete-dropdown[style*="display: block"]) {
            position: relative !important;
            z-index: 99998 !important;
        }

        /* 검색바가 들어 있는 카드의 레이어 우선순위 */
        .notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection-card:has(.autocomplete-dropdown[style*="display: block"]) {
            position: relative !important;
            z-index: 99999 !important;
        }

        /* 🔎 [스크롤바] 네이티브 스크롤바 숨김 */
        .autocomplete-dropdown {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }

        .autocomplete-dropdown::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }

        /* 오른쪽 스크롤 트랙 */
        .autocomplete-scroll-indicator {
            display: none;
            position: absolute;
            right: 4px;
            width: 5px;
            background: #eeeeee;
            border-radius: 999px;
            z-index: 1000000;
            pointer-events: none;
            box-sizing: border-box;
        }

        /* 움직이는 스크롤 핸들 */
        .autocomplete-scroll-thumb {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 24px;
            background: #b8b8b8;
            border-radius: 999px;
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            .search-wrapper {
                width: calc(100vw - 48px) !important;
                box-sizing: border-box !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                bottom: 220px !important;
            }

            .my-link-search {
                width: 100% !important;
                box-sizing: border-box !important;
                font-size: 13px !important;
            }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = cssContent;
    document.head.appendChild(styleEl);

    // 2. JSON 데이터 URL
    const JSON_URL = "https://cdn.jsdelivr.net/gh/lotxlotxm/thearthere_code@main/json/relation-keyword_261010.json";
    let searchData = [];
    let searchTimer;

    fetch(JSON_URL)
        .then(res => {
            if (!res.ok) throw new Error("네트워크 응답 오류");
            return res.json();
        })
        .then(data => {
            searchData = data;
            console.log("검색 데이터 로드 성공:", searchData.length, "개");
        })
        .catch(err => {
            fetch("https://raw.githubusercontent.com/lotxlotxm/thearthere_code/main/json/relation-keyword_261009.json")
                .then(r => r.json())
                .then(d => { searchData = d; })
                .catch(e => console.error("JSON 로드 최종 실패:", e));
        });

    const AC_CSS = `
        .box {
            all: initial;
            display: block;
            font-family: 'Google Sans Flex','Noto Sans KR',sans-serif;
        }
        .ac-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 20px 18px;
            background: #ffffff;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
        }
        .ac-item:last-child { border-bottom: none; }
        .ac-item:hover { background: #f9f9f9; }
        .ac-title {
            margin: 0;
            padding: 0;
            font-size: 15px;
            font-weight: 600;
            color: #37352f;
            line-height: 1.3;
        }
        .ac-sub {
            margin: 4px 0 0 0;
            padding: 0;
            font-size: 12px;
            color: #888888;
            line-height: 1.3;
        }
        .ac-badge {
            margin: 0;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 4px;
            background: #f5f5f5;
            color: #666666;
            white-space: nowrap;
            line-height: 1.3;
        }
    `;

    function esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));
    }

    function attachSearchToHero() {
        const heroContainer = document.querySelector(
            '.notion-callout[class*="orange"]:has(h1):has([class*="bullet"]) .notion-collection-card'
        );

        const searchBar = document.querySelector('.search-wrapper');

        if (
            heroContainer &&
            searchBar &&
            searchBar.parentNode !== heroContainer
        ) {
            heroContainer.appendChild(searchBar);
        }
    }

    function checkMegaMenuState() {
        const searchBar = document.querySelector('.search-wrapper');
        if (!searchBar) return;

        const isNavOpen = document.querySelector('.super-navbar[aria-expanded="true"]') ||
                          document.querySelector('.super-navbar__viewport') ||
                          document.querySelector('.super-navbar__menu-wrapper[style*="display: block"]') ||
                          document.querySelector('.super-navigation-menu__list.open');

        if (isNavOpen) {
            searchBar.style.setProperty('visibility', 'hidden', 'important');
            searchBar.style.setProperty('opacity', '0', 'important');
            searchBar.style.setProperty('pointer-events', 'none', 'important');
        } else {
            searchBar.style.setProperty('visibility', 'visible', 'important');
            searchBar.style.setProperty('opacity', '1', 'important');
            searchBar.style.setProperty('pointer-events', 'auto', 'important');
        }
    }

    function startLinkSearchSystem() {
        const LINK_KEYWORD = "이동검색바";
        const PLACEHOLDER_TEXT = "Search for cities, art museums, or artworks...";

        function syncDropdownScrollbar(dropdown) {
            const indicator = dropdown.parentElement
                ?.querySelector('.autocomplete-scroll-indicator');

            if (!indicator) return;

            const thumb = indicator.querySelector('.autocomplete-scroll-thumb');
            const resultCount = Number(dropdown.dataset.resultCount || 0);

            if (
                resultCount <= 4 ||
                dropdown.style.display === 'none'
            ) {
                indicator.style.display = 'none';
                return;
            }

            const visibleHeight = dropdown.clientHeight;
            const contentHeight = dropdown.scrollHeight;

            if (!visibleHeight || contentHeight <= visibleHeight + 1) {
                indicator.style.display = 'none';
                return;
            }

            indicator.style.display = 'block';
            indicator.style.top = dropdown.style.top;
            indicator.style.height = visibleHeight + 'px';

            const trackHeight = indicator.clientHeight;

            const thumbHeight = Math.max(
                24,
                Math.min(
                    trackHeight,
                    trackHeight * visibleHeight / contentHeight
                )
            );

            thumb.style.height = thumbHeight + 'px';

            const maxScroll = contentHeight - visibleHeight;
            const maxThumbTravel = trackHeight - thumbHeight;

            const offset = maxScroll > 0
                ? (dropdown.scrollTop / maxScroll) * maxThumbTravel
                : 0;

            thumb.style.transform = `translateY(${offset}px)`;
        }

        const injectLinkSearch = () => {
            const allElements = document.querySelectorAll(
                '.notion-text, .notion-callout__content, span, div'
            );

            allElements.forEach(el => {
                if (
                    el.innerText &&
                    el.innerText.trim() === LINK_KEYWORD &&
                    !document.querySelector('.my-link-search')
                ) {
                    el.innerHTML = `
                        <div class="search-wrapper filter-search-wrapper" style="
                            position:absolute;
                            bottom:330px;
                            left:50%;
                            transform:translateX(-50%);
                            width:min(1100px, calc(100vw - 48px));
                            z-index:99999 !important;
                            background:transparent !important;
                            box-sizing:border-box;
                            transition: opacity 0.2s ease, visibility 0.2s ease;
                        ">
                            <input
                                type="text"
                                class="my-link-search my-specific-search"
                                placeholder="${PLACEHOLDER_TEXT}"
                                style="
                                    width:100%;
                                    padding:10px 70px 12px 0;
                                    border:none;
                                    border-bottom:3px solid #ffffff;
                                    border-radius:0;
                                    outline:none;
                                    background:transparent !important;
                                    font-family:'Google Sans Flex', 'Noto Sans KR', sans-serif;
                                    font-size:20px;
                                    font-weight:600;
                                    line-height:1.4;
                                    letter-spacing:-0.02em;
                                    color:#ffffff !important;
                                    -webkit-text-fill-color:#ffffff !important;
                                    box-sizing:border-box;
                                    cursor:text;
                                "
                            >

<!-- 원형 X(초기화) 버튼 -->
<button
    type="button"
    class="search-clear-btn"
    style="
        display:none;
        position:absolute;
        right:36px;
        top:50%;
        transform:translateY(-50%);
        background:transparent;
border:1.5px solid #ffffff;
border-radius:50%;
        cursor:pointer;
        width:18px;
        height:18px;
        padding:0;
        align-items:center;
        justify-content:center;
        opacity:0.85;
        transition:opacity 0.2s ease, background 0.2s ease;
        z-index:10;
    "
    title="검색어 지우기"
>
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L7 7M1 7L7 1" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
</button>

                            <img
                                src="https://res.cloudinary.com/dwtaoukfu/image/upload/v1788758564/icon_search_wh_num0y9.png"
                                style="
                                    position:absolute;
                                    right:0;
                                    top:50%;
                                    transform:translateY(-50%);
                                    width:22px;
                                    height:22px;
                                    opacity:1;
                                    pointer-events:none;
                                "
                            >

                            <div
                                class="autocomplete-dropdown"
                                style="
                                    display:none;
                                    position:absolute;
                                    left:0;
                                    width:100%;
                                    margin:0 !important;
                                    padding:0 !important;
                                    background:#ffffff;
                                    border:1px solid #e0e0e0;
                                    border-radius:8px;
                                    box-shadow:0 8px 20px rgba(0,0,0,0.15);
                                    z-index:999999 !important;
                                    max-height:320px;
                                    overflow-y:auto;
                                "
                            ></div>

                            <div
                                class="autocomplete-scroll-indicator"
                                aria-hidden="true"
                            >
                                <div class="autocomplete-scroll-thumb"></div>
                            </div>
                        </div>
                    `;

                    const input = el.querySelector('.my-link-search');
                    const clearBtn = el.querySelector('.search-clear-btn');
                    const dropdown = el.querySelector('.autocomplete-dropdown');

                    const updateClearButtonVisibility = () => {
                        if (input.value.length > 0) {
                            clearBtn.style.display = 'flex';
                        } else {
                            clearBtn.style.display = 'none';
                        }
                    };

                    clearBtn.addEventListener('click', () => {
                        input.value = '';
                        updateClearButtonVisibility();
                        dropdown.dataset.resultCount = '0';
                        dropdown.style.display = 'none';
                        syncDropdownScrollbar(dropdown);
                        const root = dropdown.shadowRoot;
                        if (root) root.innerHTML = '';
                        input.focus();
                    });

                    dropdown.addEventListener('scroll', () => {
                        syncDropdownScrollbar(dropdown);
                    }, { passive: true });

                    input.addEventListener('input', (e) => {
                        updateClearButtonVisibility();
                        handleAutocomplete(e, dropdown);
                    });
                    
                    const reopenAutocomplete = () => {
                        updateClearButtonVisibility();
                        if (
                            input.value.trim() &&
                            dropdown.style.display !== 'block'
                        ) {
                            handleAutocomplete({ target: input }, dropdown);
                        }
                    };

                    input.addEventListener('focus', reopenAutocomplete);
                    input.addEventListener('click', reopenAutocomplete);

                    input.addEventListener('blur', () => {
                        setTimeout(() => {
                            dropdown.style.display = 'none';
                            syncDropdownScrollbar(dropdown);
                        }, 200);
                    });

                    el.style.display = 'none';
                    attachSearchToHero();
                }
            });
        };

        function handleAutocomplete(e, dropdown) {
            const input = e.target;
            const query = input.value.toLowerCase().trim();
            const root = dropdown.shadowRoot ||
                dropdown.attachShadow({ mode: 'open' });

            clearTimeout(searchTimer);

            if (query.length > 0) {
                searchTimer = setTimeout(() => {
                    if (typeof gtag === 'function') {
                        gtag('event', 'view_search_results', {
                            search_term: query
                        });
                    }
                }, 800);
            }

            if (!query) {
                dropdown.dataset.resultCount = '0';
                dropdown.style.display = 'none';
                syncDropdownScrollbar(dropdown);
                root.innerHTML = '';
                return;
            }

            const matches = searchData.filter(item => {
                const titleText = (
                    item.title ||
                    item.museum_name ||
                    item.artwork_name ||
                    ""
                ).toLowerCase();

                const subText = (
                    item.sub ||
                    item.location ||
                    item.artist_name ||
                    ""
                ).toLowerCase();

                const museumText = (item.museum || "").toLowerCase();

                return (
                    titleText.includes(query) ||
                    subText.includes(query) ||
                    museumText.includes(query)
                );
            })
            .sort((a, b) =>
                (a.type === 'Art Museum' ? 0 : 1) -
                (b.type === 'Art Museum' ? 0 : 1)
            )
            .slice(0, 15);

            if (matches.length === 0) {
                dropdown.dataset.resultCount = '0';
                dropdown.style.display = 'none';
                syncDropdownScrollbar(dropdown);
                root.innerHTML = '';
                return;
            }

            const itemsHtml = matches.map(item => {
                const mainTitle =
                    item.title ||
                    item.museum_name ||
                    item.artwork_name ||
                    "";

                const subTitle =
                    item.sub ||
                    item.location ||
                    item.artist_name ||
                    "";

                const targetUrl = item.url || item.path || "#";

                const badgeType =
                    item.type ||
                    (item.artwork_name ? "Artwork" : "Museum");

                return `
                    <div class="ac-item" data-url="${esc(targetUrl)}">
                        <div>
                            <div class="ac-title">${esc(mainTitle)}</div>
                            <div class="ac-sub">${esc(subTitle)}</div>
                        </div>
                        <span class="ac-badge">${esc(badgeType)}</span>
                    </div>
                `;
            }).join('');

            root.innerHTML = `
                <style>${AC_CSS}</style>
                <div class="box">${itemsHtml}</div>
            `;

            root.querySelectorAll('.ac-item').forEach(node => {
                node.addEventListener('click', () => {
                    location.href = node.dataset.url;
                });
            });

            dropdown.dataset.resultCount = String(matches.length);

            dropdown.style.top =
                (input.offsetTop + input.offsetHeight + 10) + 'px';

            dropdown.style.display = 'block';

            requestAnimationFrame(() => {
                syncDropdownScrollbar(dropdown);
            });
        }

        const observer = new MutationObserver(() => {
            injectLinkSearch();
            attachSearchToHero();
            checkMegaMenuState();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        window.addEventListener('resize', () => {
            attachSearchToHero();
            checkMegaMenuState();

            const dropdown = document.querySelector('.autocomplete-dropdown');
            if (dropdown) {
                syncDropdownScrollbar(dropdown);
            }
        });

        injectLinkSearch();
        attachSearchToHero();
        checkMegaMenuState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLinkSearchSystem);
    } else {
        startLinkSearchSystem();
    }
})();
