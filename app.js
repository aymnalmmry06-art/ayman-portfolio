const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#navLinks");
const langSwitch = document.querySelector("#langSwitch");
const contactForm = document.querySelector(".contact-form");
const formMessage = document.querySelector("#formMessage");
const scrollProgressBar = document.querySelector("#scrollProgressBar");
const backToTop = document.querySelector("#backToTop");
const navItems = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = navItems
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let currentLang = "ar";

function closeMobileMenu() {
  navLinks?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

function setHeaderState() {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}

function setScrollToolsState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (scrollProgressBar) scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
  backToTop?.classList.toggle("show", window.scrollY > 420);
}

function setActiveLink() {
  const line = window.scrollY + window.innerHeight * 0.32;
  let current = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= line) current = section;
  });

  navItems.forEach((link) => {
    link.classList.toggle("active", current && link.hash === `#${current.id}`);
  });
}

menuToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  document.body.classList.toggle("menu-open", navLinks?.classList.contains("open"));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!navLinks?.classList.contains("open")) return;
  const target = event.target;
  if (target instanceof Node && (navLinks.contains(target) || menuToggle?.contains(target))) return;
  closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMobileMenu();
});

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  if (langSwitch) {
    const current = langSwitch.querySelector(".lang-current");
    const next = langSwitch.querySelector(".lang-next");
    if (current) current.textContent = lang.toUpperCase();
    if (next) next.textContent = lang === "ar" ? "EN" : "AR";
  }
  backToTop?.setAttribute("aria-label", lang === "ar" ? "العودة للأعلى" : "Back to top");

  document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
    element.textContent = element.dataset[lang] || element.textContent;
  });

  document.querySelectorAll("[data-ar-placeholder][data-en-placeholder]").forEach((element) => {
    element.placeholder = element.dataset[`${lang}Placeholder`] || element.placeholder;
  });
}

langSwitch?.addEventListener("click", () => {
  applyLanguage(currentLang === "ar" ? "en" : "ar");
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function showFormMessage(type, text) {
  if (!formMessage) return;
  formMessage.className = `form-message show ${type}`;
  formMessage.textContent = text;
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent || "";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = currentLang === "ar" ? "جاري الإرسال..." : "Sending...";
  }

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Message was not sent");

    contactForm.reset();
    applyLanguage(currentLang);
    showFormMessage(
      "success",
      currentLang === "ar"
        ? "تم إرسال الرسالة بنجاح. شكرًا لك، سأرد عليك قريبًا."
        : "Message sent successfully. Thank you, I will reply soon.",
    );
  } catch (error) {
    showFormMessage(
      "error",
      currentLang === "ar"
        ? "تعذر إرسال الرسالة الآن. يمكنك مراسلتي من أيقونة البريد في الأعلى."
        : "Could not send the message right now. You can email me from the icon above.",
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      applyLanguage(currentLang);
    }
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  window.requestAnimationFrame(() => {
    setHeaderState();
    setActiveLink();
    setScrollToolsState();
    ticking = false;
  });
  ticking = true;
});

setHeaderState();
setActiveLink();
setScrollToolsState();
applyLanguage("ar");
