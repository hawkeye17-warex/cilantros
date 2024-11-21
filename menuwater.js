// Get all navigation items including both categories and diet type filters
const navItems = document.querySelectorAll('.nav-item');
const categoryItems = document.querySelectorAll('.category-list li');
const menuSections = document.querySelectorAll('.menu-section');
let currentCategory = 'all';
let currentDietType = 'all';

// Category selection and smooth scroll
categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        categoryItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Smooth scroll to section
        const targetSection = document.querySelector(`.menu-section[data-category="${item.textContent.toLowerCase()}"]`);
        if(targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Combined filter functionality
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const filter = item.getAttribute('data-filter');
        
        // Handle category filters
        if (!['veg', 'non-veg'].includes(filter)) {
            // Remove active from other category items
            navItems.forEach(navItem => {
                const navFilter = navItem.getAttribute('data-filter');
                if (!['veg', 'non-veg'].includes(navFilter)) {
                    navItem.classList.remove('active');
                }
            });
            item.classList.add('active');
            currentCategory = filter;
        } else {
            // Handle diet type filters
            const vegFilter = document.querySelector('.veg-filter');
            const nonVegFilter = document.querySelector('.non-veg-filter');

            // Toggle diet type filter
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                currentDietType = 'all';
            } else {
                // Remove active from other diet type filter
                vegFilter?.classList.remove('active');
                nonVegFilter?.classList.remove('active');
                item.classList.add('active');
                currentDietType = filter;
            }
        }
        
        filterItems();
    });
});

// Enhanced filterItems function that handles both category and diet type
function filterItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Track whether any items are visible in each section
    const sectionVisibility = {};

    menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemDietType = item.getAttribute('data-diet-type');
        const section = item.closest('.menu-section');
        const sectionCategory = section.querySelector('.section-title').textContent.toLowerCase().replace(' ', '-');
        
        // Check if item matches current category and diet type
        const matchesCategory = currentCategory === 'all' || 
            (itemCategory && itemCategory.toLowerCase() === currentCategory.toLowerCase());
        
        const matchesDietType = currentDietType === 'all' || 
            (itemDietType && itemDietType.toLowerCase() === currentDietType.toLowerCase());
        
        // Show or hide item based on filters
        if (matchesCategory && matchesDietType) {
            item.style.display = 'block';
            sectionVisibility[sectionCategory] = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Hide or show sections based on item visibility
    menuSections.forEach(section => {
        const sectionTitle = section.querySelector('.section-title').textContent.toLowerCase().replace(' ', '-');
        const sectionGrid = section.querySelector('.menu-grid');
        
        // Check if the section matches current category or all items are visible
        const matchesCurrentCategory = currentCategory === 'all' || 
            sectionTitle.includes(currentCategory);
        
        // Show/hide entire section if it has visible items
        if (sectionVisibility[sectionTitle] && matchesCurrentCategory) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Search functionality
function searchItems(searchTerm) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        const itemName = item.querySelector('.item-name').textContent.toLowerCase();
        const itemDescription = item.querySelector('.item-description').textContent.toLowerCase();
        
        if(itemName.includes(searchTerm.toLowerCase()) || 
           itemDescription.includes(searchTerm.toLowerCase())) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Cart functionality
function addToCart(itemName, price) {
    console.log(`Added ${itemName} to cart - Price: ${price}`);
}

// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Create hamburger menu for mobile
    const navCategories = document.querySelector('.nav-categories');
    const categoryList = document.querySelector('.category-list');
    
    // Create hamburger menu button
    const hamburgerMenu = document.createElement('div');
    hamburgerMenu.classList.add('hamburger-menu');
    hamburgerMenu.innerHTML = `<div class="hamburger-icon"></div>`;
    
    // Add hamburger menu only on mobile
    if (window.innerWidth <= 768) {
        navCategories.appendChild(hamburgerMenu);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            categoryList.classList.remove('active');
            hamburgerMenu.remove();
            categoryList.style.display = 'flex';
        } else if (!document.querySelector('.hamburger-menu')) {
            navCategories.appendChild(hamburgerMenu);
            categoryList.style.display = 'none';
        }
    });

    // Hamburger menu toggle
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        categoryList.classList.toggle('active');
        
        // Adjust display style
        if (categoryList.classList.contains('active')) {
            categoryList.style.display = 'flex';
        } else {
            categoryList.style.display = 'none';
        }
    });

    // Close menu when a category is selected
    categoryList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            hamburgerMenu.classList.remove('active');
            categoryList.classList.remove('active');
            categoryList.style.display = 'none';
        }
    });
});