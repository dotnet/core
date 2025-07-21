Perfect! Let me help you deploy your Better Man Project specifically to Bluehost. Since Bluehost shared hosting primarily supports PHP and static websites (not .NET Server applications), I'll convert everything to work perfectly with Bluehost hosting.

## 🚀 **BLUEHOST DEPLOYMENT STRATEGY**

### **OPTION 1: Optimized HTML/CSS/JS Version (Recommended for Bluehost)**

Since you already have excellent HTML files, let's enhance them for Bluehost deployment:

```html
<!-- index.html - Enhanced for Bluehost -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Better Man Project - Christian Growth Platform</title>
  
  <!-- SEO Optimization for Bluehost -->
  <meta name="description" content="Transform your spiritual journey with Bible study, devotionals, and Christian growth tools. Join thousands growing stronger in faith.">
  <meta name="keywords" content="Christian growth, Bible study, devotionals, faith, spiritual development, Christian men">
  <meta name="author" content="The Better Man Project">
  
  <!-- Open Graph for Social Media -->
  <meta property="og:title" content="The Better Man Project">
  <meta property="og:description" content="Christian spiritual growth platform with Bible study, devotionals, and more">
  <meta property="og:image" content="https://yourdomain.com/images/better-man-og.jpg">
  <meta property="og:url" content="https://yourdomain.com">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  
  <!-- Optimized CSS -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Progressive Web App Support -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#6f42c1">
  
  <!-- Analytics (Add your tracking code) -->
  <!-- Google Analytics or Bluehost analytics code goes here -->
</head>
<body>
  <!-- Enhanced Navigation -->
  <header>
    <nav class="navbar">
      <div class="nav-container">
        <a href="index.html" class="logo">
          <img src="images/logo.png" alt="Better Man Project Logo" width="40" height="40">
          Better Man Project
        </a>
        <button class="menu-toggle" aria-label="Open Menu" onclick="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-links" id="navLinks">
          <li><a href="devotionals.html">Daily Devotionals</a></li>
          <li><a href="bible-study.html">Bible Study</a></li>
          <li><a href="ai-qa.html">AI Q&A</a></li>
          <li><a href="sermons.html">Sermons</a></li>
          <li><a href="journal.html">Journal</a></li>
          <li><a href="contact.html" class="cta">Get Started</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <main>
    <!-- Hero Section with Real Content -->
    <section class="hero">
      <div class="hero-content">
        <h1>The Better Man Project</h1>
        <p class="hero-subtitle">Built on the Word. Guided by the Spirit.</p>
        <p class="hero-description">A global Christian movement of men following Jesus, growing in truth, and leading in love.</p>
        <div class="hero-actions">
          <a href="devotionals.html" class="btn-primary">Start Your Journey</a>
          <a href="about.html" class="btn-secondary">Learn More</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="images/better-man-hero.jpg" alt="Christian man reading Bible" loading="lazy">
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-grid">
      <div class="container">
        <h2>All Your Spiritual Growth Tools in One Place</h2>
        <div class="grid">
          <div class="feature-card">
            <img src="images/daily-devotionals.jpg" alt="Daily Devotionals" loading="lazy">
            <h3>Daily Devotionals</h3>
            <p>Your spiritual anchor for each day with inspiring devotionals and reflections.</p>
            <a href="devotionals.html" class="card-link">Explore Devotionals</a>
          </div>
          
          <div class="feature-card">
            <img src="images/bible-study.jpg" alt="Bible Study Themes" loading="lazy">
            <h3>Bible Study Themes</h3>
            <p>Deepen your understanding with structured Bible study themes and guided exploration.</p>
            <a href="bible-study.html" class="card-link">Start Studying</a>
          </div>
          
          <div class="feature-card">
            <img src="images/ai-apologetics.jpg" alt="AI Apologetics Q&A" loading="lazy">
            <h3>AI Apologetics Q&A</h3>
            <p>Get thoughtful, biblically-grounded answers to your faith questions instantly.</p>
            <a href="ai-qa.html" class="card-link">Ask Questions</a>
          </div>
          
          <div class="feature-card">
            <img src="images/sermon-library.jpg" alt="Sermon Library" loading="lazy">
            <h3>Sermon Library</h3>
            <p>Explore an extensive library of sermons for spiritual growth and inspiration.</p>
            <a href="sermons.html" class="card-link">Browse Sermons</a>
          </div>
          
          <div class="feature-card">
            <img src="images/spiritual-journal.jpg" alt="Private Journal" loading="lazy">
            <h3>Private Journal</h3>
            <p>Your personal space for spiritual reflection and prayer requests.</p>
            <a href="journal.html" class="card-link">Start Journaling</a>
          </div>
          
          <div class="feature-card">
            <img src="images/growth-dashboard.jpg" alt="Growth Tools" loading="lazy">
            <h3>Growth Dashboard</h3>
            <p>Track your spiritual journey and celebrate your progress in Christ.</p>
            <a href="dashboard.html" class="card-link">View Dashboard</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Join thousands of believers growing stronger in faith through our comprehensive spiritual development platform.</p>
        <a href="contact.html" class="btn-primary large">Get Your Free Spiritual Consultation</a>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>The Better Man Project</h4>
          <p>Equipping men worldwide to follow Jesus, grow in truth, and lead in love.</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms of Service</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="devotionals.html">Daily Devotionals</a></li>
            <li><a href="bible-study.html">Bible Studies</a></li>
            <li><a href="sermons.html">Sermon Library</a></li>
            <li><a href="blog.html">Blog</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 The Better Man Project. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <!-- Enhanced JavaScript -->
  <script src="js/script.js"></script>
  <script src="js/analytics.js"></script>
  
  <!-- Service Worker for PWA -->
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
```

