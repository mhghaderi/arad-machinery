import productsData from "./data/product.js";
// import { productsData } from "./product.js";
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
  }, 1000);
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
let _searchStarted = false; // track whether user began typing
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const products = Array.from(document.querySelectorAll(".product-card"));
  let hasResults = false;

  // If user JUST started typing (first non-empty char), temporarily switch product tabs to "all" and show everything first
  if (!_searchStarted && query.trim().length > 0) {
    _searchStarted = true;
    const tabsContainer = document.getElementById("productTabs");
    if (tabsContainer) {
      const tabs = Array.from(tabsContainer.querySelectorAll(".product-tab"));
      // try to find an "all" tab by data-category or fallback to first
      const allTab = tabs.find(
        (t) =>
          (t.getAttribute("data-category") || "").toLowerCase() === "all" ||
          (t.textContent || "").trim() === "همه"
      );
      tabs.forEach((t) => {
        t.setAttribute("aria-selected", "false");
        t.tabIndex = -1;
      });
      if (allTab) {
        allTab.setAttribute("aria-selected", "true");
        allTab.tabIndex = 0;
      } else if (tabs.length) {
        tabs[0].setAttribute("aria-selected", "true");
        tabs[0].tabIndex = 0;
      }
    }

    // make all products visible first (so user sees the full list before search narrows)
    products.forEach((p) => {
      p.style.display = "block";
      p.style.opacity = 1;
    });
  }

  // perform the search filtering (narrow results)
  products.forEach((product) => {
    const titleEl = product.querySelector("h3");
    const title = titleEl ? titleEl.textContent.toLowerCase() : "";
    if (query === "" || title.includes(query)) {
      product.style.display = "block";
      product.style.opacity = 1;
      hasResults = true;
    } else {
      product.style.display = "none";
    }
  });

  // If user cleared the input, reset the _searchStarted flag
  if (query.trim() === "") {
    _searchStarted = false;
  }

  // Scroll to products if search has results
  if (query && hasResults) {
    const productsSection = document.getElementById("products");
    if (productsSection) productsSection.scrollIntoView({ behavior: "smooth" });
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

// Open Product Modal
window.openProductModal = function openProductModal(id) {
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

  // Build gallery thumbnails array (we'll render slider UI below)
  let galleryHTML = "";
  product.gallery.forEach((img, index) => {
    galleryHTML +=
      `<button class=\"modal-thumb\" data-index=\"${index}\" aria-label=\"تصویر ${
        index + 1
      }\">` +
      `<img src=\"${img}\" alt=\"تصویر ${
        index + 1
      }\" class=\"w-full h-20 object-cover rounded-lg\"/>` +
      `</button>`;
  });

  const categoryColors = {
    blue: "background: rgba(37, 99, 235, 0.9); color: white;",
    yellow: "background: rgba(234, 179, 8, 0.9); color: white;",
    red: "background: rgba(239, 68, 68, 0.9); color: white;",
  };

  modalBody.innerHTML = `
                <div class="grid md:grid-cols-2 gap-10">
                    <div>
                        <div class="relative mb-6 rounded-2xl overflow-hidden shadow-2xl modal-slider">
                          <button class="slider-arrow left" aria-label="قبلی">‹</button>
                          <div class="slider-main">
                            <img src="${
                              product.gallery[0] || product.image
                            }" alt="${
    product.name
  }" id="modalMainImage" class="w-full rounded-2xl object-cover" />
                          </div>
                          <button class="slider-arrow right" aria-label="بعدی">›</button>
                          <span class="absolute top-4 right-4 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg" style="${
                            categoryColors[product.categoryColor]
                          }">${product.category}</span>
                        </div>
                        <div class="grid grid-cols-4 gap-3 modal-thumbs">${galleryHTML}</div>
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
                        <div class="rounded-2xl overflow-hidden shadow-lg" style="border: 1px solid var(--border-color)">
                            <table class="w-full">
                                <tbody>
                                    ${specsHTML}
                                </tbody>
                            </table>
                        </div>

                      </div>
                    </div>

                    <!-- Video (full width) -->
                    <div class="mt-8">
                      <div class="video-wrap rounded-2xl overflow-hidden shadow-lg" style="border:1px solid var(--border-color)">
                        <iframe src="${
                          product.video
                        }" class="w-full" style="height:520px;border:0;display:block;" frameborder="0" allowfullscreen></iframe>
                      </div>
                      <div class="mt-6">
                        <button onclick="scrollToContact(); closeProductModal();" class="btn-primary w-full justify-center text-lg py-4">
                          <i class="fas fa-headset"></i>
                          درخواست مشاوره برای این محصول
                        </button>
                      </div>
                    </div>
                    </div>
                </div>
            `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Initialize slider behavior inside modal
  try {
    const modalEl = document.getElementById("productModal");
    const mainImg = modalEl.querySelector("#modalMainImage");
    const thumbs = Array.from(modalEl.querySelectorAll(".modal-thumb"));
    const leftArrow = modalEl.querySelector(".slider-arrow.left");
    const rightArrow = modalEl.querySelector(".slider-arrow.right");
    let currentIndex = 0;

    function updateMain(index) {
      const src = product.gallery[index] || product.image;
      if (mainImg) mainImg.src = src;
      thumbs.forEach((t) => t.classList.remove("active"));
      const activeThumb = thumbs.find((t) => +t.dataset.index === index);
      if (activeThumb) activeThumb.classList.add("active");
      currentIndex = index;
    }

    thumbs.forEach((t) => {
      t.addEventListener("click", () => {
        const idx = +t.dataset.index;
        updateMain(idx);
      });
    });

    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        const next =
          (currentIndex - 1 + product.gallery.length) % product.gallery.length;
        updateMain(next);
      });
    }
    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        const next = (currentIndex + 1) % product.gallery.length;
        updateMain(next);
      });
    }

    // set initial
    updateMain(0);
  } catch (err) {
    console.error(err);
  }
};

// Close Product Modal
window.closeProductModal = function closeProductModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
};

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

// Expose to window for inline onclick handlers (modules are not global)
window.scrollToContact = scrollToContact;
window.closeMobileMenuFunc = closeMobileMenuFunc;

// Prevent typing letters in phone input
const phoneInput = document.querySelector('input[name="phone"]');

if (phoneInput) {
  phoneInput.addEventListener("input", function (e) {
    // Remove all non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, "");
  });
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

  // Initialize
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

// Mega Menu: Show submenus on hover

// Make menu items clickable to navigate or scroll to products
document.querySelectorAll(".mega-menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    // Close menu
    megaMenu.classList.remove("active");
    // Scroll to products section
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
});

// =========================================
//  منطق جدید دراپ‌داون محصولات
// =========================================
const productsMenuTrigger = document.getElementById("productsMenuTrigger");
const productsDropdown = document.getElementById("productsDropdown");
const productsMenuWrapper = document.getElementById("productsMenuWrapper");

function showDropdown() {
  if (productsDropdown) productsDropdown.classList.add("active");
}

function hideDropdown() {
  if (productsDropdown) productsDropdown.classList.remove("active");
}

if (productsMenuTrigger && productsDropdown && productsMenuWrapper) {
  // 1. موس رفت روی دکمه -> باز شو
  productsMenuTrigger.addEventListener("mouseenter", showDropdown);

  // 2. موس از کل محدوده (دکمه + منو) خارج شد -> بسته شو
  productsMenuWrapper.addEventListener("mouseleave", hideDropdown);

  // 3. روی هر لینک کلیک شد -> بسته شو
  const links = productsDropdown.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", hideDropdown);
  });
}
