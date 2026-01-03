// animations.js
// IntersectionObserver-based reveal animations and logo entrance

document.addEventListener('DOMContentLoaded', function () {
    // Logo reveal
    const logo = document.querySelector('.logo-img');
    if (logo) {
        // small delay for nicer entrance
        setTimeout(() => {
            logo.classList.add('logo-animate');
        }, 200);
    }

    // IntersectionObserver for .reveal elements
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('inview');
                }
            });
        }, { threshold: 0.12 });

        reveals.forEach(el => io.observe(el));
    } else {
        // Fallback: simply show all
        reveals.forEach(el => el.classList.add('inview'));
    }

    // Parallax-like effect for hero background overlay
    const bgOverlay = document.querySelector('.bg-overlay');
    if (bgOverlay) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            // small translate effect
            bgOverlay.style.transform = `translateY(${Math.min(y * 0.08, 60)}px)`;
        }, { passive: true });
    }
});
