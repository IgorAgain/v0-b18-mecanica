/* ========================================
   B18 Landing Page - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initCarrossel();
});

/* ----------------------------------------
   Parallax Effect - Contido na seção
   ---------------------------------------- */
function initParallax() {
    const servicosSection = document.querySelector('.servicos');
    const parallaxImg = document.querySelector('.servicos-bg img');
    
    const avaliacoesSection = document.querySelector('.avaliacoes');
    const avaliacoesImg = document.querySelector('.avaliacoes-bg img');
    
    if (!servicosSection || !parallaxImg) return;
    
    window.addEventListener('scroll', () => {
        // Parallax Serviços
        const sectionRect = servicosSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
            const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
            const parallaxOffset = (scrollProgress - 0.5) * 100;
            parallaxImg.style.transform = `translateY(${parallaxOffset}px)`;
        }
        
        // Parallax Avaliações
        if (avaliacoesSection && avaliacoesImg) {
            const avalRect = avaliacoesSection.getBoundingClientRect();
            const avalTop = avalRect.top;
            const avalHeight = avalRect.height;
            
            if (avalTop < windowHeight && avalTop > -avalHeight) {
                const scrollProgress = (windowHeight - avalTop) / (windowHeight + avalHeight);
                const parallaxOffset = (scrollProgress - 0.5) * 100;
                avaliacoesImg.style.transform = `translateY(${parallaxOffset}px)`;
            }
        }
    }, { passive: true });
}

/* ----------------------------------------
   Carrossel de Avaliações
   ---------------------------------------- */
function initCarrossel() {
    const track = document.getElementById('carrosselTrack');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const wrapper = document.querySelector('.carrossel-wrapper');
    
    if (!track || !btnPrev || !btnNext) return;
    
    let currentPosition = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    const cards = track.querySelectorAll('.avaliacao-card');
    const cardWidth = cards[0].offsetWidth + 30; // card width + gap
    const maxPosition = -(cardWidth * (cards.length - 2)); // Show 2 cards at a time
    
    // Botões de navegação
    btnNext.addEventListener('click', () => {
        currentPosition -= cardWidth;
        if (currentPosition < maxPosition) {
            currentPosition = maxPosition;
        }
        updateCarrossel();
    });
    
    btnPrev.addEventListener('click', () => {
        currentPosition += cardWidth;
        if (currentPosition > 0) {
            currentPosition = 0;
        }
        updateCarrossel();
    });
    
    function updateCarrossel() {
        track.style.transform = `translateX(${currentPosition}px)`;
        prevTranslate = currentPosition;
        currentTranslate = currentPosition;
    }
    
    // Drag functionality - Mouse
    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('mousemove', drag);
    wrapper.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('mouseleave', dragEnd);
    
    // Drag functionality - Touch
    wrapper.addEventListener('touchstart', dragStart);
    wrapper.addEventListener('touchmove', drag);
    wrapper.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        track.style.transition = 'none';
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentPos = getPositionX(e);
        const diff = currentPos - startPos;
        currentTranslate = prevTranslate + diff;
        
        // Limites
        if (currentTranslate > 50) {
            currentTranslate = 50;
        }
        if (currentTranslate < maxPosition - 50) {
            currentTranslate = maxPosition - 50;
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.3s ease';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Se arrastou mais de 100px, muda de card
        if (movedBy < -100 && currentPosition > maxPosition) {
            currentPosition -= cardWidth;
        }
        if (movedBy > 100 && currentPosition < 0) {
            currentPosition += cardWidth;
        }
        
        // Limites finais
        if (currentPosition < maxPosition) {
            currentPosition = maxPosition;
        }
        if (currentPosition > 0) {
            currentPosition = 0;
        }
        
        updateCarrossel();
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // Prevent image dragging
    track.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
}
