// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: "ease-out-cubic",
});

// Preloader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hidden");
  }, 1200);
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const html = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem("theme");
let currentTheme = "light";
if (savedTheme) {
  currentTheme = savedTheme;
} else if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  currentTheme = "dark";
}

html.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

// If user has not explicitly chosen a theme, follow system changes
if (!savedTheme && window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const sysPref = e.matches ? "dark" : "light";
      // only change when user hasn't saved an explicit preference
      if (!localStorage.getItem("theme")) {
        html.setAttribute("data-theme", sysPref);
        updateThemeIcon(sysPref);
      }
    });
}

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

// Mobile theme toggle (reuses desktop toggle behavior)
const themeToggleMobileBtn = document.getElementById("themeToggleMobile");
if (themeToggleMobileBtn) {
  themeToggleMobileBtn.addEventListener("click", () => {
    themeToggle.click();
  });
}

function updateThemeIcon(theme) {
  const themeIconMobile = document.querySelector("#themeToggleMobile i");
  if (theme === "dark") {
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
    if (themeIconMobile) {
      themeIconMobile.classList.remove("fa-moon");
      themeIconMobile.classList.add("fa-sun");
    }
  } else {
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
    if (themeIconMobile) {
      themeIconMobile.classList.remove("fa-sun");
      themeIconMobile.classList.add("fa-moon");
    }
  }
}

// Header Scroll Effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Mega Menu
const productsMenuTrigger = document.getElementById("productsMenuTrigger");
const megaMenu = document.getElementById("megaMenu");
const productsMenuWrapper = document.getElementById("productsMenuWrapper");

productsMenuTrigger.addEventListener("mouseenter", () => {
  megaMenu.classList.add("active");
});

productsMenuWrapper.addEventListener("mouseleave", () => {
  megaMenu.classList.remove("active");
});

// Search Toggle
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

function positionSearchDropdown() {
  if (!searchBox || !searchToggle) return;
  // measure
  const iconRect = searchToggle.getBoundingClientRect();
  const containerRect = searchToggle.parentElement.getBoundingClientRect();
  const ddWidth = Math.min(
    Math.max(searchBox.getBoundingClientRect().width || 360, 200),
    window.innerWidth * 0.95
  );

  // calculate left so dropdown is centered under icon center, but stay inside viewport
  const iconCenter = iconRect.left + iconRect.width / 2;
  let viewportLeft = Math.round(iconCenter - ddWidth / 2);
  const margin = 8;
  viewportLeft = Math.max(
    margin,
    Math.min(viewportLeft, window.innerWidth - ddWidth - margin)
  );

  // set left relative to container
  const leftRelativeToContainer = viewportLeft - containerRect.left;
  searchBox.style.left = leftRelativeToContainer + "px";
  searchBox.style.right = "auto";
  // cancel CSS centering transform (we'll control position via left)
  searchBox.style.transform = "translateY(0)";
}

searchToggle.addEventListener("click", () => {
  searchBox.classList.toggle("active");
  if (searchBox.classList.contains("active")) {
    // position and focus
    positionSearchDropdown();
    searchInput.focus();
  }
});

// Reposition on resize/scroll when open
window.addEventListener("resize", () => {
  if (searchBox && searchBox.classList.contains("active"))
    positionSearchDropdown();
});
window.addEventListener("scroll", () => {
  if (searchBox && searchBox.classList.contains("active"))
    positionSearchDropdown();
});

// Close search with close button
const closeSearchBtn = document.getElementById("closeSearch");
if (closeSearchBtn) {
  closeSearchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (searchBox) searchBox.classList.remove("active");
    if (searchInput) {
      searchInput.value = "";
      searchInput.blur();
    }
  });
}

// Close on outside click only when input is empty
document.addEventListener("click", (e) => {
  try {
    const container = searchToggle ? searchToggle.parentElement : null;
    if (!container) return;
    if (!container.contains(e.target)) {
      if (searchBox && searchBox.classList.contains("active")) {
        if (!searchInput || searchInput.value.trim() === "") {
          searchBox.classList.remove("active");
        }
      }
    }
  } catch (err) {
    // silent
  }
});

