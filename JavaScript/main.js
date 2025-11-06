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

    //atualiza posicao do carrosse3l
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 20; //20 é o GAP
        cardList.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    //botao proximo
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - cardsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });

    //botao anterior
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    //ajusta carrossel no redimensionamento
    window.addEventListener('resize', updateCarousel);

    //MENU MOBILEs
    const btnMenu = document.getElementById('btn-menu');
    const menuMobile = document.getElementById('menu-mobile');
    const overlayMenu = document.getElementById('overlay-menu');
    const btnFechar = document.querySelector('.btn-fechar');

    //abre menu
    btnMenu.addEventListener('click', () => {
        menuMobile.classList.add('active');
        overlayMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    //fecha menu
    function fecharMenu() {
        menuMobile.classList.remove('active');
        overlayMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    btnFechar.addEventListener('click', fecharMenu);
    overlayMenu.addEventListener('click', fecharMenu);

    //fecha menu ao clickar em algum link
    const linksMenu = menuMobile.querySelectorAll('nav ul li a');
    linksMenu.forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    //fechando o menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharMenu();
        }
    });

    //incializa carrossel
    updateCarousel();
});