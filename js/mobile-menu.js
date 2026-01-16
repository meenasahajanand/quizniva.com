document.addEventListener('DOMContentLoaded', function() {
    function toggleMenu() {
        const menu = document.getElementById('navbar-collapse-with-animation');
        const button = document.querySelector('.hs-collapse-toggle');
        
        if (menu) {
            menu.classList.toggle('hidden');
            // Also toggle 'open' class if used by CSS
            menu.classList.toggle('open');
        }
        
        if (button) {
            // Toggle icons
            const svgs = button.querySelectorAll('svg');
            svgs.forEach(svg => {
                svg.classList.toggle('hidden');
            });
        }
    }

    // Expose to global scope for onclick handlers
    window.toggleMobileMenu = toggleMenu;

    // Add event listener for elements with data-hs-collapse
    const toggles = document.querySelectorAll('[data-hs-collapse]');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    });
});