// Close search on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (searchBox && searchBox.classList.contains("active")) {
      searchBox.classList.remove("active");
    }
  }
});

// Search Functionality
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const products = document.querySelectorAll(".product-card");
  let hasResults = false;

  products.forEach((product) => {
    const title = product.querySelector("h3").textContent.toLowerCase();
    if (title.includes(query) || query === "") {
      product.style.display = "block";
      hasResults = true;
    } else {
      product.style.display = "none";
    }
  });

  // Scroll to products if search has results
  if (query && hasResults) {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  }
});

// Mobile Menu
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileOverlay = document.getElementById("mobileOverlay");
const closeMobileMenu = document.getElementById("closeMobileMenu");

mobileMenuToggle.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  mobileOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeMobileMenu.addEventListener("click", closeMobileMenuFunc);
mobileOverlay.addEventListener("click", closeMobileMenuFunc);

function closeMobileMenuFunc() {
  mobileMenu.classList.remove("active");
  mobileOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close mobile menu on link click
document.querySelectorAll("#mobileMenu a").forEach((link) => {
  link.addEventListener("click", closeMobileMenuFunc);
});

// Hero Slider
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".slider-dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
  });
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function goToSlide(index) {
  currentSlideIndex = index;
  showSlide(currentSlideIndex);
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(currentSlideIndex);
}

// Auto slide
setInterval(nextSlide, 9000);

