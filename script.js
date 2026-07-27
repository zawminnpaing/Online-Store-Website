const PRODUCTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0MnVCxHS8wU9pA4laJ45n9_UaV9rrPc-PhadUQ_v71gq0c2ENR2dPp6uqf9fgCSPA-BcEXYe0iMqu/pub?gid=0&single=true&output=csv";
const CAROUSEL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0MnVCxHS8wU9pA4laJ45n9_UaV9rrPc-PhadUQ_v71gq0c2ENR2dPp6uqf9fgCSPA-BcEXYe0iMqu/pub?gid=1445747052&single=true&output=csv"; 

let storeProducts = [];
let carouselItems = [];
let shoppingCart = [];
const STORE_PHONE = "959793155856"; 

const catalogView = document.getElementById('catalog-view');
const productView = document.getElementById('product-view');
const cartView = document.getElementById('cart-view');
const mainGrid = document.getElementById('product-grid');

document.addEventListener('DOMContentLoaded', () => {
    renderSkeletons(mainGrid, 8);
    renderSkeletons(document.getElementById('new-arrivals-grid'), 4);
    renderSkeletons(document.getElementById('trending-grid'), 4);
    
    fetchStoreData();
});

function fetchStoreData() {
    const cacheBuster = "&t=" + new Date().getTime();

    Papa.parse(PRODUCTS_CSV_URL + cacheBuster, {
        download: true,
        header: true,
        complete: function(results) {
            storeProducts = results.data
                .filter(row => row.id && row.name)
                .map(row => {
                    const imgs = [row.image1, row.image2, row.image3].filter(img => img && img.trim() !== '');
                    const tagsArray = row.tags ? row.tags.split(',').map(tag => tag.trim()) : [];
                    return {
                        id: row.id.toString(),
                        category: row.category || 'Uncategorized',
                        subCategory: row.subCategory || '',
                        name: row.name,
                        description: row.description || '',
                        price: parseFloat(row.price) || 0,
                        discountPrice: row.discountPrice ? parseFloat(row.discountPrice) : null,
                        tags: tagsArray,
                        images: imgs.length > 0 ? imgs : ['https://via.placeholder.com/300x400?text=No+Image']
                    };
                });

            renderGrid(storeProducts, mainGrid);
            
            // Smart fetch for sections
            const newArrivals = getSectionProducts('New', storeProducts, 4);
            renderGrid(newArrivals, document.getElementById('new-arrivals-grid'));
            
            const trending = getSectionProducts('Trending', storeProducts, 4);
            renderGrid(trending, document.getElementById('trending-grid'));
        }
    });

    if (CAROUSEL_CSV_URL) {
        Papa.parse(CAROUSEL_CSV_URL + cacheBuster, {
            download: true,
            header: true,
            complete: function(results) {
                carouselItems = results.data.filter(row => row.imageUrl);
                renderCarousel();
            }
        });
    }
}

// === SMART SECTION LOGIC ===
// Looks for the exact tag first. If none found, pulls the first item from unique sub-categories.
function getSectionProducts(targetTag, allProducts, limit = 4) {
    const taggedProducts = allProducts.filter(p => 
        p.tags.some(t => t.toLowerCase() === targetTag.toLowerCase())
    );

    if (taggedProducts.length > 0) {
        return taggedProducts.slice(0, limit);
    }

    const fallbackProducts = [];
    const seenSubCategories = new Set();

    for (const p of allProducts) {
        const groupingKey = p.subCategory ? p.subCategory.trim() : p.category.trim(); 
        if (!seenSubCategories.has(groupingKey)) {
            seenSubCategories.add(groupingKey);
            fallbackProducts.push(p);
        }
        if (fallbackProducts.length === limit) break;
    }

    return fallbackProducts;
}

function renderSkeletons(container, count = 8) {
    container.innerHTML = '';
    for(let i=0; i<count; i++) {
        container.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-box skeleton-img"></div>
                <div class="skeleton-box skeleton-text"></div>
                <div class="skeleton-box skeleton-text skeleton-title"></div>
                <div class="skeleton-box skeleton-text"></div>
            </div>`;
    }
}

function renderGrid(productsArray, container) {
    container.innerHTML = ''; 
    productsArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProduct(product.id);
        
        let badgesHTML = '<div class="badge-container">';
        product.tags.forEach(tag => {
            const tagLower = tag.toLowerCase();
            let badgeClass = ''; // Default black

            if (tagLower.includes('%') || tagLower.includes('off')) {
                badgeClass = 'badge-discount';
            } else if (tagLower === 'new') {
                badgeClass = 'badge-new';
            } else if (tagLower === 'trending') {
                badgeClass = 'badge-trending';
            } else if (tagLower === 'limited') {
                badgeClass = 'badge-limited';
            } else if (tagLower.includes('best seller') || tagLower.includes('bestseller')) {
                badgeClass = 'badge-bestseller';
            }

            badgesHTML += `<span class="product-badge ${badgeClass}">${tag}</span>`;
        });
        badgesHTML += '</div>';

        let priceHTML = '';
        if (product.discountPrice) {
            priceHTML = `<p class="product-price"><span class="old-price">$${product.price.toFixed(2)}</span> <span class="sale-price">$${product.discountPrice.toFixed(2)}</span></p>`;
        } else {
            priceHTML = `<p class="product-price">$${product.price.toFixed(2)}</p>`;
        }

        card.innerHTML = `
            ${product.tags.length > 0 ? badgesHTML : ''}
            <div class="img-container">
                <img src="${product.images[0]}" class="grid-img" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <p class="product-brand">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                ${priceHTML}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderCarousel() {
    const track = document.getElementById('model-track');
    const container = document.getElementById('model-carousel-container');
    track.innerHTML = '';
    
    if(carouselItems.length === 0) return;
    container.style.display = 'block';

    const loopItems = [...carouselItems, ...carouselItems]; 

    loopItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'model-item';
        div.onclick = () => filterFromCarousel(item.link);
        div.innerHTML = `<img src="${item.imageUrl}" alt="Model" loading="lazy">`;
        track.appendChild(div);
    });
}

