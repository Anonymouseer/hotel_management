document.addEventListener("DOMContentLoaded", function () {
  // Feather icons
  if (typeof feather !== "undefined") feather.replace();

  // Update copyright year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hero Swiper
  if (document.querySelector(".hero-slider")) {
    new Swiper(".hero-slider", {
      loop: true,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: ".hero-pagination", clickable: true },
    });
  }

  // Room Swiper
  if (document.querySelector(".room-swiper")) {
    new Swiper(".room-swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: ".room-pagination", clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
  }

  // Intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document
    .querySelectorAll(".amenity-card, .testimonial-card")
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });

  // Mobile nav toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener("click", () => {
      mainNav.classList.toggle("hidden");
      mainNav.classList.toggle("flex");
    });
  }

  // Reservation form validation
  const reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const checkin = reservationForm.checkin.value;
      const checkout = reservationForm.checkout.value;
      const room = reservationForm.room.value;
      if (!checkin || !checkout || !room) {
        alert("Please fill check-in/check-out dates and choose a room type.");
        return;
      }
      alert("Thanks! Our reservations team will contact you shortly.");
      reservationForm.reset();
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetSelector = this.getAttribute("href");
      if (targetSelector.length > 1) {
        const target = document.querySelector(targetSelector);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Image fade-in
  document.querySelectorAll("img").forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity .35s ease, transform .35s ease";
    if (img.complete) img.style.opacity = "1";
    else
      img.addEventListener("load", function () {
        this.style.opacity = "1";
      });
  });

  // Header shadow toggle
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) header.classList.add("shadow-xl", "scrolled");
      else header.classList.remove("shadow-xl", "scrolled");
    });
  }

  // Generic Swiper
  if (document.querySelector(".mySwiper")) {
    new Swiper(".mySwiper", {
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: { delay: 5000, disableOnInteraction: false },
    });
  }
});