// Product Modal Data
const productsData = {
  1: {
    name: "دستگاه درب‌بسته‌کن AR-100",
    category: "کوچک",
    categoryColor: "blue",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    description:
      "دستگاه درب‌بسته‌کن AR-100 مناسب برای بسته‌بندی ظروف با درب پیچی در صنایع غذایی، دارویی و آرایشی. این دستگاه با طراحی ارگونومیک و سیستم کنترل هوشمند، سرعت و دقت بالایی در بسته‌بندی دارد.",
    specs: {
      "ولتاژ ورودی": "220 ولت تک فاز",
      ابعاد: "80×60×120 سانتی‌متر",
      "ظرفیت تولید": "30 عدد در دقیقه",
      "وزن دستگاه": "85 کیلوگرم",
      "توان مصرفی": "1.5 کیلووات",
      "جنس بدنه": "استیل ضد زنگ 304",
    },
    features: [
      "سیستم کنترل PLC هوشمند",
      "قابلیت تنظیم گشتاور درب‌بسته",
      "صفحه نمایش لمسی 7 اینچ",
      "سیستم ایمنی چندگانه",
      "کاملاً قابل تنظیم برای سایزهای مختلف",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    ],
  },
  2: {
    name: "پرکن نیمه‌اتوماتیک AR-150",
    category: "کوچک",
    categoryColor: "blue",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    description:
      "پرکن مایعات AR-150 با سیستم کنترل حجم دقیق، مناسب برای پر کردن انواع مایعات غذایی، دارویی و شیمیایی. دارای نازل‌های ضد چکه و سیستم تمیزکاری سریع.",
    specs: {
      "ولتاژ ورودی": "220 ولت تک فاز",
      ابعاد: "90×70×130 سانتی‌متر",
      "ظرفیت پرکن": "25 لیتر در دقیقه",
      "وزن دستگاه": "95 کیلوگرم",
      "دقت پرکن": "±2 میلی‌لیتر",
      "جنس نازل": "استیل ضد زنگ 316",
    },
    features: [
      "سیستم کنترل حجم دیجیتال",
      "نازل‌های ضد چکه و قابل تعویض",
      "قابلیت کار با مایعات غلیظ",
      "سیستم CIP برای شستشوی اتوماتیک",
      "صرفه‌جویی در مواد اولیه",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    ],
  },
  3: {
    name: "دستگاه لیبل‌زن AR-200",
    category: "کوچک",
    categoryColor: "blue",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    description:
      "دستگاه لیبل‌زن اتوماتیک AR-200 با قابلیت چسباندن برچسب روی بطری‌ها، قوطی‌ها و ظروف مختلف. دارای سیستم تشخیص اتوماتیک محصول و تنظیم موقعیت برچسب.",
    specs: {
      "ولتاژ ورودی": "220 ولت تک فاز",
      ابعاد: "100×80×140 سانتی‌متر",
      "ظرفیت تولید": "40 عدد در دقیقه",
      "وزن دستگاه": "110 کیلوگرم",
      "نوع برچسب": "خودچسب رول",
      "دقت چسباندن": "±1 میلی‌متر",
    },
    features: [
      "سنسور تشخیص خودکار محصول",
      "تنظیم اتوماتیک موقعیت برچسب",
      "سرعت قابل تنظیم",
      "کار با انواع اشکال بطری",
      "صرفه‌جویی در برچسب",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    ],
  },
  4: {
    name: "نوارکش اتوماتیک AR-300",
    category: "متوسط",
    categoryColor: "yellow",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80",
    description:
      "دستگاه نوارکش اتوماتیک AR-300 برای بسته‌بندی کارتن‌ها با نوار چسب. قابلیت تنظیم برای سایزهای مختلف کارتن و سیستم برش اتوماتیک نوار.",
    specs: {
      "ولتاژ ورودی": "220 ولت تک فاز",
      ابعاد: "150×100×160 سانتی‌متر",
      "ظرفیت تولید": "20 کارتن در دقیقه",
      "وزن دستگاه": "180 کیلوگرم",
      "عرض نوار": "48-75 میلی‌متر",
      "سایز کارتن": "قابل تنظیم",
    },
    features: [
      "تنظیم اتوماتیک سایز کارتن",
      "سیستم برش دقیق نوار",
      "صرفه‌جویی در مصرف نوار",
      "سرعت بالای کار",
      "سیستم ایمنی استاندارد",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    ],
  },
  5: {
    name: "پرکن اتوماتیک AR-450",
    category: "متوسط",
    categoryColor: "yellow",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    description:
      "پرکن اتوماتیک AR-450 با سیستم وزنی دقیق برای پر کردن پودرها، دانه‌ها و مواد گرانولی. دارای کنترل PLC و سیستم کالیبراسیون اتوماتیک.",
    specs: {
      "ولتاژ ورودی": "380 ولت سه فاز",
      ابعاد: "180×120×200 سانتی‌متر",
      "ظرفیت تولید": "50 بسته در دقیقه",
      "وزن دستگاه": "250 کیلوگرم",
      "دقت وزنی": "±1 گرم",
      "نوع سنسور": "Load Cell دقت بالا",
    },
    features: [
      "سیستم وزنی دیجیتال دقیق",
      "کالیبراسیون اتوماتیک",
      "کنترل PLC پیشرفته",
      "قابلیت ذخیره 100 رسپی",
      "گزارش‌گیری تولید",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    ],
  },
  6: {
    name: "خط تولید کامل AR-500",
    category: "بزرگ",
    categoryColor: "red",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    description:
      "خط تولید کامل AR-500 شامل پرکن، درب‌بسته‌کن، لیبل‌زن، کانوایر و سیستم کنترل مرکزی. راه‌حل جامع برای بسته‌بندی صنعتی با اتوماسیون کامل و قابلیت سفارشی‌سازی.",
    specs: {
      "ولتاژ ورودی": "380 ولت سه فاز",
      "طول خط": "1000 سانتی‌متر",
      "ظرفیت تولید": "100 عدد در دقیقه",
      "وزن کل": "2500 کیلوگرم",
      "سیستم کنترل": "PLC + HMI",
      قابلیت: "سفارشی‌سازی کامل",
    },
    features: [
      "اتوماسیون کامل خط تولید",
      "سیستم کنترل مرکزی SCADA",
      "قابلیت یکپارچگی با سیستم‌های ERP",
      "گزارش‌گیری و مانیتورینگ لحظه‌ای",
      "سرویس و پشتیبانی 24 ساعته",
      "نصب و راه‌اندازی رایگان",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=400&q=80",
    ],
  },
};

