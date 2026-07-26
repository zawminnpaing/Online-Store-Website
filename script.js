// 1. Mock Database (Now with 3 "angles" per product)
const mockProducts = [
    // Outerwear
    { id: 1, category: "Outerwear", name: "Classic Trench", price: "$145.00", images: ["🧥", "🧥", "🧣"] },
    { id: 2, category: "Outerwear", name: "Leather Moto", price: "$210.00", images: ["🕴️", "🕴️", "🕶️"] },
    { id: 3, category: "Outerwear", name: "Tailored Blazer", price: "$180.00", images: ["🥼", "🥼", "👔"] },
    { id: 4, category: "Outerwear", name: "Winter Puffer", price: "$195.00", images: ["🧥", "🏂", "❄️"] },
    
    // Tops
    { id: 5, category: "Tops", name: "Silk Blouse", price: "$85.00", images: ["👚", "👚", "✨"] },
    { id: 6, category: "Tops", name: "Essential T-Shirt", price: "$35.00", images: ["👕", "👕", "👖"] },
    { id: 7, category: "Tops", name: "Oxford Shirt", price: "$65.00", images: ["👔", "👔", "💼"] },
    { id: 8, category: "Tops", name: "Ribbed Tank", price: "$40.00", images: ["🎽", "🎽", "🏃"] },
    
    // Bottoms
    { id: 9, category: "Bottoms", name: "High-Rise Denim", price: "$90.00", images: ["👖", "👖", "👟"] },
    { id: 10, category: "Bottoms", name: "Pleated Trousers", price: "$110.00", images: ["👖", "🕴️", "👞"] },
    { id: 11, category: "Bottoms", name: "Linen Shorts", price: "$55.00", images: ["🩳", "🩳", "🏖️"] },
    { id: 12, category: "Bottoms", name: "Midi Slip Skirt", price: "$75.00", images: ["👗", "👗", "👠"] },
    
    // Accessories
    { id: 13, category: "Accessories", name: "Leather Tote", price: "$150.00", images: ["👜", "👝", "💼"] },
    { id: 14, category: "Accessories", name: "Aviator Glasses", price: "$120.00", images: ["🕶️", "😎", "☀️"] },
    { id: 15, category: "Accessories", name: "Cashmere Scarf", price: "$85.00", images: ["🧣", "🧣", "❄️"] },
    { id: 16, category: "Accessories", name: "Canvas Bag", price: "$45.00", images: ["🛍️", "🎒", "🌴"] }
];

// UI Elements
const catalogView = document.getElementById('catalog-view');
const productView = document.getElementById('product-view');
const mainGrid = document.getElementById('product-grid');
let cartCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGrid(mockProducts, mainGrid);
});

// Render Product Cards into any given grid container
function renderGrid(productsArray, container) {
    container.innerHTML = ''; 
    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // Clicking a card opens the product detail view
        card.onclick = () => openProduct(product.id);
        
        card.innerHTML = `
            <div class="emoji-placeholder">
                ${product.images[0]}
            </div>
            <div class="product-info">
                <p class="product-brand">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Main Catalog Filter Logic
function filterProducts(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'All') {
        renderGrid(mockProducts, mainGrid);
    } else {
        const filtered = mockProducts.filter(p => p.category === category);
        renderGrid(filtered, mainGrid);
    }
}

// === PRODUCT DETAIL LOGIC ===

function openProduct(productId) {
    // Find the specific product
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    // Populate Data
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-price').innerText = product.price;
    
    // Set up Gallery
    const mainImg = document.getElementById('detail-main-img');
    const thumbContainer = document.getElementById('detail-thumbnails');
    
    mainImg.innerText = product.images[0];
    thumbContainer.innerHTML = ''; // Clear old thumbs

    product.images.forEach((emojiString, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb-box ${index === 0 ? 'active' : ''}`;
        thumb.innerText = emojiString;
        
        thumb.onclick = () => {
            mainImg.innerText = emojiString;
            // Manage active border
            document.querySelectorAll('.thumb-box').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbContainer.appendChild(thumb);
    });

    // Populate Related Sections
    document.getElementById('related-category-name').innerText = product.category;
    
    // 1. Same Category (exclude current item, show max 4)
    const sameCategory = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    renderGrid(sameCategory, document.getElementById('related-grid-same'));

    // 2. Different Category (random 4 items from other categories)
    const otherCategories = mockProducts.filter(p => p.category !== product.category).sort(() => 0.5 - Math.random()).slice(0, 4);
    renderGrid(otherCategories, document.getElementById('related-grid-other'));

    // Swap Views
    catalogView.style.display = 'none';
    window.scrollTo(0, 0); // Scroll to top
    productView.style.display = 'block';
}

function closeProduct() {
    productView.style.display = 'none';
    catalogView.style.display = 'block';
    window.scrollTo(0, 0);
}

// Cart Logic
function addToCart() {
    cartCount++;
    document.querySelector('.cart-count').innerText = cartCount;
    
    const btn = document.querySelector('.add-to-cart-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Added! <i class="fas fa-check"></i>';
    btn.style.background = '#4CAF50'; // Success green
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'var(--accent)';
    }, 2000);
}
