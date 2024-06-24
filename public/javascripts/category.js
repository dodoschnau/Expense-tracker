document.addEventListener('DOMContentLoaded', function () {
  const categorySelect = document.getElementById('categorySelect');
  const categoryIcon = document.getElementById('categoryIcon');

  categorySelect.addEventListener('change', function () {
    const selectedOption = categorySelect.selectedOptions[0];
    const iconClass = selectedOption.getAttribute('data-icon');
    categoryIcon.className = iconClass;
  });
});
