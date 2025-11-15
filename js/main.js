// main.js (v2.0) with RSS integration + Bandsintown initialization

// 페이지 로드시 기본 HOME 로드
window.addEventListener("DOMContentLoaded", () => {
  loadSection("home");
});

// 네비게이션 버튼 처리
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.section) {
    const section = e.target.dataset.section;

    document.querySelectorAll("nav button")
      .forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    loadSection(section);
  }
});

// --------------------------
// 섹션 로더
// --------------------------
function loadSection(name) {
  const content = document.getElementById("content");
  content.classList.remove("loaded");

  fetch(`https://vanjichook.github.io/inaekkum_official/sections/${name}.html?v=7`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      setTimeout(() => content.classList.add("loaded"), 50);

      if (name === "home") {
        // HOME 로드 직후 Bandsintown 위젯 초기화
        setTimeout(() => {
          loadBandsintownWidget();
        }, 80);
      }

      if (name === "about") initLangSwitch();
      if (name === "news") loadRSS();
    })
    .catch(() => {
      content.innerHTML = "<p style='padding:2em;'>Failed to load section.</p>";
    });
}

// --------------------------
// Bandsintown Loader
// --------------------------
function loadBandsintownWidget() {
  const container = document.getElementById("bit-widget-container");
  if (!container) return;

  // 기존 위젯 초기화
  container.innerHTML = `
    <a class="bit-widget-initializer"
      data-artist-name="id_15583383"
      data-events-to-display=""
      data-background-color="rgba(255,255,255,1)"
      data-separator-color="rgba(115,207,217,1)"
      data-text-color="rgba(34,36,38,1)"
      data-font="Andalé Mono"
      data-auto-style="true"
      data-button-label-capitalization="uppercase"
      data-header-capitalization="uppercase"
      data-location-capitalization="uppercase"
      data-venue-capitalization="uppercase"
      data-display-local-dates="true"
      data-local-dates-position="tab"
      data-display-past-dates="true"
      data-display-details="false"
      data-display-lineup="false"
      data-display-start-time="true"
      data-social-share-icon="false"
      data-display-limit="all"
      data-date-format="MMM. D, YYYY"
      data-date-orientation="horizontal"
      data-date-border-color="#4A4A4A"
      data-date-border-width="1px"
      data-date-capitalization="capitalize"
      data-date-border-radius="10px"
      data-event-ticket-cta-size="medium"
      data-event-custom-ticket-text=""
      data-event-ticket-text="TICKETS"
      data-event-ticket-icon="false"
      data-event-ticket-cta-text-color="rgba(255,255,255,1)"
      data-event-ticket-cta-bg-color="rgba(115,207,217,1)"
      data-event-ticket-cta-border-color="rgba(115,207,217,1)"
      data-event-ticket-cta-border-width="0px"
      data-event-ticket-cta-border-radius="2px"
      data-sold-out-button-text-color="rgba(255,255,255,1)"
      data-sold-out-button-background-color="rgba(115,207,217,1)"
      data-sold-out-button-border-color="rgba(115,207,217,1)"
      data-sold-out-button-clickable="true"
      data-event-rsvp-position="left"
      data-event-rsvp-cta-size="medium"
      data-event-rsvp-only-show-icon="false"
      data-event-rsvp-text="RSVP"
      data-event-rsvp-icon="false"
      data-event-rsvp-cta-text-color="rgba(115,207,217,1)"
      data-event-rsvp-cta-bg-color="rgba(255,255,255,1)"
      data-event-rsvp-cta-border-color="rgba(115,207,217,1)"
      data-event-rsvp-cta-border-width="1px"
      data-event-rsvp-cta-border-radius="2px"
      data-follow-section-position="top"
      data-follow-section-alignment="center"
      data-follow-section-header-text="Get updates on new shows, new music, and more"
      data-follow-section-cta-size="medium"
      data-follow-section-cta-text="FOLLOW"
      data-follow-section-cta-icon="false"
      data-follow-section-cta-text-color="rgba(255,255,255,1)"
      data-follow-section-cta-bg-color="rgba(115,207,217,1)"
      data-follow-section-cta-border-color="rgba(115,207,217,1)"
      data-follow-section-cta-border-width="0px"
      data-follow-section-cta-border-radius="2px"
      data-play-my-city-position="bottom"
      data-play-my-city-alignment="center"
      data-play-my-city-header-text="Don’t see a show near you?"
      data-play-my-city-cta-size="medium"
      data-play-my-city-cta-text="REQUEST A SHOW"
      data-play-my-city-cta-icon="false"
      data-play-my-city-cta-text-color="rgba(255,255,255,1)"
      data-play-my-city-cta-bg-color="rgba(115,207,217,1)"
      data-play-my-city-cta-border-color="rgba(115,207,217,1)"
      data-play-my-city-cta-border-width="0px"
      data-play-my-city-cta-border-radius="2px"
      data-language="en"
      data-layout-breakpoint="900"
      data-app-id="c32c33f654874394a2c1c87a4002e826"
      data-bit-logo-position="bottomRight"
      data-bit-logo-color="rgba(34,36,38,1)"
    ></a>`;

  // 기존 스크립트 제거
  const oldScript = document.getElementById("bit-script");
  if (oldScript) oldScript.remove();

  // 새 스크립트 강제 로드
  const script = document.createElement("script");
  script.id = "bit-script";
  script.src = "https://widgetv3.bandsintown.com/main.min.js?reload=" + Date.now();
  script.async = true;
  document.body.appendChild(script);
}