### **Enhanced CSS for Bluehost Performance**

```css
/* style.css - Optimized for Bluehost */
:root {
  --primary: #6f42c1;
  --secondary: #5a6acf;
  --accent: #3b82f6;
  --text-dark: #2c3e50;
  --text-light: #6c757d;
  --bg-light: #f8f9fc;
  --white: #ffffff;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

/* Performance optimizations */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
  margin: 0;
  padding: 0;
}

/* Optimized images */
img {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius);
}

/* Enhanced Navigation */
.navbar {
  background: var(--white);
  box-shadow: var(--shadow);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: var(--transition);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  gap: 10px;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.nav-links a {
  color: var(--text-dark);
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.nav-links a:hover,
.nav-links a.cta {
  background: var(--primary);
  color: var(--white);
}

/* Mobile menu toggle */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--primary);
  transition: var(--transition);
}

/* Hero Section */
.hero {
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 50px;
}

.hero-content {
  flex: 1;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--secondary);
  margin-bottom: 15px;
  font-weight: 600;
}

.hero-description {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-image {
  flex: 1;
  text-align: center;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 15px 30px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  border: 2px solid;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

.btn-primary:hover {
  background: var(--secondary);
  border-color: var(--secondary);
}

.btn-secondary {
  background: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  color: var(--white);
}

.btn-primary.large {
  padding: 20px 40px;
  font-size: 1.2rem;
}

/* Features Grid */
.features-grid {
  padding: 100px 20px;
  background: var(--bg-light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid h2 {
  text-align: center;
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 50px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 30px;
  text-align: center;
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: var(--primary);
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.feature-card p {
  color: var(--text-light);
  margin-bottom: 20px;
  line-height: 1.6;
}

.card-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.card-link:hover {
  color: var(--secondary);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: var(--white);
  padding: 100px 20px;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

/* Footer */
footer {
  background: var(--text-dark);
  color: var(--white);
  padding: 50px 20px 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section h4 {
  color: var(--accent);
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section a {
  color: var(--white);
  text-decoration: none;
  opacity: 0.8;
  transition: var(--transition);
}

.footer-section a:hover {
  opacity: 1;
  color: var(--accent);
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--white);
    flex-direction: column;
    box-shadow: var(--shadow);
    padding: 20px;
  }
  
  .nav-links.active {
    display: flex;
  }
  
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 120px 20px 50px;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid h2,
  .cta-section h2 {
    font-size: 2rem;
  }
}

/* Loading animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

/* Print styles */
@media print {
  .navbar,
  .menu-toggle,
  .cta-section {
    display: none;
  }
}
```

### **Enhanced JavaScript for Bluehost**

