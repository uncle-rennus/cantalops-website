// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Set initial state of checkbox
  if (themeToggle) {
    themeToggle.checked = currentTheme === 'dark';
  }
  
  // Theme toggle event listener
  themeToggle?.addEventListener('change', function() {
    const newTheme = this.checked ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Mobile menu toggle
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  
  navbarToggle?.addEventListener('click', function() {
    navbarMenu?.classList.toggle('active');
    
    // Toggle hamburger animation
    const spans = navbarToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
      if (navbarMenu?.classList.contains('active')) {
        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        span.style.transform = '';
        span.style.opacity = '';
      }
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!navbarToggle?.contains(event.target) && !navbarMenu?.contains(event.target)) {
      navbarMenu?.classList.remove('active');
      
      // Reset hamburger animation
      const spans = navbarToggle?.querySelectorAll('span');
      spans?.forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
      });
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add scroll effect to header
  let lastScrollTop = 0;
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header?.classList.add('header-hidden');
    } else {
      // Scrolling up
      header?.classList.remove('header-hidden');
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.service-card, .blog-card, .case-study-card').forEach(el => {
    observer.observe(el);
  });
  
  // Form validation (if contact forms are present)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });
  });
});

// Add CSS for header scroll effect
const style = document.createElement('style');
style.textContent = `
  .site-header {
    transition: transform 0.3s ease-in-out;
  }
  
  .header-hidden {
    transform: translateY(-100%);
  }
  
  .error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
  }
`;
document.head.appendChild(style);


// Performance Optimizations and Advanced Features

// Lazy loading for images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Preload critical resources
function preloadCriticalResources() {
  const criticalResources = [
    '/css/main.css',
    '/images/cantalops_logo.svg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'font';
    if (resource.includes('fonts.googleapis.com')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

// Service Worker registration for offline support
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Web Vitals monitoring
function initWebVitals() {
  // Core Web Vitals tracking
  function sendToAnalytics(metric) {
    // Replace with your analytics endpoint
    console.log('Web Vital:', metric);
  }

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const po = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        sendToAnalytics({
          name: 'LCP',
          value: lastEntry.startTime,
          id: 'lcp'
        });
      });
      po.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP measurement not supported');
    }
  }

  // First Input Delay
  if ('PerformanceObserver' in window) {
    try {
      const po = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        sendToAnalytics({
          name: 'FID',
          value: firstInput.processingStart - firstInput.startTime,
          id: 'fid'
        });
      });
      po.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID measurement not supported');
    }
  }

  // Cumulative Layout Shift
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      const po = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        sendToAnalytics({
          name: 'CLS',
          value: clsValue,
          id: 'cls'
        });
      });
      po.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS measurement not supported');
    }
  }
}

// Advanced form handling with HubSpot integration
function initAdvancedForms() {
  // HubSpot form loading with error handling
  function loadHubSpotForm(portalId, formId, targetId) {
    if (window.hbspt) {
      window.hbspt.forms.create({
        portalId: portalId,
        formId: formId,
        target: `#${targetId}`,
        onFormReady: function() {
          document.getElementById('form-loading').style.display = 'none';
        },
        onFormSubmit: function() {
          // Track form submission
          if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
              event_category: 'engagement',
              event_label: 'contact_form'
            });
          }
        }
      });
    } else {
      // Fallback form display
      document.getElementById('fallback-form').style.display = 'block';
      document.getElementById('form-loading').style.display = 'none';
    }
  }

  // Load HubSpot script
  const script = document.createElement('script');
  script.src = '//js.hsforms.net/forms/v2.js';
  script.onload = function() {
    // Replace with actual HubSpot portal and form IDs
    loadHubSpotForm('YOUR_PORTAL_ID', 'YOUR_FORM_ID', 'hubspot-form');
  };
  script.onerror = function() {
    // Show fallback form if HubSpot fails to load
    document.getElementById('fallback-form').style.display = 'block';
    document.getElementById('form-loading').style.display = 'none';
  };
  document.head.appendChild(script);
}

// Advanced scroll animations with performance optimization
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Unobserve after animation to improve performance
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    animatedElements.forEach(el => {
      el.classList.add('animated');
    });
  }
}

// Network status monitoring
function initNetworkMonitoring() {
  function updateOnlineStatus() {
    const offlineIndicator = document.querySelector('.offline-indicator');
    if (navigator.onLine) {
      offlineIndicator?.classList.remove('show');
    } else {
      offlineIndicator?.classList.add('show');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
}

// Advanced analytics tracking
function initAnalytics() {
  // Track scroll depth
  let maxScroll = 0;
  const trackScrollDepth = () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: `${scrollPercent}%`,
          value: scrollPercent
        });
      }
    }
  };

  // Throttled scroll tracking
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(trackScrollDepth, 100);
  });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'time_on_page', {
        event_category: 'engagement',
        value: timeOnPage
      });
    }
  });

  // Track CTA clicks
  document.querySelectorAll('.btn-primary, .cta-button').forEach(button => {
    button.addEventListener('click', (e) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          event_category: 'engagement',
          event_label: e.target.textContent.trim()
        });
      }
    });
  });
}

// Initialize all performance features
document.addEventListener('DOMContentLoaded', function() {
  // Core performance optimizations
  initLazyLoading();
  preloadCriticalResources();
  initWebVitals();
  
  // Advanced features
  initScrollAnimations();
  initNetworkMonitoring();
  initAnalytics();
  
  // Service worker (uncomment when sw.js is created)
  // registerServiceWorker();
  
  // HubSpot forms (uncomment when portal/form IDs are configured)
  // initAdvancedForms();
});

// Performance monitoring
window.addEventListener('load', () => {
  // Log performance metrics
  setTimeout(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Performance:', {
      'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
      'TCP Connection': perfData.connectEnd - perfData.connectStart,
      'Request': perfData.responseStart - perfData.requestStart,
      'Response': perfData.responseEnd - perfData.responseStart,
      'DOM Processing': perfData.domContentLoadedEventStart - perfData.responseEnd,
      'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
    });
  }, 0);
});