// Open Product Modal
function openProductModal(id) {
  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");
  const product = productsData[id];

  let specsHTML = "";
  for (const [key, value] of Object.entries(product.specs)) {
    specsHTML += `
                    <tr class="border-b" style="border-color: var(--border-color)">
                        <td class="py-4 px-4 font-semibold" style="color: var(--text-primary)">${key}</td>
                        <td class="py-4 px-4" style="color: var(--text-secondary)">${value}</td>
                    </tr>
                `;
  }

  let featuresHTML = "";
  product.features.forEach((feature) => {
    featuresHTML += `
                    <li class="flex items-start gap-3 mb-3">
                        <i class="fas fa-check-circle text-green-500 text-lg mt-1"></i>
                        <span style="color: var(--text-secondary)">${feature}</span>
                    </li>
                `;
  });

  let galleryHTML = "";
  product.gallery.forEach((img, index) => {
    galleryHTML += `<img src="${img}" alt="تصویر ${
      index + 1
    }" class="w-full h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition">`;
  });

  const categoryColors = {
    blue: "background: rgba(37, 99, 235, 0.9); color: white;",
    yellow: "background: rgba(234, 179, 8, 0.9); color: white;",
    red: "background: rgba(239, 68, 68, 0.9); color: white;",
  };

  modalBody.innerHTML = `
                <div class="grid md:grid-cols-2 gap-10">
                    <div>
                        <div class="relative mb-6 rounded-2xl overflow-hidden shadow-2xl">
                            <img src="${product.image}" alt="${
    product.name
  }" class="w-full rounded-2xl">
                            <span class="absolute top-4 right-4 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg" style="${
                              categoryColors[product.categoryColor]
                            }">${product.category}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            ${galleryHTML}
                        </div>
                    </div>
                    <div>
                        <h3 class="text-3xl md:text-4xl font-bold mb-4" style="color: var(--text-primary)">${
                          product.name
                        }</h3>
                        <p class="text-lg mb-8 leading-relaxed" style="color: var(--text-secondary)">${
                          product.description
                        }</p>
                        
                        <h4 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--text-primary)">
                            <i class="fas fa-cogs text-blue-600"></i>
                            مشخصات فنی
                        </h4>
                        <div class="mb-8 rounded-2xl overflow-hidden shadow-lg" style="border: 1px solid var(--border-color)">
                            <table class="w-full">
                                <tbody>
                                    ${specsHTML}
                                </tbody>
                            </table>
                        </div>

                        <h4 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--text-primary)">
                            <i class="fas fa-star text-yellow-500"></i>
                            ویژگی‌های برجسته
                        </h4>
                        <ul class="mb-8">
                            ${featuresHTML}
                        </ul>

                        <h4 class="text-2xl font-bold mb-4 flex items-center gap-2" style="color: var(--text-primary)">
                            <i class="fas fa-play-circle text-red-600"></i>
                            ویدیوی دمو
                        </h4>
                        <div class="aspect-video mb-8 rounded-2xl overflow-hidden shadow-lg">
                            <iframe src="${
                              product.video
                            }" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                        </div>

                        <button onclick="scrollToContact(); closeProductModal();" class="btn-primary w-full justify-center text-lg py-4">
                            <i class="fas fa-headset"></i>
                            درخواست مشاوره برای این محصول
                        </button>
                    </div>
                </div>
            `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Product Modal
function closeProductModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close modal on overlay click
document.getElementById("productModal").addEventListener("click", (e) => {
  if (e.target.id === "productModal") {
    closeProductModal();
  }
});

// Stats Counter Animation
const counters = document.querySelectorAll(".counter");
const speed = 50;

const runCounter = (counter) => {
  const target = +counter.getAttribute("data-target");
  const count = +counter.innerText;
  const increment = target / speed;

  if (count < target) {
    counter.innerText = Math.ceil(count + increment);
    setTimeout(() => runCounter(counter), 30);
  } else {
    counter.innerText = target;
  }
};

// Intersection Observer for counters
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

// Back to Top Button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Scroll to Contact Function
function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  closeMobileMenuFunc();
}

