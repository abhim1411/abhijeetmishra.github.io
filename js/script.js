const root = document.documentElement;
const loader = document.querySelector(".loader");
const progress = document.querySelector(".scroll-progress");
const cursorGlow = document.querySelector(".cursor-glow");
const spotlight = document.querySelector(".mouse-spotlight");
const navLinks = document.querySelector(".nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const sections = [...document.querySelectorAll("main section[id]")];

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hidden"), 450);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

const roles = ["Cybersecurity Engineer", "Python Developer", "AI Enthusiast", "SOC Analyst", "DevOps Engineer"];
const typingTarget = document.querySelector(".typing-text");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  if (!typingTarget) return;
  const role = roles[roleIndex];
  typingTarget.textContent = role.slice(0, charIndex);

  if (!deleting && charIndex < role.length) {
    charIndex += 1;
    setTimeout(typeRole, 72);
    return;
  }

  if (!deleting && charIndex === role.length) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 34);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 280);
}

typeRole();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      const duration = 1300;
      const start = performance.now();

      function tick(now) {
        const progressValue = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        counter.textContent = Math.floor(eased * target);
        if (progressValue < 1) requestAnimationFrame(tick);
        else counter.textContent = target;
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

function updateScrollState() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if (progress) progress.style.width = `${percent}%`;

  const current = sections
    .filter((section) => window.scrollY >= section.offsetTop - 180)
    .pop();

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.toggle("active", current?.id && link.getAttribute("href") === `#${current.id}`);
  });
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

document.querySelectorAll(".theme-swatch").forEach((button) => {
  button.addEventListener("click", () => {
    root.dataset.theme = button.dataset.theme;
    document.querySelectorAll(".theme-swatch").forEach((swatch) => swatch.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelector(".dark-toggle")?.addEventListener("click", () => {
  root.dataset.mode = root.dataset.mode === "light" ? "dark" : "light";
});

const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer) {
  window.addEventListener("mousemove", (event) => {
    const x = `${event.clientX}px`;
    const y = `${event.clientY}px`;
    if (cursorGlow) {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = x;
      cursorGlow.style.top = y;
    }
    if (spotlight) {
      spotlight.style.opacity = "1";
      spotlight.style.setProperty("--mx", x);
      spotlight.style.setProperty("--my", y);
    }
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

const graph = document.querySelector(".contribution-graph");
if (graph) {
  for (let index = 0; index < 126; index += 1) {
    const cell = document.createElement("span");
    const level = (index * 7 + index.toString().charCodeAt(0)) % 5;
    if (level) cell.classList.add(`level-${level}`);
    graph.appendChild(cell);
  }
}

const filterButtons = document.querySelectorAll(".filter-btn");
const certCards = document.querySelectorAll(".cert-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    certCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !visible);
    });
  });
});

const certModal = document.getElementById("certModal");
const certModalImage = certModal?.querySelector("img");

certCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!certModal || !certModalImage) return;
    certModalImage.src = card.dataset.full;
    certModalImage.alt = card.querySelector("img")?.alt || "Certificate preview";
    certModal.showModal();
    document.body.classList.add("modal-open");
  });
});

document.querySelector(".modal-close")?.addEventListener("click", () => {
  certModal?.close();
});

certModal?.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});

certModal?.addEventListener("click", (event) => {
  if (event.target === certModal) certModal.close();
});

const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();
  const button = contactForm.querySelector("button");
  const originalText = button.textContent;

  if (!name || !email || !message) return;

  button.textContent = "Sending...";
  button.disabled = true;

  if (window.emailjs) {
    emailjs.init("4g4gYl-qgDYi7ZyJL");
    emailjs
      .send("service_sh505so", "template_vp2jdjp", {
        from_name: name,
        from_email: email,
        message,
      })
      .then(() => {
        button.textContent = "Message Sent";
        contactForm.reset();
      })
      .catch(() => {
        window.location.href = `mailto:mishraabhijeet122@gmail.com?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${message}\n\nReply to: ${email}`)}`;
        button.textContent = "Opening Email";
      })
      .finally(() => {
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 1800);
      });
    return;
  }

  window.location.href = `mailto:mishraabhijeet122@gmail.com?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${message}\n\nReply to: ${email}`)}`;
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1200);
});

const canvas = document.getElementById("particleCanvas");
const ctx = canvas?.getContext("2d");
const particles = [];
let animationFrame;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createParticles() {
  particles.length = 0;
  const count = Math.min(90, Math.floor(window.innerWidth / 18));
  for (let index = 0; index < count; index += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2 + 0.6,
    });
  }
}

function drawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 245, 255, 0.62)";
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 115) {
        ctx.strokeStyle = `rgba(123, 97, 255, ${0.16 * (1 - distance / 115)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    createParticles();
    drawParticles();
  });
}
