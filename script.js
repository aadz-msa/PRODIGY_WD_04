/* ============================================
   PORTFOLIO - Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const mobileToggle = document.getElementById('mobileToggle');
    const backToTop = document.getElementById('backToTop');
    const cursorGlow = document.getElementById('cursorGlow');
    const contactForm = document.getElementById('contactForm');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const revealElements = document.querySelectorAll('.reveal-up');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ---- Cursor Glow ----
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ---- Navbar Scroll Effect ----
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ---- Active Nav Link on Scroll ----
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                allNavLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- Back to Top Button ----
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Scroll Events ----
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
        handleBackToTop();
    }, { passive: true });

    // Initialize on load
    handleNavbarScroll();

    // ---- Mobile Menu ----
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    allNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Smooth Nav Link Click ----
    allNavLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 72;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ---- Intersection Observer: Reveal on Scroll ----
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Stagger animations based on delay attribute
                    const delay = entry.target.style.animationDelay || '0s';
                    const delayMs = parseFloat(delay) * 1000;

                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delayMs);

                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // ---- Counter Animation ----
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    function animateCounters() {
        statNumbers.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ---- Contact Form ----
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            // Show sending state
            submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate send (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fa-solid fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

                contactForm.reset();

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ---- Smooth Scroll for CTA buttons ----
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            // Skip if it's a nav link (already handled)
            if (this.classList.contains('nav-link')) return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offsetTop = targetEl.offsetTop - 72;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ---- Tilt Effect on Project Cards (Desktop only) ----
    if (window.matchMedia('(hover: hover)').matches) {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ---- Typing Effect on Hero Title (optional subtle) ----
    // Already handled by CSS animations, but we add a class
    // to ensure smooth loading
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('revealed');
        }, 200);
    }

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        setTimeout(() => {
            heroVisual.classList.add('revealed');
        }, 500);
    }

    console.log('Portfolio loaded successfully ✨');
});