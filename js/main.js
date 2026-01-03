/**
 * EcoTelier - Clean JavaScript
 * Simple, efficient functionality
 */

document.addEventListener('DOMContentLoaded', function() {
	
	// Mobile Navigation
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
	
	// Smooth Scroll
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
	
	// Testimonials Slider
	const testimonials = document.querySelectorAll('.testimonial');
	const dots = document.querySelectorAll('.dot');
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
	
	// Contact Form
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
	
	// Newsletter form
	const newsletter = document.querySelector('.newsletter-form');
	if (newsletter) {
		newsletter.addEventListener('submit', function(e) {
			e.preventDefault();
			alert('Merci ! Vous êtes inscrit à notre newsletter.');
			this.reset();
		});
	}
	
});