function filterFromCarousel(linkData) {
    if (!linkData || linkData.trim() === "") return;
    const searchTerms = linkData.split(',').map(term => term.trim().toLowerCase());
    
    const filtered = storeProducts.filter(p => 
        searchTerms.includes(p.id.toLowerCase()) || 
        searchTerms.includes(p.category.toLowerCase())
    );
    
    document.getElementById('main-hero').style.display = 'none';
    document.getElementById('home-extra-sections').style.display = 'none';
    
    closeAllViews();
    renderGrid(filtered, mainGrid);
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

    const filtered = storeProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    
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
    
    renderGrid(category === 'All' ? storeProducts : storeProducts.filter(p => p.category === category), mainGrid);
}

function closeAllViews() {
    productView.style.display = 'none';
    cartView.style.display = 'none';
    catalogView.style.display = 'block';
    document.getElementById('main-hero').style.display = 'block';
    document.getElementById('home-extra-sections').style.display = 'block';
    window.scrollTo(0, 0);
}

function openProduct(productId) {
    const product = storeProducts.find(p => p.id === productId.toString());
    if (!product) return;

    document.getElementById('current-product-id').value = product.id;
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-description').innerText = product.description;
    
    if (product.discountPrice) {
        document.getElementById('detail-price').innerHTML = `<span class="old-price">$${product.price.toFixed(2)}</span> <span class="sale-price">$${product.discountPrice.toFixed(2)}</span>`;
    } else {
        document.getElementById('detail-price').innerText = `$${product.price.toFixed(2)}`;
    }
    
    document.getElementById('item-qty').value = 1;

    const mainImgContainer = document.getElementById('detail-main-img-container');
    const thumbContainer = document.getElementById('detail-thumbnails');
    
    mainImgContainer.innerHTML = `<img src="${product.images[0]}" class="detail-main-img" id="detail-main-img">`;
    const mainImg = document.getElementById('detail-main-img');
    
    thumbContainer.innerHTML = '';
    
    product.images.forEach((imgUrl, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb-box ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imgUrl}" alt="Thumbnail">`;
        thumb.onclick = () => {
            mainImg.src = imgUrl;
            document.querySelectorAll('.thumb-box').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbContainer.appendChild(thumb);
    });

    document.getElementById('related-category-name').innerText = product.category;
    renderGrid(storeProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4), document.getElementById('related-grid-same'));

    catalogView.style.display = 'none';
    cartView.style.display = 'none';
    productView.style.display = 'block';
    window.scrollTo(0, 0);
}

function changeQty(amount) {
    const qtyInput = document.getElementById('item-qty');
    let newVal = parseInt(qtyInput.value) + amount;
    if (newVal >= 1) qtyInput.value = newVal;
}

function addToCart() {
    const productId = document.getElementById('current-product-id').value;
    const quantity = parseInt(document.getElementById('item-qty').value);
    const product = storeProducts.find(p => p.id === productId);
    const existingItem = shoppingCart.find(item => item.id === productId);
    
    const activePrice = product.discountPrice ? product.discountPrice : product.price;

    if (existingItem) existingItem.quantity += quantity;
    else shoppingCart.push({ id: product.id, name: product.name, price: activePrice, quantity: quantity });

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
    badge.classList.remove('bump');
    void badge.offsetWidth; 
    badge.classList.add('bump');
}

function openCart() {
    renderCart();
    catalogView.style.display = 'none';
    productView.style.display = 'none';
    cartView.style.display = 'block';
    window.scrollTo(0, 0);
}

function removeFromCart(productId) {
    shoppingCart = shoppingCart.filter(item => item.id !== productId.toString());
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
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
                <div class="cart-item-price">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>`;
    });
    totalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
}

function processCheckout(platform) {
    if (shoppingCart.length === 0) return alert("Your cart is empty!");

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!name || !phone || !address) return alert("Please fill out all delivery details.");

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#000000', '#ffffff', '#717171'] });

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    let grandTotal = 0;
    let itemsText = "";
    
    shoppingCart.forEach(item => {
        grandTotal += (item.price * item.quantity);
        itemsText += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });

    const orderMessage = `🛍️ NEW ORDER: #${orderId}\n\n🛒 ITEMS:\n${itemsText}💰 TOTAL: $${grandTotal.toFixed(2)}\n\n👤 CUSTOMER DETAILS:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}`;
    const encodedMessage = encodeURIComponent(orderMessage);

    setTimeout(() => {
        if (platform === 'telegram') window.open(`https://t.me/+${STORE_PHONE}?text=${encodedMessage}`, '_blank');
        else if (platform === 'viber') window.open(`viber://chat?number=%2B${STORE_PHONE}&draft=${encodedMessage}`, '_blank');
    }, 800);
}
