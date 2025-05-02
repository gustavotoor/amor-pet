/**
 * Script principal para a landing page do Amor Pet
 * 
 * Este arquivo contém as funcionalidades JavaScript para a landing page,
 * incluindo animações, validações e interações com o usuário.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ativa os tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Animação suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação para elementos quando entram na viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .plan-card, .step-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Executa a animação no carregamento e no scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Adiciona classe ativa ao item de navegação atual
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector('.navbar-nav a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.navbar-nav a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    });

    // Altera o estilo do cabeçalho ao rolar a página
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Fecha o menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    });

    console.log('Amor Pet - Landing page carregada com sucesso!');
});
