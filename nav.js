// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const menu      = document.getElementById("nav-menu");
  if (!hamburger || !menu) return;

  hamburger.addEventListener("click", function () {
    const open = menu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
    hamburger.textContent = open ? "✕" : "☰";
  });

  // Close menu when a link is clicked
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      hamburger.textContent = "☰";
      hamburger.setAttribute("aria-expanded", false);
    });
  });
});
