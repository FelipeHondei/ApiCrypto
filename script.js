let analysisData = {
    highPerformers: [],
    opportunities: [],
    topPerformers: [],
    lastUpdate: null
};
let allCoinsData = [];
let filteredCoinsData = [];
let currentSortBy = 'rank';
let currentSortOrder = 'asc';
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
    if (!cryptoData || cryptoData.length === 0) {
        console.warn('Dados de criptomoedas vazios ou inválidos');
        return {
            highPerformers: [],
            opportunities: [],
            topPerformers: [],
            lastUpdate: new Date()
        };
    }

    const highPerformers = [];
    const opportunities = [];
    const topPerformers = [];

    cryptoData.forEach((coin, index) => {
        // Tentar diferentes propriedades da API
        const change24h = parseFloat(coin.percent_change_24h || coin.change24h || 0);
        const change7d = parseFloat(coin.percent_change_7d || coin.change7d || 0);
        
        // Limpar e converter preço
        let priceValue = coin.price_usd || coin.price || '0';
        if (typeof priceValue === 'string') {
            priceValue = priceValue.replace(/[$,]/g, '');
        }
        const price = parseFloat(priceValue) || 0;
        
        const rank = parseInt(coin.rank) || (index + 1);
        const marketCap = parseFloat(coin.market_cap_usd || coin.marketCap || 0);

        const coinData = {
            name: coin.name || 'Unknown',
            symbol: coin.symbol || 'N/A',
            price: price,
            change24h: change24h,
            change7d: change7d,
            rank: rank,
            marketCap: marketCap
        };

        // Categorizar moedas baseado nos critérios
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

    // Ordenar arrays
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

    const rankBadge = (coin.rank && coin.rank <= 10) ? `<div class="rank-badge">${coin.rank}</div>` : '';

    return `
        <div class="crypto-card" style="animation-delay: ${index * 0.1}s">
            ${rankBadge}
            <div class="crypto-header">
                <div class="crypto-name">${coin.name || 'N/A'}</div>
                <div class="crypto-symbol">${coin.symbol || 'N/A'}</div>
            </div>
            <div class="crypto-price">$${priceFormatted}</div>
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
    // Verificar se price é válido
    if (price === null || price === undefined || isNaN(price) || price === 0) {
        return '0.00';
    }
    
    const numPrice = parseFloat(price);
    
    if (numPrice >= 1) {
        return numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (numPrice >= 0.01) {
        return numPrice.toFixed(4);
    } else if (numPrice > 0) {
        return numPrice.toFixed(8);
    } else {
        return '0.00';
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

function displayAllCoins(data) {
    if (!data || data.length === 0) {
        console.warn('Dados vazios para displayAllCoins');
        return;
    }

    // Processar dados para garantir compatibilidade
    const processedData = data.map((coin, index) => ({
        name: coin.name || 'Unknown',
        symbol: coin.symbol || 'N/A',
        price: parseFloat(coin.price_usd || coin.price || 0),
        change24h: parseFloat(coin.percent_change_24h || coin.change24h || 0),
        change7d: parseFloat(coin.percent_change_7d || coin.change7d || 0),
        rank: parseInt(coin.rank) || (index + 1),
        marketCap: parseFloat(coin.market_cap_usd || coin.marketCap || 0)
    }));

    allCoinsData = [...processedData];
    filteredCoinsData = [...processedData];
    
    // Renderizar tabela
    renderCoinsTable();
    
    // Mostrar seção
    const allCoinsSection = document.getElementById('allCoinsSection');
    if (allCoinsSection) {
        allCoinsSection.style.display = 'block';
        setTimeout(() => {
            allCoinsSection.classList.add('loaded');
        }, 500);
    }
    
    // Setup event listeners
    setupTableEventListeners();
}

function fixSelectStyling() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        // Forçar estilo correto
        sortSelect.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary');
        sortSelect.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
        sortSelect.style.border = '1px solid ' + getComputedStyle(document.documentElement).getPropertyValue('--border-primary');
        
        // Aplicar estilo às opções
        Array.from(sortSelect.options).forEach(option => {
            option.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary');
            option.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
        });
    }
}

function renderCoinsTable() {
    const tbody = document.getElementById('coinsTableBody');
    
    if (!tbody) {
        console.error('Elemento coinsTableBody não encontrado');
        return;
    }
    
    if (!filteredCoinsData || filteredCoinsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhuma moeda encontrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredCoinsData.map(coin => {
        // Garantir que os dados existem e são válidos
        const coinName = coin.name || 'N/A';
        const coinSymbol = coin.symbol || 'N/A';
        const coinRank = coin.rank || 0;
        const coinPrice = parseFloat(coin.price || coin.price_usd || 0);
        const change24h = parseFloat(coin.change24h || coin.percent_change_24h || 0);
        const change7d = parseFloat(coin.change7d || coin.percent_change_7d || 0);
        const marketCap = parseFloat(coin.marketCap || coin.market_cap_usd || 0);
        
        // Definir classes de cor baseadas nos valores
        const change24hClass = change24h > 0 ? 'change-positive' : change24h < 0 ? 'change-negative' : 'change-neutral';
        const change7dClass = change7d > 0 ? 'change-positive' : change7d < 0 ? 'change-negative' : 'change-neutral';
        
        return `
            <tr data-coin="${coinSymbol}" style="background: transparent;">
                <td style="color: var(--accent-primary); font-weight: 700;"><span class="coin-rank">${coinRank}</span></td>
                <td>
                    <div class="coin-info">
                        <span class="coin-symbol">${coinSymbol}</span>
                        <span class="coin-name">${coinName}</span>
                    </div>
                </td>
                <td class="coin-price" style="color: var(--accent-primary); font-weight: 600;">$${formatPrice(coinPrice)}</td>
                <td class="${change24hClass}" style="font-weight: 600;">${formatPercentage(change24h)}</td>
                <td class="${change7dClass}" style="font-weight: 600;">${formatPercentage(change7d)}</td>
                <td class="market-cap" style="color: var(--text-secondary);">$${formatMarketCap(marketCap)}</td>
            </tr>
        `;
    }).join('');
}

function formatMarketCap(marketCap) {
    // Verificar se marketCap é válido
    if (marketCap === null || marketCap === undefined || isNaN(marketCap) || marketCap === 0) {
        return '0';
    }
    
    const numMarketCap = parseFloat(marketCap);
    
    if (numMarketCap >= 1e12) {
        return (numMarketCap / 1e12).toFixed(2) + 'T';
    } else if (numMarketCap >= 1e9) {
        return (numMarketCap / 1e9).toFixed(2) + 'B';
    } else if (numMarketCap >= 1e6) {
        return (numMarketCap / 1e6).toFixed(2) + 'M';
    } else if (numMarketCap >= 1e3) {
        return (numMarketCap / 1e3).toFixed(2) + 'K';
    }
    return numMarketCap.toFixed(2);
}

function setupTableEventListeners() {
    const searchInput = document.getElementById('coinSearch');
    const sortSelect = document.getElementById('sortSelect');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredCoinsData = allCoinsData.filter(coin => 
                coin.name.toLowerCase().includes(searchTerm) || 
                coin.symbol.toLowerCase().includes(searchTerm)
            );
            sortCoinsData();
            renderCoinsTable();
        });
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortBy = e.target.value;
            sortCoinsData();
            renderCoinsTable();
        });
    }
    
    // Click on table rows for interaction
    const tableBody = document.getElementById('coinsTableBody');
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (row && row.dataset.coin) {
                const coinSymbol = row.dataset.coin;
                highlightCoin(coinSymbol);
            }
        });
    }
}

function sortCoinsData() {
    filteredCoinsData.sort((a, b) => {
        let aValue = a[currentSortBy];
        let bValue = b[currentSortBy];
        
        // Conversão para números quando necessário
        if (currentSortBy === 'price' || currentSortBy === 'change24h' || currentSortBy === 'marketCap' || currentSortBy === 'rank') {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
        }
        
        // Ordenação por string (nome)
        if (currentSortBy === 'name') {
            return currentSortOrder === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        // Ordenação numérica
        if (currentSortOrder === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
}

function highlightCoin(symbol) {
    // Remove highlight anterior
    document.querySelectorAll('.coin-highlighted').forEach(el => {
        el.classList.remove('coin-highlighted');
    });
    
    // Adiciona highlight à linha clicada
    const targetRow = document.querySelector(`tr[data-coin="${symbol}"]`);
    if (targetRow) {
        targetRow.classList.add('coin-highlighted');
        
        // Remove highlight após 3 segundos
        setTimeout(() => {
            targetRow.classList.remove('coin-highlighted');
        }, 3000);
    }
    
    // Scroll suave para mostrar outras seções dessa moeda
    scrollToOtherCoinSections(symbol);
}

function scrollToOtherCoinSections(symbol) {
    // Procura pela moeda nas outras seções e destaca
    const sections = ['highPerformersGrid', 'opportunitiesGrid', 'topPerformersGrid'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const cards = section.querySelectorAll('.crypto-card');
            cards.forEach(card => {
                const cardSymbol = card.querySelector('.crypto-symbol')?.textContent;
                if (cardSymbol === symbol) {
                    card.classList.add('coin-highlighted');
                    setTimeout(() => {
                        card.classList.remove('coin-highlighted');
                    }, 3000);
                }
            });
        }
    });
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
        
        // ADICIONE esta linha após displayResults:
        displayAllCoins(cryptoData);

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

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.themeToggle = null;
        this.themeLabel = null;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupToggle();
        this.setupSystemThemeListener();
        this.setupKeyboardShortcuts();
    }

    getPreferredTheme() {
        // Detecta preferência do sistema
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('crypto-analyzer-theme');
        } catch (e) {
            console.warn('LocalStorage não disponível, usando tema padrão');
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('crypto-analyzer-theme', theme);
        } catch (e) {
            console.warn('Não foi possível salvar a preferência de tema');
        }
    }

    setTheme(theme) {
        const root = document.documentElement;
        const body = document.body;

        // Adiciona classe para desabilitar transições durante a mudança
        body.classList.add('theme-switching');

        // Define o tema
        root.setAttribute('data-theme', theme);
        this.currentTheme = theme;

        // Remove classe após um frame para reativar transições
        requestAnimationFrame(() => {
            body.classList.remove('theme-switching');
        });

        // Atualiza elementos específicos
        this.updateThemeElements(theme);

        // Salva preferência
        this.storeTheme(theme);

        // Dispara evento customizado
        this.dispatchThemeEvent(theme);
    }

    updateThemeElements(theme) {
        if (!this.themeLabel) return;

        // Atualiza texto do label
        this.themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';

        // Atualiza aria-label para acessibilidade
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label',
                `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
            );
        }
    }

    setupToggle() {
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initToggleElements());
        } else {
            this.initToggleElements();
        }
    }

    initToggleElements() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeLabel = document.getElementById('themeLabel');

        if (this.themeToggle && this.themeLabel) {
            this.updateThemeElements(this.currentTheme);
        }
    }

    setupSystemThemeListener() {
        // Escuta mudanças na preferência do sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addListener((e) => {
            // Só muda automaticamente se não há preferência salva
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T para alternar tema
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';

        // Adiciona efeito visual de transição
        this.addToggleEffect();

        // Pequeno delay para o efeito visual
        setTimeout(() => {
            this.setTheme(newTheme);
            this.isTransitioning = false;
        }, 150);
    }

    addToggleEffect() {
        // Efeito de "flash" suave durante a transição
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${this.currentTheme === 'dark' ? 'white' : 'black'};
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.15s ease;
        `;

        document.body.appendChild(overlay);

        // Trigger reflow
        overlay.offsetHeight;

        // Fade in
        overlay.style.opacity = '0.1';

        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 150);
        }, 75);
    }

    dispatchThemeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme, previousTheme: this.currentTheme === 'dark' ? 'light' : 'dark' }
        });
        document.dispatchEvent(event);
    }

    // Método público para obter tema atual
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Método público para definir tema programaticamente
    setThemeManual(theme) {
        if (['dark', 'light'].includes(theme)) {
            this.setTheme(theme);
        }
    }
}

let themeManager;

function toggleTheme() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();

    // Integra com o sistema de loading existente
    integrateWithLoadingSystem();

    // Integra com efeitos visuais existentes
    integrateWithVisualEffects();
});

function integrateWithLoadingSystem() {
    // Escuta mudanças de tema para atualizar loading screen
    document.addEventListener('themeChanged', (e) => {
        const { theme } = e.detail;

        // Atualiza cores do loading screen se estiver ativo
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            updateLoadingScreenTheme(theme);
        }
    });
}

function updateLoadingScreenTheme(theme) {
    const progressBar = document.getElementById('progressBar');
    const cryptoRain = document.getElementById('cryptoRain');

    if (progressBar) {
        progressBar.style.background = theme === 'dark'
            ? 'linear-gradient(90deg, #00d4ff, #1e90ff, #7b68ee)'
            : 'linear-gradient(90deg, #0066cc, #0080ff, #4d79ff)';
    }

    // Atualiza opacidade da chuva de crypto para light mode
    if (cryptoRain) {
        const columns = cryptoRain.querySelectorAll('.crypto-column');
        columns.forEach(column => {
            column.style.opacity = theme === 'light' ? '0.3' : '0.4';
        });
    }
}

function integrateWithVisualEffects() {
    // Atualiza cores dos efeitos visuais baseado no tema
    document.addEventListener('themeChanged', (e) => {
        const { theme } = e.detail;
        updateVisualEffectsTheme(theme);
    });
}

function updateVisualEffectsTheme(theme) {
    // Atualiza variáveis CSS customizadas para efeitos
    const root = document.documentElement;

    if (theme === 'light') {
        root.style.setProperty('--particle-color', '#1a1a1a');
        root.style.setProperty('--glow-color', 'rgba(0, 102, 204, 0.15)');
    } else {
        root.style.setProperty('--particle-color', '#ffffff');
        root.style.setProperty('--glow-color', 'rgba(0, 212, 255, 0.2)');
    }
}

// Função para outros scripts obterem o tema atual
function getCurrentTheme() {
    return themeManager ? themeManager.getCurrentTheme() : 'dark';
}

// Função para outros scripts definirem tema programaticamente
function setTheme(theme) {
    if (themeManager) {
        themeManager.setThemeManual(theme);
    }
}

// Detecta se o usuário prefere reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Aplica tema com animação reduzida se necessário
function setThemeWithMotionPreference(theme) {
    if (prefersReducedMotion()) {
        document.body.classList.add('reduce-motion');
    }
    setTheme(theme);
}

// Previne flash of unstyled content
(function () {
    const savedTheme = localStorage.getItem('crypto-analyzer-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();

// Export para uso em outros módulos (se usando módulos ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, toggleTheme, getCurrentTheme, setTheme };
}
document.addEventListener('themeChanged', () => {
    setTimeout(fixSelectStyling, 100);
});

// Chamar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(fixSelectStyling, 100);
});

// Forçar atualização da tabela quando necessário
function forceTableUpdate() {
    if (allCoinsData.length > 0) {
        renderCoinsTable();
        fixSelectStyling();
    }
}