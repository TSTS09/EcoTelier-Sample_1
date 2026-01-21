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
			const isActive = this.classList.toggle('active');
			nav.classList.toggle('active');
			document.body.style.overflow = isActive ? 'hidden' : '';
			
			// Update ARIA attributes for accessibility
			this.setAttribute('aria-expanded', isActive);
			this.setAttribute('aria-label', isActive ? 'Fermer le menu' : 'Ouvrir le menu');
		});
		
		// Close on link click
		nav.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				navToggle.classList.remove('active');
				nav.classList.remove('active');
				document.body.style.overflow = '';
				navToggle.setAttribute('aria-expanded', 'false');
				navToggle.setAttribute('aria-label', 'Ouvrir le menu');
			});
		});
		
		// Close on outside click
		document.addEventListener('click', function(e) {
			if (!e.target.closest('.nav') && !e.target.closest('.nav-toggle') && nav.classList.contains('active')) {
				navToggle.classList.remove('active');
				nav.classList.remove('active');
				document.body.style.overflow = '';
				navToggle.setAttribute('aria-expanded', 'false');
				navToggle.setAttribute('aria-label', 'Ouvrir le menu');
			}
		});
		
		// Close on Escape key
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && nav.classList.contains('active')) {
				navToggle.classList.remove('active');
				nav.classList.remove('active');
				document.body.style.overflow = '';
				navToggle.setAttribute('aria-expanded', 'false');
				navToggle.setAttribute('aria-label', 'Ouvrir le menu');
				navToggle.focus();
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
	let previousFocusElement = null;
	
	// Open lightbox
	function openLightbox(images, title, startIndex = 0) {
		currentGallery = images;
		currentTitle = title;
		currentIndex = startIndex;
		
		// Store the element that had focus before opening
		previousFocusElement = document.activeElement;
		
		lightbox.classList.add('active');
		lightbox.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		
		updateLightboxImage();
		createThumbnails();
		
		// Focus on close button for accessibility
		if (lightboxClose) lightboxClose.focus();
	}
	
	// Close lightbox
	function closeLightbox() {
		lightbox.classList.remove('active');
		lightbox.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		
		// Return focus to the element that opened the lightbox
		if (previousFocusElement) previousFocusElement.focus();
	}
	
	// Update main image
	function updateLightboxImage() {
		lightboxImage.style.opacity = '0';
		
		setTimeout(() => {
			lightboxImage.src = currentGallery[currentIndex];
			lightboxImage.alt = currentTitle + ' - Image ' + (currentIndex + 1);
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
			thumb.innerHTML = `<img src="${src}" alt="Image ${index + 1}">`;
			thumb.setAttribute('role', 'button');
			thumb.setAttribute('tabindex', '0');
			thumb.addEventListener('click', () => {
				currentIndex = index;
				updateLightboxImage();
			});
			thumb.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					currentIndex = index;
					updateLightboxImage();
				}
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
	document.querySelectorAll('.feature-card, .service-card, .product-card').forEach(el => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(30px)';
		el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(el);
	});
	
	// ===========================================
	// Image Loading Optimization (Low Connectivity)
	// ===========================================
	
	// Handle all lazy-loaded images
	document.querySelectorAll('img[loading="lazy"]').forEach(img => {
		// Mark as loaded when complete
		if (img.complete && img.naturalHeight !== 0) {
			img.classList.add('loaded');
		} else {
			img.addEventListener('load', function() {
				this.classList.add('loaded');
			});
			
			// Error handling - show fallback
			img.addEventListener('error', function() {
				this.classList.add('error');
				const parent = this.closest('.product-image');
				if (parent && !parent.querySelector('.image-error')) {
					const errorDiv = document.createElement('div');
					errorDiv.className = 'image-error';
					errorDiv.innerHTML = `
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="3" width="18" height="18" rx="2"/>
							<circle cx="8.5" cy="8.5" r="1.5"/>
							<path d="M21 15l-5-5L5 21"/>
						</svg>
						<span data-fr="Image non disponible" data-en="Image unavailable">Image non disponible</span>
					`;
					parent.appendChild(errorDiv);
					// Hide placeholder
					const placeholder = parent.querySelector('.image-placeholder');
					if (placeholder) placeholder.style.display = 'none';
				}
			});
		}
	});
	
	// Preload lightbox images when gallery is clicked (but not all at once)
	document.querySelectorAll('.product-card').forEach(card => {
		card.addEventListener('click', function() {
			const galleryData = this.querySelector('.product-gallery');
			if (galleryData) {
				try {
					const images = JSON.parse(galleryData.dataset.images);
					// Preload first 3 images only for faster lightbox open
					images.slice(0, 3).forEach(src => {
						const preloadImg = new Image();
						preloadImg.src = src;
					});
				} catch(e) {}
			}
		});
	});
	
	// Connection-aware image loading
	if ('connection' in navigator) {
		const connection = navigator.connection;
		if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
			// On slow connections, reduce image quality expectations
			document.body.classList.add('low-bandwidth');
			console.log('EcoTelier: Mode connexion lente activé');
		}
	}
	
	// ===========================================
	// Language Switcher (FR/EN)
	// ===========================================
	
	const langToggle = document.getElementById('lang-toggle');
	let currentLang = localStorage.getItem('ecotelier-lang') || 'fr';
	
	// Translation data for dynamic elements
	const translations = {
		fr: {
			heroTitle: "L'acier qui <em>préserve</em> nos forêts",
			heroText: "Mobilier en acier 100% recyclable. Préservons nos forêts ensemble.",
			seeCreations: "Voir nos créations",
			whySteel: "Pourquoi l'acier ?",
			recyclable: "Recyclable",
			lifeCycles: "Cycles de vie",
			expertise: "Ans d'expertise",
			contactTitle: "Parlons de votre projet",
			contactText: "Envie de mobilier durable et écologique ? Contactez-nous pour un devis personnalisé.",
			fullName: "Nom complet",
			email: "Email",
			subject: "Sujet",
			select: "Sélectionner...",
			quoteRequest: "Demande de devis",
			industrialFurniture: "Mobilier industriel",
			interiorDecoration: "Décoration intérieure",
			outdoorDesign: "Aménagement extérieur",
			other: "Autre",
			message: "Message",
			sendMessage: "Envoyer le message",
			ecoMessage: "Chaque projet réalisé en acier = des arbres préservés",
			portfolioTitle: "Nos réalisations",
			portfolioText: "Cliquez sur une image pour explorer la galerie",
			servicesTitle: "Ce que nous créons",
			viewGallery: "Voir la galerie",
			testimonialsTitle: "Ils nous font confiance"
		},
		en: {
			heroTitle: "Steel that <em>preserves</em> our forests",
			heroText: "100% recyclable steel furniture. Let's preserve our forests together.",
			seeCreations: "See our creations",
			whySteel: "Why steel?",
			recyclable: "Recyclable",
			lifeCycles: "Life cycles",
			expertise: "Years of expertise",
			contactTitle: "Let's talk about your project",
			contactText: "Want durable and eco-friendly furniture? Contact us for a personalized quote.",
			fullName: "Full name",
			email: "Email",
			subject: "Subject",
			select: "Select...",
			quoteRequest: "Quote request",
			industrialFurniture: "Industrial furniture",
			interiorDecoration: "Interior decoration",
			outdoorDesign: "Outdoor design",
			other: "Other",
			message: "Message",
			sendMessage: "Send message",
			ecoMessage: "Every steel project = trees preserved",
			portfolioTitle: "Our creations",
			portfolioText: "Click an image to explore the gallery",
			servicesTitle: "What we create",
			viewGallery: "View gallery",
			testimonialsTitle: "They trust us"
		}
	};
	
	function setLanguage(lang) {
		currentLang = lang;
		localStorage.setItem('ecotelier-lang', lang);
		document.documentElement.lang = lang;
		
		// Update all elements with data-fr and data-en attributes
		document.querySelectorAll('[data-fr][data-en]').forEach(el => {
			el.textContent = el.getAttribute(`data-${lang}`);
		});
		
		// Update toggle button appearance
		const langCurrent = langToggle.querySelector('.lang-current');
		const langOther = langToggle.querySelector('.lang-other');
		
		if (lang === 'fr') {
			langCurrent.textContent = 'FR';
			langOther.textContent = 'EN';
		} else {
			langCurrent.textContent = 'EN';
			langOther.textContent = 'FR';
		}
		
		// Update specific dynamic content
		const t = translations[lang];
		
		// Hero section
		const heroH1 = document.querySelector('.hero h1');
		if (heroH1) heroH1.innerHTML = t.heroTitle;
		
		const heroP = document.querySelector('.hero-content > p');
		if (heroP) heroP.textContent = t.heroText;
		
		const heroBtnPrimary = document.querySelector('.hero-actions .btn-primary span');
		if (heroBtnPrimary) heroBtnPrimary.textContent = t.seeCreations;
		
		const heroBtnGhost = document.querySelector('.hero-actions .btn-ghost');
		if (heroBtnGhost) heroBtnGhost.textContent = t.whySteel;
		
		// Hero stats
		const statSpans = document.querySelectorAll('.hero-stat span');
		if (statSpans.length >= 3) {
			statSpans[0].textContent = t.recyclable;
			statSpans[1].textContent = t.lifeCycles;
			statSpans[2].textContent = t.expertise;
		}
		
		// Contact section
		const contactH2 = document.querySelector('.contact-info h2');
		if (contactH2) contactH2.textContent = t.contactTitle;
		
		const contactP = document.querySelector('.contact-info > p');
		if (contactP) contactP.textContent = t.contactText;
		
		// Form labels
		const nameLabel = document.querySelector('label[for="name"]');
		if (nameLabel) nameLabel.textContent = t.fullName;
		
		const emailLabel = document.querySelector('label[for="email"]');
		if (emailLabel) emailLabel.textContent = t.email;
		
		const subjectLabel = document.querySelector('label[for="subject"]');
		if (subjectLabel) subjectLabel.textContent = t.subject;
		
		const messageLabel = document.querySelector('label[for="message"]');
		if (messageLabel) messageLabel.textContent = t.message;
		
		// Select options
		const selectOptions = document.querySelectorAll('#subject option');
		if (selectOptions.length >= 6) {
			selectOptions[0].textContent = t.select;
			selectOptions[1].textContent = t.quoteRequest;
			selectOptions[2].textContent = t.industrialFurniture;
			selectOptions[3].textContent = t.interiorDecoration;
			selectOptions[4].textContent = t.outdoorDesign;
			selectOptions[5].textContent = t.other;
		}
		
		// Submit button
		const submitBtn = document.querySelector('.contact-form button[type="submit"] span');
		if (submitBtn) submitBtn.textContent = t.sendMessage;
		
		// Eco badge
		const ecoBadge = document.querySelector('.contact-eco-badge p');
		if (ecoBadge) ecoBadge.textContent = t.ecoMessage;
		
		// Portfolio section
		const portfolioH2 = document.querySelector('.realisations h2');
		if (portfolioH2) portfolioH2.textContent = t.portfolioTitle;
		
		const portfolioP = document.querySelector('.realisations .section-header p');
		if (portfolioP) portfolioP.textContent = t.portfolioText;
		
		// Services section
		const servicesH2 = document.querySelector('.services h2');
		if (servicesH2) servicesH2.textContent = t.servicesTitle;
		
		// View gallery buttons
		document.querySelectorAll('.product-view').forEach(btn => {
			const span = btn.querySelector('svg');
			if (span) {
				btn.innerHTML = '';
				btn.appendChild(span);
				btn.append(' ' + t.viewGallery);
			}
		});
		
		// Testimonials
		const testimonialsH2 = document.querySelector('.testimonials h2');
		if (testimonialsH2) testimonialsH2.textContent = t.testimonialsTitle;
	}
	
	// Initialize language
	if (langToggle) {
		setLanguage(currentLang);
		
		langToggle.addEventListener('click', function() {
			const newLang = currentLang === 'fr' ? 'en' : 'fr';
			setLanguage(newLang);
		});
	}
	
});
