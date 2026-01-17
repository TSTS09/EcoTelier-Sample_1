/**
 * EcoTelier - Interactive JavaScript
 * Lightbox Gallery, Testimonials & Smooth Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
	
	// ===========================================
	// Mobile Navigation
	// ===========================================
	
	const navToggle = document.getElementById('nav-toggle');
	const nav = document.getElementById('nav');
	
	if (navToggle && nav) {
		navToggle.addEventListener('click', function() {
			this.classList.toggle('active');
			nav.classList.toggle('active');
			document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
		});
		
		// Close on link click
		nav.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				navToggle.classList.remove('active');
				nav.classList.remove('active');
				document.body.style.overflow = '';
			});
		});
		
		// Close on outside click
		document.addEventListener('click', function(e) {
			if (!e.target.closest('.nav') && !e.target.closest('.nav-toggle') && nav.classList.contains('active')) {
				navToggle.classList.remove('active');
				nav.classList.remove('active');
				document.body.style.overflow = '';
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
					const offset = 80;
					const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
					window.scrollTo({ top: position, behavior: 'smooth' });
				}
			}
		});
	});
	
	// ===========================================
	// Lightbox Gallery
	// ===========================================
	
	const lightbox = document.getElementById('lightbox');
	const lightboxImage = document.getElementById('lightbox-image');
	const lightboxTitle = document.getElementById('lightbox-title');
	const lightboxCounter = document.getElementById('lightbox-counter');
	const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
	const lightboxClose = document.getElementById('lightbox-close');
	const lightboxPrev = document.getElementById('lightbox-prev');
	const lightboxNext = document.getElementById('lightbox-next');
	const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
	
	let currentGallery = [];
	let currentIndex = 0;
	let currentTitle = '';
	
	// Open lightbox
	function openLightbox(images, title, startIndex = 0) {
		currentGallery = images;
		currentTitle = title;
		currentIndex = startIndex;
		
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden';
		
		updateLightboxImage();
		createThumbnails();
	}
	
	// Close lightbox
	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
	}
	
	// Update main image
	function updateLightboxImage() {
		lightboxImage.style.opacity = '0';
		
		setTimeout(() => {
			lightboxImage.src = currentGallery[currentIndex];
			lightboxImage.alt = currentTitle;
			lightboxTitle.textContent = currentTitle;
			lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
			lightboxImage.style.opacity = '1';
			lightboxImage.style.animation = 'zoomIn 0.3s ease';
			
			// Update active thumbnail
			document.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
				thumb.classList.toggle('active', i === currentIndex);
			});
		}, 150);
	}
	
	// Create thumbnails
	function createThumbnails() {
		lightboxThumbnails.innerHTML = '';
		
		currentGallery.forEach((src, index) => {
			const thumb = document.createElement('div');
			thumb.className = 'lightbox-thumb' + (index === currentIndex ? ' active' : '');
			thumb.innerHTML = `<img src="${src}" alt="">`;
			thumb.addEventListener('click', () => {
				currentIndex = index;
				updateLightboxImage();
			});
			lightboxThumbnails.appendChild(thumb);
		});
	}
	
	// Navigate
	function nextImage() {
		currentIndex = (currentIndex + 1) % currentGallery.length;
		updateLightboxImage();
	}
	
	function prevImage() {
		currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
		updateLightboxImage();
	}
	
	// Event listeners
	if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
	if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
	if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
	if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
	
	// Keyboard navigation
	document.addEventListener('keydown', function(e) {
		if (!lightbox.classList.contains('active')) return;
		
		switch(e.key) {
			case 'Escape':
				closeLightbox();
				break;
			case 'ArrowLeft':
				prevImage();
				break;
			case 'ArrowRight':
				nextImage();
				break;
		}
	});
	
	// Touch/Swipe support for lightbox
	let touchStartX = 0;
	let touchEndX = 0;
	
	lightbox.addEventListener('touchstart', function(e) {
		touchStartX = e.changedTouches[0].screenX;
	}, { passive: true });
	
	lightbox.addEventListener('touchend', function(e) {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}, { passive: true });
	
	function handleSwipe() {
		const diff = touchStartX - touchEndX;
		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				nextImage();
			} else {
				prevImage();
			}
		}
	}
	
	// Product cards click handler
	document.querySelectorAll('.product-card').forEach(card => {
		card.addEventListener('click', function() {
			const galleryData = this.querySelector('.product-gallery');
			const title = this.querySelector('h4').textContent;
			
			if (galleryData) {
				try {
					const images = JSON.parse(galleryData.dataset.images);
					openLightbox(images, title);
				} catch (e) {
					// Fallback to single image
					const img = this.querySelector('.product-image img');
					if (img) {
						openLightbox([img.src], title);
					}
				}
			}
		});
	});
	
	// ===========================================
	// Testimonials Slider
	// ===========================================
	
	const testimonials = document.querySelectorAll('.testimonial');
	const prevBtn = document.getElementById('prev-testimonial');
	const nextBtn = document.getElementById('next-testimonial');
	const dotsContainer = document.getElementById('testimonials-dots');
	
	if (testimonials.length > 0) {
		let currentTestimonial = 0;
		let autoPlayInterval;
		
		// Create dots
		testimonials.forEach((_, index) => {
			const dot = document.createElement('button');
			dot.className = index === 0 ? 'active' : '';
			dot.addEventListener('click', () => showTestimonial(index));
			dotsContainer.appendChild(dot);
		});
		
		const dots = dotsContainer.querySelectorAll('button');
		
		function showTestimonial(index) {
			testimonials.forEach(t => t.classList.remove('active'));
			dots.forEach(d => d.classList.remove('active'));
			
			testimonials[index].classList.add('active');
			dots[index].classList.add('active');
			currentTestimonial = index;
		}
		
		function next() {
			showTestimonial((currentTestimonial + 1) % testimonials.length);
		}
		
		function prev() {
			showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
		}
		
		if (nextBtn) nextBtn.addEventListener('click', next);
		if (prevBtn) prevBtn.addEventListener('click', prev);
		
		// Auto-play
		function startAutoPlay() {
			autoPlayInterval = setInterval(next, 5000);
		}
		
		function stopAutoPlay() {
			clearInterval(autoPlayInterval);
		}
		
		startAutoPlay();
		
		const slider = document.getElementById('testimonials-slider');
		if (slider) {
			slider.addEventListener('mouseenter', stopAutoPlay);
			slider.addEventListener('mouseleave', startAutoPlay);
		}
	}
	
	// ===========================================
	// Contact Form
	// ===========================================
	
	const form = document.getElementById('contact-form');
	const formStatus = document.getElementById('form-status');
	
	if (form) {
		form.addEventListener('submit', async function(e) {
			e.preventDefault();
			
			// Validate
			const required = form.querySelectorAll('[required]');
			let valid = true;
			
			required.forEach(field => {
				if (!field.value.trim()) {
					valid = false;
					field.style.borderColor = '#b85c38';
				} else {
					field.style.borderColor = '';
				}
			});
			
			if (!valid) {
				showFormStatus('error', 'Veuillez remplir tous les champs obligatoires.');
				return;
			}
			
			// Email validation
			const email = form.querySelector('#email');
			if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
				email.style.borderColor = '#b85c38';
				showFormStatus('error', 'Veuillez entrer une adresse email valide.');
				return;
			}
			
			const btn = form.querySelector('button[type="submit"]');
			const btnText = btn.querySelector('span');
			const originalText = btnText.textContent;
			btn.disabled = true;
			btnText.textContent = 'Envoi en cours...';
			
			const action = form.getAttribute('action');
			
			try {
				if (action && action.includes('formspree') && !action.includes('YOUR_FORM_ID')) {
					const response = await fetch(action, {
						method: 'POST',
						body: new FormData(form),
						headers: { 'Accept': 'application/json' }
					});
					
					if (response.ok) {
						showFormStatus('success', 'Merci ! Votre message a été envoyé avec succès.');
						form.reset();
					} else {
						throw new Error();
					}
				} else {
					// Demo mode
					await new Promise(r => setTimeout(r, 1500));
					showFormStatus('success', 'Message enregistré (mode démo). Configurez Formspree pour l\'envoi réel.');
					form.reset();
				}
			} catch (err) {
				showFormStatus('error', 'Une erreur est survenue. Veuillez réessayer.');
			} finally {
				btn.disabled = false;
				btnText.textContent = originalText;
			}
		});
		
		function showFormStatus(type, message) {
			formStatus.className = 'form-status ' + type;
			formStatus.textContent = message;
			formStatus.style.display = 'block';
			
			if (type === 'success') {
				setTimeout(() => {
					formStatus.style.display = 'none';
				}, 5000);
			}
		}
	}
	
	// ===========================================
	// Header scroll effect
	// ===========================================
	
	const header = document.querySelector('.header');
	let lastScroll = 0;
	
	window.addEventListener('scroll', function() {
		const currentScroll = window.pageYOffset;
		
		if (currentScroll > 100) {
			header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
		} else {
			header.style.boxShadow = 'none';
		}
		
		lastScroll = currentScroll;
	});
	
	// ===========================================
	// Intersection Observer for animations
	// ===========================================
	
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '-50px'
	};
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);
	
	// Animate elements on scroll
	document.querySelectorAll('.reason, .service-card, .product-card').forEach(el => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(30px)';
		el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(el);
	});
	
});
