document.addEventListener('DOMContentLoaded', () => {
    updateCartIconCount(); // Initial update on page load
    if (document.getElementById('cartItemsContainer')) {
        displayCartItems(); // If on cart page, display items
    }
});

function getCart() {
    return JSON.parse(localStorage.getItem('gatonautasCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('gatonautasCart', JSON.stringify(cart));
    updateCartIconCount();
}

function addToCart(productId, productName, productPrice, productImage) {
    const cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
    }
    saveCart(cart);
    alert(`${productName} foi adicionado ao carrinho!`);
}

function updateCartIconCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function displayCartItems() {
    const cart = getCart();
    const container = document.getElementById('cartItemsContainer');
    const summaryContainer = document.getElementById('cartSummaryContainer');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!container) return;
    container.innerHTML = ''; // Clear current items

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio. Que tal <a href="produtos.html">adicionar alguns itens</a>?</p>';
        if (summaryContainer) summaryContainer.style.display = 'none';
        return;
    }

    if (summaryContainer) summaryContainer.style.display = 'block';
    let totalOverallPrice = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        const itemTotalPrice = item.price * item.quantity;
        totalOverallPrice += itemTotalPrice;

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <label for="qty-${item.id}" class="sr-only">Quantidade</label>
                <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                <button onclick="removeFromCart('${item.id}')">Remover</button>
            </div>
            <div class="cart-item-price">R$ ${itemTotalPrice.toFixed(2)}</div>
        `;
        container.appendChild(itemElement);
    });

    if (cartTotalElement) {
        cartTotalElement.textContent = `R$ ${totalOverallPrice.toFixed(2)}`;
    }
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);
    const newQuantity = parseInt(quantity);

    if (productIndex > -1 && newQuantity > 0) {
        cart[productIndex].quantity = newQuantity;
    } else if (productIndex > -1 && newQuantity <= 0) {
        // If quantity is 0 or less, remove item or set to 1 (here, removing)
        cart.splice(productIndex, 1);
    }
    saveCart(cart);
    displayCartItems(); // Re-render cart
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCartItems(); // Re-render cart
}

// Add a class for screen-reader only text if you don't have one
// e.g. in style.css: .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }