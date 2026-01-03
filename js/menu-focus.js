/**
 * EcoTelier - Menu Navigation Script
 * Gère le menu hamburger pour les appareils mobiles
 */

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('first');
    const sublist = document.querySelector('.sublist');
    const menuItems = document.querySelectorAll('.sublist .menu-items');
    
    // Toggle menu mobile
    if (menuToggle && sublist) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sublist.classList.toggle('active');
            
            // Animation du bouton hamburger
            if (sublist.classList.contains('active')) {
                menuToggle.innerHTML = '✕';
                menuToggle.style.color = '#f73131';
            } else {
                menuToggle.innerHTML = '☰';
                menuToggle.style.color = '#2c2c2c';
            }
        });
    }
    
    // Fermer le menu quand on clique sur un lien
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 1023) {
                sublist.classList.remove('active');
                menuToggle.innerHTML = '☰';
                menuToggle.style.color = '#2c2c2c';
            }
        });
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1023) {
            if (!e.target.closest('nav') && sublist.classList.contains('active')) {
                sublist.classList.remove('active');
                menuToggle.innerHTML = '☰';
                menuToggle.style.color = '#2c2c2c';
            }
        }
    });
    
    // Réinitialiser le menu quand on redimensionne la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1023) {
            sublist.classList.remove('active');
            sublist.style.display = '';
            menuToggle.innerHTML = '☰';
        }
    });
    
    // Highlight du lien actif basé sur le scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(function(section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.sublist a[href="#' + sectionId + '"]');
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.style.color = '#f73131';
                } else {
                    navLink.style.color = '';
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
