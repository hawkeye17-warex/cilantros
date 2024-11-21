const menuSections = ['appetizers', 'mains', 'desserts'];
        let currentPage = 0;
        
        function getItemsPerPage(section) {
            const items = document.querySelectorAll(`#${section} .menu-item`);
            const totalItems = items.length;
            const pages = Math.ceil(totalItems / 3);
            const result = [];
            
            for (let i = 0; i < pages; i++) {
                const start = i * 3;
                const end = Math.min(start + 3, totalItems);
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
                container.appendChild(item.cloneNode(true));
            });
            
            return container;
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

            // Calculate total pages including sub-pages
            let totalPages = 0;
            menuSections.forEach(section => {
                totalPages += getItemsPerPage(section).length;
            });

            // Show cover page on first view
            if (currentPage === 0) {
                pageLeft.innerHTML = `
                    <div class="cover-page">
                        <img src="gateway.jpg" alt="Restaurant Interior" class="cover-image">
                        <h1 class="restaurant-name">Cilantro's Gateway</h1>
                    </div>
                `;
            }

            // Find current section and page
            let currentSection = 0;
            let remainingPages = currentPage;
            let leftContent = null;
            let rightContent = null;

            while (currentSection < menuSections.length) {
                const sectionPages = getItemsPerPage(menuSections[currentSection]);
                if (remainingPages >= sectionPages.length) {
                    remainingPages -= sectionPages.length;
                    currentSection++;
                } else {
                    if (currentPage > 0) {
                        leftContent = createPageContent(
                            menuSections[currentSection],
                            sectionPages[remainingPages],
                            remainingPages,
                            sectionPages.length
                        );
                    }
                    
                    if (remainingPages + 1 < sectionPages.length) {
                        rightContent = createPageContent(
                            menuSections[currentSection],
                            sectionPages[remainingPages + 1],
                            remainingPages + 1,
                            sectionPages.length
                        );
                    } else if (currentSection + 1 < menuSections.length) {
                        const nextSectionPages = getItemsPerPage(menuSections[currentSection + 1]);
                        rightContent = createPageContent(
                            menuSections[currentSection + 1],
                            nextSectionPages[0],
                            0,
                            nextSectionPages.length
                        );
                    }
                    break;
                }
            }

            if (currentPage > 0 && leftContent) {
                pageLeft.appendChild(leftContent);
            }
            if (rightContent) {
                pageRight.appendChild(rightContent);
            }

            // Update navigation
            prevButton.disabled = currentPage === 0;
            nextButton.disabled = !rightContent;
            pageNumbers.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        }

        function nextPage() {
            currentPage++;
            updatePages();
        }

        function previousPage() {
            if (currentPage > 0) {
                currentPage--;
                updatePages();
            }
        }

        // Initialize the book
        updatePages();