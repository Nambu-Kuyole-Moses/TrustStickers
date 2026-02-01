// Sample sticker data - In production, this would come from a database
const stickers = [
    {
        id: 1,
        name: "Abstract Waves",
        price: "₵25",
        type: "laptop",
        description: "Modern abstract wave design"
    },
    {
        id: 2,
        name: "Geometric Pattern",
        price: "₵20",
        type: "phone",
        description: "Clean geometric patterns"
    },
    {
        id: 3,
        name: "Nature Inspired",
        price: "₵30",
        type: "laptop",
        description: "Beautiful nature scenes"
    },
    {
        id: 4,
        name: "Minimalist Black",
        price: "₵18",
        type: "phone",
        description: "Sleek minimalist design"
    },
    {
        id: 5,
        name: "Gaming Theme",
        price: "₵35",
        type: "laptop",
        description: "Cool gaming graphics"
    },
    {
        id: 6,
        name: "Colorful Abstract",
        price: "₵22",
        type: "phone",
        description: "Vibrant abstract art"
    }
];

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    setupFilterButtons();
    populateStickerDropdown();
});

// Render gallery items
function renderGallery(filter = 'all') {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    const filteredStickers = filter === 'all' 
        ? stickers 
        : stickers.filter(sticker => sticker.type === filter);

    filteredStickers.forEach(sticker => {
        const stickerCard = createStickerCard(sticker);
        galleryGrid.appendChild(stickerCard);
    });
}

// Create sticker card element
function createStickerCard(sticker) {
    const card = document.createElement('div');
    card.className = 'sticker-card fade-in';
    card.innerHTML = `
        <div class="sticker-image">
            <i class="fas fa-sticky-note"></i>
        </div>
        <div class="sticker-info">
            <h3 class="sticker-name">${sticker.name}</h3>
            <p class="sticker-description">${sticker.description}</p>
            <div class="sticker-price">${sticker.price}</div>
        </div>
    `;

    // Add click event to select sticker
    card.addEventListener('click', () => {
        selectSticker(sticker);
    });

    return card;
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter gallery
            const filter = button.getAttribute('data-filter');
            renderGallery(filter);
        });
    });
}

// Populate sticker dropdown in order form
function populateStickerDropdown() {
    const stickerSelect = document.getElementById('sticker');
    stickerSelect.innerHTML = '<option value="">Select a Sticker</option>';
    
    stickers.forEach(sticker => {
        const option = document.createElement('option');
        option.value = sticker.id;
        option.textContent = `${sticker.name} - ${sticker.price} (${sticker.type})`;
        stickerSelect.appendChild(option);
    });
}

// Select sticker function
function selectSticker(sticker) {
    const stickerSelect = document.getElementById('sticker');
    stickerSelect.value = sticker.id;
    
    // Scroll to order section
    scrollToSection('order');
    
    // Highlight the selected sticker
    document.querySelectorAll('.sticker-card').forEach(card => {
        card.style.border = 'none';
    });
    
    // Find and highlight the selected card
    const selectedCard = Array.from(document.querySelectorAll('.sticker-card'))
        .find(card => card.querySelector('.sticker-name').textContent === sticker.name);
    
    if (selectedCard) {
        selectedCard.style.border = '3px solid #667eea';
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Filter stickers by type
function filterStickers(type) {
    renderGallery(type);
}