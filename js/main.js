/**
 * EcoTelier - Creative JavaScript
 * Custom cursor, animations, interactions
 */

document.addEventListener('DOMContentLoaded', () => {
	
	// ===========================================
	// Custom Cursor
	// ===========================================
	
	const cursor = document.querySelector('.cursor');
	const follower = document.querySelector('.cursor-follower');
	
	if (cursor && follower && window.innerWidth > 768) {
		let mouseX = 0, mouseY = 0;
		let cursorX = 0, cursorY = 0;
		let followerX = 0, followerY = 0;
		
		document.addEventListener('mousemove', (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		});
		
		function animateCursor() {
			// Cursor direct
			cursorX += (mouseX - cursorX) * 0.2;
			cursorY += (mouseY - cursorY) * 0.2;
			cursor.style.left = cursorX + 'px';
			cursor.style.top = cursorY + 'px';
			
			// Follower with delay
			followerX += (mouseX - followerX) * 0.1;
			followerY += (mouseY - followerY) * 0.1;
			follower.style.left = followerX + 'px';
			follower.style.top = followerY + 'px';
			
			requestAnimationFrame(animateCursor);
		}
		animateCursor();
		
		// Hide on leave
		document.addEventListener('mouseleave', () => {
			cursor.style.opacity = '0';
			follower.style.opacity = '0';
		});
		
		document.addEventListener('mouseenter', () => {
			cursor.style.opacity = '1';
			follower.style.opacity = '1';
		});
	}
	
	// ===========================================
	// Mobile Navigation
	// ===========================================
	
	const navToggle = document.getElementById('nav-toggle');
	const navList = document.getElementById('nav-list');
	const navLinks = document.querySelectorAll('.nav-link');
	
	if (navToggle && navList) {
		navToggle.addEventListener('click', () => {
			navToggle.classList.toggle('active');
			navList.classList.toggle('active');
			document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
		});
		
		navLinks.forEach(link => {
			link.addEventListener('click', () => {
				navToggle.classList.remove('active');
				navList.classList.remove('active');
				document.body.style.overflow = '';
			});
		});
	}
	
	// ===========================================
	// Header scroll behavior
	// ===========================================
	
	const header = document.querySelector('.header');
	let lastScroll = 0;
	let ticking = false;
	
	window.addEventListener('scroll', () => {
		if (!ticking) {
			requestAnimationFrame(() => {
				const currentScroll = window.pageYOffset;
				
				// Add scrolled class
				if (currentScroll > 50) {
					header.classList.add('scrolled');
				} else {
					header.classList.remove('scrolled');
				}
				
				// Hide/show on scroll
				if (currentScroll > lastScroll && currentScroll > 200) {
					header.classList.add('hidden');
				} else {
					header.classList.remove('hidden');
				}
				
				lastScroll = currentScroll;
				ticking = false;
			});
			ticking = true;
		}
	});
	
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
					const headerHeight = header.offsetHeight;
					const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
					window.scrollTo({
						top: targetPosition,
						behavior: 'smooth'
					});
				}
			}
		});
	});
	
	// ===========================================
	// Reveal on Scroll
	// ===========================================
	
	const revealElements = document.querySelectorAll('.section-header, .work-item, .service-item, .feature, .contact-item, .about-text, .about-features');
	
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry, index) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					entry.target.classList.add('visible');
				}, index * 50);
				revealObserver.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: '-50px'
	});
	
	revealElements.forEach(el => {
		el.classList.add('reveal');
		revealObserver.observe(el);
	});
	
	// ===========================================
	// Testimonials Slider
	// ===========================================
	
	const testimonials = [
		{
			text: '"EcoTelier a transformé notre espace avec des mezzanines parfaitement adaptées. La qualité est exceptionnelle."',
			avatar: 'KM',
			name: 'Kofi Mensah',
			role: 'Directeur d\'usine'
		},
		{
			text: '"Je recommande EcoTelier à tous mes clients. Leur mobilier industriel apporte une touche unique aux espaces."',
			avatar: 'AA',
			name: 'Ama Asante',
			role: 'Architecte d\'intérieur'
		},
		{
			text: '"Les tables et étagères ont donné à notre restaurant le caractère industriel chic que nous recherchions."',
			avatar: 'YB',
			name: 'Yaw Boateng',
			role: 'Restaurateur'
		}
	];
	
	let currentTestimonial = 0;
	const testimonialText = document.getElementById('testimonial-text');
	const authorAvatar = document.getElementById('author-avatar');
	const authorName = document.getElementById('author-name');
	const authorRole = document.getElementById('author-role');
	const progressCurrent = document.getElementById('progress-current');
	const progressBar = document.getElementById('progress-bar');
	const prevBtn = document.getElementById('prev-btn');
	const nextBtn = document.getElementById('next-btn');
	
	function updateTestimonial(index) {
		const t = testimonials[index];
		
		// Fade out
		testimonialText.style.opacity = '0';
		testimonialText.style.transform = 'translateY(10px)';
		
		setTimeout(() => {
			testimonialText.textContent = t.text;
			authorAvatar.textContent = t.avatar;
			authorName.textContent = t.name;
			authorRole.textContent = t.role;
			progressCurrent.textContent = String(index + 1).padStart(2, '0');
			progressBar.style.width = ((index + 1) / testimonials.length * 100) + '%';
			
			// Fade in
			testimonialText.style.opacity = '1';
			testimonialText.style.transform = 'translateY(0)';
		}, 300);
	}
	
	function nextTestimonial() {
		currentTestimonial = (currentTestimonial + 1) % testimonials.length;
		updateTestimonial(currentTestimonial);
	}
	
	function prevTestimonial() {
		currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
		updateTestimonial(currentTestimonial);
	}
	
	if (prevBtn && nextBtn) {
		prevBtn.addEventListener('click', prevTestimonial);
		nextBtn.addEventListener('click', nextTestimonial);
		
		// Auto-play
		let autoPlay = setInterval(nextTestimonial, 6000);
		
		const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
		if (testimonialsWrapper) {
			testimonialsWrapper.addEventListener('mouseenter', () => clearInterval(autoPlay));
			testimonialsWrapper.addEventListener('mouseleave', () => {
				autoPlay = setInterval(nextTestimonial, 6000);
			});
		}
	}
	
	// ===========================================
	// Contact Form
	// ===========================================
	
	const contactForm = document.getElementById('contact-form');
	const formStatus = document.getElementById('form-status');
	const submitBtn = document.getElementById('submit-btn');
	
	if (contactForm) {
		contactForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			
			// Basic validation
			const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
			let valid = true;
			
			inputs.forEach(input => {
				if (!input.value.trim()) {
					valid = false;
					input.style.borderColor = '#ef4444';
				} else {
					input.style.borderColor = '';
				}
			});
			
			if (!valid) {
				showStatus('error', 'Veuillez remplir tous les champs obligatoires.');
				return;
			}
			
			// Email validation
			const email = contactForm.querySelector('#email');
			if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
				email.style.borderColor = '#ef4444';
				showStatus('error', 'Veuillez entrer une adresse email valide.');
				return;
			}
			
			// Submit
			submitBtn.disabled = true;
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<span class="btn-text">Envoi...</span>';
			
			const formData = new FormData(contactForm);
			const formAction = contactForm.getAttribute('action');
			
			try {
				if (formAction && formAction.includes('formspree.io') && !formAction.includes('YOUR_FORM_ID')) {
					const response = await fetch(formAction, {
						method: 'POST',
						body: formData,
						headers: { 'Accept': 'application/json' }
					});
					
					if (response.ok) {
						showStatus('success', 'Merci ! Votre message a été envoyé.');
						contactForm.reset();
					} else {
						throw new Error('Erreur serveur');
					}
				} else {
					// Demo mode
					await new Promise(resolve => setTimeout(resolve, 1500));
					showStatus('success', 'Message enregistré (mode démo).');
					contactForm.reset();
				}
			} catch (error) {
				showStatus('error', 'Une erreur est survenue. Réessayez plus tard.');
			} finally {
				submitBtn.disabled = false;
				submitBtn.innerHTML = originalText;
			}
		});
		
		function showStatus(type, message) {
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
	// Parallax Effects
	// ===========================================
	
	if (window.innerWidth > 768) {
		const sculpture = document.querySelector('.sculpture');
		const floatTags = document.querySelectorAll('.float-tag');
		
		window.addEventListener('scroll', () => {
			const scrolled = window.pageYOffset;
			
			if (sculpture && scrolled < window.innerHeight) {
				sculpture.style.transform = `translateY(${scrolled * 0.1}px)`;
			}
			
			floatTags.forEach((tag, i) => {
				const direction = i % 2 === 0 ? 1 : -1;
				tag.style.transform = `translateY(${scrolled * 0.05 * direction}px)`;
			});
		}, { passive: true });
	}
	
	// ===========================================
	// Work Item Hover Effect
	// ===========================================
	
	const workItems = document.querySelectorAll('.work-item');
	
	workItems.forEach(item => {
		item.addEventListener('mouseenter', function() {
			this.style.zIndex = '10';
		});
		
		item.addEventListener('mouseleave', function() {
			setTimeout(() => {
				this.style.zIndex = '1';
			}, 300);
		});
	});
	
	// ===========================================
	// Marquee pause on hover
	// ===========================================
	
	const marquee = document.querySelector('.hero-marquee');
	const marqueeTrack = document.querySelector('.marquee-track');
	
	if (marquee && marqueeTrack) {
		marquee.addEventListener('mouseenter', () => {
			marqueeTrack.style.animationPlayState = 'paused';
		});
		
		marquee.addEventListener('mouseleave', () => {
			marqueeTrack.style.animationPlayState = 'running';
		});
	}
	
	// ===========================================
	// Keyboard Navigation for Testimonials
	// ===========================================
	
	document.addEventListener('keydown', (e) => {
		const section = document.querySelector('.section-testimonials');
		if (!section) return;
		
		const rect = section.getBoundingClientRect();
		const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
		
		if (isVisible) {
			if (e.key === 'ArrowLeft') prevTestimonial();
			if (e.key === 'ArrowRight') nextTestimonial();
		}
	});
	
	// ===========================================
	// Performance: Reduced motion
	// ===========================================
	
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		document.documentElement.style.setProperty('--duration', '0.01s');
		document.documentElement.style.setProperty('--duration-fast', '0.01s');
		
		// Stop marquee
		if (marqueeTrack) {
			marqueeTrack.style.animation = 'none';
		}
	}
	
	// ===========================================
	// Console Branding
	// ===========================================
	
	console.log(
		'%c E %c EcoTelier ',
		'background: #c45a3b; color: white; font-size: 24px; font-weight: bold; padding: 8px 12px; border-radius: 4px 0 0 4px;',
		'background: #1c1c1c; color: #f5f5f0; font-size: 14px; padding: 12px 16px; border-radius: 0 4px 4px 0;'
	);
	console.log('%c L\'art du métal sur mesure ', 'color: #666; font-size: 11px; font-family: monospace;');
	
});
