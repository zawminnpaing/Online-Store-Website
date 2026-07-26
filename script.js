// 1. Mock Database (Added 3 "angles" using related emojis)
const mockProducts = [
    { id: 1, category: "Outerwear", name: "Classic Trench", price: "$145.00", angles: ["🧥", "👔", "🧵"] },
    { id: 2, category: "Outerwear", name: "Leather Moto", price: "$210.00", angles: ["🕴️", "🕶️", "🖤"] },
    { id: 3, category: "Outerwear", name: "Tailored Blazer", price: "$180.00", angles: ["🥼", "👔", "💼"] },
    { id: 4, category: "Outerwear", name: "Winter Puffer", price: "$195.00", angles: ["🧥", "🧣", "🧤"] },
    
    { id: 5, category: "Tops", name: "Silk Blouse", price: "$85.00", angles: ["👚", "✨", "🎀"] },
    { id: 6, category: "Tops", name: "Essential T-Shirt", price: "$35.00", angles: ["👕", "👖", "🧢"] },
    { id: 7, category: "Tops", name: "Oxford Shirt", price: "$65.00", angles: ["👔", "💼", "👞"] },
    { id: 8, category: "Tops", name: "Ribbed Tank", price: "$40.00", angles: ["🎽", "🩳", "☀️"] },
    
    { id: 9, category: "Bottoms", name: "High-Rise Denim", price: "$90.00", angles: ["👖", "👕", "👟"] },
    { id: 10, category: "Bottoms", name: "Pleated Trousers", price: "$110.00", angles: ["👖", "👞", "💼"] },
    { id: 11, category: "Bottoms", name: "Linen Shorts", price: "$55.00", angles: ["🩳", "🎽", "🕶️"] },
    { id: 12, category: "Bottoms", name: "Midi Skirt", price: "$75.00", angles: ["👗", "👠", "✨"] },
    
    { id: 13, category: "Accessories", name: "Leather Tote", price: "$150.00", angles: ["👜", "💼", "👛"] },
    { id: 14, category: "Accessories", name: "Aviators", price: "$120.00", angles: ["🕶️", "☀️", "😎"] },
    { id: 15, category: "Accessories", name: "Cashmere Scarf", price: "$85.00", angles: ["🧣", "🧥", "❄️"] },
    { id: 16, category: "Accessories", name: "Canvas Bag", price: "$45.00", angles: ["🛍️", "🛒", "🌿"] }
];

document.addEventListener('DOMContentLoaded', () => {
    renderGrid(mockProducts, 'product-grid');
});

// Render cards into a specific container
function renderGrid(productsArray, containerId) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = ''; 

    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // When clicked, open the product page overlay
        card.onclick = () => openProductPage(product.id);
        
        card.innerHTML = `
            <div class="emoji-placeholder">${product.angles[0]}</div>
            <div class="product-info">
                <p class="product-brand">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Homepage Filtering Logic
function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'All') {
        renderGrid(mockProducts, 'product-grid');
    } else {
        const filtered = mockProducts.filter(p => p.category === category);
        renderGrid(filtered, 'product-grid');
    }
}

// --- PRODUCT PAGE LOGIC ---
function openProductPage(productId) {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    // 1. Fill basic details
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-price').innerText = product.price;

    // 2. Setup 3-Angle Gallery
    const mainImgContainer = document.getElementById('detail-main-img');
    const thumbContainer = document.getElementById('detail-thumbnails');
    
    mainImgContainer.innerText = product.angles[0]; // Set default main image
    thumbContainer.innerHTML = ''; // Clear old thumbnails

    product.angles.forEach((angleEmoji, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.innerText = angleEmoji;
        
        thumb.onclick = () => {
            mainImgContainer.innerText = angleEmoji; // Swap main image
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbContainer.appendChild(thumb);
    });

    // 3. Populate "Related Products" (Same category, excluding current product)
    document.getElementById('related-category-name').innerText = product.category;
    const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id);
    renderGrid(relatedProducts, 'related-grid');

    // 4. Populate "Other Categories" (Random selection from different categories)
    const otherProducts = mockProducts.filter(p => p.category !== product.category).slice(0, 4); // Just grab 4 others
    renderGrid(otherProducts, 'others-grid');

    // 5. Slide in the overlay and scroll to top
    const overlay = document.getElementById('product-page');
    overlay.classList.add('active');
    overlay.scrollTop = 0; 
}

function closeProductPage() {
    document.getElementById('product-page').classList.remove('active');
}
