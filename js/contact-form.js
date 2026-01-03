/**
 * EcoTelier - Contact Form Script
 * Gère la soumission du formulaire de contact
 * Utilise Formspree ou peut être adapté pour d'autres services
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit');
    
    if (!contactForm) return;
    
    // Validation en temps réel
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Validation d'un champ
    function validateField(field) {
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Supprimer l'erreur précédente
        removeError(field);
        
        // Vérifier si le champ est requis et vide
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        }
        
        // Validation spécifique par type
        if (field.value.trim()) {
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Veuillez entrer une adresse email valide';
                    }
                    break;
                    
                case 'phone':
                    const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
                    if (field.value && !phoneRegex.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Veuillez entrer un numéro de téléphone valide';
                    }
                    break;
                    
                case 'name':
                    if (field.value.length < 2) {
                        isValid = false;
                        errorMessage = 'Le nom doit contenir au moins 2 caractères';
                    }
                    break;
                    
                case 'message':
                    if (field.value.length < 10) {
                        isValid = false;
                        errorMessage = 'Le message doit contenir au moins 10 caractères';
                    }
                    break;
            }
        }
        
        if (!isValid) {
            showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    // Afficher une erreur
    function showError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#f73131';
        
        // Créer le message d'erreur s'il n'existe pas
        let errorDiv = field.parentElement.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #f73131; font-size: 13px; margin-top: 5px;';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
    
    // Supprimer une erreur
    function removeError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Valider tout le formulaire
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Soumission du formulaire
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Valider le formulaire
        if (!validateForm()) {
            showFormStatus('error', 'Veuillez corriger les erreurs dans le formulaire.');
            return;
        }
        
        // Désactiver le bouton et afficher le chargement
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Envoi en cours...</span>';
        
        // Récupérer les données du formulaire
        const formData = new FormData(contactForm);
        
        // Ajouter des métadonnées
        formData.append('_subject', 'Nouveau message depuis le site EcoTelier');
        formData.append('_replyto', formData.get('email'));
        
        try {
            // Vérifier si Formspree est configuré
            const formAction = contactForm.getAttribute('action');
            
            if (formAction && formAction.includes('formspree.io') && !formAction.includes('YOUR_FORM_ID')) {
                // Envoyer à Formspree
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showFormStatus('success', 'Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } else {
                // Mode démo - simuler l'envoi
                await simulateFormSubmission(formData);
                showFormStatus('success', 'Merci ! Votre message a été enregistré. (Mode démo - configurez Formspree pour l\'envoi réel)');
                contactForm.reset();
            }
        } catch (error) {
            console.error('Erreur:', error);
            showFormStatus('error', 'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer ou nous contacter directement par téléphone.');
        } finally {
            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Simuler l'envoi pour la démo
    function simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            console.log('📧 Formulaire soumis (mode démo):');
            console.log('Nom:', formData.get('name'));
            console.log('Email:', formData.get('email'));
            console.log('Téléphone:', formData.get('phone'));
            console.log('Sujet:', formData.get('subject'));
            console.log('Message:', formData.get('message'));
            
            // Simuler un délai réseau
            setTimeout(resolve, 1500);
        });
    }
    
    // Afficher le statut du formulaire
    function showFormStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        // Scroll vers le message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Masquer après 10 secondes pour les succès
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 10000);
        }
    }
    
    // Styles pour les erreurs (ajoutés dynamiquement)
    const errorStyles = document.createElement('style');
    errorStyles.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #f73131 !important;
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .form-status {
            padding: 15px 20px;
            border-radius: 8px;
            margin-top: 20px;
            font-weight: 500;
        }
        
        .form-status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .form-status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        #submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(errorStyles);
});

/**
 * Instructions pour configurer Formspree:
 * 
 * 1. Créez un compte gratuit sur https://formspree.io
 * 2. Créez un nouveau formulaire et copiez l'ID du formulaire
 * 3. Remplacez "YOUR_FORM_ID" dans l'attribut action du formulaire HTML par votre ID
 *    Exemple: action="https://formspree.io/f/xyzabcde"
 * 4. Les messages seront envoyés à l'email associé à votre compte Formspree
 * 
 * Alternatives à Formspree:
 * - Netlify Forms (si hébergé sur Netlify)
 * - EmailJS (envoi côté client)
 * - Getform.io
 * - Basin (bassin.io)
 */
