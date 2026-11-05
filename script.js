const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const profileSelect = document.querySelector("#profile");
const leadForm = document.querySelector("#leadForm");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3600);
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".select-profile").forEach((button) => {
  button.addEventListener("click", () => {
    profileSelect.value = button.dataset.profile;
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => document.querySelector("#fullName").focus(), 550);
  });
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;

  // Demo únicamente: no se envía ni almacena información.
  showToast("¡Gracias! Esta es una demostración; no se ha enviado ningún dato.");
  leadForm.reset();
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});