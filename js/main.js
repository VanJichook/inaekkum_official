// main.js

// 페이지 시작 시 기본 home.html 로드
window.addEventListener("DOMContentLoaded", () => {
  loadSection("home");
});

// nav 버튼 클릭 이벤트
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.section) {
    const section = e.target.dataset.section;

    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    loadSection(section);
  }
});

// AJAX로 HTML 파일 로드
function loadSection(name) {
  const content = document.getElementById("content");
  content.classList.remove("loaded");

  fetch(`sections/${name}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;

      // fade-in 효과
      setTimeout(() => content.classList.add("loaded"), 50);

      // ★ HOME일 때 Bandsintown 실행
      if (name === "home") {
        loadBandsintownWidget();
      }

      // ⭐ 여기에 추가!
      // ★ ABOUT일 때 언어 토글 초기화 실행
      if (name === "about") {
        initLangToggle();
      }
    })
    .catch(() => {
      content.innerHTML = "<p style='padding:2em;'>Failed to load section.</p>";
    });
}
function initLangToggle() {
  const ko = document.getElementById("aboutKO");
  const en = document.getElementById("aboutEN");
  const buttons = document.querySelectorAll(".lang-btn");

  if (!ko || !en) return; // ABOUT 페이지가 아닐 때

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
