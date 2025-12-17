// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Download button click effect
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', function(e) {
    this.classList.add('clicked');
    
    // Reset the animation after it completes
    setTimeout(() => {
      this.classList.remove('clicked');
    }, 2000);
  });
}
const certStack = document.getElementById('certStack');

certStack.addEventListener('click', () => {
  certStack.classList.toggle('active');
});


// Posters Carousel Auto-swipe
const postersCarousel = document.querySelector('.posters-carousel');
if (postersCarousel) {
  const cards = postersCarousel.querySelectorAll('.poster-card');
  let currentIndex = 0;
  const totalCards = cards.length;
  const cardsToShow = 2;
  const totalSlides = Math.ceil(totalCards / cardsToShow);
  
  function updateCarousel() {
    if (cards.length === 0) return;
    
    // Get the width of one card including gap
    const firstCard = cards[0];
    const cardRect = firstCard.getBoundingClientRect();
    const gap = 30;
    const cardWidth = cardRect.width + gap;
    
    // Move by 2 cards at a time
    const translateX = -(currentIndex * cardWidth * cardsToShow);
    postersCarousel.style.transform = `translateX(${translateX}px)`;
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }
  
  // Initialize
  setTimeout(() => {
    updateCarousel();
  }, 100);
  
  // Auto-swipe every 4 seconds
  setInterval(nextSlide, 4000);
  
  // Update on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 250);
  });
}

// Lightbox Modal for Poster Images
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
const posterImages = document.querySelectorAll('.poster-img');

// Open lightbox on image click
posterImages.forEach(img => {
  img.addEventListener('click', function() {
    const imageSrc = this.getAttribute('data-src') || this.src;
    const caption = this.getAttribute('data-caption') || this.alt;
    
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
});

// Close lightbox
function closeLightbox() {
  lightboxModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);

// Close on background click
lightboxModal.addEventListener('click', function(e) {
  if (e.target === lightboxModal) {
    closeLightbox();
  }
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
    closeLightbox();
  }
});

// Contact Form Mailto Feature
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (name && email && message) {
      // Replace 'your-email@example.com' with your actual email address
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
      
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
      
        if (!name || !email || !message) return;
      
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
      
        emailjs.send(
          'service_sh505so',
          'template_vp2jdjp',
          {
            from_name: name,
            from_email: email,
            message: message,
          }
        )
        .then(() => {
          button.textContent = 'Message Sent ✅';
          contactForm.reset();
      
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 2000);
        })
        .catch((error) => {
          alert('Failed to send message ❌');
          console.error(error);
          button.textContent = originalText;
          button.disabled = false;
        });
      });
      // Show success message
      const button = contactForm.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        // Reset form
        contactForm.reset();
      }, 2000);
    }
  });
}

// Custom Cursor Drone Effect (only on non-touch devices)
const cursor = document.querySelector('.cursor-drone');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice && cursor) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow animation
  function animateCursor() {
    // Calculate distance between cursor and mouse
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    // Smooth interpolation
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    // Update cursor position
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }

  // Initialize cursor position
  cursorX = window.innerWidth / 2;
  cursorY = window.innerHeight / 2;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';

  // Start animation
  animateCursor();

  // Prevent hover effect on clickable/interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .project-card, .card, .nav-links a, .poster-card, .skill-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('hover'); // Ensure hover class is removed
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover'); // Keep it removed when leaving
    });
  });
} else if (cursor) {
  // Hide cursor on touch devices
  cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
}
