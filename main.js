const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");
const header = document.getElementById("header");
const scrollUp = document.getElementById("scroll-up");
const sections = document.querySelectorAll("section[id]");
const cursorGlow = document.getElementById("cursor-glow");

const heroSearch = document.getElementById("hero-search");
const heroDestination = document.getElementById("hero-destination");
const plannerForm = document.getElementById("planner-form");
const routeSearch = document.getElementById("route-search");
const routeCards = document.querySelectorAll(".route-card");
const resultCount = document.getElementById("result-count");
const emptyMessage = document.getElementById("empty-message");

const hereButton = document.getElementById("here-button");
const demandCount = document.getElementById("demand-count");
const demandMessage = document.getElementById("demand-message");

const rewardButton = document.getElementById("reward-button");
const rewardMessage = document.getElementById("reward-message");
const ridesLeft = document.getElementById("rides-left");

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

let demandUsers = 18;
let rides = 8;

function openMenu() {
  navMenu.classList.add("show-menu");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navMenu.classList.remove("show-menu");
  document.body.classList.remove("menu-open");
}

function updateHeader() {
  header.classList.toggle("scroll-header", window.scrollY >= 40);
}

function updateScrollButton() {
  scrollUp.classList.toggle("show-scroll", window.scrollY >= 480);
}

function updateActiveLink() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 110;
    const sectionId = section.getAttribute("id");
    const currentLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

    if (!currentLink) return;

    currentLink.classList.toggle(
      "active-link",
      scrollY > sectionTop && scrollY <= sectionTop + sectionHeight
    );
  });
}

function filterRoutes() {
  const value = routeSearch.value.trim().toLowerCase();
  let visibleCards = 0;

  routeCards.forEach((card) => {
    const content = `${card.dataset.route} ${card.textContent}`.toLowerCase();
    const isVisible = content.includes(value);

    card.style.display = isVisible ? "block" : "none";
    if (isVisible) visibleCards += 1;
  });

  resultCount.textContent = `${visibleCards} opcion${visibleCards === 1 ? "" : "es"}`;
  emptyMessage.style.display = visibleCards === 0 ? "block" : "none";
}

function submitHeroSearch(event) {
  event.preventDefault();
  const value = heroDestination.value.trim();

  if (value && routeSearch) {
    routeSearch.value = value;
    filterRoutes();
  }

  document.getElementById("buscar-ruta").scrollIntoView({ behavior: "smooth" });
}

function submitPlanner(event) {
  event.preventDefault();
  filterRoutes();
}

function updateDemand() {
  demandCount.textContent = `${demandUsers} usuarios`;

  if (demandUsers >= 26) {
    demandMessage.textContent = "Demanda alta: bus solicitado y frecuencia ajustada.";
    return;
  }

  if (demandUsers >= 21) {
    demandMessage.textContent = "Demanda media: supervisor monitoreando la ruta.";
    return;
  }

  demandMessage.textContent = "Demanda estable: frecuencia recomendada cada 10 minutos.";
}

function registerDemand() {
  demandUsers += 1;
  updateDemand();

  hereButton.disabled = true;
  hereButton.innerHTML = '<i class="bx bx-check-circle"></i> Bus solicitado';

  setTimeout(() => {
    hereButton.disabled = false;
    hereButton.innerHTML = '<i class="bx bx-map-pin"></i> Aqui estoy';
  }, 2400);
}

function simulateReward() {
  rides += 1;
  if (ridesLeft) ridesLeft.textContent = `${rides} pasajes`;
  rewardMessage.textContent = "Recompensa aplicada: ganaste 1 pasaje.";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", type === "success");
}

function handleContactSubmit(event) {
  event.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const comment = contactForm.comment.value.trim();

  if (!name || !email || !comment) {
    showFormMessage("Completa todos los campos antes de enviar.");
    return;
  }

  if (!isValidEmail(email)) {
    showFormMessage("Ingresa un correo valido.");
    return;
  }

  const requests = JSON.parse(localStorage.getItem("nexviaHelpRequests")) || [];
  requests.push({ name, email, comment, date: new Date().toISOString() });
  localStorage.setItem("nexviaHelpRequests", JSON.stringify(requests));

  contactForm.reset();
  showFormMessage("Solicitud enviada correctamente. NEXVIA dara seguimiento.", "success");
}

function moveCursor(event) {
  if (!cursorGlow) return;

  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
}

function animateNavPointer(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

function pulseNavLink(event) {
  const link = event.currentTarget;
  link.classList.add("is-clicked");

  setTimeout(() => {
    link.classList.remove("is-clicked");
  }, 360);
}

if (navToggle) navToggle.addEventListener("click", openMenu);
if (navClose) navClose.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    pulseNavLink(event);
    closeMenu();
  });

  link.addEventListener("mousemove", animateNavPointer);
  link.addEventListener("mouseenter", () => cursorGlow?.classList.add("is-active"));
  link.addEventListener("mouseleave", () => cursorGlow?.classList.remove("is-active"));
});

window.addEventListener("mousemove", moveCursor);

window.addEventListener("scroll", () => {
  updateHeader();
  updateScrollButton();
  updateActiveLink();
});

if (heroSearch) heroSearch.addEventListener("submit", submitHeroSearch);
if (plannerForm) plannerForm.addEventListener("submit", submitPlanner);
if (routeSearch) routeSearch.addEventListener("input", filterRoutes);
if (hereButton) hereButton.addEventListener("click", registerDemand);
if (rewardButton) rewardButton.addEventListener("click", simulateReward);
if (contactForm) contactForm.addEventListener("submit", handleContactSubmit);

updateHeader();
updateScrollButton();
updateActiveLink();
updateDemand();
filterRoutes();