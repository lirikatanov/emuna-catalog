// ==========================================================================
// אמונה — Landing page interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const toTopBtn = document.getElementById('toTop');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- sticky header shadow ----
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    toTopBtn.classList.toggle('visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- mobile nav toggle ----
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    header.classList.toggle('nav-open', mainNav.classList.contains('open'));
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
      header.classList.remove('nav-open');
      document.body.style.overflow = '';
    });
  });

  // ---- back to top ----
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- scrollspy: highlight active nav link ----
  const sections = Array.from(navLinks)
    .map(link => link.getAttribute('href'))
    .filter(href => href && href.startsWith('#'))
    .map(href => document.querySelector(href))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));

  // ---- reveal on scroll ----
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => {
      el.classList.add('reveal-ready');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('in-view'));
  }

  // ---- contact form: sends to Efrat's WhatsApp ----
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const WHATSAPP_NUMBER = '972544996314';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const interest = document.getElementById('cf-interest').value.trim();

      if (!name || !interest) {
        formMsg.textContent = 'אנא מלאו שם ופרטים על מה שאתן מחפשות.';
        formMsg.className = 'form-msg error';
        return;
      }

      const message = `היי אפרת, שמי ${name} 😊\nאני מתעניין/ת ב-${interest}.\nאשמח לקבל פרטים נוספים.`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');

      formMsg.textContent = `תודה, ${name}! נפתח עבורכם וואטסאפ — פשוט לחצו שליחה שם.`;
      formMsg.className = 'form-msg success';
      form.reset();
    });
  }

  // ---- image lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && lightboxClose) {
    const zoomableSelector = '.about-photo img, .cat-hero-photo img, .pc-img img, .pc-img-full img, .pc-tallit-img img, .pc-tallit-swatch img, .material-strip img, .rh-atmo-img img, .pc-kid-img img, .pc-kid-gallery-img img';

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    document.querySelectorAll(zoomableSelector).forEach(img => {
      img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  // ---- color swatches: swap main product image ----
  const charmsMainImg = document.getElementById('charmsMainImg');
  const charmsColorDots = document.getElementById('charmsColorDots');

  if (charmsMainImg && charmsColorDots) {
    charmsColorDots.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;
      const newSrc = swatch.getAttribute('data-img');
      if (!newSrc) return;
      charmsMainImg.src = newSrc;
      charmsMainImg.alt = 'סידור סדרת צארמס - ' + (swatch.getAttribute('aria-label') || '');
      charmsColorDots.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  }

  // ---- click-to-select product gallery (kippot) ----
  const kippotGallery = document.getElementById('kippotGallery');
  if (kippotGallery) {
    const thumbs = Array.from(kippotGallery.querySelectorAll('.pcg-thumb'));
    const detailTitle = document.getElementById('kippotDetailTitle');
    const detailMeta = document.getElementById('kippotDetailMeta');
    const detailDesc = document.getElementById('kippotDetailDesc');
    const detailPrice = document.getElementById('kippotDetailPrice');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        detailTitle.textContent = thumb.dataset.title || '';
        detailMeta.textContent = thumb.dataset.meta || '';
        detailDesc.textContent = thumb.dataset.desc || '';
        detailPrice.textContent = thumb.dataset.price || '';
      });
    });
  }

  // ---- swipeable product image galleries (2+ photos per card) ----
  document.querySelectorAll('.pc-img-swipe').forEach(wrap => {
    const track = wrap.querySelector('.pc-img-track');
    const dots = Array.from(wrap.querySelectorAll('.pc-img-dots .dot'));
    if (!track) return;

    const images = Array.from(track.querySelectorAll('img'));
    if (!images.length || !dots.length) return;

    let currentIndex = 0;
    const goToImage = (index) => {
      currentIndex = (index + images.length) % images.length;
      images[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentIndex));
    };

    // desktop-only prev/next arrow buttons (hidden on mobile via CSS; mobile keeps touch-swipe)
    if (images.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'pc-img-nav prev';
      prevBtn.setAttribute('aria-label', 'לתמונה הקודמת');
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'pc-img-nav next';
      nextBtn.setAttribute('aria-label', 'לתמונה הבאה');
      wrap.appendChild(prevBtn);
      wrap.appendChild(nextBtn);

      prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goToImage(currentIndex - 1); });
      nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goToImage(currentIndex + 1); });
    }

    const dotObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = images.indexOf(entry.target);
          currentIndex = index;
          dots.forEach(d => d.classList.remove('active'));
          if (dots[index]) dots[index].classList.add('active');
        }
      });
    }, { root: track, threshold: 0.6 });

    images.forEach(img => dotObserver.observe(img));
  });

  // ---- scroll text reveal (about section) ----
  const revealTextTargets = document.querySelectorAll('.about-text h2, .about-text p:not(.eyebrow):not(.about-signature)');

  if (revealTextTargets.length) {
    revealTextTargets.forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(' ');
    });

    const wordEls = document.querySelectorAll('.about-text .reveal-word');
    let wordsTicking = false;
    const updateWordReveal = () => {
      const trigger = window.innerHeight * 0.75;
      wordEls.forEach(w => {
        w.classList.toggle('revealed', w.getBoundingClientRect().top < trigger);
      });
      wordsTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!wordsTicking) {
        requestAnimationFrame(updateWordReveal);
        wordsTicking = true;
      }
    }, { passive: true });
    updateWordReveal();
  }
});
