// Existing code from menuport.js
const navItems = document.querySelectorAll('.nav-item');
const categoryItems = document.querySelectorAll('.category-list li');
const menuSections = document.querySelectorAll('.menu-section');
let currentCategory = 'all';
let currentDietType = 'all';

categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    categoryItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    const targetSection = document.querySelector(`.menu-section[data-category="${item.textContent.toLowerCase()}"]`);
    if(targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const filter = item.getAttribute('data-filter');
    
    if (!['veg', 'non-veg'].includes(filter)) {
      navItems.forEach(navItem => {
        const navFilter = navItem.getAttribute('data-filter');
        if (!['veg', 'non-veg'].includes(navFilter)) {
          navItem.classList.remove('active');
        }
      });
      item.classList.add('active');
      currentCategory = filter;
    } else {
      const vegFilter = document.querySelector('.veg-filter');
      const nonVegFilter = document.querySelector('.non-veg-filter');

      if (item.classList.contains('active')) {
        item.classList.remove('active');
        currentDietType = 'all';
      } else {
        vegFilter?.classList.remove('active');
        nonVegFilter?.classList.remove('active');
        item.classList.add('active');
        currentDietType = filter;
      }
    }
    
    filterItems();
  });
});

function filterItems() {
  const menuItems = document.querySelectorAll('.menu-item');
  const sectionVisibility = {};

  menuItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    const itemDietType = item.getAttribute('data-diet-type');
    const section = item.closest('.menu-section');
    const sectionCategory = section.querySelector('.section-title').textContent.toLowerCase().replace(' ', '-');
    
    const matchesCategory = currentCategory === 'all' || 
      (itemCategory && itemCategory.toLowerCase() === currentCategory.toLowerCase());
    
    const matchesDietType = currentDietType === 'all' || 
      (itemDietType && itemDietType.toLowerCase() === currentDietType.toLowerCase());
    
    if (matchesCategory && matchesDietType) {
      item.style.display = 'block';
      sectionVisibility[sectionCategory] = true;
    } else {
      item.style.display = 'none';
    }
  });

  menuSections.forEach(section => {
    const sectionTitle = section.querySelector('.section-title').textContent.toLowerCase().replace(' ', '-');
    const sectionGrid = section.querySelector('.menu-grid');
    
    const matchesCurrentCategory = currentCategory === 'all' || 
      sectionTitle.includes(currentCategory);
    
    if (sectionVisibility[sectionTitle] && matchesCurrentCategory) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}

// New code for the updated functionality
let cart = [];

// Add to Cart functionality
document.querySelectorAll('.add-to-cart').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const menuItem = event.target.closest('.menu-item');
    const itemName = menuItem.querySelector('.item-name').textContent.trim();
    const itemPrice = parseFloat(menuItem.querySelector('.item-price').textContent.replace('[₹', '').replace(']', ''));
    const itemQuantity = parseInt(menuItem.querySelector('.quantity-input').value);
    const itemSpiceLevel = menuItem.querySelector('.spice-level').value;

    const cartItem = {
      name: itemName,
      price: itemPrice,
      quantity: itemQuantity,
      spiceLevel: itemSpiceLevel
    };

    addToCart(cartItem);
    updateCartPreview();
  });
});

function updateItemQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change); // Ensure quantity doesn't go below 1
    updateCartSummary();
  }
}

// Cart Management
function addToCart(item) {
  cart.push(item);
  updateCartSummary();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartSummary();
}

function updateCartSummary() {
  const cartSummaryElement = document.querySelector('.cart-summary');
  const totalPriceElement = document.querySelector('.total-price .total-amount');
  const taxesAmountElement = document.querySelector('.taxes-and-fees .taxes-amount');
  const finalAmountElement = document.querySelector('.final-amount .final-amount');

  let totalPrice = 0;
  let taxesAmount = 0;

  cartSummaryElement.innerHTML = '';

  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <div class="cart-item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-quantity-controls">
          <button class="quantity-decrease" onclick="updateItemQuantity(${index}, -1)">-</button>
          <span class="item-quantity">${item.quantity}</span>
          <button class="quantity-increase" onclick="updateItemQuantity(${index}, 1)">+</button>
        </div>
        <div class="item-spice-level">Spice Level: ${item.spiceLevel}</div>
      </div>
      <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove-from-cart" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartSummaryElement.appendChild(itemElement);

    totalPrice += item.price * item.quantity;
  });

  taxesAmount = totalPrice * 0.08;
  const finalAmount = totalPrice + taxesAmount;

  if (totalPriceElement) totalPriceElement.textContent = totalPrice.toFixed(2);
  if (taxesAmountElement) taxesAmountElement.textContent = taxesAmount.toFixed(2);
  if (finalAmountElement) finalAmountElement.textContent = finalAmount.toFixed(2);
}


