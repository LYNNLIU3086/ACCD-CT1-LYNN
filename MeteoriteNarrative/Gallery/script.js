// 配置
const CONFIG = {
    itemsPerLoad: 12,
    totalItems: 1000,
    animationDelay: 100
};

// 艺术数据生成
function generateArtworks() {
    const artworks = [];
    const artists = [
        'Leonardo da Vinci', 'Vincent van Gogh', 'Rembrandt', 
        'Michelangelo', 'Pablo Picasso', 'Claude Monet',
        'Johannes Vermeer', 'Caravaggio', 'Raphael',
        'Titian', 'Donatello', 'Sandro Botticelli'
    ];
    
    const categories = ['文艺复兴', '巴洛克', '印象派', '古典主义', '浪漫主义', '现实主义'];
    const centuries = ['14th Century', '15th Century', '16th Century', '17th Century', '18th Century', '19th Century'];

    for (let i = 1; i <= CONFIG.totalItems; i++) {
        const artist = artists[Math.floor(Math.random() * artists.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const century = centuries[Math.floor(Math.random() * centuries.length)];
        
        artworks.push({
            id: i,
            title: `Masterpiece ${i}`,
            artist: artist,
            century: century,
            category: category,
            description: `这幅${category}时期的杰作由${artist}创作，展现了非凡的艺术造诣和历史价值。作品体现了当时的社会文化背景和艺术发展趋势。`,
            image: `images/art${(i % 50) + 1}.jpg`
        });
    }
    return artworks;
}

// 画廊类
class Gallery {
    constructor() {
        this.artworks = [];
        this.displayedCount = 0;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.artworks = generateArtworks();
        this.renderInitialArtworks();
        this.initEventListeners();
        this.initModal();
    }

    renderInitialArtworks() {
        this.loadMoreArtworks();
    }

    loadMoreArtworks() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.classList.add('loading');

        // 模拟加载延迟
        setTimeout(() => {
            const startIndex = this.displayedCount;
            const endIndex = Math.min(startIndex + CONFIG.itemsPerLoad, this.artworks.length);
            const artworksToShow = this.artworks.slice(startIndex, endIndex);

            artworksToShow.forEach((artwork, index) => {
                setTimeout(() => {
                    this.createArtworkCard(artwork, this.displayedCount + index);
                }, index * 50);
            });

            this.displayedCount += artworksToShow.length;
            this.isLoading = false;
            loadMoreBtn.classList.remove('loading');

            // 检查是否已加载所有项目
            if (this.displayedCount >= this.artworks.length) {
                loadMoreBtn.style.display = 'none';
            }
        }, 800);
    }

    createArtworkCard(artwork, index) {
        const galleryGrid = document.getElementById('galleryGrid');
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.style.animationDelay = `${(index % CONFIG.itemsPerLoad) * 0.1}s`;

        card.innerHTML = `
            <div class="artwork-image-container">
                <img src="${artwork.image}" alt="${artwork.title}" class="artwork-image">
                <div class="artwork-overlay"></div>
            </div>
            <div class="artwork-info">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-artist">${artwork.artist}</p>
                <div class="artwork-meta">
                    <span class="artwork-year">${artwork.century}</span>
                    <span class="artwork-category">${artwork.category}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => this.openModal(artwork));
        galleryGrid.appendChild(card);
    }

    initModal() {
        this.modal = document.getElementById('imageModal');
        this.modalBackground = document.getElementById('modalBackground');
        this.modalClose = document.getElementById('modalClose');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalArtist = document.getElementById('modalArtist');
        this.modalDescription = document.getElementById('modalDescription');

        this.modalBackground.addEventListener('click', () => this.closeModal());
        this.modalClose.addEventListener('click', () => this.closeModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(artwork) {
        this.modalImage.src = artwork.image;
        this.modalImage.alt = artwork.title;
        this.modalTitle.textContent = artwork.title;
        this.modalArtist.textContent = artwork.artist;
        this.modalDescription.textContent = artwork.description;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    initEventListeners() {
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadMoreArtworks();
        });
    }
}

// 初始化画廊
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});