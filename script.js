// ==========================================
// 1. DATABASE (READY FOR 11 PM GOOGLE SHEETS)
// ==========================================
// Note: I added a 'badge' property to a few items for testing.
const mockProducts = [
    { id: 1, category: "Outerwear", name: "Classic Trench", price: 145.00, images: ["🧥", "🧥", "🧣"], badge: "NEW" },
    { id: 2, category: "Outerwear", name: "Leather Moto", price: 210.00, images: ["🕴️", "🕴️", "🕶️"] },
    { id: 3, category: "Outerwear", name: "Tailored Blazer", price: 180.00, images: ["🥼", "🥼", "👔"] },
    { id: 4, category: "Outerwear", name: "Winter Puffer", price: 195.00, images: ["🧥", "🏂", "❄️"], badge: "TRENDING", badgeClass: "badge-hot" },
    { id: 5, category: "Tops", name: "Silk Blouse", price: 85.00, images: ["👚", "👚", "✨"] },
    { id: 6, category: "Tops", name: "Essential T-Shirt", price: 35.00, images: ["👕", "👕", "👖"], badge: "BEST SELLER" },
    { id: 7, category: "Tops", name: "Oxford Shirt", price: 65.00, images: ["👔", "👔", "💼"] },
    { id: 8, category: "Tops", name: "Ribbed Tank", price: 40.00, images: ["🎽", "🎽", "🏃"] },
    { id: 9, category: "Bottoms", name: "High-Rise Denim", price: 90.00, images: ["👖", "👖", "👟"] },
    { id: 10, category: "Bottoms", name: "Pleated Trousers", price: 110.00, images: ["👖", "🕴️", "👞"], badge: "LIMITED", badgeClass: "badge-hot" },
    { id: 11, category: "Bottoms", name: "Linen Shorts", price: 55.00, images: ["🩳", "🩳", "🏖️"] },
    { id: 12, category: "Bottoms", name: "Midi Slip Skirt", price: 75.00, images: ["👗", "👗", "👠"] },
    { id: 13, category: "Accessories", name: "Leather Tote", price: 150.00, images: ["👜", "👝", "💼"] },
    { id: 14, category: "Accessories", name: "Aviator Glasses", price: 120.00, images: ["🕶️", "😎", "☀️"] },
    { id: 15, category: "Accessories", name: "Cashmere Scarf", price: 85.00, images: ["🧣", "🧣", "❄️"] },
    { id: 16, category: "Accessories", name: "Canvas Bag", price: 45.00, images: ["🛍️", "🎒", "🌴"] }
];

// ==========================================
// 2. CORE STORE LOGIC
// ==========================================
const catalogView = document.getElementById('catalog-view');
const productView = document.getElementById('product-view');
const cartView = document.getElementById('cart-view');
const mainGrid = document.getElementById('product-grid');
const STORE_PHONE = "959793155856"; 
let shoppingCart = [];

