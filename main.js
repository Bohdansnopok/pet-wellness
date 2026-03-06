document.addEventListener('DOMContentLoaded', () => {
  const accordionButtons = document.querySelectorAll('.accordion__item__dark-bg');

  accordionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      if (!answer || !answer.classList.contains('accordion__item__answer')) return;

      button.classList.toggle('active');
      answer.classList.toggle('active');
    });
  });
});
