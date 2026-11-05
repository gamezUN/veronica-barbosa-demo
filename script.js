const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const profileSelect = document.querySelector("#profile");
const leadForm = document.querySelector("#leadForm");
const toast = document.querySelector("#toast");
const publicView = document.querySelector("#publicView");
const crmView = document.querySelector("#crmView");
const publicFooter = document.querySelector("#publicFooter");
const openCrm = document.querySelector("#openCrm");
const backToSite = document.querySelector("#backToSite");
const brandHome = document.querySelector("#brandHome");
const uploadOverlay = document.querySelector("#uploadOverlay");
const pdfInput = document.querySelector("#pdfInput");
const uploadSelection = document.querySelector("#uploadSelection");
const confirmUpload = document.querySelector("#confirmUpload");
const selectedFile = document.querySelector("#selectedFile");

let selectedPdf = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3600);
}

function showPublicView() {
  document.body.classList.remove("crm-mode");
  crmView.setAttribute("hidden", "");
  publicView.removeAttribute("hidden");
  publicFooter.removeAttribute("hidden");
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCrmView() {
  document.body.classList.add("crm-mode");
  publicView.setAttribute("hidden", "");
  publicFooter.setAttribute("hidden", "");
  crmView.removeAttribute("hidden");
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  history.replaceState(null, "", "#crm");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delegación de eventos para que los controles sigan funcionando aunque
// el navegador restaure la página desde caché o se navegue por el historial.
document.addEventListener("click", (event) => {
  if (event.target.closest("#openCrm")) {
    event.preventDefault();
    showCrmView();
  }
  if (event.target.closest("#backToSite")) {
    event.preventDefault();
    showPublicView();
  }
});

if (window.location.hash === "#crm") showCrmView();
brandHome.addEventListener("click", (event) => {
  if (!crmView.hidden) {
    event.preventDefault();
    showPublicView();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

mainNav.querySelectorAll(".public-link").forEach((link) => {
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

// Ventana de selección estilo Drive: acepta únicamente archivos PDF.
function openPdfPicker() {
  selectedPdf = null;
  pdfInput.value = "";
  uploadSelection.hidden = true;
  uploadSelection.textContent = "";
  confirmUpload.disabled = true;
  uploadOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePdfPicker() {
  uploadOverlay.hidden = true;
  document.body.style.overflow = "";
}

document.querySelector("#openUpload").addEventListener("click", openPdfPicker);
document.querySelector("#closeUpload").addEventListener("click", closePdfPicker);
document.querySelector("#cancelUpload").addEventListener("click", closePdfPicker);

uploadOverlay.addEventListener("click", (event) => {
  if (event.target === uploadOverlay) closePdfPicker();
});

pdfInput.addEventListener("change", () => {
  const file = pdfInput.files[0];
  if (!file) return;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    pdfInput.value = "";
    selectedPdf = null;
    uploadSelection.hidden = true;
    confirmUpload.disabled = true;
    showToast("Formato no válido. Selecciona un archivo PDF.");
    return;
  }

  selectedPdf = file;
  uploadSelection.textContent = "✓ " + file.name + " · " + Math.max(1, Math.round(file.size / 1024)) + " KB";
  uploadSelection.hidden = false;
  confirmUpload.disabled = false;
});

confirmUpload.addEventListener("click", () => {
  if (!selectedPdf) return;
  selectedFile.textContent = "PDF seleccionado: " + selectedPdf.name;
  selectedFile.hidden = false;
  closePdfPicker();
  showToast("PDF seleccionado para la demostración. No se ha subido a ningún servidor.");
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;
  showToast("Formulario de demostración. No se ha enviado ni guardado información.");
  leadForm.reset();
  selectedFile.hidden = true;
  selectedFile.textContent = "";
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