// --------------------------
// NEWS RSS LOADER
// --------------------------
function loadRSS() {
  const box = document.getElementById("rss-feed");
  if (!box) return;

  box.innerHTML = `<h4>Naver Blog</h4><p>Loading latest posts…</p>`;

  fetch('https://vanjichook.github.io/inaekkum_official/data/naver_rss.json?ts=' + Date.now())
    .then(r => r.json())
    .then(data => {
      if (!data.items) {
        box.innerHTML = '<h4>Naver Blog</h4><p>No posts available.</p>';
        return;
      }

      box.innerHTML = '<h4>Naver Blog</h4>';

      data.items.slice(0, 3).forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'rss-item';
        const date = new Date(item.pubDate).toLocaleDateString('ko-KR');

        wrap.innerHTML = `
          <a href="${item.link}" target="_blank">• ${item.title}</a>
          <span style="display:block; color:#888; font-size:0.85em; margin-left:0.2em;">${date}</span>
        `;

        box.appendChild(wrap);
      });
    })
    .catch(err => {
      console.error("RSS load error", err);
      box.innerHTML = '<h4>Naver Blog</h4><p>Failed to load feed.</p>';
    });
}

// --------------------------
// ABOUT 언어 스위치
// --------------------------
function initLangSwitch() {
  const switchBtn = document.getElementById("langSwitch");
  if (!switchBtn) return;

  const introKO = document.getElementById("introKO");
  const introEN = document.getElementById("introEN");
  const aboutKO = document.getElementById("aboutKO");
  const aboutEN = document.getElementById("aboutEN");
  const membersKO = document.getElementById("membersKO");
  const membersEN = document.getElementById("membersEN");

  function applyLang(isEN) {
    if (introKO) introKO.style.display = isEN ? "none" : "block";
    if (introEN) introEN.style.display = isEN ? "block" : "none";

    if (aboutKO) aboutKO.style.display = isEN ? "none" : "block";
    if (aboutEN) aboutEN.style.display = isEN ? "block" : "none";

    if (membersKO) membersKO.style.display = isEN ? "none" : "grid";
    if (membersEN) membersEN.style.display = isEN ? "grid" : "none";
  }

  switchBtn.addEventListener("change", () => {
    applyLang(switchBtn.checked);
  });

  applyLang(switchBtn.checked);
}

// --------------------------
// MUSIC 모달
// --------------------------
function openAlbumModal(key) {
  const modal = document.getElementById('album-modal');
  const wrap = document.getElementById('albumModalInner');
  const sw = document.getElementById('albumLangSwitch');

  if (!window.albumData) return;
  const data = window.albumData[key];
  if (!data) return;

  wrap.innerHTML = `
    <div id="albumKR">${data.kr}</div>
    <div id="albumEN" style="display:none;">${data.en}</div>
  `;

  if (sw) {
    sw.checked = false;
    sw.onchange = () => {
      document.getElementById('albumKR').style.display = sw.checked ? 'none' : 'block';
      document.getElementById('albumEN').style.display = sw.checked ? 'block' : 'none';
    };
  }

  modal.style.display = 'flex';
}

function closeAlbumModal() {
  const modal = document.getElementById('album-modal');
  if (modal) modal.style.display = 'none';
}
