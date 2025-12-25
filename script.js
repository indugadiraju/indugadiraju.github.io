/* .js files add interaction to your website */

// Dropdown functionality for project cards
document.addEventListener('DOMContentLoaded', function() {
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  
  dropdownButtons.forEach(button => {
    button.addEventListener('click', function() {
      const projectCard = this.closest('.project-card');
      projectCard.classList.toggle('active');
    });
  });

  // Carousel functionality
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentSlide = 0;

    function showSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Add active class to current slide and dot
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (dots[index]) {
        dots[index].classList.add('active');
      }
      
      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });

    // Initialize first slide
    showSlide(0);
  });
});
