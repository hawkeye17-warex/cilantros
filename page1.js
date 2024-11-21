const menuSections = ['appetizers', 'mains', 'desserts'];
let currentPage = 0;
let menuMemory = {
    lastVisitedPage: 0,
    visitCounts: {},
    favorites: new Set(),
    lastVisit: null
};
function addCornerImage(pageElement, imageUrl, position) {
    const cornerDiv = document.createElement('div');
    cornerDiv.className = `corner-image ${position}`;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Decorative corner image';
    
    cornerDiv.appendChild(img);
    pageElement.appendChild(cornerDiv);
}

function loadMenuMemory() {
    const saved = localStorage.getItem('menuMemory');
    if (saved) {
        const parsed = JSON.parse(saved);
        menuMemory = {
            ...parsed,
            favorites: new Set(parsed.favorites),
            lastVisit: new Date(parsed.lastVisit)
        };
        currentPage = menuMemory.lastVisitedPage;
    }
}

function saveMenuMemory() {
    const toSave = {
        ...menuMemory,
        lastVisitedPage: currentPage,
        favorites: Array.from(menuMemory.favorites),
        lastVisit: new Date().toISOString()
    };
    localStorage.setItem('menuMemory', JSON.stringify(toSave));
}

function trackItemView(itemName) {
    menuMemory.visitCounts[itemName] = (menuMemory.visitCounts[itemName] || 0) + 1;
    saveMenuMemory();
}

function toggleFavorite(itemName) {
    if (menuMemory.favorites.has(itemName)) {
        menuMemory.favorites.delete(itemName);
    } else {
        menuMemory.favorites.add(itemName);
    }
    saveMenuMemory();
}

function getItemsPerPage(section) {
    const items = document.querySelectorAll(`#${section} .menu-item`);
    const totalItems = items.length;
    // Change to 4 items per page
    const itemsPerPage = 4;
    const pages = Math.ceil(totalItems / itemsPerPage);
    const result = [];
    
    for (let i = 0; i < pages; i++) {
        const start = i * itemsPerPage;
        const end = Math.min(start + itemsPerPage, totalItems);
        result.push(Array.from(items).slice(start, end));
    }
    
    return result;
}

function createPageContent(section, items, pageNum, totalPages) {
    const container = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = document.querySelector(`#${section} h2`).textContent;
    if (pageNum > 0) {
        title.innerHTML += ` <span class="continued-text">(Continued)</span>`;
    }
    container.appendChild(title);
    
    items.forEach(item => {
        const itemClone = item.cloneNode(true);
        const itemName = itemClone.querySelector('.menu-item-name').textContent;
        
        const favButton = document.createElement('button');
        favButton.className = 'favorite-button';
        favButton.innerHTML = menuMemory.favorites.has(itemName) ? '★' : '☆';
        favButton.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(itemName);
            favButton.innerHTML = menuMemory.favorites.has(itemName) ? '★' : '☆';
        };
        
        itemClone.querySelector('.menu-item-header').appendChild(favButton);
        trackItemView(itemName);
        container.appendChild(itemClone);
    });
    
    return container;
}

// Example of adding different images to different pages
function decoratePage(pageElement, pageNumber) {
    switch(pageNumber) {
        //individual
        case 1:
            addCornerImage(pageElement, 'entry.jpg', 'top-left');
            break;
        case 2:
            addCornerImage(pageElement, 'entry.jpg', 'top-right');
            break;
        case 3:
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            break;
        case 4:
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            break;

        //combo of 2 
        case 5:
            addCornerImage(pageElement, 'images/plate.png', 'top-left');
            addCornerImage(pageElement, 'images/plate.png', 'top-right');
            break;
        case 6:
            addCornerImage(pageElement, 'images/plate.png', 'top-left');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            break;
        case 7:
            addCornerImage(pageElement, 'images/plate.png', 'top-left');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            break;
        case 8:
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            addCornerImage(pageElement, 'images/plate.png', 'top-right');
            break;
        case 9:
            addCornerImage(pageElement, 'images/plate.png', 'top-right');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            break;
        case 10:
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            break;

        //3 side image
        case 11:
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            addCornerImage(pageElement, 'images/plate.png', 'top-left');
            addCornerImage(pageElement, 'images/plate.png', 'top-right');
            break;
        case 12:
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            addCornerImage(pageElement, 'images/plate.png', 'top-left');
            addCornerImage(pageElement, 'images/plate.png', 'top-right');
            break;
        case 13:
            addCornerImage(pageElement, 'images/plate.png', 'top-left');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            break;
        case 14:
            addCornerImage(pageElement, 'images/plate.png', 'top-right');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-left');
            addCornerImage(pageElement, 'images/plate.png', 'bottom-right');
            break;
        // Add more cases as needed
    }
}

