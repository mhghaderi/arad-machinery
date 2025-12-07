// assets/scripts/about.js

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("[data-about-counter]");
  const duration = 1200;

  counters.forEach((el) => {
    const target = Number(el.getAttribute("data-about-counter") || 0);
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(target * progress);
      el.textContent = value + (String(target).includes("+") ? "+" : "+");
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
});
