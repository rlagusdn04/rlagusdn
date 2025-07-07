const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!sidebar.classList.contains('hidden')) {
    if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
      sidebar.classList.add('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !sidebar.classList.contains('hidden')) {
    sidebar.classList.add('hidden');
  }
}); 