// Menu Mobile toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) { // Check if elements exist
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('open'); // For hamburger to X animation
    });
  }

  // Update cart count on all pages (if cart.js is not loaded on every page, this part can be in cart.js)
  // If cart.js handles this with its own DOMContentLoaded, this might be redundant or could be moved there.
  // For simplicity, if cart.js is included everywhere (even if not strictly needed), its DOMContentLoaded will run.
  // If cart.js is only on cart/product pages, this small snippet here is useful for other pages.
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement && typeof getCart === 'function') { // Check if getCart is available
      const cart = getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
  } else if (cartCountElement) {
      // Fallback if getCart isn't loaded yet or available (e.g., from localStorage directly)
      const storedCart = JSON.parse(localStorage.getItem('gatonautasCart')) || [];
      const totalItems = storedCart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
  }
});

// Scroll Animations
const animatedElements = document.querySelectorAll('.team-card, .product-card, .gallery img, .form-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            // Optional: unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of the element is visible

animatedElements.forEach(el => {
    el.style.opacity = 0; // Initially hidden
    el.style.transform = 'translateY(20px)'; // Initially moved down
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});