function updatePages() {
    const pageLeft = document.getElementById('pageLeft');
    const pageRight = document.getElementById('pageRight');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageNumbers = document.getElementById('pageNumbers');

    // Clear pages
    pageLeft.innerHTML = '';
    pageRight.innerHTML = '';

    // Calculate total pages
    let totalPages = 1; // Start at 1 for cover page
    menuSections.forEach(section => {
        const sectionPages = getItemsPerPage(section);
        totalPages += Math.ceil(sectionPages.length / 2); // Two pages per spread
    });

    // Show cover page on first view
    if (currentPage === 0) {
        pageLeft.innerHTML = `
            <div class="cover-page">
                <img src="inside.jpg" alt="Restaurant Interior" class="cover-image">
                <h1 class="restaurant-name">Cilantro's Portage</h1>
            </div>
        `;
        
        // Show first section on right page
        const firstSectionPages = getItemsPerPage(menuSections[0]);
        if (firstSectionPages.length > 0) {
            rightContent = createPageContent(
                menuSections[0],
                firstSectionPages[0],
                0,
                firstSectionPages.length
            );
            pageRight.appendChild(rightContent);
            decoratePage(pageRight, 2);
        }
    } else {
        // Find current section and page
        let currentSection = 0;
        let remainingPages = currentPage - 1; // Subtract 1 for cover page
        let leftContent = null;
        let rightContent = null;

        while (currentSection < menuSections.length) {
            const sectionPages = getItemsPerPage(menuSections[currentSection]);
            
            if (remainingPages < sectionPages.length) {
                // Create left page content
                leftContent = createPageContent(
                    menuSections[currentSection],
                    sectionPages[remainingPages],
                    remainingPages,
                    sectionPages.length
                );
                
                // Create right page content if available
                if (remainingPages + 1 < sectionPages.length) {
                    rightContent = createPageContent(
                        menuSections[currentSection],
                        sectionPages[remainingPages + 1],
                        remainingPages + 1,
                        sectionPages.length
                    );
                } else if (currentSection + 1 < menuSections.length) {
                    // Move to next section for right page
                    const nextSectionPages = getItemsPerPage(menuSections[currentSection + 1]);
                    if (nextSectionPages.length > 0) {
                        rightContent = createPageContent(
                            menuSections[currentSection + 1],
                            nextSectionPages[0],
                            0,
                            nextSectionPages.length
                        );
                    }
                }
                break;
            } else {
                remainingPages -= sectionPages.length;
                currentSection++;
            }
        }

        if (leftContent) pageLeft.appendChild(leftContent);
        if (rightContent) pageRight.appendChild(rightContent);
    }

    // Update navigation
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage >= totalPages - 1;
    pageNumbers.textContent = `Page ${currentPage + 1} of ${totalPages}`;

    
}

function turnPage(direction) {
    const pageLeft = document.getElementById('pageLeft');
    const pageRight = document.getElementById('pageRight');
    
    // Prevent multiple turns at once
    if (pageLeft.classList.contains('turning') || pageRight.classList.contains('turning')) {
        return;
    }
    
    // Add turning class based on direction
    if (direction === 'next') {
        pageRight.classList.add('turning');
        pageRight.style.zIndex = '2';
        pageLeft.style.zIndex = '1';
    } else {
        pageLeft.classList.add('turning');
        pageLeft.style.zIndex = '2';
        pageRight.style.zIndex = '1';
    }
    
    // Update content during animation
    setTimeout(() => {
        updatePages();
        
        // Remove turning classes after content update
        setTimeout(() => {
            pageLeft.classList.remove('turning');
            pageRight.classList.remove('turning');
            pageLeft.style.zIndex = '';
            pageRight.style.zIndex = '';
        }, 50);
    }, 400);
}

function nextPage() {
    currentPage++;
    updatePages();
    saveMenuMemory();
    turnPage('next');
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
      updatePages();
      saveMenuMemory();
      turnPage('prev');
    }
  }
// Function to check if device is mobile
function isMobileDevice() {
    return (window.innerWidth <= 768);
}

// Function to handle touch events for mobile devices
function initializeTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.querySelector('.book').addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.querySelector('.book').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left - go to next page
                if (!document.getElementById('nextButton').disabled) {
                    nextPage();
                }
            } else {
                // Swipe right - go to previous page
                if (!document.getElementById('prevButton').disabled) {
                    previousPage();
                }
            }
        }
    }
}

// Function to adjust items per page based on screen size
function getResponsiveItemsPerPage() {
    if (window.innerWidth <= 480) {
        return 2; // Show 2 items per page on very small devices
    } else if (window.innerWidth <= 768) {
        return 3; // Show 3 items per page on tablets
    }
    return 4; // Default 4 items per page on larger screens
}

// Modify your existing getItemsPerPage function to use responsive values
function getItemsPerPage(section) {
    const items = document.querySelectorAll(`#${section} .menu-item`);
    const totalItems = items.length;
    const itemsPerPage = getResponsiveItemsPerPage();
    const pages = Math.ceil(totalItems / itemsPerPage);
    const result = [];
    
    for (let i = 0; i < pages; i++) {
        const start = i * itemsPerPage;
        const end = Math.min(start + itemsPerPage, totalItems);
        result.push(Array.from(items).slice(start, end));
    }
    
    return result;
}

// Add resize handler for responsive updates
let resizeTimeout;
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updatePages();
    }, 250);
});

// Modify your DOMContentLoaded event listener to include the new initializations
document.addEventListener('DOMContentLoaded', () => {
    loadMenuMemory();
    updatePages();
    initializeTouchEvents(); // Initialize touch events for mobile
    
    // Add orientation change handler
    window.addEventListener('orientationchange', () => {
        setTimeout(updatePages, 100); // Small delay to ensure proper rendering
    });
});