document.addEventListener('DOMContentLoaded', () => {
    // We simulate an 800ms "network delay" so you can see the premium Skeleton Loaders
    simulateNetworkLoad(mockProducts, mainGrid);
    
    const newArrivals = [...mockProducts].reverse().slice(0, 4);
    simulateNetworkLoad(newArrivals, document.getElementById('new-arrivals-grid'));

    const trending = [...mockProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
    simulateNetworkLoad(trending, document.getElementById('trending-grid'));
});

// SKELETON LOADER LOGIC
function renderSkeletons(container, count = 8) {
    container.innerHTML = '';
    for(let i=0; i<count; i++) {
        container.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-box skeleton-img"></div>
                <div class="skeleton-box skeleton-text"></div>
                <div class="skeleton-box skeleton-text skeleton-title"></div>
                <div class="skeleton-box skeleton-text"></div>
            </div>
        `;
    }
}

function simulateNetworkLoad(productsArray, container) {
    renderSkeletons(container, productsArray.length > 4 ? 8 : 4);
    setTimeout(() => {
        renderGrid(productsArray, container);
    }, 800); // 800 milliseconds delay
}

// RENDERING CARDS
function renderGrid(productsArray, container) {
    container.innerHTML = ''; 
    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProduct(product.id);
        
        // Check if item has a badge
        let badgeHTML = '';
        if (product.badge) {
            const badgeClass = product.badgeClass ? product.badgeClass : '';
            badgeHTML = `<span class="product-badge ${badgeClass}">${product.badge}</span>`;
        }

        card.innerHTML = `
            ${badgeHTML}
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

// === SEARCH & FILTERS ===
function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');
    
    if(searchBar.style.display === 'flex') {
        searchBar.style.display = 'none';
        searchInput.value = '';
        document.getElementById('main-hero').style.display = 'block';
        document.getElementById('home-extra-sections').style.display = 'block';
        filterProducts('All');
    } else {
        searchBar.style.display = 'flex';
        searchInput.focus();
        window.scrollTo(0, 0);
    }
}

function searchProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    document.getElementById('main-hero').style.display = 'none';
    document.getElementById('home-extra-sections').style.display = 'none';

    const filtered = mockProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    
    if(catalogView.style.display === 'none') {
        closeAllViews(); 
        document.getElementById('main-hero').style.display = 'none';
        document.getElementById('home-extra-sections').style.display = 'none';
    }
    
    renderGrid(filtered, mainGrid);
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('main-hero').style.display = 'block';
    document.getElementById('home-extra-sections').style.display = 'block';
    
    // Using simulated load so the skeleton flashes when filtering
    simulateNetworkLoad(category === 'All' ? mockProducts : mockProducts.filter(p => p.category === category), mainGrid);
}

// === VIEW MANAGEMENT ===
function closeAllViews() {
    productView.style.display = 'none';
    cartView.style.display = 'none';
    catalogView.style.display = 'block';
    document.getElementById('main-hero').style.display = 'block';
    document.getElementById('home-extra-sections').style.display = 'block';
    window.scrollTo(0, 0);
}

// === PRODUCT DETAIL VIEW ===
function openProduct(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('current-product-id').value = product.id;
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('item-qty').value = 1;

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

    document.getElementById('related-category-name').innerText = product.category;
    renderGrid(mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4), document.getElementById('related-grid-same'));
    renderGrid(mockProducts.filter(p => p.category !== product.category).sort(() => 0.5 - Math.random()).slice(0, 4), document.getElementById('related-grid-other'));

    catalogView.style.display = 'none';
    cartView.style.display = 'none';
    productView.style.display = 'block';
    window.scrollTo(0, 0);
}

// === CART LOGIC ===
function changeQty(amount) {
    const qtyInput = document.getElementById('item-qty');
    let newVal = parseInt(qtyInput.value) + amount;
    if (newVal >= 1) qtyInput.value = newVal;
}

function addToCart() {
    const productId = parseInt(document.getElementById('current-product-id').value);
    const quantity = parseInt(document.getElementById('item-qty').value);
    const product = mockProducts.find(p => p.id === productId);
    const existingItem = shoppingCart.find(item => item.id === productId);
    
    if (existingItem) existingItem.quantity += quantity;
    else shoppingCart.push({ id: product.id, name: product.name, price: product.price, quantity: quantity });

    updateCartBadge();
    
    const btn = document.querySelector('.add-to-cart-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Added! <i class="fas fa-check"></i>';
    btn.style.background = '#4CAF50';
    setTimeout(() => { btn.innerHTML = originalText; btn.style.background = 'var(--accent)'; }, 1500);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count-badge');
    badge.innerText = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add cart bump animation
    badge.classList.remove('bump');
    void badge.offsetWidth; // Trigger DOM reflow to restart animation
    badge.classList.add('bump');
}

function openCart() {
    renderCart();
    renderGrid([...mockProducts].sort(() => 0.5 - Math.random()).slice(0, 4), document.getElementById('cart-recommended-grid'));
    catalogView.style.display = 'none';
    productView.style.display = 'none';
    cartView.style.display = 'block';
    window.scrollTo(0, 0);
}

function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCart();
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
        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} x $${item.price.toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div class="cart-item-price">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>`;
    });
    totalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
}

// === CHECKOUT / MESSAGING ===
function processCheckout(platform) {
    if (shoppingCart.length === 0) return alert("Your cart is empty!");

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !phone || !address) return alert("Please fill out all delivery details.");

    // Fire Confetti!
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#ffffff', '#717171']
    });

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    let grandTotal = 0;
    let itemsText = "";
    
    shoppingCart.forEach(item => {
        grandTotal += (item.price * item.quantity);
        itemsText += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });

    const orderMessage = `🛍️ NEW ORDER: #${orderId}\n\n🛒 ITEMS:\n${itemsText}💰 TOTAL: $${grandTotal.toFixed(2)}\n\n👤 CUSTOMER DETAILS:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}`;
    const encodedMessage = encodeURIComponent(orderMessage);

    // Wait slightly so they can see the confetti before opening the app
    setTimeout(() => {
        if (platform === 'telegram') {
            window.open(`https://t.me/+${STORE_PHONE}?text=${encodedMessage}`, '_blank');
        } else if (platform === 'viber') {
            window.open(`viber://chat?number=%2B${STORE_PHONE}&draft=${encodedMessage}`, '_blank');
        }
    }, 800);
}
