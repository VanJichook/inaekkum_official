// main.js

// 페이지 로드시 기본 home 로드
window.addEventListener("DOMContentLoaded", () => {
  loadSection("home");
});

// 네비게이션 버튼 클릭 처리
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.section) {
    const section = e.target.dataset.section;

    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    loadSection(section);
  }
});

// 섹션 AJAX 로드
function loadSection(name) {
  const content = document.getElementById("content");
  content.classList.remove("loaded");

  fetch(`https://vanjichook.github.io/inaekkum_official/sections/${name}.html?v=5`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      setTimeout(() => content.classList.add("loaded"), 50);

      // HOME일 때 Bandsintown 위젯 로드
      if (name === "home") {
        loadBandsintownWidget?.();
      }

      // ABOUT일 때 언어 토글 로드
      if (name === "about") {
        initLangToggle();
      }
    })
    .catch(() => {
      content.innerHTML = "<p style='padding:2em;'>Failed to load section.</p>";
    });
}

// ABOUT 언어 토글 기능
function initLangToggle() {
  const ko = document.getElementById("aboutKO");
  const en = document.getElementById("aboutEN");
  const buttons = document.querySelectorAll(".lang-btn");

  if (!ko || !en) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === "ko") {
        ko.style.display = "block";
        en.style.display = "none";
      } else {
        ko.style.display = "none";
        en.style.display = "block";
      }
    });
  });
}

// ================================
// 🔥 Bandsintown 위젯 강제 재실행
// ================================
function loadBandsintownWidget() {
  const container = document.getElementById("bit-widget-container");
  if (!container) return;

  // 기존 위젯 제거
  container.innerHTML = "";

  // 초기화 태그 생성
  const init = document.createElement("a");
  init.className = "bit-widget-initializer";
  init.setAttribute("data-artist-name", "id_15583383");
  container.appendChild(init);

  // 기존 스크립트 삭제 (GitHub는 같은 src 재로드 안 함)
  const oldScript = document.getElementById("bit-script");
  if (oldScript) oldScript.remove();

  // 🔥 새 스크립트 강제 로드 (캐시 우회)
  const script = document.createElement("script");
  script.id = "bit-script";
  script.src = "https://widgetv3.bandsintown.com/main.min.js?reload=" + Date.now();
  script.async = true;
  document.body.appendChild(script);
}
