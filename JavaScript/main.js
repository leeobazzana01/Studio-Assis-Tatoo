//globais
let mapa;
let marcadores = [];

//coordenadas do estudio
const COORDENADAS_STUDIO = [-21.529217725000002, -46.644467750000004];

document.addEventListener('DOMContentLoaded', function() {
    //configuração carrossel
    const carousel = document.querySelector('.carousel');
    const cardList = document.querySelector('.card-list');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    const cardsPerView = 3;
    const totalCards = cards.length;

    //atualiza posicao do carrossel
    function updateCarousel() {
        if(cards.length > 0) {
            const cardWidth = cards[0].offsetWidth + 20; //20 é o GAP
            cardList.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
    }

    //botao proximo
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalCards - cardsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    //botao anterior
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    //ajusta carrossel no redimensionamento
    window.addEventListener('resize', updateCarousel);

    //MENU MOBILE
    const btnMenu = document.getElementById('btn-menu');
    const menuMobile = document.getElementById('menu-mobile');
    const overlayMenu = document.getElementById('overlay-menu');
    const btnFechar = document.querySelector('.btn-fechar');

    //abre menu
    if(btnMenu) {
        btnMenu.addEventListener('click', () => {
            menuMobile.classList.add('active');
            overlayMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Força o mapa a recalcular tamanho se ele estiver visível ao abrir menu
            setTimeout(() => { if(mapa) mapa.invalidateSize(); }, 300);
        });
    }

    //fecha menu
    function fecharMenu() {
        menuMobile.classList.remove('active');
        overlayMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if(btnFechar) btnFechar.addEventListener('click', fecharMenu);
    if(overlayMenu) overlayMenu.addEventListener('click', fecharMenu);

    //fecha menu ao clickar em algum link
    if(menuMobile) {
        const linksMenu = menuMobile.querySelectorAll('nav ul li a');
        linksMenu.forEach(link => {
            link.addEventListener('click', fecharMenu);
        });
    }

    //fechando o menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharMenu();
        }
    });

    //incializa carrossel
    updateCarousel();
    
    // Inicializa o mapa 
    iniciaMapa();
});

//adicionando mapas e interação do usuário
const localizacoes = [
    {
        id: 1,
        nome: "Studio Assis Tatoo",
        lat: COORDENADAS_STUDIO[0],
        lng: COORDENADAS_STUDIO[1],
        descricao: "Venha conhecer nossa arte e fazer seu orçamento!",
        tipo: "Estúdio de Tatuagem"
    },
];

//incializa o mapa qnd a pág abrir
function iniciaMapa() {
    // Verifica se o elemento mapa existe para evitar erros
    if(!document.getElementById('mapa')) return;

    //config inicial do mapa - FOCADO NO ESTÚDIO
    mapa = L.map('mapa').setView(COORDENADAS_STUDIO, 15);

    //camada do tile layers
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        atribuicao: '© Leonardo Bazzana',
        maxZoom: 19,
        minZoom: 10
    }).addTo(mapa);

    //adicionando marcadores
    adicionaMarcadoresAoMapa();
    
    //controles de zoom padrão 
    mapa.zoomControl.setPosition('topright');
    
    // Correção CRÍTICA para responsividade
    window.addEventListener('resize', () => {
        mapa.invalidateSize();
    });
}

//adiciona marcadores 
function adicionaMarcadoresAoMapa() {
    localizacoes.forEach(localizacao => {
        //icone p isso - AGORA COM BOOTSTRAP ICONS
        const iconePersonalizado = L.divIcon({
            className: 'marcador-bootstrap',
            html: pegaHTMLMarcadorBootstrap(localizacao.tipo),
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });

        //criar marcador
        const marcador = L.marker([localizacao.lat, localizacao.lng], { icon: iconePersonalizado })
            .addTo(mapa)
            .bindPopup(`
                <div class="popup-personalizado">
                    <h3>${localizacao.nome}</h3>
                    <p>${localizacao.descricao}</p>
                    <br>
                    <a href="https://www.google.com/maps/search/?api=1&query=${localizacao.lat},${localizacao.lng}" target="_blank" class="btn btn-dark btn-sm mt-2">
                        <i class="bi bi-map"></i> Abrir no GPS
                    </a>
                </div>
            `);

        marcadores.push(marcador);
        
        // Abre o popup do estúdio automaticamente ao carregar
        if(localizacao.id === 1) {
            marcador.openPopup();
        }
    });
}

//gerar html com base no marcador
function pegaHTMLMarcadorBootstrap(tipo) {
    const iconesBootstrap = {
        "Estúdio de Tatuagem": 'bi-geo-alt-fill',       //loc padrao
        "Mercado de vendas": 'bi-building',           //predio
        "Parque": 'bi-tree',                          //arvore
        "Comercial": 'bi-briefcase',                  //negocios
        "estadio": 'bi-trophy',                       //estádio/trofeu
        "Mercado": 'bi-cart'                          //carrinho
    };
    
    //fallback padrao
    const iconeClasse = iconesBootstrap[tipo] || 'bi-geo-alt-fill'; 
    
    //retorna so o icone
    return `<i class="bi ${iconeClasse}"></i>`;
}

//funcoes p controlar o mapa 
function ZoomMais() {
    if(mapa) mapa.zoomIn();
}

function ZoomMenos() {
    if(mapa) mapa.zoomOut();
}

function ResetaView() {
    if(mapa) {
        //reset p a loc do estudio
        mapa.setView(COORDENADAS_STUDIO, 15);
        mostraNotificacao('Visualização resetada para o Estúdio!');
    }
}

//funcao p focar em localizacao especifica
function focaNaLocalizacao(idLocalizacao) {
    const localizacao = localizacoes.find(loc => loc.id === idLocalizacao);
    if (localizacao && mapa) {
        mapa.setView([localizacao.lat, localizacao.lng], 16);
        mostraNotificacao(`Navegando para: ${localizacao.nome}`);
    }
}

//funcao p mostrar notificacoes 
function mostraNotificacao(mensagem) {
    //cria elementos c classes Bootstrap
    const notificacao = document.createElement('div');
    notificacao.className = 'alert alert-success alert-dismissible fade show shadow';
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border: none;
        background-color: #FF8C1A; /* Cor da marca */
        color: white;
        font-weight: bold;
        animation: deslizaEntra 0.3s ease;
    `;
    
    notificacao.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacao);
    
    //remove automaticamente dps d 4s
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.style.animation = 'deslizaSai 0.3s ease';
            setTimeout(() => {
                if (notificacao.parentNode) {
                    document.body.removeChild(notificacao);
                }
            }, 300);
        }
    }, 4000);
}

//add css para animações
const estilo = document.createElement('style');
estilo.textContent = `
    @keyframes deslizaEntra {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes deslizaSai {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(estilo);