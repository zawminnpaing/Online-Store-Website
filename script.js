// 1. Mock Database (To be replaced by Google Sheets later)
const mockProducts = [
    // Outerwear
    { id: 1, category: "Outerwear", name: "Classic Trench", price: "$145.00", emoji: "🧥" },
    { id: 2, category: "Outerwear", name: "Leather Moto Jacket", price: "$210.00", emoji: "🕴️" },
    { id: 3, category: "Outerwear", name: "Tailored Blazer", price: "$180.00", emoji: "🥼" },
    { id: 4, category: "Outerwear", name: "Winter Puffer", price: "$195.00", emoji: "🧥" },
    
    // Tops
    { id: 5, category: "Tops", name: "Silk Blouse", price: "$85.00", emoji: "👚" },
    { id: 6, category: "Tops", name: "Essential T-Shirt", price: "$35.00", emoji: "👕" },
    { id: 7, category: "Tops", name: "Oxford Button-Down", price: "$65.00", emoji: "👔" },
    { id: 8, category: "Tops", name: "Ribbed Knit Tank", price: "$40.00", emoji: "🎽" },
    
    // Bottoms
    { id: 9, category: "Bottoms", name: "High-Rise Denim", price: "$90.00", emoji: "👖" },
    { id: 10, category: "Bottoms", name: "Pleated Trousers", price: "$110.00", emoji: "👖" },
    { id: 11, category: "Bottoms", name: "Linen Shorts", price: "$55.00", emoji: "🩳" },
    { id: 12, category: "Bottoms", name: "Midi Slip Skirt", price: "$75.00", emoji: "👗" },
    
    // Accessories
    { id: 13, category: "Accessories", name: "Leather Tote", price: "$150.00", emoji: "👜" },
    { id: 14, category: "Accessories", name: "Aviator Sunglasses", price: "$120.00", emoji: "🕶️" },
    { id: 15, category: "Accessories", name: "Cashmere Scarf", price: "$85.00", emoji: "🧣" },
    { id: 16, category: "Accessories", name: "Canvas Tote Bag", price: "$45.00", emoji: "🛍️" }
];

// 2. Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(mockProducts);
});

// 3. Render Function
function renderProducts(productsToRender) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; // Clear current grid

    productsToRender.forEach(product => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Build card HTML using the emoji as the image
        card.innerHTML = `
            <div class="emoji-placeholder">
                ${product.emoji}
            </div>
            <div class="product-info">
                <p class="product-brand">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// 4. Filtering Logic
function filterProducts(category) {
    // Update active button styling
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter the array
    if (category === 'All') {
        renderProducts(mockProducts);
    } else {
        const filtered = mockProducts.filter(product => product.category === category);
        renderProducts(filtered);
    }
}
