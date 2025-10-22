class ProductGallery {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilter = 'all';
        this.searchTerm = '';

        this.initializeElements();
        this.loadProducts();
        this.attachEventListeners();
    }

    initializeElements() {
        this.galleryGrid = document.getElementById('galleryGrid');
        this.imageCountElement = document.getElementById('imageCount');
        this.searchInput = document.getElementById('searchInput');
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalCategory = document.getElementById('modalCategory');
        this.modalDate = document.getElementById('modalDate');
        this.closeModal = document.getElementById('closeModal');
    }

    async loadProducts() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            this.products = data.gallery;
            this.filteredProducts = [...this.products];
            this.renderGallery();
            this.updateProductCount();
        } catch (error) {
            console.error('Error loading products:', error);
            this.galleryGrid.innerHTML = '<p class="no-results" style="text-align:center; grid-column:1/-1; padding:2rem; color:#888;">Error loading products. Please try again later.</p>';
        }
    }

    renderGallery() {
        if (this.filteredProducts.length === 0) {
            this.galleryGrid.innerHTML = '<p class="no-results" style="text-align:center; grid-column:1/-1; padding:2rem; color:#888;">No products found matching your criteria.</p>';
            return;
        }

        this.galleryGrid.innerHTML = this.filteredProducts.map(product => `
            <div class="gallery-item" data-id="${product.id}" data-category="${product.category}">
                <img src="${product.imageUrl}" alt="${product.description}" loading="lazy">
                <div class="item-info">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="item-meta">
                        <div class="meta-left">
                            <span class="category-tag">${this.formatCategory(product.category)}</span>
                            ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
                        </div>
                        ${product.price ? `<span class="price-tag">${product.price}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Add click event to gallery items
        this.galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => this.openModal(parseInt(item.dataset.id)));
        });

        this.updateProductCount();
    }

    formatCategory(category) {
        const categoryMap = {
            'pcb-design': 'PCB Design',
            'etching': 'Etching',
            'fabrication': 'Fabrication',
            'laptop-repair': 'Laptop Repair',
            'mobile-repair': 'Mobile Repair',
            'electronic-components': 'Components',
            'electronics-gadgets': 'Gadgets',
            'diy-modules': 'DIY Modules'
        };
        return categoryMap[category] || category;
    }

    openModal(productId) {
        const product = this.products.find(prod => prod.id === productId);
        if (!product) return;

        this.modalImage.src = product.imageUrl;
        this.modalImage.alt = product.description;
        this.modalTitle.textContent = product.title;
        this.modalDescription.textContent = product.description;
        this.modalCategory.textContent = this.formatCategory(product.category);
        this.modalDate.textContent = new Date(product.date).toLocaleDateString();

        // Add price to modal if it exists
        const existingPrice = document.getElementById('modalPrice');
        if (existingPrice) {
            existingPrice.remove();
        }

        if (product.price) {
            const priceElement = document.createElement('div');
            priceElement.id = 'modalPrice';
            priceElement.className = 'modal-price';
            priceElement.textContent = product.price;
            this.modalDescription.after(priceElement);
        }

        this.modal.classList.add('show');
    }

    closeProductModal() {
        this.modal.classList.remove('show');
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            const matchesFilter = this.currentFilter === 'all' ||
                (this.currentFilter === 'featured' ? product.featured :
                    product.category === this.currentFilter);

            const matchesSearch = !this.searchTerm ||
                product.title.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm) ||
                product.category.toLowerCase().includes(this.searchTerm);

            return matchesFilter && matchesSearch;
        });

        this.renderGallery();
    }

    updateProductCount() {
        const count = this.filteredProducts.length;
        this.imageCountElement.textContent = `${count} product${count !== 1 ? 's' : ''}`;
    }

    attachEventListeners() {
        // Filter buttons
        document.querySelectorAll('.gallery-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.gallery-nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterProducts();
            });
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.filterProducts();
        });

        // Modal close
        this.closeModal.addEventListener('click', () => this.closeProductModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeProductModal();
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeProductModal();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProductGallery();
});