// Contact Form Submission
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Show success message
  alert(
    "✅ پیام شما با موفقیت ارسال شد!\n\nتیم ما به زودی با شما تماس خواهد گرفت.\n\nباتشکر از اعتماد شما به آراد ماشین‌سازی"
  );

  // Reset form
  e.target.reset();
});

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Add scroll reveal animation
const revealElements = document.querySelectorAll("[data-aos]");
const revealOnScroll = () => {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("aos-animate");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Initial check

/* Product Tabs Filtering + Accessibility */
(function () {
  const tabsContainer = document.getElementById("productTabs");
  if (!tabsContainer) return;

  const tabs = Array.from(tabsContainer.querySelectorAll(".product-tab"));
  const products = Array.from(document.querySelectorAll(".product-card"));

  function setActiveTab(activeTab) {
    tabs.forEach((t) => {
      const isActive = t === activeTab;
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });
  }

  function filterProducts(category) {
    products.forEach((p) => {
      const pCat = p.getAttribute("data-category");
      if (!category || category === "all" || category === "همه") {
        p.style.display = "block";
        p.style.opacity = 1;
      } else {
        if (pCat === category) {
          p.style.display = "block";
          p.style.opacity = 1;
        } else {
          p.style.opacity = 0;
          setTimeout(() => (p.style.display = "none"), 250);
        }
      }
    });
  }

  // Click + keyboard
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", (e) => {
      const cat = tab.getAttribute("data-category");
      setActiveTab(tab);
      filterProducts(cat);
      // focus remains on clicked tab
    });

    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tab.click();
      }
    });
  });

  // initialize
  setActiveTab(tabs[0]);
  filterProducts("all");
})();

/* Mega menu: keyboard and mobile (click/touch) accessibility tweaks */
(function () {
  if (!productsMenuTrigger || !megaMenu || !productsMenuWrapper) return;

  productsMenuTrigger.addEventListener("focus", () => {
    megaMenu.classList.add("active");
  });

  productsMenuTrigger.addEventListener("blur", () => {
    // give time for focus to move into the menu
    setTimeout(() => {
      const active = document.activeElement;
      if (!productsMenuWrapper.contains(active)) {
        megaMenu.classList.remove("active");
      }
    }, 120);
  });

  // Mobile / touch: toggle on click when narrow
  productsMenuTrigger.addEventListener("click", (e) => {
    if (window.innerWidth < 1024) {
      e.preventDefault();
      megaMenu.classList.toggle("active");
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      megaMenu.classList.remove("active");
    }
  });
})();

//////////////////
document.querySelectorAll(".category-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    // Remove active class from all items
    document
      .querySelectorAll(".category-item")
      .forEach((i) => i.classList.remove("active"));
    document
      .querySelectorAll(".submenu")
      .forEach((s) => s.classList.remove("active"));

    // Add active to current item
    item.classList.add("active");

    // Show corresponding submenu
    const targetId = item.dataset.target;
    const targetSubmenu = document.querySelector("#" + targetId);
    if (targetSubmenu) {
      targetSubmenu.classList.add("active");
    }
  });
});

// Close submenus when leaving menu
document.getElementById("megaMenu").addEventListener("mouseleave", () => {
  document
    .querySelectorAll(".category-item")
    .forEach((i) => i.classList.remove("active"));
  document
    .querySelectorAll(".submenu")
    .forEach((s) => s.classList.remove("active"));
});

// Show first category on menu open
// productsMenuWrapper.addEventListener("mouseenter", () => {
//   const firstCategory = document.querySelector(".category-item");
//   if (firstCategory && !document.querySelector(".submenu.active")) {
//     firstCategory.classList.add("active");
//     const targetId = firstCategory.dataset.target;
//     document.querySelector("#" + targetId).classList.add("active");
//   }
// });

// Make menu items clickable to navigate or scroll to products
document.querySelectorAll(".mega-menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    // Close menu
    megaMenu.classList.remove("active");
    // Scroll to products section
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
});
