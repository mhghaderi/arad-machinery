document.addEventListener("DOMContentLoaded", () => {
  // ۱. مدیریت منوی ریسپانسیو (Toggle Menu)
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const categoryItems = document.querySelectorAll(".menu-category-item"); // برای مدیریت آکاردئونی مگا منو

  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true" || false;
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    mainNav.classList.toggle("is-open");

    // اگر منو بسته شد، مگا منو و زیرمنوهای باز را ببند
    if (!mainNav.classList.contains("is-open")) {
      document.querySelector(".mega-menu").classList.remove("is-open");
      categoryItems.forEach((item) => item.classList.remove("is-open"));
    }
  });

  // ۲. مدیریت منوهای فرعی ستونی در موبایل (Accordion-like)
  categoryItems.forEach((item) => {
    const titleLink = item.querySelector(".category-title");

    if (titleLink) {
      titleLink.addEventListener("click", (e) => {
        // این منطق فقط در حالت موبایل (یا تبلت کوچک) فعال می‌شود
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const isOpen = item.classList.contains("is-open");

          // بستن همه منوهای فرعی باز
          categoryItems.forEach((i) => i.classList.remove("is-open"));

          // باز کردن منوی مورد نظر
          if (!isOpen) {
            item.classList.add("is-open");
          }
        }
      });
    }
  });

  // ۳. انیمیشن‌های نرم (Scroll Reveal / Intersection Observer)
  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% عنصر در دید باشد
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // پس از نمایش، دیگر مشاهده نشود
      }
    });
  }, observerOptions);

  // انتخاب تمام عناصر با کلاس‌های انیمیشن
  const animatedElements = document.querySelectorAll(
    ".animate-fadein, .animate-slideup, .animate-zoom"
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // ۴. انیمیشن نرم اسکرول (برای دکمه درخواست مشاوره)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      document.querySelector(targetId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});
