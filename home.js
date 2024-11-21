/*preloader*/

window.addEventListener('load', function() {
    // Wait for the page to fully load
    setTimeout(function() {
        // Hide preloader
        const preloader = document.getElementById('preloader');
        preloader.style.display = 'none';

        // Show the main content
        const mainContent = document.getElementById('main-content');
        mainContent.style.display = 'block'; // Make content visible
    }, 1000); // 3 seconds (or adjust to your preference)
});




/*contact us*/
document.querySelectorAll('.location-panel').forEach(panel => {
    panel.addEventListener('mouseenter', () => {
        panel.style.transform = 'scale(1.05)';
    });
    panel.addEventListener('mouseleave', () => {
        panel.style.transform = 'scale(1)';
    });
});

/*top*/

// JavaScript for Back to Top Functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTopBtn');

    // Show/Hide Button based on Scroll Position
    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
            backToTopButton.classList.add('pulse');
        } else {
            backToTopButton.classList.remove('show');
            backToTopButton.classList.remove('pulse');
        }
    }

    // Smooth Scroll to Top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event Listeners
    window.addEventListener('scroll', toggleBackToTopButton);
    backToTopButton.addEventListener('click', scrollToTop);

    // Optional: Keyboard Accessibility
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            scrollToTop();
        }
    });

    // Accessibility Attributes
    backToTopButton.setAttribute('aria-label', 'Scroll to top');
    backToTopButton.setAttribute('title', 'Go to top');
    backToTopButton.tabIndex = 0;
});


/* JavaScript for Navbar Toggle on Mobile with Null Check */
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Only add event listener if elements exist
    if (hamburger && navLinks) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
});


/*hamburger*/
// Get the hamburger icon and the menu
// Get the hamburger icon and the menu
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.navbar ul');
const menuItems = document.querySelectorAll('.navbar ul li a'); // Select all menu links

// Toggle the menu visibility when the hamburger icon is clicked
hamburger.addEventListener('click', () => {
    menu.classList.toggle('hide'); // Toggle the 'show' class to display/hide the menu
});

// Close the menu when a menu item is clicked
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menu.classList.remove('show'); // Remove the 'show' class to hide the menu
    });
});


let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        let autoSlideInterval;

        function updateSlides(direction) {
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].classList.add('inactive');

            if (direction === 'next') {
                slides[currentSlide].style.transform = 'translateX(-100%)';
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].style.transform = 'translateX(0)';
            } else {
                slides[currentSlide].style.transform = 'translateX(100%)';
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                slides[currentSlide].style.transform = 'translateX(0)';
            }

            slides[currentSlide].classList.remove('inactive');
            slides[currentSlide].classList.add('active');
            resetAutoSlide();
        }

        function nextSlide() {
            updateSlides('next');
        }

        function prevSlide() {
            updateSlides('prev');
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        // Initialize auto-slide
        resetAutoSlide();

        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
        });

/*testimonial*/

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonial-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;

    function updateCarousel(index) {
        const offset = cards[index].offsetLeft;
        carousel.scrollTo({
            left: offset,
            behavior: 'smooth'
        });

        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, cards.length - 1);
        updateCarousel(currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });
});