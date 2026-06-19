

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const preloader = document.getElementById('preloader');
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const cartBtn = document.getElementById('nav-cart-btn');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartBadge = document.getElementById('cart-badge');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartSummaryCount = document.getElementById('cart-summary-count');
    const cartRequestBtn = document.getElementById('cart-request-btn');
    const conciergeToggle = document.getElementById('concierge-toggle');
    const conciergePanel = document.getElementById('concierge-panel');
    const conciergeClose = document.getElementById('concierge-close');
    const conciergeBody = document.getElementById('concierge-body');
    const conciergeQuestions = document.getElementById('concierge-questions');
    const conciergeResponse = document.getElementById('concierge-response');
    const conciergeCta = document.getElementById('concierge-cta');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    const testimonialsDots = document.getElementById('testimonials-dots');
    const collectionTabs = document.querySelectorAll('.collection-tab');
    const collectionGrid = document.getElementById('collection-grid');

    // ============================================
    // INQUIRY CART STATE
    // ============================================
    let inquiryCart = JSON.parse(localStorage.getItem('hcc_inquiry_cart')) || [];

    function saveCart() {
        localStorage.setItem('hcc_inquiry_cart', JSON.stringify(inquiryCart));
    }

    function updateCartBadge() {
        const count = inquiryCart.length;
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.classList.add('visible');
        } else {
            cartBadge.classList.remove('visible');
        }
    }

    function buildWhatsAppMessage() {
        if (inquiryCart.length === 0) return 'https://wa.me/963988614489';
        let msg = 'Hello HCC Concierge, I would like to request a quote for the following cigars from my inquiry list:%0A%0A';
        inquiryCart.forEach((item, i) => {
            msg += `${i + 1}. ${item.cigar} (${item.brand}) - ${item.qty}, ${item.size}%0A`;
        });
        msg += '%0APlease share pricing and availability. Thank you.';
        return `https://wa.me/963988614489?text=${msg}`;
    }

    function renderCart() {
        if (inquiryCart.length === 0) {
            cartEmpty.style.display = 'flex';
            cartItems.style.display = 'none';
            cartFooter.classList.add('hidden');
        } else {
            cartEmpty.style.display = 'none';
            cartItems.style.display = 'flex';
            cartFooter.classList.remove('hidden');
            cartItems.innerHTML = inquiryCart.map((item, index) => `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${item.img}" alt="${item.cigar}" loading="lazy">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.cigar}</div>
                        <div class="cart-item-meta">${item.brand} | ${item.qty} | ${item.size}</div>
                    </div>
                    <button class="cart-item-remove" aria-label="Remove ${item.cigar}" onclick="window.hccRemoveFromCart(${index})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            `).join('');
            cartSummaryCount.textContent = `${inquiryCart.length} cigar${inquiryCart.length !== 1 ? 's' : ''}`;
            cartRequestBtn.href = buildWhatsAppMessage();
        }
        updateCartBadge();
    }

    window.hccRemoveFromCart = function(index) {
        inquiryCart.splice(index, 1);
        saveCart();
        renderCart();
    };

    function addToCart(cigar, brand, size, qty, img) {
        const exists = inquiryCart.some(item => item.cigar === cigar);
        if (exists) {
            // Show brief feedback
            const btn = document.querySelector(`[data-cigar="${cigar}"].btn-cart-add`);
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Already Added`;
                btn.classList.add('added');
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('added');
                }, 1500);
            }
            return;
        }
        inquiryCart.push({ cigar, brand, size, qty, img });
        saveCart();
        renderCart();
        // Open cart to show feedback
        openCart();
    }

    function openCart() {
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // PRELOADER
    // ============================================
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1800);
    });

    // ============================================
    // NAVIGATION SCROLL EFFECT
    // ============================================
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 80) {
            nav.classList.remove('nav-transparent');
            nav.classList.add('nav-solid');
        } else {
            nav.classList.add('nav-transparent');
            nav.classList.remove('nav-solid');
        }
        lastScroll = currentScroll;
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // CART EVENTS
    // ============================================
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-cart-add');
        if (btn) {
            const cigar = btn.dataset.cigar;
            const brand = btn.dataset.brand;
            const size = btn.dataset.size;
            const qty = btn.dataset.qty;
            const img = btn.dataset.img;
            addToCart(cigar, brand, size, qty, img);
        }
    });

    // ============================================
    // CONCIERGE ASSISTANT
    // ============================================
    function openConcierge() {
        conciergePanel.classList.add('active');
    }

    function closeConcierge() {
        conciergePanel.classList.remove('active');
    }

    conciergeToggle.addEventListener('click', openConcierge);
    conciergeClose.addEventListener('click', closeConcierge);

    // Close concierge when clicking outside
    document.addEventListener('click', function(e) {
        if (!conciergeWidget.contains(e.target) && conciergePanel.classList.contains('active')) {
            closeConcierge();
        }
    });

    const conciergeWidget = document.querySelector('.concierge-widget');

    // Concierge responses
    const conciergeResponses = {
        authenticity: `<p>Absolutely. Every cigar in our collection is sourced through legitimate, authorized channels directly from Cuba. We guarantee 100% authenticity on every box. Each shipment arrives with proper documentation, and we are happy to provide real photos and verification details upon request.</p><p>Our reputation depends on trust, and we have built our business on the principle that authenticity is non-negotiable.</p>`,
        
        payment: `<p>We offer flexible and secure payment arrangements tailored to our clients' preferences. Our concierge will discuss the most suitable payment method during our private conversation, ensuring a seamless and discreet transaction process.</p><p>All payment details are handled confidentially through our WhatsApp concierge channel.</p>`,
        
        photos: `<p>Yes, absolutely. We understand the importance of seeing exactly what you are acquiring. Upon request, our concierge will share real, high-quality photographs of the specific cigars you are interested in, including box codes, seals, and condition details.</p><p>This transparency is part of our commitment to building lasting trust with every collector.</p>`,
        
        humidor: `<p>We would be delighted to assist you with your humidor setup and maintenance. Our team can advise on optimal temperature (18-20°C) and humidity (65-70%), recommend Spanish cedar humidors, guide you through seasoning, and suggest the best Boveda packs or distilled water systems for your collection size.</p><p>Whether you are setting up your first humidor or optimizing a large collection, our concierge is here to help.</p>`,
        
        beginner: `<p>We have curated a comprehensive beginner's guide covering everything from selecting your first cigar to understanding vitolas, ring gauges, and flavor profiles. We recommend starting with approachable classics like the Montecristo N4 or Cohiba Siglo II.</p><p>Our concierge is always available to provide personalized guidance based on your taste preferences and experience level.</p>`,
        
        recommendation: `<p>For beginners, we typically recommend the <strong>Montecristo N4</strong> or <strong>Cohiba Siglo II</strong> — both offer a balanced, approachable profile that introduces the complexity of Cuban tobacco without overwhelming the palate.</p><p>The Montecristo N4 is a classic Corona with medium body and rich, creamy flavors. The Cohiba Siglo II offers a slightly more refined experience with subtle spice and cedar notes. Both are excellent entry points into the world of premium Cuban cigars.</p>`,
        
        special: `<p>For special occasions, we recommend considering limited editions or iconic classics. The <strong>Cohiba Behike 52/54/56</strong> series represents the absolute pinnacle of Cohiba craftsmanship, while the <strong>Cohiba Esplendidos</strong> is a timeless Churchill format perfect for celebrations.</p><p>For truly memorable moments, our rare arrivals like the <strong>Cohiba 50 Majestuosos 1966</strong> or <strong>Trinidad Topes EL 2016</strong> offer extraordinary experiences that few collectors ever encounter.</p>`,
        
        storage: `<p>Proper storage is essential for preserving your investment. Key principles: maintain 18-20°C temperature and 65-70% relative humidity, use Spanish cedar humidors, rotate your stock periodically, and allow cigars to rest for at least 2-3 weeks after delivery before smoking.</p><p>Limited editions benefit significantly from aging — 3-5 years can transform a great cigar into an extraordinary one. Our concierge can provide detailed guidance tailored to your specific collection.</p>`
    };

    // Track current cigar context for smart recommendations
    let currentCigarContext = null;

    document.addEventListener('click', function(e) {
        const card = e.target.closest('.cigar-card');
        if (card) {
            currentCigarContext = {
                brand: card.dataset.brand,
                name: card.dataset.name
            };
        }
    });

    document.querySelectorAll('.concierge-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            let response = conciergeResponses[question] || '<p>Our concierge would be delighted to assist you with this inquiry personally.</p>';
            
            // Smart contextual recommendations
            if (currentCigarContext && (question === 'recommendation' || question === 'special')) {
                const brand = currentCigarContext.brand;
                const name = currentCigarContext.name;
                
                if (brand === 'cohiba') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> If you appreciate this Cohiba, you may also enjoy the <strong>Cohiba Behike 54</strong> for a more intense experience, or the <strong>Cohiba Siglo VI</strong> for a similar profile with greater complexity. For a special occasion, the <strong>Cohiba Talisman EL 2017</strong> is an exceptional limited edition that shares Cohiba's signature elegance.</p>`;
                } else if (brand === 'montecristo') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> Montecristo enthusiasts often appreciate the <strong>Partagas Serie E N2</strong> for its fuller body, or the <strong>Romeo y Julieta Churchill</strong> for a similarly refined experience. The <strong>Montecristo 80 Anniversario</strong> is the ultimate celebration cigar for any Montecristo lover.</p>`;
                } else if (brand === 'partagas') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> Partagas is known for robust, full-bodied character. You might also enjoy the <strong>Bolivar Belicosos Finos</strong> or the <strong>Punch Double Coronas</strong> for similarly powerful profiles. The <strong>Partagas Lusitanias</strong> is an iconic double corona that represents the brand at its finest.</p>`;
                } else if (brand === 'romeo-y-julieta') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> Romeo y Julieta offers elegance and balance. Consider the <strong>Cohiba Siglo IV</strong> for a step up in refinement, or the <strong>Hoyo de Monterrey Epicure N2</strong> for a similarly smooth, creamy experience with more complexity.</p>`;
                } else if (brand === 'hoyo-de-monterrey') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> Hoyo de Monterrey is celebrated for its smooth, approachable character. The <strong>Romeo y Julieta Short Churchill</strong> offers a similar elegance, while the <strong>Cohiba Siglo II</strong> provides a more premium alternative with comparable smoothness.</p>`;
                } else if (brand === 'bolivar') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> Bolivar is for those who appreciate power and intensity. The <strong>Partagas Serie P N2</strong> and <strong>Partagas Salamones LCDH</strong> share this bold character. For a special occasion, the <strong>Cohiba Behike 56</strong> delivers unmatched intensity with Cohiba refinement.</p>`;
                } else if (brand === 'trinidad') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> Trinidad is one of Cuba's most exclusive marcas. The <strong>Cohiba Behike 52</strong> offers a similarly rarefied experience, while the <strong>H. Upmann Magnum 56 EL 2015</strong> provides another exceptional limited edition with remarkable depth.</p>`;
                } else if (brand === 'h-upmann') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> H. Upmann is revered for its sophisticated, medium-to-full character. The <strong>Cohiba Maduro Genios</strong> offers a similarly complex experience with darker, richer notes. For a special occasion, the <strong>Trinidad Topes EL 2016</strong> is another exceptional limited edition.</p>`;
                } else if (brand === 'punch') {
                    response += `<p><strong>Since you are viewing ${name}:</strong> The Punch Double Coronas is a legendary full-bodied cigar. If you enjoy this profile, the <strong>Partagas Lusitanias</strong> offers a similar format with Partagas character, while the <strong>Bolivar Royal Coronas</strong> provides concentrated power in a smaller ring gauge.</p>`;
                }
            }
            
            conciergeQuestions.style.display = 'none';
            conciergeResponse.innerHTML = response;
            conciergeResponse.classList.add('active');
            conciergeCta.style.display = 'block';
        });
    });

    // Reset concierge when reopened
    conciergeToggle.addEventListener('click', function() {
        if (!conciergePanel.classList.contains('active')) {
            conciergeQuestions.style.display = 'flex';
            conciergeResponse.innerHTML = '';
            conciergeResponse.classList.remove('active');
            conciergeCta.style.display = 'none';
        }
    });
    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials-dots .dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    }

    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prev);
    }

    testimonialNext.addEventListener('click', function() {
        nextTestimonial();
        resetTestimonialInterval();
    });

    testimonialPrev.addEventListener('click', function() {
        prevTestimonial();
        resetTestimonialInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
            resetTestimonialInterval();
        });
    });

    function startTestimonialInterval() {
        testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    function resetTestimonialInterval() {
        clearInterval(testimonialInterval);
        startTestimonialInterval();
    }

    startTestimonialInterval();

    // ============================================
    // COLLECTION TABS FILTERING
    // ============================================
    collectionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const brand = this.dataset.brand;
            
            // Update active tab
            collectionTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            const cards = collectionGrid.querySelectorAll('.cigar-card');
            cards.forEach(card => {
                if (brand === 'all' || card.dataset.brand === brand) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = 'cardFadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll(
        '.section-header, .heritage-block, .trust-item, .knowledge-card, ' +
        '.experience-card, .rare-card, .contact-method'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // INSTAGRAM LINK HANDLER
    // ============================================
    const instagramLink = document.getElementById('instagram-link');
    if (instagramLink) {
        instagramLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Keep existing Instagram link exactly as provided
            // User should replace # with actual Instagram URL
            alert('Please connect with us on Instagram. Our concierge can share the link via WhatsApp.');
        });
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Close panels with Escape
        if (e.key === 'Escape') {
            closeCart();
            closeConcierge();
            if (mobileMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ============================================
    // INITIALIZE
    // ============================================
    renderCart();

    // Log initialization
    console.log('%c Havana Cigar Club ', 'background: #c9a96e; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 4px;');
    console.log('%c Light it, Live it & Love it ', 'color: #c9a96e; font-size: 14px; font-style: italic;');

})();