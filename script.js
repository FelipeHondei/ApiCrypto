let analysisData = {
    highPerformers: [],
    opportunities: [],
    topPerformers: [],
    lastUpdate: null
};

let autoRefreshInterval = null;
let isAutoRefreshing = false;

// API Configuration
const API_CONFIG = {
    baseUrl: 'https://api.coinlore.net/api',
    endpoints: {
        tickers: '/tickers/',
        global: '/global/'
    }
};

class LoadingManager {
    constructor() {
        this.progress = 0;
        this.statusMessages = [
            "Inicializando sistema...",
            "Conectando à API CoinLore...",
            "Coletando dados do mercado...",
            "Analisando criptomoedas...",
            "Processando oportunidades...",
            "Finalizando análise..."
        ];
        this.currentMessageIndex = 0;
    }

    async startLoading() {
        this.createCryptoRain();

        // Simula o carregamento em etapas realistas
        const steps = [15, 35, 60, 80, 95, 100];

        for (let i = 0; i < steps.length; i++) {
            await this.updateProgress(steps[i], this.statusMessages[i]);
            await this.delay(400 + Math.random() * 200);
        }

        await this.delay(500);
        this.hideLoading();
    }

    async updateProgress(targetProgress, statusMessage) {
        const progressBar = document.getElementById('progressBar');
        const statusElement = document.getElementById('loadingStatus');

        statusElement.textContent = statusMessage;

        return new Promise(resolve => {
            const animateProgress = () => {
                if (this.progress < targetProgress) {
                    this.progress += 2;
                    progressBar.style.width = this.progress + '%';
                    setTimeout(animateProgress, 20);
                } else {
                    resolve();
                }
            };
            animateProgress();
        });
    }

    createCryptoRain() {
        const cryptoRain = document.getElementById('cryptoRain');
        const cryptoSymbols = '₿ΞΞΞ₳◊ŁΔΞ฿₿ΞΞÐØ₿ΞŁΔØ◊₳฿₿ΞÐŁΔØ◊₳฿₿ΞÐŁΔØ◊₳฿₿ΞÐŁΔØ◊₳฿';

        for (let i = 0; i < 8; i++) {
            const column = document.createElement('div');
            column.className = 'crypto-column';
            column.style.left = Math.random() * 100 + '%';
            column.style.animationDelay = Math.random() * 5 + 's';
            column.style.animationDuration = (Math.random() * 2 + 6) + 's';

            let text = '';
            for (let j = 0; j < 10; j++) {
                text += cryptoSymbols.charAt(Math.floor(Math.random() * cryptoSymbols.length)) + '<br>';
            }
            column.innerHTML = text;

            cryptoRain.appendChild(column);
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');

        loadingScreen.classList.add('hidden');

        setTimeout(() => {
            mainContainer.classList.add('loaded');
            this.showContent();
        }, 500);
    }

    showContent() {
        setTimeout(() => {
            const statsGrid = document.getElementById('statsGrid');
            if (statsGrid) statsGrid.classList.add('loaded');
        }, 200);

        setTimeout(() => {
            const sections = document.querySelectorAll('.section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.classList.add('loaded');
                }, index * 100);
            });
        }, 400);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Elementos do cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let trailElements = [];

// Atualizar posição do mouse
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animar cursor principal e seguidor
function updateCursor() {
    // Cursor principal (resposta imediata)
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    // Cursor seguidor (com atraso suave)
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(updateCursor);
}
updateCursor();

// Efeito de trilha do cursor
let trailTimer = 0;
document.addEventListener('mousemove', (e) => {
    trailTimer++;
    if (trailTimer % 3 === 0) { // Criar trilha a cada 3 movimentos
        createTrail(e.clientX, e.clientY);
    }
});

function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);

    // Animar e remover a trilha
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0)';
        trail.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 500);
    }, 100);
}

