class ProductGallery {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilter = 'all';
        this.searchTerm = '';

        this.services = {
            'pcb-design': {
                title: 'PCB Design Service',
                description: 'Professional circuit board design services including schematic capture, layout, and signal integrity analysis for your electronic projects. We specialize in creating optimized PCB layouts that meet your specific requirements.',
                imageUrl: 'images/pcbdesign.jpeg',
                features: [
                    'Schematic capture and circuit design',
                    'Multi-layer PCB layout',
                    'Signal integrity analysis',
                    'Impedance control',
                    'Design for manufacturability (DFM)',
                    '3D modeling and visualization',
                    'Gerber file generation',
                    'Design review and optimization'
                ],
                price: 'Starting from Ksh. 750.00'
            },
            'etching': {
                title: 'PCB Etching Services',
                description: 'High-precision PCB etching with advanced chemical processes for complex circuit patterns and fine-pitch components. We use state-of-the-art equipment to ensure perfect results every time.',
                imageUrl: 'images/etching.jpg',
                features: [
                    'High-precision chemical etching',
                    'Fine-pitch component support',
                    'Quick turnaround times',
                    'Quality control at every stage',
                    'Various board materials available',
                    'Custom etching patterns',
                    'Prototype and production runs',
                    'Environmentally safe processes'
                ],
                price: 'Starting from Ksh. 400.00'
            },
            'fabrication': {
                title: 'PCB Fabrication',
                description: 'End-to-end PCB fabrication from prototype to mass production with quality assurance and testing at every stage. We handle everything from material selection to final assembly.',
                imageUrl: 'images/pcbcomp.jpg',
                features: [
                    'Prototype to mass production',
                    'Surface mount technology (SMT)',
                    'Through-hole assembly',
                    'Quality assurance testing',
                    'Component sourcing',
                    'Final product assembly',
                    'Packaging and shipping',
                    'RoHS compliant materials'
                ],
                price: 'Starting from Ksh. 1,000.00'
            },
            'laptop-repair': {
                title: 'Laptop Repair Services',
                description: 'Professional laptop repair services including motherboard-level diagnostics, component replacement, and data recovery. We repair all major brands and models.',
                imageUrl: 'images/motherboard.jpg',
                features: [
                    'Motherboard-level diagnostics',
                    'Screen replacement',
                    'Keyboard and touchpad repair',
                    'Battery replacement',
                    'Data recovery services',
                    'Virus removal',
                    'Hardware upgrades',
                    'Warranty on all repairs'
                ],
                price: 'Starting from Ksh. 500.00'
            },
            'mobile-repair': {
                title: 'Mobile Repair Services',
                description: 'Expert smartphone and tablet repair with genuine parts, including display, battery, and charging port replacements. Fast and reliable service for all mobile devices.',
                imageUrl: 'images/phonerepair.jpg',
                features: [
                    'Screen replacement',
                    'Battery replacement',
                    'Charging port repair',
                    'Camera module replacement',
                    'Water damage repair',
                    'Software issues',
                    'Glass-only repairs',
                    'Original parts guarantee'
                ],
                price: 'Starting from Ksh. 600.00'
            }
        };