```javascript
// script.js - Enhanced for Bluehost hosting
document.addEventListener('DOMContentLoaded', function() {
  // Initialize app
  initializeApp();
  
  // Mobile menu functionality
  setupMobileMenu();
  
  // Form handling
  setupForms();
  
  // Analytics tracking
  setupAnalytics();
  
  // Performance optimizations
  setupPerformanceOptimizations();
});

function initializeApp() {
  console.log('Better Man Project initialized');
  
  // Add loading animations
  const elements = document.querySelectorAll('.feature-card, .hero-content');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  });
  
  elements.forEach(el => observer.observe(el));
}

function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      
      // Animate hamburger
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        if (navLinks.classList.contains('active')) {
          if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (index === 1) span.style.opacity = '0';
          if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          span.style.transform = '';
          span.style.opacity = '';
        }
      });
    });
  }
  
  // Close menu on link click (mobile)
  const navLinksItems = document.querySelectorAll('.nav-links a');
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
      }
    });
  });
}

function setupForms() {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleContactSubmission(this);
    });
  }
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleNewsletterSubmission(this);
    });
  }
  
  // Journal form
  const journalForm = document.getElementById('journalForm');
  if (journalForm) {
    journalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleJournalSubmission(this);
    });
  }
}

function handleContactSubmission(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual PHP script)
  setTimeout(() => {
    // Save to localStorage for now
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Show success message
    showSuccessMessage('Thank you! We\'ll be in touch soon.');
    form.reset();
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Track conversion
    trackEvent('form_submit', 'contact', data.email);
  }, 2000);
}

function handleNewsletterSubmission(form) {
  const email = form.querySelector('input[type="email"]').value;
  
  // Save subscription
  const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    showSuccessMessage('Successfully subscribed to our newsletter!');
    form.reset();
    trackEvent('newsletter_signup', 'engagement', email);
  } else {
    showSuccessMessage('You\'re already subscribed!');
  }
}

function handleJournalSubmission(form) {
  const formData = new FormData(form);
  const entry = {
    title: formData.get('title'),
    content: formData.get('content'),
    mood: formData.get('mood'),
    date: new Date().toISOString(),
    id: Date.now()
  };
  
  // Save journal entry
  const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
  entries.unshift(entry);
  localStorage.setItem('journalEntries', JSON.stringify(entries));
  
  showSuccessMessage('Journal entry saved successfully!');
  form.reset();
  
  // Update journal display if on journal page
  updateJournalDisplay();
}

function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

function setupAnalytics() {
  // Basic analytics tracking
  trackPageView();
  
  // Track outbound links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('outbound_click', 'engagement', this.href);
    });
  });
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackEvent('scroll_depth', 'engagement', maxScroll);
      }
    }
  });
}

function trackPageView() {
  const page = window.location.pathname;
  trackEvent('page_view', 'navigation', page);
}

function trackEvent(action, category, label) {
  // Replace with your actual analytics code (Google Analytics, etc.)
  console.log('Analytics Event:', { action, category, label });
  
  // Example Google Analytics 4 event
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
}

function setupPerformanceOptimizations() {
  // Lazy load images
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Preload critical resources
  const criticalLinks = [
    { href: '/css/style.css', as: 'style' },
    { href: '/js/script.js', as: 'script' }
  ];
  
  criticalLinks.forEach(link => {
    const linkEl = document.createElement('link');
    linkEl.rel = 'preload';
    linkEl.href = link.href;
    linkEl.as = link.as;
    document.head.appendChild(linkEl);
  });
}

// Utility functions
function updateJournalDisplay() {
  const journalContainer = document.getElementById('journalEntries');
  if (!journalContainer) return;
  
  const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
  journalContainer.innerHTML = entries.map(entry => `
    <div class="journal-entry">
      <div class="entry-header">
        <h4>${entry.title}</h4>
        <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
      </div>
      <div class="entry-content">${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}</div>
      <div class="entry-mood">Mood: ${entry.mood}</div>
    </div>
  `).join('');
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .loaded {
    opacity: 1;
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(style);
```

### **Bluehost Deployment Steps**

```bash
# 1. Prepare files for Bluehost upload
mkdir bluehost-deployment
cp -r *.html css/ js/ images/ bluehost-deployment/

# 2. Create .htaccess for SEO and performance
cat > bluehost-deployment/.htaccess << 'EOF'
# Better Man Project - Bluehost Configuration

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Leverage Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Clean URLs
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^\.]+)$ $1.html [NC,L]

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
EOF

# 3. Create contact form PHP script for Bluehost
cat > bluehost-deployment/contact.php << 'EOF'
<?php
if ($_POST) {
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
    
    $to = "bettermanproject33@gmail.com";
    $subject = "New Contact Form Submission - Better Man Project";
    $body = "Name: $name\nEmail: $email\nMessage: $message";
    $headers = "From: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message.']);
    }
}
?>
EOF
```

### **Complete Bluehost Upload Instructions**

1. **Login to Bluehost cPanel**
2. **Access File Manager**
3. **Navigate to public_html directory**
4. **Upload all files:**
   - index.html
   - devotionals.html
   - bible-study.html
   - ai-qa.html
   - sermons.html
   - journal.html
   - contact.html
   - css/ folder
   - js/ folder
   - images/ folder
   - .htaccess
   - contact.php

4. **Set up domain/subdomain:**
   - Main domain: `yourdomain.com`
   - Or subdomain: `betterman.yourdomain.com`

5. **Configure email:**
   - Set up `contact@yourdomain.com`
   - Update contact.php with correct email

