/* ============================================
   ARCHTEN - GSAP ScrollTrigger Animations
   Modern Dark Theme
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Register Plugin
    gsap.registerPlugin(ScrollTrigger);

    /* ============================================
       NAVBAR SCROLL EFFECT
       ============================================ */
    const header = document.getElementById('mainHeader');
    if (header) {
        ScrollTrigger.create({
            start: 'top -60',
            onUpdate: (self) => {
                if (self.scroll() > 60) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }


    /* ============================================
       HERO SECTION — Staggered entrance
       ============================================ */
    // Hanya jalan jika ada elemen .hero di halaman tersebut
    if (document.querySelector('.hero')) {
        const heroTl = gsap.timeline({ delay: 0.2 });
        
        heroTl
        .fromTo('.hero-eyebrow',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' }
        )
        .fromTo('.hero h1 span:first-child',
            { opacity: 0, y: 60, skewY: 4 },
            { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: 'power3.out' },
            '-=0.5'
        )
        .fromTo('.hero h1 span:last-child',
            { opacity: 0, y: 60, skewY: 4 },
            { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: 'power3.out' },
            '-=0.7'
        )
        .fromTo('#hero-subtitle',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.5'
        )
        .fromTo('#hero-cta',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
            '-=0.6'
        );

        // Animasi Orb (Bola-bola dekorasi) jika ada
        if (document.querySelector('.hero-orb-1')) {
            gsap.fromTo('.hero-orb-1',
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
            );
            gsap.fromTo('.hero-orb-2',
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
                0.5
            );
        }
    }

    /* ============================================
       HELPER — ScrollTrigger defaults
       ============================================ */
    const defaultST = (trigger, extra = {}) => ({
        trigger,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
        ...extra
    });

    /* ============================================
       FEATURES SECTION
       ============================================ */
    // Section label + title + subtitle
    gsap.fromTo('.features .section-label',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: defaultST('.features .section-label')
        }
    );

    gsap.fromTo('.features .section-title',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: defaultST('.features .section-title')
        }
    );

    gsap.fromTo('.features .section-subtitle',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power2.out',
            scrollTrigger: defaultST('.features .section-subtitle')
        }
    );

    // Feature cards — stagger with scale bounce
    gsap.fromTo('.feature-card',
        { opacity: 0, y: 50, scale: 0.92 },
        {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Icon bounce on card entry
    gsap.fromTo('.feature-icon-wrap',
        { scale: 0, rotation: -10 },
        {
            scale: 1, rotation: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.2,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );

    /* ============================================
       PROJECTS / MENU SECTION
       ============================================ */
    // Section dividers
    gsap.utils.toArray('.section-divider').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: defaultST(el)
            }
        );
    });

    // Project cards — wave stagger
    gsap.utils.toArray('.projects-grid').forEach((grid) => {
        const cards = grid.querySelectorAll('.project-card');
        gsap.fromTo(cards,
            { opacity: 0, y: 60, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.7,
                stagger: {
                    each: 0.12,
                    ease: 'power1.out'
                },
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // Card image clip reveal
        const images = grid.querySelectorAll('.project-image img');
        gsap.fromTo(images,
            { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.1 },
            {
                clipPath: 'inset(0% 0% 0% 0%)', scale: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    /* ============================================
       ABOUT SECTION
       ============================================ */
    // Left content — slide in from left
    const aboutLeftEls = document.querySelectorAll('.about-content > *');
    gsap.fromTo(aboutLeftEls,
        { opacity: 0, x: -50 },
        {
            opacity: 1, x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-container',
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        }
    );

    // Right visual — slide from right with reveal
    gsap.fromTo('.about-visual',
        { opacity: 0, x: 60, scale: 0.95 },
        {
            opacity: 1, x: 0, scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-container',
                start: 'top 78%',
                toggleActions: 'play none none none'
            }
        }
    );

    // List items — stagger from left
    const listItems = document.querySelectorAll('.about-list li');
    gsap.fromTo(listItems,
        { opacity: 0, x: -30 },
        {
            opacity: 1, x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-list',
                start: 'top 82%',
                toggleActions: 'play none none none'
            }
        }
    );

    /* ============================================
       SOCIAL MEDIA SECTION
       ============================================ */
    gsap.fromTo('.social-media h2',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: defaultST('.social-media h2')
        }
    );

    gsap.fromTo('.social-media .section-subtitle',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power2.out',
            scrollTrigger: defaultST('.social-media .section-subtitle')
        }
    );

    // Social links — radial stagger from center
    const socialLinks = document.querySelectorAll('.menu-links a');
    gsap.fromTo(socialLinks,
        { opacity: 0, y: 40, scale: 0.85 },
        {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            stagger: {
                each: 0.08,
                from: 'center',
                ease: 'power1.out'
            },
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: '.menu-links',
                start: 'top 82%',
                toggleActions: 'play none none none'
            }
        }
    );

    /* ============================================
       FOOTER
       ============================================ */
    gsap.fromTo('footer .footer-column',
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: defaultST('footer')
        }
    );

    gsap.fromTo('.copyright',
        { opacity: 0 },
        {
            opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out',
            scrollTrigger: defaultST('.copyright')
        }
    );

    /* ============================================
       SECTION BORDER LINES — animated width
       ============================================ */
    gsap.utils.toArray(['#fitur', '.projects', '.about', '.social-media', 'footer']).forEach(section => {
        gsap.fromTo(section,
            { '--line-width': '0%' },
            {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

   /* ============================================
       HOVER — Magnetic feel
       ============================================ */
    if (window.matchMedia("(pointer: fine)").matches) {
        document.querySelectorAll('.hero-btn, .btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.12,
                    y: y * 0.12,
                    duration: 0.4, 
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    /* ============================================
       NAV LINK hover underline animation
       ============================================ */
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.fromTo(link, { scale: 0.97 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
        });
    });

    console.log('✨ GSAP Animations loaded — ARCHTEN Dark Theme');
});