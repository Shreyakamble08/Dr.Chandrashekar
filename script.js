// Main JavaScript file for Dr. Sutariya website
// Main Google Translate initialization function
function googleTranslateElementInit() {
  // Initialize desktop translate element
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,mr,hi",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element"
  );

  // Initialize mobile translate element
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,mr,hi",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element_mobile"
  );

  // Restore selected language if cookie exists
  restoreLanguageSelection();
}

// Function to restore language selection from cookie
function restoreLanguageSelection() {
  const langCookie = document.cookie.match(/googtrans=([^;]+)/);
  if (langCookie) {
    const langValue = decodeURIComponent(langCookie[1]);
    const select = document.querySelector('.goog-te-combo');
    if (select && langValue) {
      setTimeout(() => {
        select.value = langValue.split('/')[2];
      }, 500);
    }
  }
}

// Load Google Translate script dynamically
function loadGoogleTranslate() {
  // Check if already loaded
  if (!window.google || !google.translate) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  } else {
    // If already loaded, just reinitialize
    googleTranslateElementInit();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadGoogleTranslate();
  
  // Check every second for 5 seconds if translator loaded (for slower connections)
  let attempts = 0;
  const checkInterval = setInterval(() => {
    if (document.querySelector('.goog-te-combo') || attempts >= 5) {
      clearInterval(checkInterval);
    } else {
      loadGoogleTranslate();
      attempts++;
    }
  }, 1000);
});

// Reinitialize on potential page transitions
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    loadGoogleTranslate();
  }
});

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu()
  initBannerSlider()
  initSmoothScrolling()
  initFormValidation()
  initCounterAnimation()
  initLazyLoading()

  // Add loading states
  addLoadingStates()

  // Initialize tooltips
  initTooltips()

  // Add phone formatting to phone inputs
  const phoneInputs = document.querySelectorAll('input[type="tel"]')
  phoneInputs.forEach((input) => {
    input.addEventListener("input", () => formatPhoneNumber(input))
  })

  // Add click handlers for appointment buttons
  const appointmentButtons = document.querySelectorAll("[data-appointment]")
  appointmentButtons.forEach((button) => {
    button.addEventListener("click", bookAppointment)
  })
})

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden")

      if (isHidden) {
        mobileMenu.classList.remove("hidden")
        mobileMenuBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>'
        mobileMenu.style.animation = "slideDown 0.3s ease-out"
      } else {
        mobileMenu.style.animation = "slideUp 0.3s ease-out"
        setTimeout(() => {
          mobileMenu.classList.add("hidden")
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
        }, 300)
      }
    })

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll("a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden")
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
      })
    })
  }
}

// Banner Slider Functionality
function initBannerSlider() {
  const slider = document.getElementById("banner-slider")
  const dots = document.querySelectorAll(".dot")

  if (!slider || dots.length === 0) return

  let currentSlide = 0
  const totalSlides = 3

  // Auto-slide functionality
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides
    updateSlider()
  }

  function updateSlider() {
    const translateX = -currentSlide * 100
    slider.style.transform = `translateX(${translateX}%)`

    // Update dots
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active")
        dot.style.opacity = "1"
        dot.style.backgroundColor = "#B4EBE6"
      } else {
        dot.classList.remove("active")
        dot.style.opacity = "0.5"
        dot.style.backgroundColor = "white"
      }
    })
  }

  // Dot click functionality
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index
      updateSlider()
    })
  })

  // Auto-slide every 3 seconds
  setInterval(nextSlide, 3000)

  // Initialize first slide
  updateSlider()
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const formObject = {}

      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        formObject[key] = value
      }

      // Basic validation
      if (validateForm(formObject)) {
        // Show success message
        showNotification("Message sent successfully!", "success")
        form.reset()
      } else {
        showNotification("Please fill in all required fields.", "error")
      }
    })
  })
}

// Form validation helper
function validateForm(data) {
  const requiredFields = ["name", "email", "phone"]

  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === "") {
      return false
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return false
  }

  return true
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  } text-white`

  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
    notification.style.transition = "transform 0.3s ease"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Counter Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll(".counter")

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

// Counter animation helper
function animateCounter(element) {
  const target = Number.parseInt(element.textContent.replace(/\D/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Format number based on original text
    const originalText = element.textContent
    if (originalText.includes("%")) {
      element.textContent = Math.floor(current) + "%"
    } else if (originalText.includes("+")) {
      element.textContent = Math.floor(current) + "+"
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Lazy Loading for images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
}

// Loading states for buttons
function addLoadingStates() {
  const buttons = document.querySelectorAll('button[type="submit"]')

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const originalText = this.textContent
      this.innerHTML = '<span class="loading"></span> Sending...'
      this.disabled = true

      // Reset after 2 seconds (simulated)
      setTimeout(() => {
        this.textContent = originalText
        this.disabled = false
      }, 2000)
    })
  })
}

// Tooltip initialization
function initTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]")

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

// Tooltip functions
function showTooltip(e) {
  const tooltip = document.createElement("div")
  tooltip.className = "absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50"
  tooltip.textContent = e.target.dataset.tooltip
  tooltip.id = "tooltip"

  document.body.appendChild(tooltip)

  const rect = e.target.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px"
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip")
  if (tooltip) {
    document.body.removeChild(tooltip)
  }
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Add scroll to top button
window.addEventListener("scroll", () => {
  const scrollButton = document.getElementById("scroll-to-top")

  if (!scrollButton) {
    const button = document.createElement("button")
    button.id = "scroll-to-top"
    button.innerHTML = '<i class="fas fa-arrow-up"></i>'
    button.className =
      "fixed bottom-4 right-4 bg-gradient-to-r from-[#164B60] via-[#1B6B93] to-[#4FC0D0] text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 z-50"
    button.style.display = "none"
    button.onclick = scrollToTop
    document.body.appendChild(button)
  }

  const scrollButton2 = document.getElementById("scroll-to-top")
  if (window.pageYOffset > 300) {
    scrollButton2.style.display = "block"
  } else {
    scrollButton2.style.display = "none"
  }
})

// Phone number formatting
function formatPhoneNumber(input) {
  const value = input.value.replace(/\D/g, "")
  const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
  input.value = formattedValue
}

// Appointment booking functionality
function bookAppointment() {
  const phone = "02235693635"
  const message = "Hello, I would like to book an appointment with Dr. Sutariya."
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// Search functionality (if needed)
function initSearch() {
  const searchInput = document.getElementById("search-input")
  const searchResults = document.getElementById("search-results")

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase()
      // Implement search logic here
      console.log("Searching for:", query)
    })
  }
}

// Print functionality
function printPage() {
  window.print()
}

// Share functionality
function shareContent(title, url) {
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url,
    })
  } else {
    // Fallback for browsers that don't support Web Share API
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, "_blank")
  }
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // You could send this to an error tracking service
})

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now()
  console.log("Page loaded in:", loadTime, "ms")
})

// CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    .animate-slideInFromRight {
        animation: slideInFromRight 0.5s ease-in-out;
    }
`
document.head.appendChild(style)

// Initialize everything when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite)
} else {
  initializeWebsite()
}

function initializeWebsite() {
  console.log("Dr. Sutariya website initialized successfully!")
}
