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
});