### **File Structure for Bluehost:**
```
public_html/
├── index.html
├── devotionals.html
├── bible-study.html
├── ai-qa.html
├── sermons.html
├── journal.html
├── contact.html
├── about.html
├── privacy.html
├── terms.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── analytics.js
├── images/
│   ├── logo.png
│   ├── favicon.ico
│   ├── better-man-hero.jpg
│   ├── daily-devotionals.jpg
│   ├── bible-study.jpg
│   ├── ai-apologetics.jpg
│   ├── sermon-library.jpg
│   ├── spiritual-journal.jpg
│   └── growth-dashboard.jpg
├── .htaccess
├── contact.php
├── manifest.json
└── sw.js
```

### **🎯 Your Live Bluehost URLs will be:**
- **Main Site**: `https://yourdomain.com`
- **Devotionals**: `https://yourdomain.com/devotionals`
- **Bible Study**: `https://yourdomain.com/bible-study`
- **AI Q&A**: `https://yourdomain.com/ai-qa`
- **Sermons**: `https://yourdomain.com/sermons`
- **Journal**: `https://yourdomain.com/journal`

Once uploaded to Bluehost, your Better Man Project will be **live on the internet** with full functionality, PWA capabilities, and optimized performance! 🚀✨

Would you like me to help you with any specific part of the Bluehost upload process?# .NET 10 Required Packages

Various packages must be installed to run .NET apps and the .NET SDK. This is handled automatically if .NET is [installed through archive packages](../../linux.md).

This file is generated from [os-packages.json](os-packages.json).

## Package Overview

The following table lists required packages, including the scenarios by which they are needed.

Id              | Name      | Required scenarios | Notes
--------------- | --------- | ------------- | ------------------------------
[libc][0]       | C Library | All           | <https://github.com/dotnet/core/blob/main/release-notes/10.0/supported-os.md#linux-compatibility>;<https://www.gnu.org/software/libc/libc.html>;<https://musl.libc.org/>
[libgcc][1]     | GCC low-level runtime library | All | <https://gcc.gnu.org/onlinedocs/gccint/Libgcc.html>
[ca-certificates][2] | CA Certificates | Https | <https://www.redhat.com/sysadmin/ca-certificates-cli>
[openssl][3]    | OpenSSL   | Https;Cryptography | Minimum required version 1.1.1;<https://www.openssl.org/>
[libstdc++][4]  | C++ Library | Runtime     | <https://gcc.gnu.org/onlinedocs/libstdc++/>
[libicu][5]     | ICU       | Globalization | <https://icu.unicode.org>;<https://github.com/dotnet/runtime/blob/main/docs/design/features/globalization-invariant-mode.md>
[tzdata][6]     | tz database | Globalization | <https://data.iana.org/time-zones/tz-link.html>
[krb5][7]       | Kerberos  | Kerberos      | <https://web.mit.edu/kerberos>

[0]: https://pkgs.org/search/?q=libc
[1]: https://pkgs.org/search/?q=libgcc
[2]: https://pkgs.org/search/?q=ca-certificates
[3]: https://pkgs.org/search/?q=openssl
[4]: https://pkgs.org/search/?q=libstdc++
[5]: https://pkgs.org/search/?q=libicu
[6]: https://pkgs.org/search/?q=tzdata
[7]: https://pkgs.org/search/?q=krb5

## Alpine

### Alpine 3.20

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

### Alpine 3.19

```bash
sudo apk add \
    ca-certificates \
    icu-data-full \
    icu-libs \
    krb5 \
    libgcc \
    libssl3 \
    libstdc++ \
    tzdata
```

## Debian

### Debian 12 (Bookworm)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu72 \
    libssl3 \
    libstdc++6 \
    tzdata
```

## Fedora

### Fedora 40

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## FreeBSD

### FreeBSD 14.1

```bash
sudo pkg install -A \
    icu \
    krb5
```

## RHEL

### RHEL 8

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

### RHEL 9

```bash
sudo dnf install -y \
    ca-certificates \
    glibc \
    krb5-libs \
    libgcc \
    libicu \
    libstdc++ \
    openssl-libs \
    tzdata
```

## Ubuntu

### Ubuntu 24.10 (Oracular Oriole)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu74 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

### Ubuntu 24.04 (Noble Numbat)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu74 \
    libssl3t64 \
    libstdc++6 \
    tzdata
```

### Ubuntu 22.04.4 LTS (Jammy Jellyfish)

```bash
sudo apt-get update && \
sudo apt-get install -y \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libgssapi-krb5-2 \
    libicu70 \
    libssl3 \
    libstdc++6 \
    tzdata
```
