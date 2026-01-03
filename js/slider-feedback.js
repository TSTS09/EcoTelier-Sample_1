/**
 * EcoTelier - Testimonials Slider Script
 * Gère le carousel des témoignages clients
 */

document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.main-text');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    
    if (!testimonials.length || !btnLeft || !btnRight) return;
    
    let currentIndex = 0;
    const totalSlides = testimonials.length;
    let isAnimating = false;
    
    // Initialiser les styles
    function initSlider() {
        testimonials.forEach((slide, index) => {
            if (index === 0) {
                slide.style.transform = 'scale(1)';
                slide.style.opacity = '1';
                slide.style.position = 'relative';
            } else {
                slide.style.transform = 'scale(0)';
                slide.style.opacity = '0';
                slide.style.position = 'absolute';
            }
        });
        updateButtons();
    }
    
    // Mettre à jour l'état des boutons
    function updateButtons() {
        // Garder les boutons visibles et actifs (boucle gérée dans les handlers)
        btnLeft.style.background = '#f73131';
        btnLeft.style.cursor = 'pointer';
        btnRight.style.background = '#f73131';
        btnRight.style.cursor = 'pointer';
    }
    
    // Afficher un slide
    function showSlide(index) {
        if (isAnimating) return;
        if (index < 0 || index >= totalSlides) return;
        if (index === currentIndex) return;
        
        isAnimating = true;
        
        const currentSlide = testimonials[currentIndex];
        const nextSlide = testimonials[index];
        
        // Cacher le slide actuel
        currentSlide.style.transform = 'scale(0)';
        currentSlide.style.opacity = '0';
        
        // Attendre la fin de l'animation
        setTimeout(() => {
            currentSlide.style.position = 'absolute';
            nextSlide.style.position = 'relative';
            
            // Afficher le nouveau slide
            nextSlide.style.transform = 'scale(1)';
            nextSlide.style.opacity = '1';
            
            currentIndex = index;
            updateButtons();
            
            setTimeout(() => {
                isAnimating = false;
            }, 400);
        }, 400);
    }
    
    // Événement bouton suivant (avec boucle)
    btnRight.addEventListener('click', function() {
        if (currentIndex < totalSlides - 1) {
            showSlide(currentIndex + 1);
        } else {
            showSlide(0);
        }
    });
    
    // Événement bouton précédent (avec boucle)
    btnLeft.addEventListener('click', function() {
        if (currentIndex > 0) {
            showSlide(currentIndex - 1);
        } else {
            showSlide(totalSlides - 1);
        }
    });
    
    // Support clavier
    document.addEventListener('keydown', function(e) {
        const commentsSection = document.querySelector('.section-comments');
        const rect = commentsSection.getBoundingClientRect();
        
        // Vérifier si la section est visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                showSlide(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < totalSlides - 1) {
                showSlide(currentIndex + 1);
            }
        }
    });
    
    // Support tactile (swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    
    const commentBlock = document.querySelector('.comment-block');
    
    if (commentBlock) {
        commentBlock.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        commentBlock.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < totalSlides - 1) {
                // Swipe vers la gauche - slide suivant
                showSlide(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe vers la droite - slide précédent
                showSlide(currentIndex - 1);
            }
        }
    }
    
    // Auto-play optionnel (désactivé par défaut)
    let autoPlayInterval = null;
    const autoPlayDelay = 5000; // 5 secondes
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentIndex < totalSlides - 1) {
                showSlide(currentIndex + 1);
            } else {
                showSlide(0);
            }
        }, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Pause auto-play on hover
    const sectionComments = document.querySelector('.section-comments');
    if (sectionComments) {
        sectionComments.addEventListener('mouseenter', stopAutoPlay);
        sectionComments.addEventListener('mouseleave', function() {
            // Reprendre l'auto-play après que l'utilisateur quitte la section
            startAutoPlay();
        });
    }
    
    // Initialiser
    initSlider();

    // Activer l'auto-play au démarrage (boucle continue)
    startAutoPlay();
});