        this.initializeElements();
        this.loadProducts();
        this.attachEventListeners();
    }

    initializeElements() {
        this.galleryGrid = document.getElementById('galleryGrid');
        this.imageCountElement = document.getElementById('imageCount');
        this.searchInput = document.getElementById('searchInput');
        this.modal = document.getElementById('detailModal');
        this.modalBody = document.getElementById('modalBody');
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
                ${product.outOfStock ? '<div class="out-of-stock-label">Out of Stock</div>' : ''}
                ${product.new ? '<div class="new-tag">New</div>' : ''}
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
            item.addEventListener('click', () => this.openProductDetail(parseInt(item.dataset.id)));
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
            'diy-modules': 'DIY Modules',
            'oraimo-products': 'Oraimo',
            'laptops': 'Laptops'
        };
        return categoryMap[category] || category;
    }

    openServiceDetail(serviceId) {
        const service = this.services[serviceId];
        if (!service) return;

        const modalContent = `
            <div class="service-detail">
                <div class="detail-image">
                    <img src="${service.imageUrl}" alt="${service.title}">
                </div>
                <div class="detail-info">
                    <h2 class="detail-title">${service.title}</h2>
                    <p class="detail-description">${service.description}</p>
                    
                    <div class="detail-features">
                        <h4>Service Features:</h4>
                        <ul>
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-meta">
                        <span class="detail-price">${service.price}</span>
                    </div>
                    
                    <div class="detail-actions">
                        <a href="#contact" class="detail-contact-btn" onclick="this.closeDetailModal()">
                            <i class="fas fa-phone"></i> Contact for Quote
                        </a>
                        <button class="detail-close-btn" onclick="this.closeDetailModal()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.modalBody.innerHTML = modalContent;
        this.modal.classList.add('show');

        // Add event listener to contact button
        const contactBtn = this.modalBody.querySelector('.detail-contact-btn');
        contactBtn.onclick = (e) => {
            e.preventDefault();
            this.closeDetailModal();
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        };
    }

    openProductDetail(productId) {
        const product = this.products.find(prod => prod.id === productId);
        if (!product) return;

        const modalContent = `
            <div class="product-detail">
                <div class="detail-image">
                    <img src="${product.imageUrl}" alt="${product.description}">
                </div>
                <div class="detail-info">
                    <h2 class="detail-title">${product.title}</h2>
                    <p class="detail-description">${product.description}</p>
                    
                    <div class="detail-badges">
                        ${product.featured ? '<span class="detail-badge featured">Featured</span>' : ''}
                        ${product.new ? '<span class="detail-badge new">New Arrival</span>' : ''}
                        ${product.outOfStock ? '<span class="detail-badge out-of-stock">Out of Stock</span>' : ''}
                    </div>
                    
                    <div class="detail-meta">
                        ${product.price ? `<span class="detail-price">${product.price}</span>` : ''}
                        <span class="detail-category">${this.formatCategory(product.category)}</span>
                    </div>
                    
                    ${product.features ? `
                    <div class="detail-features">
                        <h4>Product Features:</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div class="detail-actions">
                        ${!product.outOfStock ? `
                        <a href="#contact" class="detail-contact-btn">
                            <i class="fas fa-shopping-cart"></i> Inquire About Product
                        </a>
                        ` : ''}
                        <button class="detail-close-btn">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.modalBody.innerHTML = modalContent;
        this.modal.classList.add('show');

        // Add event listeners to buttons
        const contactBtn = this.modalBody.querySelector('.detail-contact-btn');
        const closeBtn = this.modalBody.querySelector('.detail-close-btn');

        if (contactBtn) {
            contactBtn.onclick = (e) => {
                e.preventDefault();
                this.closeDetailModal();
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth'
                });
            };
        }

        closeBtn.onclick = () => this.closeDetailModal();
    }

    closeDetailModal() {
        this.modal.classList.remove('show');
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            let matchesFilter = false;

            if (this.currentFilter === 'all') {
                matchesFilter = true;
            } else if (this.currentFilter === 'featured') {
                matchesFilter = product.featured;
            } else if (this.currentFilter === 'out-of-stock') {
                matchesFilter = product.outOfStock;
            } else {
                matchesFilter = product.category === this.currentFilter;
            }

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

        // Service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceId = card.dataset.service;
                this.openServiceDetail(serviceId);
            });
        });

        // Service links in footer
        document.querySelectorAll('.service-modal-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceId = link.dataset.service;
                this.openServiceDetail(serviceId);
            });
        });

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.filterProducts();
        });

        // Modal close
        this.closeModal.addEventListener('click', () => this.closeDetailModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeDetailModal();
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDetailModal();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (!this.classList.contains('service-modal-link')) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
}

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProductGallery();
});
