// PWA Dashboard Application with exact visual style implementation - FIXED
class PWADashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.isOffline = false;
        this.deferredPrompt = null;
        
        // Application data (exactly from provided JSON)
        this.data = {
            metrics: {
                organicTraffic: 15420,
                keywordRankings: 287,
                qualityBacklinks: 1245,
                sitePerformance: 87,
                trafficDataPoints: [2400, 1800, 3200, 2900, 3800, 4200, 3600],
                trafficSources: [45, 25, 15, 15],
                keywordDistribution: [28, 18, 12, 8]
            },
            seoData: {
                organicKeywords: 1567,
                organicImpressions: 87654,
                organicCTR: 4.8,
                averagePosition: 12.3,
                topPages: [
                    {"url": "yourwebsite.com/blog/seo-tips", "traffic": 5200, "keywords": 120, "position": 2.1},
                    {"url": "yourwebsite.com/services/digital-marketing", "traffic": 3100, "keywords": 85, "position": 4.5},
                    {"url": "yourwebsite.com/contact-us", "traffic": 1800, "keywords": 30, "position": 7.8},
                    {"url": "yourwebsite.com/pricing", "traffic": 950, "keywords": 15, "position": 10.2}
                ],
                keywordAnalysis: [
                    {"keyword": "digital marketing trends", "volume": "12,000", "competition": "High", "cpc": "€3.50", "relevance": "92%"},
                    {"keyword": "seo services france", "volume": "5,000", "competition": "Medium", "cpc": "€2.10", "relevance": "88%"},
                    {"keyword": "ai in marketing", "volume": "25,000", "competition": "Very High", "cpc": "€4.80", "relevance": "95%"},
                    {"keyword": "local seo agency", "volume": "800", "competition": "Low", "cpc": "€1.20", "relevance": "75%"}
                ],
                technicalIssues: [
                    {"type": "High", "description": "Missing H1 tag on 3 pages", "solution": "Add H1 tags to the identified pages for better content structure."},
                    {"type": "Medium", "description": "Slow loading images detected (average 2.5s)", "solution": "Optimize image sizes and consider lazy loading for improved speed."},
                    {"type": "Low", "description": "Broken internal link count: 5", "solution": "Identify and fix the broken internal links to improve user experience and crawlability."}
                ],
                backlinkData: {
                    domainAuthority: 68,
                    totalBacklinks: 15000,
                    referringDomains: 850,
                    newBacklinksLastMonth: 55,
                    lostBacklinksLastMonth: 12,
                    topReferringDomains: ["exampleblog.com", "industryauthority.net", "partnerwebsite.org"]
                }
            },
            seaData: {
                campaigns: [
                    {"name": "Summer Sale 2025", "status": "Active", "budget": "€5,000", "spend": "€3,200", "roi": "+25%"},
                    {"name": "New Product Launch", "status": "Active", "budget": "€10,000", "spend": "€8,500", "roi": "+15%"},
                    {"name": "Brand Awareness Q3", "status": "Paused", "budget": "€3,000", "spend": "€1,800", "roi": "-5%"},
                    {"name": "Remarketing Campaign", "status": "Active", "budget": "€2,000", "spend": "€1,900", "roi": "+30%"}
                ]
            },
            insights: [
                {"type": "high-priority", "title": "Opportunité SEO Détectée", "description": "15 nouveaux mots-clés à faible concurrence identifiés dans votre niche"},
                {"type": "medium-priority", "title": "Baisse de Performance", "description": "3 pages importantes ont perdu des positions cette semaine"},
                {"type": "info-priority", "title": "Objectif Atteint", "description": "Votre campagne SEA a dépassé l'objectif de conversions de 23%"}
            ],
            reports: [
                {"name": "Monthly SEO Performance Report", "icon": "📊", "link": "#"},
                {"name": "Weekly SEA Campaign Summary", "icon": "📈", "link": "#"},
                {"name": "Keyword Gap Analysis Report", "icon": "🔑", "link": "#"},
                {"name": "Website Health Audit", "icon": "🏥", "link": "#"}
            ],
            settings: [
                {"name": "Account Profile", "description": "Manage your personal details and subscription.", "icon": "👤"},
                {"name": "Integrations", "description": "Connect with Google Analytics, Search Console, CRM, etc.", "icon": "🧩"},
                {"name": "Notifications", "description": "Configure email and in-app alert preferences.", "icon": "🔔"},
                {"name": "Billing & Plans", "description": "View invoices and manage your subscription plan.", "icon": "💳"},
                {"name": "API Access", "description": "Manage API keys for external applications.", "icon": "🔐"}
            ]
        };

        this.init();
    }

    async init() {
        await this.setupPWA();
        this.setupEventListeners();
        this.checkConnectivity();
        this.showApp();
        this.initCharts();
        this.populateContent();
        this.animateCounters();
        this.applyFadeInAnimations();
    }

    async setupPWA() {
        // Create and inject manifest
        const manifest = {
            name: "SEO-SEA Dashboard Pro",
            short_name: "SEO Dashboard",
            description: "Professional SEO & SEA analytics dashboard with AI integration",
            start_url: "/",
            display: "standalone",
            background_color: "#0f0f23",
            theme_color: "#6366f1",
            orientation: "portrait-primary",
            icons: [
                {
                    src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' rx='48' fill='%236366f1'/><text x='96' y='120' text-anchor='middle' fill='white' font-size='72' font-weight='bold'>S</text></svg>",
                    sizes: "192x192",
                    type: "image/svg+xml"
                },
                {
                    src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='128' fill='%236366f1'/><text x='256' y='320' text-anchor='middle' fill='white' font-size='192' font-weight='bold'>S</text></svg>",
                    sizes: "512x512",
                    type: "image/svg+xml"
                }
            ]
        };

        const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(manifestBlob);
        document.getElementById('manifest-placeholder').href = manifestURL;

        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register(this.createServiceWorker());
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }

        // Handle PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showPWAInstallBanner();
        });
    }

    createServiceWorker() {
        const swCode = `
            const CACHE_NAME = 'seo-dashboard-v1';
            const urlsToCache = [
                '/',
                '/style.css',
                '/app.js',
                'https://cdn.jsdelivr.net/npm/chart.js'
            ];

            self.addEventListener('install', (event) => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.addAll(urlsToCache))
                );
            });

            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request)
                        .then((response) => {
                            if (response) {
                                return response;
                            }
                            return fetch(event.request).catch(() => {
                                if (event.request.destination === 'document') {
                                    return caches.match('/');
                                }
                            });
                        })
                );
            });

            self.addEventListener('sync', (event) => {
                if (event.tag === 'background-sync') {
                    event.waitUntil(doBackgroundSync());
                }
            });

            function doBackgroundSync() {
                return Promise.resolve();
            }
        `;

        const swBlob = new Blob([swCode], { type: 'application/javascript' });
        return URL.createObjectURL(swBlob);
    }

    showPWAInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        banner.classList.remove('hidden');
    }

    setupEventListeners() {
        // PWA Install
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (this.deferredPrompt) {
                    this.deferredPrompt.prompt();
                    const result = await this.deferredPrompt.userChoice;
                    if (result.outcome === 'accepted') {
                        console.log('PWA installed');
                    }
                    this.deferredPrompt = null;
                    document.getElementById('pwa-install-banner').classList.add('hidden');
                }
            });
        }

        const dismissBtn = document.getElementById('pwa-dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                document.getElementById('pwa-install-banner').classList.add('hidden');
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('collapsed');
            });
        }

        // Navigation with hover effects - FIXED
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                console.log('Navigating to section:', section); // Debug log
                this.navigateToSection(section);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Form submissions with AI thinking effects - FIXED
        setTimeout(() => {
            const analyzeBtn = document.getElementById('analyze-keywords');
            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', () => {
                    this.analyzeKeywords();
                });
            }

            const auditBtn = document.getElementById('start-audit');
            if (auditBtn) {
                auditBtn.addEventListener('click', () => {
                    this.startTechnicalAudit();
                });
            }

            const generateBtn = document.getElementById('generate-content');
            if (generateBtn) {
                generateBtn.addEventListener('click', () => {
                    this.generateContent();
                });
            }

            const analyzeContentBtn = document.getElementById('analyze-content');
            if (analyzeContentBtn) {
                analyzeContentBtn.addEventListener('click', () => {
                    this.analyzeContent();
                });
            }
        }, 1000);

        // Connectivity events
        window.addEventListener('online', () => {
            this.isOffline = false;
            this.updateConnectivityStatus();
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
            this.updateConnectivityStatus();
        });
    }

    navigateToSection(section) {
        console.log('Setting active section to:', section); // Debug log
        
        // Update active nav item with animation
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-section="${section}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update content sections with fadeIn animation - FIXED
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        const targetSection = document.getElementById(`section-${section}`);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Activated section:', `section-${section}`); // Debug log
        } else {
            console.warn('Section not found:', `section-${section}`); // Debug log
        }

        // Update header
        this.updatePageHeader(section);
        this.currentSection = section;

        // Load section-specific data if needed
        this.loadSectionData(section);

        // Apply fade in animations to new content
        setTimeout(() => {
            this.applyFadeInAnimations();
        }, 100);
    }

    updatePageHeader(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'seo-dashboard': 'SEO Dashboard', 
            'keywords': 'Analyse des Mots-clés',
            'audit': 'Audit Technique',
            'backlinks': 'Analyse des Backlinks',
            'campaigns': 'Campagnes SEA',
            'ads': 'Performance Publicitaire',
            'content-gen': 'Génération de Contenu IA',
            'content-analysis': 'Analyse de Contenu',
            'reports': 'Rapports',
            'analytics': 'Analytics Avancées',
            'settings': 'Paramètres'
        };

        const breadcrumbs = {
            'dashboard': 'Accueil / Dashboard',
            'seo-dashboard': 'SEO / Dashboard',
            'keywords': 'SEO / Mots-clés', 
            'audit': 'SEO / Audit Technique',
            'backlinks': 'SEO / Backlinks',
            'campaigns': 'SEA / Campagnes',
            'ads': 'SEA / Publicités',
            'content-gen': 'Contenu / Génération IA',
            'content-analysis': 'Contenu / Analyse',
            'reports': 'Système / Rapports',
            'analytics': 'Système / Analytics',
            'settings': 'Système / Paramètres'
        };

        const titleEl = document.getElementById('page-title');
        const breadcrumbEl = document.getElementById('breadcrumb-path');
        
        if (titleEl) titleEl.textContent = titles[section] || section;
        if (breadcrumbEl) breadcrumbEl.textContent = breadcrumbs[section] || section;
    }

    loadSectionData(section) {
        switch (section) {
            case 'seo-dashboard':
                this.loadSEODashboard();
                break;
            case 'keywords':
                this.loadKeywordsSection();
                break;
            case 'audit':
                this.loadAuditSection();
                break;
            case 'backlinks':
                this.loadBacklinksSection();
                break;
            case 'campaigns':
                this.loadCampaignsSection();
                break;
            case 'ads':
                this.loadAdsSection();
                break;
            case 'reports':
                this.loadReportsSection();
                break;
            case 'analytics':
                this.loadAnalyticsSection();
                break;
            case 'settings':
                this.loadSettingsSection();
                break;
        }
    }

    showApp() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('app').classList.remove('hidden');
            // Apply fadeIn animation to the entire app
            document.getElementById('app').style.animation = 'fadeIn 0.6s ease-in-out';
        }, 3000); // Extended loading time to show beautiful gradient hero
    }

    checkConnectivity() {
        this.isOffline = !navigator.onLine;
        this.updateConnectivityStatus();
    }

    updateConnectivityStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        const offlineNotice = document.getElementById('offline-notice');

        if (this.isOffline) {
            if (statusIndicator) statusIndicator.classList.remove('online');
            if (statusText) statusText.textContent = 'Hors ligne';
            if (offlineNotice) offlineNotice.classList.remove('hidden');
        } else {
            if (statusIndicator) statusIndicator.classList.add('online');
            if (statusText) statusText.textContent = 'En ligne';
            if (offlineNotice) offlineNotice.classList.add('hidden');
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        const themeText = document.querySelector('.theme-text');
        
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Mode Sombre';
        } else {
            body.classList.add('dark');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Mode Clair';
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-animate]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-animate'));
            if (isNaN(target)) return;
            
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    }

    applyFadeInAnimations() {
        // Apply fadeIn animation to metric cards
        const metricCards = document.querySelectorAll('.metric-card[data-animate="fadeIn"]');
        metricCards.forEach((card, index) => {
            card.style.animation = `fadeIn 0.6s ease-in-out ${index * 0.1}s both`;
        });
    }

    initCharts() {
        setTimeout(() => {
            this.createTrafficChart();
            this.createSourcesChart();
        }, 500);
    }

    createTrafficChart() {
        const canvas = document.getElementById('trafficChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.charts.traffic = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Trafic Organique',
                    data: this.data.metrics.trafficDataPoints,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255,255,255,0.7)'
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255,255,255,0.7)'
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                }
            }
        });
    }

    createSourcesChart() {
        const canvas = document.getElementById('sourcesChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.charts.sources = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Organique', 'Direct', 'Social', 'Référent'],
                datasets: [{
                    data: this.data.metrics.trafficSources,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255,255,255,0.7)',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    populateContent() {
        // Load all sections on startup
        this.loadSEODashboard();
        this.loadKeywordsSection();
        this.loadAuditSection();
        this.loadBacklinksSection();
        this.loadCampaignsSection();
        this.loadReportsSection();
        this.loadSettingsSection();
    }

    loadSEODashboard() {
        const topPagesGrid = document.getElementById('top-pages-grid');
        if (!topPagesGrid) return;

        topPagesGrid.innerHTML = '';
        
        this.data.seoData.topPages.forEach((page, index) => {
            const pageCard = document.createElement('div');
            pageCard.className = 'page-card glass-morphism';
            pageCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
            pageCard.innerHTML = `
                <div class="page-url">${page.url}</div>
                <div class="page-metrics">
                    <div class="page-metric">
                        <div class="page-metric-value">${page.traffic.toLocaleString()}</div>
                        <div class="page-metric-label">Trafic</div>
                    </div>
                    <div class="page-metric">
                        <div class="page-metric-value">${page.keywords}</div>
                        <div class="page-metric-label">Keywords</div>
                    </div>
                    <div class="page-metric">
                        <div class="page-metric-value">${page.position}</div>
                        <div class="page-metric-label">Position</div>
                    </div>
                </div>
            `;
            topPagesGrid.appendChild(pageCard);
        });
    }

    loadKeywordsSection() {
        const keywordResults = document.getElementById('keyword-results');
        if (!keywordResults) return;

        keywordResults.innerHTML = '';
        
        // Load default keyword data
        this.data.seoData.keywordAnalysis.forEach((keyword, index) => {
            const keywordCard = document.createElement('div');
            keywordCard.className = 'keyword-card glass-morphism';
            keywordCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
            keywordCard.innerHTML = `
                <div class="keyword-term">${keyword.keyword}</div>
                <div class="keyword-metric">
                    <div class="keyword-metric-value">${keyword.volume}</div>
                    <div class="keyword-metric-label">Volume</div>
                </div>
                <div class="keyword-metric">
                    <div class="keyword-metric-value">${keyword.competition}</div>
                    <div class="keyword-metric-label">Concurrence</div>
                </div>
                <div class="keyword-metric">
                    <div class="keyword-metric-value">${keyword.cpc}</div>
                    <div class="keyword-metric-label">CPC</div>
                </div>
                <div class="keyword-metric">
                    <div class="keyword-metric-value">${keyword.relevance}</div>
                    <div class="keyword-metric-label">Pertinence</div>
                </div>
            `;
            keywordResults.appendChild(keywordCard);
        });
    }

    loadAuditSection() {
        const auditResults = document.getElementById('audit-results');
        if (!auditResults) return;

        auditResults.innerHTML = '';
        
        // Load default audit data
        this.data.seoData.technicalIssues.forEach((issue, index) => {
            const issueCard = document.createElement('div');
            issueCard.className = `issue-card glass-morphism ${issue.type.toLowerCase()}`;
            issueCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
            issueCard.innerHTML = `
                <div class="issue-header">
                    <span class="issue-type ${issue.type.toLowerCase()}">${issue.type}</span>
                </div>
                <div class="issue-description">${issue.description}</div>
                <div class="issue-solution">${issue.solution}</div>
            `;
            auditResults.appendChild(issueCard);
        });
    }

    loadBacklinksSection() {
        const backlinkMetrics = document.getElementById('backlink-metrics');
        if (!backlinkMetrics) return;

        const backlinks = this.data.seoData.backlinkData;
        backlinkMetrics.innerHTML = `
            <div class="metric-card glass-morphism">
                <div class="metric-header">
                    <span class="metric-icon">🎯</span>
                    <span class="metric-label">Domain Authority</span>
                </div>
                <div class="metric-value">${backlinks.domainAuthority}</div>
                <div class="metric-change positive">+2.3%</div>
            </div>
            <div class="metric-card glass-morphism">
                <div class="metric-header">
                    <span class="metric-icon">🔗</span>
                    <span class="metric-label">Total Backlinks</span>
                </div>
                <div class="metric-value">${backlinks.totalBacklinks.toLocaleString()}</div>
                <div class="metric-change positive">+${backlinks.newBacklinksLastMonth}</div>
            </div>
            <div class="metric-card glass-morphism">
                <div class="metric-header">
                    <span class="metric-icon">🌐</span>
                    <span class="metric-label">Domaines Référents</span>
                </div>
                <div class="metric-value">${backlinks.referringDomains}</div>
                <div class="metric-change positive">+12</div>
            </div>
            <div class="metric-card glass-morphism">
                <div class="metric-header">
                    <span class="metric-icon">📈</span>
                    <span class="metric-label">Nouveaux ce mois</span>
                </div>
                <div class="metric-value">${backlinks.newBacklinksLastMonth}</div>
                <div class="metric-change negative">-${backlinks.lostBacklinksLastMonth}</div>
            </div>
        `;
    }

    loadCampaignsSection() {
        const campaignsGrid = document.getElementById('campaigns-grid');
        if (!campaignsGrid) return;

        campaignsGrid.innerHTML = '';
        
        this.data.seaData.campaigns.forEach((campaign, index) => {
            const campaignCard = document.createElement('div');
            campaignCard.className = 'campaign-card glass-morphism';
            campaignCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
            campaignCard.innerHTML = `
                <div class="campaign-header">
                    <div class="campaign-name">${campaign.name}</div>
                    <span class="campaign-status ${campaign.status.toLowerCase()}">${campaign.status}</span>
                </div>
                <div class="campaign-metrics">
                    <div class="campaign-metric">
                        <div class="campaign-metric-value">${campaign.budget}</div>
                        <div class="campaign-metric-label">Budget</div>
                    </div>
                    <div class="campaign-metric">
                        <div class="campaign-metric-value">${campaign.spend}</div>
                        <div class="campaign-metric-label">Dépensé</div>
                    </div>
                    <div class="campaign-metric">
                        <div class="campaign-metric-value">${campaign.roi}</div>
                        <div class="campaign-metric-label">ROI</div>
                    </div>
                </div>
            `;
            campaignsGrid.appendChild(campaignCard);
        });
    }

    loadAdsSection() {
        if (!document.getElementById('adPerformanceChart')) return;

        setTimeout(() => {
            const ctx = document.getElementById('adPerformanceChart').getContext('2d');
            this.charts.adPerformance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['CTR', 'CPC', 'Conversions', 'Quality Score'],
                    datasets: [{
                        label: 'Performance Publicitaire',
                        data: [4.2, 1.85, 156, 8.5],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: 'rgba(255,255,255,0.7)'
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255,255,255,0.7)'
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            }
                        }
                    }
                }
            });
        }, 300);
    }

    loadAnalyticsSection() {
        this.createCoreWebVitalsChart();
        this.createKeywordDistributionChart();
    }

    createCoreWebVitalsChart() {
        if (!document.getElementById('coreWebVitalsChart')) return;

        setTimeout(() => {
            const ctx = document.getElementById('coreWebVitalsChart').getContext('2d');
            this.charts.coreWebVitals = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'],
                    datasets: [{
                        label: 'Core Web Vitals',
                        data: [85, 92, 78, 88, 90],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.2)',
                        pointBackgroundColor: '#1FB8CD',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: 'rgba(255,255,255,0.7)'
                            }
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                color: 'rgba(255,255,255,0.7)'
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            },
                            pointLabels: {
                                color: 'rgba(255,255,255,0.7)'
                            }
                        }
                    }
                }
            });
        }, 300);
    }

    createKeywordDistributionChart() {
        if (!document.getElementById('keywordDistributionChart')) return;

        setTimeout(() => {
            const ctx = document.getElementById('keywordDistributionChart').getContext('2d');
            this.charts.keywordDistribution = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Top 3', 'Top 10', 'Top 50', 'Top 100'],
                    datasets: [{
                        label: 'Répartition des Mots-clés',
                        data: this.data.metrics.keywordDistribution,
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: 'rgba(255,255,255,0.7)'
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255,255,255,0.7)'
                            },
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            }
                        }
                    }
                }
            });
        }, 300);
    }

    loadReportsSection() {
        const reportsGrid = document.getElementById('reports-grid');
        if (!reportsGrid) return;

        reportsGrid.innerHTML = '';
        
        this.data.reports.forEach((report, index) => {
            const reportCard = document.createElement('a');
            reportCard.className = 'report-card glass-morphism';
            reportCard.href = report.link;
            reportCard.target = '_blank';
            reportCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
            reportCard.innerHTML = `
                <div class="report-icon" style="font-size: 2rem;">${report.icon}</div>
                <div class="report-name" style="margin-left: 1rem;">${report.name}</div>
            `;
            reportsGrid.appendChild(reportCard);
        });
    }

    loadSettingsSection() {
        const settingsGrid = document.getElementById('settings-grid');
        if (!settingsGrid) return;

        settingsGrid.innerHTML = '';
        
        this.data.settings.forEach((setting, index) => {
            const settingCard = document.createElement('div');
            settingCard.className = 'setting-card glass-morphism';
            settingCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
            settingCard.innerHTML = `
                <div class="setting-icon" style="font-size: 2rem; margin-right: 1rem;">${setting.icon}</div>
                <div class="setting-content">
                    <div class="setting-name" style="font-weight: 600; margin-bottom: 0.5rem;">${setting.name}</div>
                    <div class="setting-description" style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">${setting.description}</div>
                </div>
            `;
            settingsGrid.appendChild(settingCard);
        });
    }

    analyzeKeywords() {
        const input = document.getElementById('keyword-input');
        if (!input) return;
        
        const keywords = input.value.split('\n').filter(k => k.trim());
        
        if (keywords.length === 0) {
            alert('Veuillez entrer au moins un mot-clé à analyser.');
            return;
        }

        // Apply AI thinking animation
        this.simulateAIThinking('keyword-results', () => {
            const keywordResults = document.getElementById('keyword-results');
            if (!keywordResults) return;
            
            keywordResults.innerHTML = '';
            
            keywords.forEach((keyword, index) => {
                const mockData = this.generateMockKeywordData(keyword.trim());
                const keywordCard = document.createElement('div');
                keywordCard.className = 'keyword-card glass-morphism';
                keywordCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
                keywordCard.innerHTML = `
                    <div class="keyword-term">${mockData.keyword}</div>
                    <div class="keyword-metric">
                        <div class="keyword-metric-value">${mockData.volume}</div>
                        <div class="keyword-metric-label">Volume</div>
                    </div>
                    <div class="keyword-metric">
                        <div class="keyword-metric-value">${mockData.competition}</div>
                        <div class="keyword-metric-label">Concurrence</div>
                    </div>
                    <div class="keyword-metric">
                        <div class="keyword-metric-value">${mockData.cpc}</div>
                        <div class="keyword-metric-label">CPC</div>
                    </div>
                    <div class="keyword-metric">
                        <div class="keyword-metric-value">${mockData.relevance}</div>
                        <div class="keyword-metric-label">Pertinence</div>
                    </div>
                `;
                keywordResults.appendChild(keywordCard);
            });
        });
    }

    startTechnicalAudit() {
        const url = document.getElementById('audit-url');
        if (!url) return;
        
        if (!url.value) {
            alert('Veuillez entrer une URL à auditer.');
            return;
        }

        this.simulateAIThinking('audit-results', () => {
            const auditResults = document.getElementById('audit-results');
            if (!auditResults) return;
            
            auditResults.innerHTML = '';
            
            const mockIssues = this.generateMockAuditIssues(url.value);
            mockIssues.forEach((issue, index) => {
                const issueCard = document.createElement('div');
                issueCard.className = `issue-card glass-morphism ${issue.type.toLowerCase()}`;
                issueCard.style.animation = `slideUp 0.6s ease-in-out ${index * 0.1}s both`;
                issueCard.innerHTML = `
                    <div class="issue-header">
                        <span class="issue-type ${issue.type.toLowerCase()}">${issue.type}</span>
                    </div>
                    <div class="issue-description">${issue.description}</div>
                    <div class="issue-solution">${issue.solution}</div>
                `;
                auditResults.appendChild(issueCard);
            });
        });
    }

    generateContent() {
        const contentType = document.getElementById('content-type');
        const topic = document.getElementById('content-topic');
        const tone = document.getElementById('content-tone');
        
        if (!contentType || !topic || !tone) return;
        
        if (!topic.value) {
            alert('Veuillez entrer un sujet pour générer le contenu.');
            return;
        }

        const generatedContent = document.getElementById('generated-content');
        if (!generatedContent) return;
        
        generatedContent.innerHTML = '<div class="ai-thinking">🤖 Génération en cours par IA...</div>';
        generatedContent.classList.add('show');

        setTimeout(() => {
            const mockContent = this.generateMockContent(contentType.value, topic.value, tone.value);
            generatedContent.innerHTML = `
                <h4 style="color: white; margin-bottom: 1rem;">Contenu Généré (${contentType.value})</h4>
                <pre style="background: rgba(15,15,35,.9); color: rgba(255,255,255,0.9); padding: 1rem; border-radius: 8px; overflow-x: auto;">${mockContent}</pre>
                <button class="btn-primary" onclick="navigator.clipboard.writeText(\`${mockContent.replace(/`/g, '\\`')}\`); alert('Contenu copié!')">
                    📋 Copier
                </button>
            `;
        }, 3000); // Extended for AI thinking effect
    }

    analyzeContent() {
        const content = document.getElementById('content-to-analyze');
        if (!content) return;
        
        if (!content.value) {
            alert('Veuillez entrer du contenu à analyser.');
            return;
        }

        const analysisResults = document.getElementById('content-analysis-results');
        if (!analysisResults) return;
        
        analysisResults.innerHTML = '<div class="ai-thinking">🧠 Analyse en cours par IA...</div>';
        analysisResults.classList.add('show');

        setTimeout(() => {
            const analysis = this.generateMockContentAnalysis(content.value);
            analysisResults.innerHTML = `
                <div class="analysis-metrics">
                    <div class="analysis-metric">
                        <div class="analysis-score">${analysis.readability}</div>
                        <div class="analysis-label">Lisibilité</div>
                    </div>
                    <div class="analysis-metric">
                        <div class="analysis-score">${analysis.seoScore}</div>
                        <div class="analysis-label">Score SEO</div>
                    </div>
                    <div class="analysis-metric">
                        <div class="analysis-score">${analysis.sentiment}</div>
                        <div class="analysis-label">Sentiment</div>
                    </div>
                    <div class="analysis-metric">
                        <div class="analysis-score">${analysis.wordCount}</div>
                        <div class="analysis-label">Mots</div>
                    </div>
                </div>
                <div class="analysis-suggestions">
                    <h4>Suggestions d'Amélioration</h4>
                    <ul>
                        ${analysis.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            `;
        }, 3000); // Extended for AI thinking effect
    }

    simulateAIThinking(elementId, callback) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = '<div class="ai-thinking">🤖 Analyse IA en cours...</div>';
        element.classList.add('loading');
        
        setTimeout(() => {
            element.classList.remove('loading');
            callback();
        }, 2500);
    }

    generateMockKeywordData(keyword) {
        const volumes = ['500', '1,200', '3,500', '8,900', '15,000', '25,000'];
        const competitions = ['Low', 'Medium', 'High', 'Very High'];
        const cpcs = ['€0.80', '€1.50', '€2.20', '€3.80', '€5.10'];
        const relevances = ['75%', '82%', '89%', '94%', '97%'];

        return {
            keyword,
            volume: volumes[Math.floor(Math.random() * volumes.length)],
            competition: competitions[Math.floor(Math.random() * competitions.length)],
            cpc: cpcs[Math.floor(Math.random() * cpcs.length)],
            relevance: relevances[Math.floor(Math.random() * relevances.length)]
        };
    }

    generateMockAuditIssues(url) {
        const issues = [
            {
                type: 'High',
                description: `Page ${url} : Balise title manquante`,
                solution: 'Ajoutez une balise title descriptive et unique pour cette page.'
            },
            {
                type: 'Medium',
                description: 'Images sans attribut alt détectées',
                solution: 'Ajoutez des textes alternatifs descriptifs pour toutes les images.'
            },
            {
                type: 'Low',
                description: 'Temps de réponse serveur légèrement élevé (1.2s)',
                solution: 'Optimisez la configuration serveur ou considérez un CDN.'
            }
        ];

        return issues;
    }

    generateMockContent(type, topic, tone) {
        const templates = {
            article: `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}

## Introduction

L'univers du ${topic} évolue constamment, et il est essentiel de rester à jour avec les dernières tendances et meilleures pratiques.

## Points Clés

- Analyse approfondie du marché
- Stratégies innovantes  
- Conseils d'experts
- Études de cas réelles

## Conclusion

En appliquant ces conseils, vous pourrez optimiser vos résultats et atteindre vos objectifs plus efficacement.`,
            
            meta: `Découvrez les meilleures stratégies de ${topic} pour 2025. Guide complet avec conseils d'experts et études de cas pratiques.`,
            
            title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} : Guide Complet 2025 | Votre Site`,
            
            ad: `🚀 Boostez votre ${topic} dès aujourd'hui !
✅ Résultats garantis en 30 jours
✅ Accompagnement personnalisé
✅ Prix attractif
👉 Commencez maintenant !`
        };

        return templates[type] || templates.article;
    }

    generateMockContentAnalysis(content) {
        const wordCount = content.split(' ').length;
        
        return {
            readability: Math.floor(Math.random() * 40) + 60,
            seoScore: Math.floor(Math.random() * 30) + 70,
            sentiment: 'Positif',
            wordCount: wordCount,
            suggestions: [
                'Ajoutez des sous-titres pour améliorer la structure',
                'Intégrez plus de mots-clés pertinents',
                'Raccourcissez certaines phrases pour améliorer la lisibilité',
                'Ajoutez des liens internes vers des pages connexes'
            ]
        };
    }
}

// Initialize the PWA Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PWADashboard();
});