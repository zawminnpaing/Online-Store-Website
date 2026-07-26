// 1. Mock Database (Prices are now numbers instead of strings for calculation)
const mockProducts = [
    { id: 1, category: "Outerwear", name: "Classic Trench", price: 145.00, images: ["🧥", "🧥", "🧣"] },
    { id: 2, category: "Outerwear", name: "Leather Moto", price: 210.00, images: ["🕴️", "🕴️", "🕶️"] },
    { id: 3, category: "Outerwear", name: "Tailored Blazer", price: 180.00, images: ["🥼", "🥼", "👔"] },
    { id: 4, category: "Outerwear", name: "Winter Puffer", price: 195.00, images: ["🧥", "🏂", "❄️"] },
    { id: 5, category: "Tops", name: "Silk Blouse", price: 85.00, images: ["👚", "👚", "✨"] },
    { id: 6, category: "Tops", name: "Essential T-Shirt", price: 35.00, images: ["👕", "👕", "👖"] },
    { id: 7, category: "Tops", name: "Oxford Shirt", price: 65.00, images: ["👔", "👔", "💼"] },
    { id: 8, category: "Tops", name: "Ribbed Tank", price: 40.00, images: ["🎽", "🎽", "🏃"] },
    { id: 9, category: "Bottoms", name: "High-Rise Denim", price: 90.00, images: ["👖", "👖", "👟"] },
    { id: 10, category: "Bottoms", name: "Pleated Trousers", price: 110.00, images: ["👖", "🕴️", "👞"] },
    { id: 11, category: "Bottoms", name: "Linen Shorts", price: 55.00, images: ["🩳", "🩳", "🏖️"] },
    { id: 12, category: "Bottoms", name: "Midi Slip Skirt", price: 75.00, images: ["👗", "👗", "👠"] },
    { id: 13, category: "Accessories", name: "Leather Tote", price: 150.00, images: ["👜", "👝", "💼"] },
    { id: 14, category: "Accessories", name: "Aviator Glasses", price: 120.00, images: ["🕶️", "😎", "☀️"] },
    { id: 15, category: "Accessories", name: "Cashmere Scarf", price: 85.00, images: ["🧣", "🧣", "❄️"] },
    { id: 16, category: "Accessories", name: "Canvas Bag", price: 45.00, images: ["🛍️", "🎒", "🌴"] }
];

// UI Variables
const catalogView = document.getElementById('catalog-view');
const productView = document.getElementById('product-view');
const cartView = document.getElementById('cart-view');
const mainGrid = document.getElementById('product-grid');

// Store Settings
const STORE_PHONE = "959793155856"; // Your store number with country code

// Cart State (The customer's personal temporary memory)
let shoppingCart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGrid(mockProducts, mainGrid);
});

// Render Grid
function renderGrid(productsArray, container) {
    container.innerHTML = ''; 
    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProduct(product.id);
        card.innerHTML = `
            <div class="emoji-placeholder">${product.images[0]}</div>
            <div class="product-info">
                <p class="product-brand">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Category Filter
function filterProducts(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'All') {
        renderGrid(mockProducts, mainGrid);
    } else {
        renderGrid(mockProducts.filter(p => p.category === category), mainGrid);
    }
}

// === VIEW MANAGEMENT ===
function closeAllViews() {
    productView.style.display = 'none';
    cartView.style.display = 'none';
    catalogView.style.display = 'block';
    window.scrollTo(0, 0);
}

// === PRODUCT DETAIL LOGIC ===
function openProduct(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('current-product-id').value = product.id;
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-price').innerText = `$${product.price.toFixed(2)}`;
    
    // Reset Quantity to 1
    document.getElementById('item-qty').value = 1;

    // Set Gallery
    const mainImg = document.getElementById('detail-main-img');
    const thumbContainer = document.getElementById('detail-thumbnails');
    mainImg.innerText = product.images[0];
    thumbContainer.innerHTML = '';

    product.images.forEach((emojiString, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb-box ${index === 0 ? 'active' : ''}`;
        thumb.innerText = emojiString;
        thumb.onclick = () => {
            mainImg.innerText = emojiString;
            document.querySelectorAll('.thumb-box').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbContainer.appendChild(thumb);
    });

    catalogView.style.display = 'none';
    cartView.style.display = 'none';
    productView.style.display = 'block';
    window.scrollTo(0, 0);
}

// Quantity Buttons
function changeQty(amount) {
    const qtyInput = document.getElementById('item-qty');
    let currentVal = parseInt(qtyInput.value);
    let newVal = currentVal + amount;
    if (newVal >= 1) {
        qtyInput.value = newVal;
    }
}

// === CART LOGIC ===
function addToCart() {
    const productId = parseInt(document.getElementById('current-product-id').value);
    const quantity = parseInt(document.getElementById('item-qty').value);
    const product = mockProducts.find(p => p.id === productId);

    // Check if item is already in cart
    const existingItem = shoppingCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity; // Add to existing quantity
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    updateCartBadge();
    
    // Visual Feedback
    const btn = document.querySelector('.add-to-cart-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Added! <i class="fas fa-check"></i>';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'var(--accent)';
    }, 1500);
}

function updateCartBadge() {
    // Calculate total number of items
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count-badge').innerText = totalItems;
}

function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCart(); // Refresh cart view
}

// === CHECKOUT VIEW LOGIC ===
function openCart() {
    renderCart();
    catalogView.style.display = 'none';
    productView.style.display = 'none';
    cartView.style.display = 'block';
    window.scrollTo(0, 0);
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-price');
    container.innerHTML = '';
    
    if (shoppingCart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalDisplay.innerText = '$0.00';
        return;
    }

    let grandTotal = 0;

    shoppingCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        const cartItemHTML = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} x $${item.price.toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div class="cart-item-price">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
        container.innerHTML += cartItemHTML;
    });

    totalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
}

// === MESSAGE GENERATION & DEEP LINKING ===
function processCheckout(platform) {
    // 1. Validate Form & Cart
    if (shoppingCart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !phone || !address) {
        alert("Please fill out all delivery details.");
        return;
    }

    // 2. Generate a random 4-digit Order ID
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

    // 3. Calculate total
    let grandTotal = 0;
    let itemsText = "";
    shoppingCart.forEach(item => {
        grandTotal += (item.price * item.quantity);
        itemsText += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });

    // 4. Build the message block
    const orderMessage = 
`🛍️ NEW ORDER: #${orderId}

🛒 ITEMS:
${itemsText}
💰 TOTAL: $${grandTotal.toFixed(2)}

👤 CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
Address: ${address}`;

    // 5. Encode the text so the browser can send it in a URL safely
    const encodedMessage = encodeURIComponent(orderMessage);

    // 6. Open the respective app
    if (platform === 'telegram') {
        // Opens Telegram app directly to the number with pre-filled text
        window.open(`https://t.me/+${STORE_PHONE}?text=${encodedMessage}`, '_blank');
    } else if (platform === 'viber') {
        // Opens Viber app directly (Works universally on mobile)
        window.open(`viber://chat?number=%2B${STORE_PHONE}&draft=${encodedMessage}`, '_blank');
    }
}
