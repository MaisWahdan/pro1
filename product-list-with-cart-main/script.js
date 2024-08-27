// Initialize cart array to hold items
let cart = [];

// Select all add-to-cart buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const quantityBtnsPlus = document.querySelectorAll('.quantity-btn.plus');
const quantityBtnsMinus = document.querySelectorAll('.quantity-btn.minus');

// Select cart elements
const cartElement = document.querySelector('.cart');
const cartItemsCount = cartElement.querySelector('h2');
const cartList = cartElement.querySelector('ul');
const totalPriceElement = cartElement.querySelector('.total-price');
const carbonNeutralElement = document.querySelector('.carbon-neutral');
const emptyCartMessage = document.querySelector('.empty-cart-message');
const confirmOrderBtn = document.querySelector('.confirm-order');
let totalPrice = 0;

// إخفاء العناصر عند تحميل الصفحة
totalPriceElement.style.display = 'none';
carbonNeutralElement.style.display = 'none';
emptyCartMessage.style.display = 'flex';
confirmOrderBtn.style.display = 'none';

// Function to add item to cart
function addToCart(itemName, itemPrice, quantity, imageUrl) {
    const itemInCart = cart.find(item => item.name === itemName);

    if (itemInCart) {
        itemInCart.quantity += quantity; // زيادة الكمية إذا كان العنصر موجوداً بالفعل في السلة
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1, image: imageUrl }); // إضافة عنصر جديد إلى السلة بكمية 1
    }

    displayCart(); // عرض السلة المحدثة
}

// Function to update cart items and quantity
function updateCart(itemName, itemPrice, quantity) {
    const itemInCart = cart.find(item => item.name === itemName);

    if (itemInCart) {
        itemInCart.quantity = quantity;
        if (quantity === 0) {
            cart = cart.filter(item => item.name !== itemName);
        }
    } else if (quantity > 0) {
        cart.push({ name: itemName, price: itemPrice, quantity });
    }

    displayCart();
}

// Function to display items in the cart
function displayCart() {
    cartList.innerHTML = ''; // Clear the current cart list
    let totalItems = 0; // Initialize total items count
    totalPrice = 0; // Initialize total price

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'flex'; // Show empty cart message
        totalPriceElement.style.display = 'none'; // Hide total price element
        carbonNeutralElement.style.display = 'none'; // Hide carbon-neutral element
        confirmOrderBtn.style.display = 'none'; // Hide Confirm Order button
    } else {
        emptyCartMessage.style.display = 'none'; // Hide empty cart message
        totalPriceElement.style.display = 'block'; // Show total price element
        carbonNeutralElement.style.display = 'block'; // Show carbon-neutral element
        confirmOrderBtn.style.display = 'block'; // Show Confirm Order button
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <div class="item-info">
                <p>${item.quantity}x ${item.name}</p>
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <span class="remove-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                    <path fill="#CAAFA7" d="M8.375 9.375L5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                </svg>
            </span>
        `;
        cartList.appendChild(cartItem);

        totalItems += item.quantity; // Increment total items by item quantity
        totalPrice += item.price * item.quantity; // Calculate total price

        // Event listener to decrease item quantity or remove item
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--; // Decrease the quantity by 1
            } else {
                cart.splice(index, 1); // Remove item from array if quantity is 1
            }
            displayCart(); // Update cart display
        });
    });

    cartItemsCount.textContent = `Your Cart (${totalItems})`; // Display the total number of items in the cart
    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`; // Update total price
}

// Event listeners for buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const itemElement = button.closest('.dessert-item');
        const quantityControls = itemElement.querySelector('.quantity-controls');
        const quantityElement = itemElement.querySelector('.quantity');
        const itemName = itemElement.querySelector('.dessert-name').textContent;
        const itemPrice = parseFloat(itemElement.querySelector('.dessert-price').textContent.replace('$', ''));
        const itemImage = itemElement.querySelector('.dessert-image').getAttribute('src'); // Get image URL

        quantityElement.textContent = 1; // Reset quantity to 1
        button.classList.add('hidden');  // Hide the "Add to Cart" button
        quantityControls.classList.remove('hidden');  // Show the quantity controls

        addToCart(itemName, itemPrice, 1, itemImage);
    });
});

quantityBtnsPlus.forEach(button => {
    button.addEventListener('click', () => {
        const itemElement = button.closest('.dessert-item');
        const quantityElement = itemElement.querySelector('.quantity');
        const itemName = itemElement.querySelector('.dessert-name').textContent;
        const itemPrice = parseFloat(itemElement.querySelector('.dessert-price').textContent.replace('$', ''));

        let quantity = parseInt(quantityElement.textContent);
        quantity++;
        quantityElement.textContent = quantity;

        updateCart(itemName, itemPrice, quantity);
    });
});

quantityBtnsMinus.forEach(button => {
    button.addEventListener('click', () => {
        const itemElement = button.closest('.dessert-item');
        const quantityElement = itemElement.querySelector('.quantity');
        const itemName = itemElement.querySelector('.dessert-name').textContent;
        const itemPrice = parseFloat(itemElement.querySelector('.dessert-price').textContent.replace('$', ''));

        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 0) {
            quantity--;
            quantityElement.textContent = quantity;

            if (quantity === 0) {
                const addToCartButton = itemElement.querySelector('.add-to-cart');
                addToCartButton.classList.remove('hidden');  // Show the "Add to Cart" button again
                const quantityControls = itemElement.querySelector('.quantity-controls');
                quantityControls.classList.add('hidden');  // Hide the quantity controls
            }

            updateCart(itemName, itemPrice, quantity);
        }
    });
});

// Order Confirmation Modal

const modal = document.getElementById('order-confirmation-modal');
const startNewOrderBtn = document.getElementById('start-new-order');
const orderSummaryList = document.getElementById('order-summary');
const modalTotalPrice = document.getElementById('modal-total-price');

// Function to open the modal
function openModal() {
    modal.style.display = 'flex';
    displayOrderSummary();
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Display order summary in the modal
function displayOrderSummary() {
    orderSummaryList.innerHTML = '';
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}" class="summary-image">
                <div class="summary-details">
                    <span>${item.name}</span>
                    <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                </div>
            </div>
        `;
        orderSummaryList.appendChild(listItem);
    });
    modalTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event listener to open the modal when "Confirm Order" is clicked
confirmOrderBtn.addEventListener('click', openModal);

// Function to reset everything for a new order
function resetForNewOrder() {
    cart = [];
    displayCart();
    addToCartButtons.forEach(button => {
        const itemElement = button.closest('.dessert-item');
        const quantityControls = itemElement.querySelector('.quantity-controls');
        const quantityElement = itemElement.querySelector('.quantity');

        quantityControls.classList.add('hidden');
        button.classList.remove('hidden');
        quantityElement.textContent = 1;
    });

    closeModal();
}

// Event listener to start a new order
startNewOrderBtn.addEventListener('click', resetForNewOrder);

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
