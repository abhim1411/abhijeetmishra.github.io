const loader = document.querySelector(".loader");
const progress = document.querySelector(".scroll-progress");
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
    if (card.tagName === "A") return;
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

