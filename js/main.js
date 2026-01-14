/**
 * EcoTelier - Clean JavaScript
 * Simple, efficient functionality with product carousels
 */

document.addEventListener('DOMContentLoaded', function() {
	
	// ===========================================
	// Mobile Navigation
	// ===========================================
	
	const navToggle = document.getElementById('nav-toggle');
	const navMenu = document.getElementById('nav-menu');
	
	if (navToggle && navMenu) {
		navToggle.addEventListener('click', function() {
			this.classList.toggle('active');
			navMenu.classList.toggle('active');
		});
		
		// Close menu on link click
		navMenu.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				navToggle.classList.remove('active');
				navMenu.classList.remove('active');
			});
		});
		
		// Close menu on outside click
		document.addEventListener('click', function(e) {
			if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
				navToggle.classList.remove('active');
				navMenu.classList.remove('active');
			}
		});
	}
	
	// ===========================================
	// Smooth Scroll
	// ===========================================
	
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			const href = this.getAttribute('href');
			if (href !== '#' && href.length > 1) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) {
					const header = document.querySelector('.header');
					const offset = header ? header.offsetHeight + 20 : 20;
					const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
					window.scrollTo({ top: position, behavior: 'smooth' });
				}
			}
		});
	});
	
	// ===========================================
	// Product Carousels
	// ===========================================
	
	const productCarousels = document.querySelectorAll('.product-carousel');
	
	productCarousels.forEach(carousel => {
		const slides = carousel.querySelectorAll('.carousel-slide');
		const dotsContainer = carousel.querySelector('.carousel-dots');
		
		if (slides.length <= 1) return;
		
		let currentIndex = 0;
		let autoPlayInterval;
		let touchStartX = 0;
		let touchEndX = 0;
		
		// Create dots
		slides.forEach((_, index) => {
			const dot = document.createElement('button');
			dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
			dot.setAttribute('aria-label', `Image ${index + 1}`);
			dot.addEventListener('click', () => goToSlide(index));
			dotsContainer.appendChild(dot);
		});
		
		const dots = dotsContainer.querySelectorAll('.carousel-dot');
		
		function goToSlide(index) {
			slides[currentIndex].classList.remove('active');
			dots[currentIndex].classList.remove('active');
			
			currentIndex = index;
			if (currentIndex >= slides.length) currentIndex = 0;
			if (currentIndex < 0) currentIndex = slides.length - 1;
			
			slides[currentIndex].classList.add('active');
			dots[currentIndex].classList.add('active');
		}
		
		function nextSlide() {
			goToSlide(currentIndex + 1);
		}
		
		function prevSlide() {
			goToSlide(currentIndex - 1);
		}
		
		// Auto-play with staggered start for natural feel
		function startAutoPlay() {
			const delay = 4000 + Math.random() * 2000; // 4-6 seconds random
			autoPlayInterval = setInterval(nextSlide, delay);
		}
		
		function stopAutoPlay() {
			clearInterval(autoPlayInterval);
		}
		
		// Start auto-play with staggered delay
		setTimeout(startAutoPlay, Math.random() * 3000);
		
		// Pause on hover
		carousel.addEventListener('mouseenter', stopAutoPlay);
		carousel.addEventListener('mouseleave', startAutoPlay);
		
		// Touch/Swipe support
		carousel.addEventListener('touchstart', function(e) {
			touchStartX = e.changedTouches[0].screenX;
			stopAutoPlay();
		}, { passive: true });
		
		carousel.addEventListener('touchend', function(e) {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
			startAutoPlay();
		}, { passive: true });
		
		function handleSwipe() {
			const swipeThreshold = 50;
			const diff = touchStartX - touchEndX;
			
			if (Math.abs(diff) > swipeThreshold) {
				if (diff > 0) {
					nextSlide(); // Swipe left = next
				} else {
					prevSlide(); // Swipe right = prev
				}
			}
		}
		
		// Mouse drag support for desktop
		let isDragging = false;
		let dragStartX = 0;
		
		carousel.addEventListener('mousedown', function(e) {
			isDragging = true;
			dragStartX = e.clientX;
			stopAutoPlay();
		});
		
		carousel.addEventListener('mousemove', function(e) {
			if (!isDragging) return;
			e.preventDefault();
		});
		
		carousel.addEventListener('mouseup', function(e) {
			if (!isDragging) return;
			isDragging = false;
			
			const diff = dragStartX - e.clientX;
			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					nextSlide();
				} else {
					prevSlide();
				}
			}
			startAutoPlay();
		});
		
		carousel.addEventListener('mouseleave', function() {
			isDragging = false;
		});
	});
	
	// ===========================================
	// Testimonials Slider
	// ===========================================
	
	const testimonials = document.querySelectorAll('.testimonial');
	const dots = document.querySelectorAll('.testimonial-nav .dot');
	const prevBtn = document.getElementById('prev-btn');
	const nextBtn = document.getElementById('next-btn');
	
	if (testimonials.length > 0) {
		let current = 0;
		
		function showTestimonial(index) {
			testimonials.forEach(t => t.classList.remove('active'));
			dots.forEach(d => d.classList.remove('active'));
			
			testimonials[index].classList.add('active');
			dots[index].classList.add('active');
			current = index;
		}
		
		function next() {
			showTestimonial((current + 1) % testimonials.length);
		}
		
		function prev() {
			showTestimonial((current - 1 + testimonials.length) % testimonials.length);
		}
		
		if (nextBtn) nextBtn.addEventListener('click', next);
		if (prevBtn) prevBtn.addEventListener('click', prev);
		
		dots.forEach((dot, i) => {
			dot.addEventListener('click', () => showTestimonial(i));
		});
		
		// Auto-play
		let autoPlay = setInterval(next, 6000);
		const slider = document.querySelector('.testimonials-slider');
		if (slider) {
			slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
			slider.addEventListener('mouseleave', () => autoPlay = setInterval(next, 6000));
		}
	}
	
	// ===========================================
	// Contact Form
	// ===========================================
	
	const form = document.getElementById('contact-form');
	const status = document.getElementById('form-status');
	
	if (form) {
		form.addEventListener('submit', async function(e) {
			e.preventDefault();
			
			// Basic validation
			const required = form.querySelectorAll('[required]');
			let valid = true;
			
			required.forEach(field => {
				if (!field.value.trim()) {
					valid = false;
					field.style.borderColor = '#c45a3b';
				} else {
					field.style.borderColor = '';
				}
			});
			
			if (!valid) {
				showStatus('error', 'Veuillez remplir tous les champs obligatoires.');
				return;
			}
			
			// Email check
			const email = form.querySelector('#email');
			if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
				email.style.borderColor = '#c45a3b';
				showStatus('error', 'Veuillez entrer une adresse email valide.');
				return;
			}
			
			const btn = form.querySelector('button[type="submit"]');
			btn.disabled = true;
			btn.textContent = 'Envoi en cours...';
			
			const action = form.getAttribute('action');
			
			try {
				if (action && action.includes('formspree') && !action.includes('YOUR_FORM_ID')) {
					const response = await fetch(action, {
						method: 'POST',
						body: new FormData(form),
						headers: { 'Accept': 'application/json' }
					});
					
					if (response.ok) {
						showStatus('success', 'Merci ! Votre message a été envoyé avec succès.');
						form.reset();
					} else {
						throw new Error();
					}
				} else {
					// Demo mode
					await new Promise(r => setTimeout(r, 1500));
					showStatus('success', 'Message enregistré (mode démo). Configurez Formspree pour l\'envoi réel.');
					form.reset();
				}
			} catch {
				showStatus('error', 'Une erreur est survenue. Veuillez réessayer.');
			} finally {
				btn.disabled = false;
				btn.textContent = 'Envoyer le message';
			}
		});
		
		function showStatus(type, message) {
			status.className = 'form-status ' + type;
			status.textContent = message;
			status.style.display = 'block';
			
			if (type === 'success') {
				setTimeout(() => { status.style.display = 'none'; }, 5000);
			}
		}
	}
	
	// ===========================================
	// Newsletter Form
	// ===========================================
	
	const newsletter = document.querySelector('.newsletter-form');
	if (newsletter) {
		newsletter.addEventListener('submit', function(e) {
			e.preventDefault();
			alert('Merci ! Vous êtes inscrit à notre newsletter.');
			this.reset();
		});
	}
	
	// ===========================================
	// Eco Circle Animation (on scroll)
	// ===========================================
	
	const ecoCircle = document.querySelector('.eco-progress');
	if (ecoCircle) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					ecoCircle.style.animation = 'fillCircle 2s ease forwards';
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.5 });
		
		observer.observe(ecoCircle);
	}
	
	// Add CSS animation for eco circle
	const style = document.createElement('style');
	style.textContent = `
		@keyframes fillCircle {
			from { stroke-dashoffset: 565; }
			to { stroke-dashoffset: 0; }
		}
		.eco-progress {
			stroke-dashoffset: 565;
		}
	`;
	document.head.appendChild(style);
	
});
