/* ========================================
   B18 Landing Page - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initParallax();
    initCarrossel();
    initSmoothScroll();
});

/* ----------------------------------------
   Mobile Menu
   ---------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a');
    const body = document.body;
    
    if (!menuToggle || !nav) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu when clicking outside
    nav.addEventListener('click', (e) => {
        if (e.target === nav) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function openMenu() {
        nav.classList.add('active');
        menuToggle.classList.add('active');
        body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    function closeMenu() {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        }, 100);
    });
}

/* ----------------------------------------
   Smooth Scroll for anchor links
   ---------------------------------------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const marqueeHeight = document.querySelector('.marquee').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - marqueeHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ----------------------------------------
   Parallax Effect - Contido na seção
   ---------------------------------------- */
function initParallax() {
    const servicosSection = document.querySelector('.servicos');
    const parallaxImg = document.querySelector('.servicos-bg img');
    
    const avaliacoesSection = document.querySelector('.avaliacoes');
    const avaliacoesImg = document.querySelector('.avaliacoes-bg img');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    if (!servicosSection || !parallaxImg) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    function updateParallax() {
        const windowHeight = window.innerHeight;
        
        // Parallax Serviços
        const sectionRect = servicosSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        
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
    }
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
    let cardWidth = calculateCardWidth();
    let maxPosition = calculateMaxPosition();
    
    function calculateCardWidth() {
        const card = cards[0];
        const style = getComputedStyle(track);
        const gap = parseInt(style.gap) || 30;
        return card.offsetWidth + gap;
    }
    
    function calculateMaxPosition() {
        const visibleCards = window.innerWidth <= 992 ? 1 : 2;
        return -(cardWidth * (cards.length - visibleCards));
    }
    
    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cardWidth = calculateCardWidth();
            maxPosition = calculateMaxPosition();
            
            // Adjust current position if needed
            if (currentPosition < maxPosition) {
                currentPosition = maxPosition;
            }
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            
            updateCarrossel();
        }, 100);
    });
    
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
        
        // Update button states
        btnPrev.style.opacity = currentPosition >= 0 ? '0.5' : '1';
        btnNext.style.opacity = currentPosition <= maxPosition ? '0.5' : '1';
    }
    
    // Initial button state
    updateCarrossel();
    
    // Drag functionality - Mouse
    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('mousemove', drag);
    wrapper.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('mouseleave', dragEnd);
    
    // Drag functionality - Touch
    wrapper.addEventListener('touchstart', dragStart, { passive: true });
    wrapper.addEventListener('touchmove', drag, { passive: false });
    wrapper.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        track.style.transition = 'none';
        wrapper.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        if (e.type === 'touchmove') {
            // Prevent vertical scroll while dragging horizontally
            const currentPos = getPositionX(e);
            const diff = Math.abs(currentPos - startPos);
            if (diff > 10) {
                e.preventDefault();
            }
        }
        
        const currentPos = getPositionX(e);
        const diff = currentPos - startPos;
        currentTranslate = prevTranslate + diff;
        
        // Limites com resistência
        const resistance = 0.3;
        if (currentTranslate > 0) {
            currentTranslate = currentTranslate * resistance;
        }
        if (currentTranslate < maxPosition) {
            const overscroll = currentTranslate - maxPosition;
            currentTranslate = maxPosition + (overscroll * resistance);
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.3s ease';
        wrapper.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        const threshold = cardWidth * 0.2; // 20% of card width
        
        // Se arrastou mais que o threshold, muda de card
        if (movedBy < -threshold && currentPosition > maxPosition) {
            currentPosition -= cardWidth;
        }
        if (movedBy > threshold && currentPosition < 0) {
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
    
    // Keyboard navigation
    wrapper.setAttribute('tabindex', '0');
    wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            btnPrev.click();
        } else if (e.key === 'ArrowRight') {
            btnNext.click();
        }
    });
}

/* ----------------------------------------
   Header Scroll Effect (Optional)
   ---------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}
