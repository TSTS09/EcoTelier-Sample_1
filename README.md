# EcoTelier - Site Web de Fabrication Métallique

Site web moderne et professionnel pour EcoTelier, spécialiste en fabrication de produits métalliques sur mesure pour les industries et les particuliers.

## 🏭 À propos d'EcoTelier

EcoTelier propose :
- **Mobilier Industriel** : Établis de rangement, tables industrielles, échelles à crinoline, mezzanines
- **Décoration Intérieure** : Guéridons, tables design, étagères et lustres au style industriel
- **Aménagement Extérieur** : Auvents, pergolas, garde-corps, mobilier de jardin

## 📁 Structure du Projet

```
ecotelier/
├── index.html          # Page principale
├── css/
│   ├── reset.css       # Reset CSS standard
│   └── styles.css      # Styles personnalisés
├── js/
│   ├── menu-focus.js   # Navigation et menu mobile
│   ├── slider-feedback.js  # Carousel des témoignages
│   └── contact-form.js # Gestion du formulaire de contact
├── images/             # Images du site (à ajouter)
└── README.md           # Ce fichier
```

## ⚙️ Configuration du Formulaire de Contact

### Option 1 : Formspree (Recommandé)

1. Créez un compte gratuit sur [Formspree](https://formspree.io)
2. Créez un nouveau formulaire
3. Copiez l'ID du formulaire (ex: `xyzabcde`)
4. Dans `index.html`, remplacez `YOUR_FORM_ID` par votre ID :
   ```html
   <form id="contact-form" action="https://formspree.io/f/VOTRE_ID_ICI" method="POST">
   ```
5. Les messages seront envoyés à votre email Formspree

### Option 2 : Autres services

- **Netlify Forms** : Si hébergé sur Netlify, ajoutez `netlify` au formulaire
- **EmailJS** : Service côté client, nécessite configuration JavaScript
- **Getform.io** : Alternative similaire à Formspree

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `css/styles.css` :

```css
:root {
    --primary-dark: #031652;    /* Bleu foncé */
    --primary-red: #f73131;     /* Rouge accent */
    --text-dark: #161616;       /* Texte sombre */
    --text-light: #f6f6f4;      /* Texte clair */
    --bg-light: #f9f9f8;        /* Fond clair */
}
```

### Informations de Contact

Modifiez dans `index.html` :
- Adresse
- Numéro de téléphone
- Email
- Liens des réseaux sociaux

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints à :
- 1200px
- 1023px (tablette)
- 767px (mobile paysage)
- 480px (mobile portrait)

## 🖼️ Images

Pour ajouter vos propres images :

1. Créez un dossier `images/`
2. Remplacez les placeholders SVG par vos images :
   - Logo : créez `images/logo.png`
   - Photos de produits
   - Photos de l'atelier
   - Photos de réalisations

## 🚀 Déploiement

### Hébergement statique

Ce site peut être hébergé sur :
- **GitHub Pages** (gratuit)
- **Netlify** (gratuit, formulaires inclus)
- **Vercel** (gratuit)
- **Firebase Hosting** (gratuit)
- Tout hébergeur web classique

### Instructions rapides pour Netlify

1. Connectez votre dépôt GitHub
2. Configurez le build :
   - Build command : (laisser vide)
   - Publish directory : `.` ou `/`
3. Le formulaire fonctionnera automatiquement avec Netlify Forms

## 📝 Modifications Courantes

### Ajouter une nouvelle section de service

1. Dupliquez un `<li>` dans `.service-list`
2. Modifiez l'icône SVG
3. Changez le titre et la description

### Ajouter un nouveau produit

1. Dupliquez un `<li>` dans `.gallery`
2. Remplacez le placeholder par une image
3. Mettez à jour le nom du produit

### Modifier les témoignages

1. Trouvez la section `.comment-block`
2. Modifiez ou ajoutez des `.main-text`
3. Le slider s'adapte automatiquement

## 🔧 Support Navigateurs

- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)
- Mobile iOS Safari
- Mobile Chrome

## 📄 Licence

Template adapté pour EcoTelier.
Design original basé sur Metal Factory Template.

---

**EcoTelier** - L'excellence métallique au service de vos projets