// Criar partículas no clique
document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 6 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    document.body.appendChild(particle);

    // Animar partícula
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1000 + 1000;

    particle.animate([
        {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1
        },
        {
            transform: `translate(${Math.cos(angle) * distance - 50}px, ${Math.sin(angle) * distance - 50}px) scale(0)`,
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    };
}
// Detectar dispositivos móveis e ocultar cursor customizado
if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// Mock data para demonstração quando a API falhar
const mockCryptoData = [
    { name: "Bitcoin", symbol: "BTC", price_usd: "45320.50", percent_change_24h: "2.45", percent_change_7d: "5.20", rank: "1", market_cap_usd: "850000000000" },
    { name: "Ethereum", symbol: "ETH", price_usd: "3240.80", percent_change_24h: "1.85", percent_change_7d: "3.75", rank: "2", market_cap_usd: "390000000000" },
    { name: "Cardano", symbol: "ADA", price_usd: "1.25", percent_change_24h: "-0.85", percent_change_7d: "4.20", rank: "3", market_cap_usd: "42000000000" },
    { name: "Solana", symbol: "SOL", price_usd: "95.40", percent_change_24h: "8.50", percent_change_7d: "12.30", rank: "4", market_cap_usd: "38000000000" },
    { name: "Polkadot", symbol: "DOT", price_usd: "24.60", percent_change_24h: "-1.20", percent_change_7d: "6.80", rank: "5", market_cap_usd: "24000000000" },
    { name: "Chainlink", symbol: "LINK", price_usd: "28.30", percent_change_24h: "3.40", percent_change_7d: "8.90", rank: "6", market_cap_usd: "13000000000" },
    { name: "Litecoin", symbol: "LTC", price_usd: "165.20", percent_change_24h: "1.60", percent_change_7d: "2.30", rank: "7", market_cap_usd: "12000000000" },
    { name: "Avalanche", symbol: "AVAX", price_usd: "78.90", percent_change_24h: "12.80", percent_change_7d: "18.50", rank: "8", market_cap_usd: "18000000000" },
    { name: "Polygon", symbol: "MATIC", price_usd: "1.85", percent_change_24h: "6.20", percent_change_7d: "15.40", rank: "9", market_cap_usd: "14000000000" },
    { name: "Cosmos", symbol: "ATOM", price_usd: "32.40", percent_change_24h: "-2.10", percent_change_7d: "7.60", rank: "10", market_cap_usd: "9200000000" }
];

async function fetchCryptoData() {
    try {
        updateStatus('connecting', 'Conectando à API...');

        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.tickers}?start=0&limit=100`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateStatus('connected', 'Conectado à API CoinLore');

        return data.data || [];
    } catch (error) {
        console.warn('API não disponível, usando dados de demonstração:', error);
        updateStatus('connected', 'Usando dados de demonstração');

        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 500));

        return mockCryptoData;
    }
}

function updateStatus(status) {
    const statusDot = document.getElementById('statusDot');


    statusDot.className = 'status-dot';
    if (status === 'connected') {
        statusDot.classList.add('connected');
    }
}

function analyzeMarketData(cryptoData) {
    const highPerformers = [];
    const opportunities = [];
    const topPerformers = [];

    cryptoData.forEach(coin => {
        const change24h = parseFloat(coin.percent_change_24h) || 0;
        const change7d = parseFloat(coin.percent_change_7d) || 0;
        const price = parseFloat(coin.price_usd) || 0;
        const rank = parseInt(coin.rank) || 0;

        const coinData = {
            name: coin.name,
            symbol: coin.symbol,
            price: price,
            change24h: change24h,
            change7d: change7d,
            rank: rank,
            marketCap: parseFloat(coin.market_cap_usd) || 0
        };

        if (change24h > 0) {
            highPerformers.push(coinData);
        }

        if (change7d > 0 && change24h < 0) {
            opportunities.push(coinData);
        }

        if (change24h > 5) {
            topPerformers.push(coinData);
        }
    });

    highPerformers.sort((a, b) => b.change24h - a.change24h);
    opportunities.sort((a, b) => b.change7d - a.change7d);
    topPerformers.sort((a, b) => b.change24h - a.change24h);

    return {
        highPerformers: highPerformers.slice(0, 12),
        opportunities: opportunities.slice(0, 8),
        topPerformers: topPerformers.slice(0, 6),
        lastUpdate: new Date()
    };
}

function createCryptoCard(coin, index = 0) {
    const priceFormatted = formatPrice(coin.price);
    const change24hClass = coin.change24h > 0 ? 'positive' : coin.change24h < 0 ? 'negative' : 'neutral';
    const change7dClass = coin.change7d > 0 ? 'positive' : coin.change7d < 0 ? 'negative' : 'neutral';

    const rankBadge = coin.rank <= 10 ? `<div class="rank-badge">${coin.rank}</div>` : '';

    return `
                <div class="crypto-card" style="animation-delay: ${index * 0.1}s">
                    ${rankBadge}
                    <div class="crypto-header">
                        <div class="crypto-name">${coin.name}</div>
                        <div class="crypto-symbol">${coin.symbol}</div>
                    </div>
                    <div class="crypto-price">${priceFormatted}</div>
                    <div class="crypto-changes">
                        <div class="change-item">
                            <div class="change-label">24h</div>
                            <div class="change-value ${change24hClass}">${formatPercentage(coin.change24h)}</div>
                        </div>
                        <div class="change-item">
                            <div class="change-label">7d</div>
                            <div class="change-value ${change7dClass}">${formatPercentage(coin.change7d)}</div>
                        </div>
                    </div>
                </div>
            `;
}

function formatPrice(price) {
    if (price >= 1) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 0.01) {
        return price.toFixed(4);
    } else {
        return price.toFixed(8);
    }
}

function formatPercentage(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '0.00%';
    }
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function updateStats(data) {
    document.getElementById('highPerformersCount').textContent = data.highPerformers.length;
    document.getElementById('opportunitiesCount').textContent = data.opportunities.length;
    document.getElementById('topPerformersCount').textContent = data.topPerformers.length;
    document.getElementById('totalAnalyzed').textContent = '100';
}

function displayResults(data) {
    analysisData = data;

    // Update statistics
    updateStats(data);

    // Show stats section
    document.getElementById('statsSection').style.display = 'block';
    setTimeout(() => {
        document.getElementById('statsGrid').classList.add('loaded');
    }, 100);

    // Display High Performers
    if (data.highPerformers.length > 0) {
        const highPerformersGrid = document.getElementById('highPerformersGrid');
        highPerformersGrid.innerHTML = data.highPerformers
            .map((coin, index) => createCryptoCard(coin, index))
            .join('');

        document.getElementById('highPerformersSection').style.display = 'block';
        setTimeout(() => {
            document.getElementById('highPerformersSection').classList.add('loaded');
        }, 200);
    }

    // Display Opportunities
    if (data.opportunities.length > 0) {
        const opportunitiesGrid = document.getElementById('opportunitiesGrid');
        opportunitiesGrid.innerHTML = data.opportunities
            .map((coin, index) => createCryptoCard(coin, index))
            .join('');

        document.getElementById('opportunitiesSection').style.display = 'block';
        setTimeout(() => {
            document.getElementById('opportunitiesSection').classList.add('loaded');
        }, 300);
    }

    // Display Top Performers
    if (data.topPerformers.length > 0) {
        const topPerformersGrid = document.getElementById('topPerformersGrid');
        topPerformersGrid.innerHTML = data.topPerformers
            .map((coin, index) => createCryptoCard(coin, index))
            .join('');

        document.getElementById('topPerformersSection').style.display = 'block';
        setTimeout(() => {
            document.getElementById('topPerformersSection').classList.add('loaded');
        }, 400);
    }

    // Update last update time
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.textContent = `Última atualização: ${data.lastUpdate.toLocaleString('pt-BR')}`;
    lastUpdate.style.display = 'block';
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = `❌ ${message}`;
    errorElement.style.display = 'block';

    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

async function analyzeMarket() {
    const button = document.getElementById('analyzeButton');
    const buttonText = document.getElementById('buttonText');

    // Disable button and show loading
    button.disabled = true;
    buttonText.innerHTML = '<div class="button-spinner"></div>Analisando...';

    // Hide error message
    document.getElementById('errorMessage').style.display = 'none';

    try {
        const cryptoData = await fetchCryptoData();

        if (!cryptoData || cryptoData.length === 0) {
            throw new Error('Nenhum dado de criptomoeda foi retornado');
        }

        await new Promise(resolve => setTimeout(resolve, 3000));

        const analysisResults = analyzeMarketData(cryptoData);
        displayResults(analysisResults);

    } catch (error) {
        console.error('Erro na análise:', error);
        showError(`Erro ao analisar mercado: ${error.message}`);
        updateStatus('error', 'Erro na conexão');
    } finally {
        // Re-enable button
        button.disabled = false;
        buttonText.textContent = 'Atualizar';
    }
}

function activateGlitch() {
    // Easter egg - Matrix glitch effect
    document.body.style.animation = 'glitch 0.3s ease-in-out';

    setTimeout(() => {
        document.body.style.animation = 'none';
    }, 300);

    // Add some random floating shapes
    const shapes = document.querySelector('.floating-shapes');
    for (let i = 0; i < 12; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDuration = (Math.random() * 3 + 2) + 's';
        shapes.appendChild(shape);

        setTimeout(() => {
            shape.remove();
        }, 5000);
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const loadingManager = new LoadingManager();
    await loadingManager.startLoading();

    // Auto-analyze market on page load
    setTimeout(() => {
        analyzeMarket();
    }, 500);
});

// Create floating shapes on load
function createFloatingShapes() {
    const shapesContainer = document.querySelector('.floating-shapes');

    for (let i = 0; i < 12; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDuration = (Math.random() * 10 + 15) + 's';
        shape.style.animationDelay = Math.random() * 2 + 's';

        if (Math.random() > 0.5) {
            shape.style.borderRadius = '50%';
        }

        shapesContainer.appendChild(shape);
    }
}

// Initialize floating shapes
createFloatingShapes();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        analyzeMarket();
    }

    if (e.key === 'Escape') {
        if (isAutoRefreshing) {
            autoRefresh();
        }
    }
});