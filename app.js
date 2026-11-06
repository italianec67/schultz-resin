/**
 * SchultzResin Landing Script (Updated with Lightbox & Full Video)
 * Features:
 * - Lightbox Zoom on Click for Catalog & Production Carousel (3/4 Screen View)
 * - Dynamic Branching Quiz with Custom Inputs & Messenger Choice
 * - Header & Drawer Callback Modal
 * - Order Modal with Messenger & Legal Consent
 * - Video Modal (Full Process Movie with sound controls)
 * - Production Carousel with Next/Prev navigation
 * - Scroll To Top Button
 * - Mobile Burger Drawer Navigation
 * - Phone Mask & Toast Notification
 * - Cookie Consent
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. PHONE MASK (+7 (XXX) XXX-XX-XX) ---
  const phoneInputs = document.querySelectorAll('.phone-mask');
  phoneInputs.forEach(input => {
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '');
      if (!val) {
        input.value = '';
        return;
      }
      if (val[0] === '8' || val[0] === '7') {
        val = val.substring(1);
      }
      let formatted = '+7 (';
      if (val.length > 0) formatted += val.substring(0, 3);
      if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
      if (val.length >= 6) formatted += '-' + val.substring(6, 8);
      if (val.length >= 8) formatted += '-' + val.substring(8, 10);
      input.value = formatted;
    });
  });

    // --- 2. MOBILE BURGER & DRAWER MENU ---
  const mobileBurgerBtn = document.getElementById('mobileBurgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add('active');
    if (mobileBurgerBtn) mobileBurgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove('active');
    if (mobileBurgerBtn) mobileBurgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileBurgerBtn && mobileDrawer) {
    mobileBurgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.addEventListener('click', closeMobileMenu);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // --- 3. CATALOG FILTER TABS ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const catalogCards = document.querySelectorAll('.catalog-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      catalogCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 4. LIGHTBOX MODAL (3/4 Screen Zoom on Click) ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const zoomableItems = document.querySelectorAll('.zoomable');

  zoomableItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't trigger if clicked on order button
      if (e.target.closest('.order-btn')) return;

      const imgSrc = item.dataset.img || item.querySelector('img')?.src;
      const imgTitle = item.dataset.title || item.querySelector('img')?.alt || 'Изделие мастерской SchultzResin';

      if (imgSrc && lightboxImg && lightboxCaption && lightboxModal) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = imgTitle;
        lightboxModal.classList.add('active');
      }
    });
  });

  document.getElementById('lightboxModalClose')?.addEventListener('click', () => lightboxModal?.classList.remove('active'));
  document.getElementById('lightboxModalBackdrop')?.addEventListener('click', () => lightboxModal?.classList.remove('active'));

  // --- 5. DYNAMIC 5-STEP BRANCHING QUIZ ENGINE ---
  const quizForm = document.getElementById('quizForm');
  const nextBtns = document.querySelectorAll('.next-step-btn');
  const prevBtns = document.querySelectorAll('.prev-step-btn');
  const quizSteps = document.querySelectorAll('.quiz-step');
  const progressFill = document.getElementById('progressFill');
  const stepIndicator = document.getElementById('stepIndicator');

  // Branch Elements
  const step2Retail = document.getElementById('step2Retail');
  const step2B2B = document.getElementById('step2B2B');
  const step2Question = document.getElementById('step2Question');

  const step3Self = document.getElementById('step3Self');
  const step3Gift = document.getElementById('step3Gift');
  const step3B2B = document.getElementById('step3B2B');

  const step4Retail = document.getElementById('step4Retail');
  const step4B2B = document.getElementById('step4B2B');

  let branchHistory = [1];

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const curStep = parseInt(btn.closest('.quiz-step').dataset.step);
      const targetVal = document.querySelector('input[name="quiz_target"]:checked')?.value || 'self';

      let nextStepNum = curStep + 1;

      // Special branch routing:
      // If Step 1 has 'stock' (Из наличия), skip Step 2 and Step 3 directly to Step 4 (Логистика)
      if (curStep === 1 && targetVal === 'stock') {
        nextStepNum = 4;
      }

      goToQuizStep(nextStepNum);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetVal = document.querySelector('input[name="quiz_target"]:checked')?.value || 'self';
      const curStep = parseInt(btn.closest('.quiz-step').dataset.step);

      let prevStepNum = curStep - 1;
      // If returning from Step 4 when 'stock' was selected, jump back to Step 1
      if (curStep === 4 && targetVal === 'stock') {
        prevStepNum = 1;
      }

      goToQuizStep(prevStepNum);
    });
  });

  function goToQuizStep(stepNum) {
    const targetVal = document.querySelector('input[name="quiz_target"]:checked')?.value || 'self';

    // 1. Configure Step 2 based on Target (B2C vs B2B)
    if (stepNum === 2) {
      if (targetVal === 'b2b') {
        if (step2Retail) step2Retail.style.display = 'none';
        if (step2B2B) step2B2B.style.display = 'grid';
        if (step2Question) step2Question.textContent = '2. Какой формат изделий в корпоративных цветах компании вас интересует?';
      } else {
        if (step2Retail) step2Retail.style.display = 'grid';
        if (step2B2B) step2B2B.style.display = 'none';
        if (step2Question) step2Question.textContent = '2. Какой предмет будем создавать (или искать в наличии)?';
      }
    }

    // 2. Configure Step 3 based on Target (Self vs Gift vs B2B)
    if (stepNum === 3) {
      if (step3Self) step3Self.style.display = 'none';
      if (step3Gift) step3Gift.style.display = 'none';
      if (step3B2B) step3B2B.style.display = 'none';

      if (targetVal === 'self') {
        if (step3Self) step3Self.style.display = 'block';
      } else if (targetVal === 'gift') {
        if (step3Gift) step3Gift.style.display = 'block';
      } else if (targetVal === 'b2b') {
        if (step3B2B) step3B2B.style.display = 'block';
      }
    }

    // 3. Configure Step 4 based on Target (Retail vs B2B)
    if (stepNum === 4) {
      if (targetVal === 'b2b') {
        if (step4Retail) step4Retail.style.display = 'none';
        if (step4B2B) step4B2B.style.display = 'block';
      } else {
        if (step4Retail) step4Retail.style.display = 'block';
        if (step4B2B) step4B2B.style.display = 'none';
      }
    }

    // 4. Configure Step 5 (Final messenger message synthesis)
    if (stepNum === 5) {
      const quizFinalTitle = document.getElementById('quizFinalTitle');
      const quizFinalSubtitle = document.getElementById('quizFinalSubtitle');
      const quizTextarea = document.getElementById('quizTextarea');

      if (targetVal === 'b2b') {
        if (quizFinalTitle) quizFinalTitle.textContent = 'Данные для расчета корпоративного заказа приняты!';
        if (quizFinalSubtitle) quizFinalSubtitle.textContent = 'Сформировали заявку для мастера. Нажмите на удобный мессенджер — Ольга пришлет оптовый прайс, согласует брендирование и закрывающие документы:';

        const b2bProduct = document.querySelector('input[name="quiz_product_b2b"]:checked')?.value || 'Корпоративные подарки';
        const b2bTier = document.querySelector('input[name="quiz_b2b_tier"]:checked')?.value || 'Малая партия 5–15 шт.';
        const b2bDelivery = document.querySelector('input[name="quiz_delivery_b2b"]:checked')?.value || 'Стандартный срок';

        if (quizTextarea) {
          quizTextarea.value = `Здравствуйте, Ольга! Интересует корпоративный заказ: ${b2bProduct}. Параметры: ${b2bTier}. Сроки: ${b2bDelivery}. Нужен расчет сметы и условий для юрлиц.`;
          focusTextareaWithCursorAtEnd(quizTextarea);
        }
      } else if (targetVal === 'stock') {
        if (quizFinalTitle) quizFinalTitle.textContent = 'Запрос на готовые работы из наличия сформирован!';
        if (quizFinalSubtitle) quizFinalSubtitle.textContent = 'Ольга ответит в течение 10–15 минут, пришлет фото и видео изделий, которые можно забрать или отправить прямо сейчас:';

        const stockDelivery = document.querySelector('input[name="quiz_delivery_retail"]:checked')?.value || 'Срочно';

        if (quizTextarea) {
          quizTextarea.value = `Здравствуйте, Ольга! Ищу изделия из наличия со скидкой 10%. Доставка/получение: ${stockDelivery}. Пришлите, пожалуйста, фото и видео готовых работ.`;
          focusTextareaWithCursorAtEnd(quizTextarea);
        }
      } else {
        // Self or Gift
        if (quizFinalTitle) quizFinalTitle.textContent = 'Параметры приняты! Ваш промокод на скидку 10% сформирован';
        if (quizFinalSubtitle) quizFinalSubtitle.textContent = 'Фотографии не передают глубину смолы и переливы золота. Ольга пришлет живые видео подходящих работ в диалоге:';

        const product = document.querySelector('input[name="quiz_product_retail"]:checked')?.value || 'Часы/декор';
        let detail = '';
        if (targetVal === 'self') {
          detail = document.querySelector('input[name="quiz_scale_self"]:checked')?.value || 'Средний формат';
        } else {
          detail = 'Бюджет: ' + (document.querySelector('input[name="quiz_budget_gift"]:checked')?.value || '1 500 – 4 000 ₽');
        }
        const delivery = document.querySelector('input[name="quiz_delivery_retail"]:checked')?.value || 'Стандартные сроки';

        if (quizTextarea) {
          quizTextarea.value = `Здравствуйте, Ольга! Прошел подбор на сайте: ищу ${targetVal === 'gift' ? 'в подарок' : 'для своего дома'} — ${product}. Детали: ${detail}. Сроки/доставка: ${delivery}. Хочу закрепить скидку 10% на заказ.`;
          focusTextareaWithCursorAtEnd(quizTextarea);
        }
      }
    }

    // Toggle active step
    quizSteps.forEach(step => step.classList.remove('active'));
    const targetStep = document.querySelector(`.quiz-step[data-step="${stepNum}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
      const progressPercent = targetVal === 'stock' && stepNum === 4 ? 75 : (stepNum / 5) * 100;
      if (progressFill) progressFill.style.width = `${progressPercent}%`;
      if (stepIndicator) {
        stepIndicator.textContent = stepNum === 5 ? 'Финальный шаг' : `Шаг ${stepNum} из 5`;
      }
    }
  }

  // --- 6. PRODUCTION CAROUSEL WITH SWIPE & COUNTER ---
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const carouselPrevMini = document.getElementById('carouselPrevMini');
  const carouselNextMini = document.getElementById('carouselNextMini');
  const carouselCurrentNum = document.getElementById('carouselCurrentNum');
  const carouselTotalNum = document.getElementById('carouselTotalNum');

  if (carouselTrack) {
    let currentSlide = 0;
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    if (carouselTotalNum) {
      carouselTotalNum.textContent = totalSlides;
    }

    function getVisibleCount() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 992) return 2;
      return 4;
    }

    function updateCarousel() {
      const visible = getVisibleCount();
      const maxSlide = Math.max(0, totalSlides - visible);
      if (currentSlide > maxSlide) currentSlide = maxSlide;
      if (currentSlide < 0) currentSlide = 0;

      if (slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width + 16;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      }

      if (carouselCurrentNum) {
        carouselCurrentNum.textContent = currentSlide + 1;
      }
    }

    function nextSlide() {
      const visible = getVisibleCount();
      if (currentSlide < totalSlides - visible) {
        currentSlide++;
      } else {
        currentSlide = 0; // wrap around
      }
      updateCarousel();
    }

    function prevSlide() {
      const visible = getVisibleCount();
      if (currentSlide > 0) {
        currentSlide--;
      } else {
        currentSlide = Math.max(0, totalSlides - visible); // wrap around
      }
      updateCarousel();
    }

    carouselNextBtn?.addEventListener('click', nextSlide);
    carouselPrevBtn?.addEventListener('click', prevSlide);
    carouselNextMini?.addEventListener('click', nextSlide);
    carouselPrevMini?.addEventListener('click', prevSlide);

    // Touch swipe support on mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  // --- 7. ACCORDION (FAQ) ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
      }
    });
  });

  // Helper to place cursor at end of textarea and trigger focus (blinking caret)
  function focusTextareaWithCursorAtEnd(el) {
    if (!el) return;
    setTimeout(() => {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, 120);
  }

  // --- MESSENGER DISPATCHER ENGINE ---
  const MESSENGER_LINKS = {
    telegram: 'https://t.me/shults_art_resin',
    max: 'https://max.ru/join/v3nX1ZB_nsTEWo7bMsAPFa2f5wcHgpRAbanokIg9pbg',
    vk: 'https://vk.ru/club239195224'
  };

  function handleMessengerClick(channel, textareaId) {
    const textarea = document.getElementById(textareaId);
    const text = textarea ? textarea.value.trim() : '';

    // Copy to clipboard so user never loses their edited text
    if (text && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }

    let targetUrl = '';
    if (channel === 'Telegram') {
      targetUrl = `${MESSENGER_LINKS.telegram}?text=${encodeURIComponent(text)}`;
    } else if (channel === 'VK') {
      targetUrl = `${MESSENGER_LINKS.vk}`;
    } else if (channel === 'MAX') {
      targetUrl = `${MESSENGER_LINKS.max}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }

    showToast(`Сообщение скопировано! Открываем ${channel}...`);

    if (typeof ym !== 'undefined') {
      ym(99999999, 'reachGoal', 'messenger_click');
    }

    // Close any active modal
    callbackModal?.classList.remove('active');
    orderModal?.classList.remove('active');
    giftBoxModal?.classList.remove('active');
    exitModal?.classList.remove('active');
  }

  // Global delegation for messenger action buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-messenger');
    if (btn) {
      e.preventDefault();
      const channel = btn.getAttribute('data-channel');
      const targetInputId = btn.getAttribute('data-target-input');
      handleMessengerClick(channel, targetInputId);
    }
  });

  // --- 8. MODALS ENGINE ---
  const callbackModal = document.getElementById('callbackModal');
  const orderModal = document.getElementById('orderModal');
  const videoModal = document.getElementById('videoModal');
  const exitModal = document.getElementById('exitModal');

  // Callback Modal Triggers
  const headerCallbackBtn = document.getElementById('headerCallbackBtn');
  const drawerCallbackBtn = document.getElementById('drawerCallbackBtn');

  [headerCallbackBtn, drawerCallbackBtn].forEach(btn => {
    btn?.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      callbackModal?.classList.add('active');
      const textarea = document.getElementById('callbackTextarea');
      focusTextareaWithCursorAtEnd(textarea);
    });
  });

  document.getElementById('callbackModalClose')?.addEventListener('click', () => callbackModal?.classList.remove('active'));
  document.getElementById('callbackModalBackdrop')?.addEventListener('click', () => callbackModal?.classList.remove('active'));

  // Order Modal Trigger (from Catalog Cards)
  const orderBtns = document.querySelectorAll('.order-btn');
  const orderModalProduct = document.getElementById('orderModalProduct');
  const orderTextarea = document.getElementById('orderTextarea');

  orderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.catalog-card');
      const productName = btn.dataset.product || card?.querySelector('.card-title')?.textContent?.trim() || 'Изделие ручной работы';
      const priceText = card?.querySelector('.price-current')?.textContent?.trim() || '';

      if (orderModalProduct) {
        orderModalProduct.innerHTML = `Вы выбрали: <strong>${productName}</strong> ${priceText ? `(${priceText})` : ''}`;
      }
      if (orderTextarea) {
        orderTextarea.value = `Здравствуйте, Ольга! Хочу заказать «${productName}»${priceText ? ` (${priceText})` : ''} из каталога сайта. Подскажите, есть ли в наличии или сколько займет изготовление?`;
      }
      orderModal?.classList.add('active');
      focusTextareaWithCursorAtEnd(orderTextarea);
    });
  });

  document.getElementById('orderModalClose')?.addEventListener('click', () => orderModal?.classList.remove('active'));
  document.getElementById('orderModalBackdrop')?.addEventListener('click', () => orderModal?.classList.remove('active'));

  // --- 8. GIFT BOX & SMART DELIVERY CALCULATOR ENGINE ---
  const giftBoxModal = document.getElementById('giftBoxModal');
  const deliveryGiftOrderBtn = document.getElementById('deliveryGiftOrderBtn');
  const deliveryCalcModal = document.getElementById('deliveryCalcModal');
  const deliveryCalcTriggerBtn = document.getElementById('deliveryCalcTriggerBtn');
  const calcDoCalculateBtn = document.getElementById('calcDoCalculateBtn');
  const calcResultCard = document.getElementById('calcResultCard');
  
  const calcCitySelect = document.getElementById('calcCitySelect');
  const customCityWrap = document.getElementById('customCityWrap');
  const customCityInput = document.getElementById('customCityInput');
  const calcItemSelect = document.getElementById('calcItemSelect');
  
  const calcDaysVal = document.getElementById('calcDaysVal');
  const calcPriceVal = document.getElementById('calcPriceVal');

  // Gift Box Modal Triggers
  deliveryGiftOrderBtn?.addEventListener('click', () => {
    giftBoxModal?.classList.add('active');
    const giftTextarea = document.getElementById('giftTextarea');
    focusTextareaWithCursorAtEnd(giftTextarea);
  });

  document.getElementById('giftBoxModalClose')?.addEventListener('click', () => giftBoxModal?.classList.remove('active'));
  document.getElementById('giftBoxModalBackdrop')?.addEventListener('click', () => giftBoxModal?.classList.remove('active'));

  // Delivery Calc Modal Open
  deliveryCalcTriggerBtn?.addEventListener('click', () => {
    deliveryCalcModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (calcResultCard) calcResultCard.style.display = 'block';
    calculateDelivery();
  });
  
  const closeCalcModal = () => {
    deliveryCalcModal?.classList.remove('active');
    document.body.style.overflow = '';
  };
  document.getElementById('deliveryCalcModalClose')?.addEventListener('click', closeCalcModal);
  document.getElementById('deliveryCalcModalBackdrop')?.addEventListener('click', closeCalcModal);


  // Toggle Custom City Input Field
  calcCitySelect?.addEventListener('change', () => {
    if (calcCitySelect.value === 'custom_other') {
      if (customCityWrap) customCityWrap.style.display = 'block';
      customCityInput?.focus();
    } else {
      if (customCityWrap) customCityWrap.style.display = 'none';
    }
  });

  // Base Geographic Distances & Zones Matrix from Orenburg (51.7682° N, 55.0970° E)
  const knownCityDatabase = {
    // 1. Оренбург и область
    orenburg:    { days: 'от 2 дней', small: 250, medium: 290, large: 350 },
    orsk:        { days: 'от 2 дней', small: 270, medium: 340, large: 420 },
    buzuluk:     { days: 'от 2 дней', small: 270, medium: 340, large: 420 },
    novotroitsk: { days: 'от 2 дней', small: 270, medium: 340, large: 420 },
    gay:         { days: 'от 2 дней', small: 280, medium: 350, large: 430 },
    
    // 2. Соседние регионы
    samara:      { days: 'от 2 дней', small: 300, medium: 370, large: 480 },
    tolyatti:    { days: 'от 2 дней', small: 300, medium: 370, large: 480 },
    ufa:         { days: 'от 2 дней', small: 300, medium: 370, large: 480 },
    kazan:       { days: 'от 2 дней', small: 320, medium: 380, large: 510 },
    sterlitamak: { days: 'от 2 дней', small: 310, medium: 370, large: 490 },
    
    // 3. Вся Россия
    msk:         { days: 'от 2–3 дней', small: 340, medium: 410, large: 540 },
    spb:         { days: 'от 2–3 дней', small: 360, medium: 430, large: 570 },
    ekb:         { days: 'от 2–3 дней', small: 320, medium: 390, large: 520 },
    chel:        { days: 'от 2–3 дней', small: 320, medium: 390, large: 520 },
    nn:          { days: 'от 2–3 дней', small: 330, medium: 400, large: 530 },
    krd:         { days: 'от 3–4 дней', small: 350, medium: 430, large: 560 },
    sochi:       { days: 'от 3–4 дней', small: 360, medium: 440, large: 580 },
    rnd:         { days: 'от 3–4 дней', small: 350, medium: 420, large: 550 },
    perm:        { days: 'от 2–3 дней', small: 330, medium: 400, large: 530 },
    tmn:         { days: 'от 2–3 дней', small: 340, medium: 420, large: 550 },
    nsk:         { days: 'от 3–4 дней', small: 370, medium: 460, large: 620 },
    krasnoyarsk: { days: 'от 3–5 дней', small: 390, medium: 490, large: 650 },
    omsk:        { days: 'от 3–4 дней', small: 360, medium: 450, large: 590 },
    volgograd:   { days: 'от 2–3 дней', small: 330, medium: 400, large: 530 },
    voronezh:    { days: 'от 2–3 дней', small: 330, medium: 400, large: 530 },
    vladivostok: { days: 'от 5–7 дней', small: 520, medium: 690, large: 890 },
    habarovsk:   { days: 'от 5–7 дней', small: 520, medium: 690, large: 890 }
  };

  // Smart Keyword Recognizer for Custom Text Input (e.g. "Сургут", "Якутск", "Мурманск")
  function evaluateCustomCity(cityName) {
    const name = (cityName || '').toLowerCase().trim();
    if (!name) return { days: 'от 2–4 дней', small: 360, medium: 430, large: 570 };

    // Far East / North Extreme
    if (/якутск|магадан|петропавловск|камчатк|сахалин|южно-сахалинск|норильск|анадырь|чукотк/.test(name)) {
      return { days: 'от 6–9 дней', small: 590, medium: 790, large: 990 };
    }
    // Siberia / Far East East
    if (/владивосток|хабаровск|чита|иркутск|улан-удэ|благовещенск|сургут|нижневартовск|ханты|ямал|салехард|новый уренгой|ноябрьск/.test(name)) {
      return { days: 'от 4–6 дней', small: 460, medium: 560, large: 720 };
    }
    // Urals / Western Siberia
    if (/томск|кемерово|барнаул|новокузнецк|курган|магнитогорск|златоуст|миасс|нижний тагил/.test(name)) {
      return { days: 'от 3–4 дней', small: 350, medium: 420, large: 560 };
    }
    // South / Caucasus
    if (/симферополь|севастополь|крым|ставрополь|пятигорск|кисловодск|владикавказ|грозный|махачкала|нальчик|астрахань|элиста/.test(name)) {
      return { days: 'от 3–4 дней', small: 360, medium: 440, large: 580 };
    }
    // North-West / Golden Ring / Center
    if (/архангельск|мурманск|петрозаводск|карели|вологда|череповец|ярославль|кострома|иваново|владимир|тверь|рязань|тула|калуга|брянск|орел|курск|белгород|липецк|тамбов|пенза|саранск|чебоксары|йошкар-ола|ульяновск|димитровград/.test(name)) {
      return { days: 'от 2–3 дней', small: 330, medium: 400, large: 530 };
    }
    // Orenburg region small towns
    if (/соль-илецк|сорочинск|медногорск|кувандык|ясный|абдулино|саракташ|акбулак|новосергиевка|переволоцк|тоцк/.test(name)) {
      return { days: 'от 2 дней', small: 260, medium: 320, large: 390 };
    }

    // Standard Central Russia default
    return { days: 'от 2–4 дней', small: 350, medium: 420, large: 560 };
  }

  function calculateDelivery() {
    const cityKey = calcCitySelect?.value || 'orsk';
    const item = calcItemSelect?.value || 'medium';

    let rate;
    if (cityKey === 'custom_other') {
      const userCityText = customCityInput?.value || '';
      rate = evaluateCustomCity(userCityText);
    } else {
      rate = knownCityDatabase[cityKey] || knownCityDatabase['orsk'];
    }

    const price = rate[item] || 380;

    if (calcDaysVal) calcDaysVal.textContent = rate.days;
    if (calcPriceVal) calcPriceVal.innerHTML = `от <span class="tnum">${price}</span> ₽`;

    if (calcResultCard) {
      calcResultCard.style.display = 'block';
      calcResultCard.style.animation = 'none';
      calcResultCard.offsetHeight; // trigger reflow
      calcResultCard.style.animation = 'fadeIn 0.3s ease';
    }
  }

  // Calculate ONLY on clicking the gold "Рассчитать доставку" button or changing item
  calcDoCalculateBtn?.addEventListener('click', calculateDelivery);
  customCityInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateDelivery();
    }
  });

  // --- 9. FULL VIDEO MODAL TRIGGER ---

  // Full Video Modal Trigger
  const heroVideoTrigger = document.getElementById('heroVideoTrigger');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');

  if (heroVideoTrigger) {
    heroVideoTrigger.addEventListener('click', () => {
      const vModal = document.getElementById('videoModal');
      const vPlayer = document.getElementById('modalVideoPlayer');
      if (vModal) {
        vModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      if (vPlayer) {
        vPlayer.currentTime = 0;
        vPlayer.muted = false;
        vPlayer.play().catch(e => console.log('Autoplay prevented:', e));
      }
    });
  }

  function closeVideoModal() {
    const vModal = document.getElementById('videoModal');
    const vPlayer = document.getElementById('modalVideoPlayer');
    if (vModal) vModal.classList.remove('active');
    if (vPlayer) vPlayer.pause();
    document.body.style.overflow = '';
  }

  document.getElementById('videoModalClose')?.addEventListener('click', closeVideoModal);
  document.getElementById('videoModalBackdrop')?.addEventListener('click', closeVideoModal);


  // Exit Modal Trigger & Close
  document.getElementById('exitModalClose')?.addEventListener('click', () => exitModal?.classList.remove('active'));
  document.getElementById('exitModalBackdrop')?.addEventListener('click', () => exitModal?.classList.remove('active'));

  let exitTriggered = false;
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !exitTriggered && !localStorage.getItem('exit_intent_shown')) {
      exitTriggered = true;
      localStorage.setItem('exit_intent_shown', 'true');
      exitModal?.classList.add('active');
      const exitTextarea = document.getElementById('exitTextarea');
      focusTextareaWithCursorAtEnd(exitTextarea);
    }
  });

  // --- 9. SCROLL TO TOP BUTTON ---
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('active');
    } else {
      scrollTopBtn?.classList.remove('active');
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 10. COOKIE CONSENT ---
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptCookieBtn = document.getElementById('acceptCookieBtn');

  if (!localStorage.getItem('cookie_consent')) {
    setTimeout(() => {
      if (cookieBanner) cookieBanner.style.display = 'block';
    }, 1500);
  }

  acceptCookieBtn?.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    if (cookieBanner) cookieBanner.style.display = 'none';
  });

  // --- 11. TOAST NOTIFICATION ---
  function showToast(customMsg) {
    const toast = document.getElementById('toastNotification');
    if (toast) {
      if (customMsg) {
        const msgEl = toast.querySelector('.toast-msg span');
        if (msgEl) msgEl.textContent = customMsg;
      }
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 4000);
    }
  }

  const forms = [
    quizForm,
    document.getElementById('mainCtaForm'),
    document.getElementById('orderModalForm'),
    document.getElementById('callbackModalForm'),
    document.getElementById('giftBoxModalForm'),
    document.getElementById('exitForm')
  ];

  forms.forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (typeof ym !== 'undefined') {
        ym(99999999, 'reachGoal', 'form_submit');
      }

      showToast();
      form.reset();
      callbackModal?.classList.remove('active');
      orderModal?.classList.remove('active');
      giftBoxModal?.classList.remove('active');
      exitModal?.classList.remove('active');
      if (form === quizForm) {
        goToQuizStep(1);
      }
    });
  });

});

/* ==========================================================================
   ИНТЕРАКТИВНОЕ ОТКРЫТИЕ И ЗАКРЫТИЕ ЮРИДИЧЕСКИХ ДОКУМЕНТОВ НА КЛИКЕ (152-ФЗ)
   ПОЛНЫЕ ОФИЦИАЛЬНЫЕ ТЕКСТЫ ДОКУМЕНТОВ
   ========================================================================== */
const LEGAL_DOCS_DATA = {
  privacy: {
    title: "Политика в отношении обработки персональных данных (152-ФЗ)",
    content: `
      <h2>1. Реквизиты и статус Оператора персональных данных</h2>
      <p>Настоящая Политика обработки персональных данных (далее — «Политика») составлена в соответствии с Федеральным законом РФ от 27.07.2006 № 152-ФЗ «О персональных данных» и действует в отношении всей информации, которую Мастерская Шульц: арт – смола может получить о Пользователе во время использования сайта.</p>
      <p><strong>Наименование:</strong> Мастерская Шульц: арт – смола.<br>
      <strong>Оператор/Мастер:</strong> Шульц Ольга Алексеевна<br>
      <strong>Правовой статус:</strong> Плательщик налога на профессиональный доход (самозанятая)<br>
      <strong>Адрес производства:</strong> Российская Федерация, г. Оренбург, ул. Перовского, д. 1а<br>
      <strong>Контактный телефон:</strong> +7 (961) 922-16-10<br>
      <strong>Официальный Email:</strong> shults_art_resin@mail.ru</p>

      <h2>2. Основные понятия</h2>
      <p><strong>Персональные данные</strong> — любая информация, относящаяся прямо или косвенно к определённому или определяемому физическому лицу (Пользователю).</p>
      <p><strong>Обработка персональных данных</strong> — любое действие (операция) или совокупность действий, совершаемых с персональными данными: сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача, обезличивание, блокирование, удаление, уничтожение.</p>
      <p><strong>Конфиденциальность</strong> — обязательное для соблюдения Оператором требование не допускать распространения персональных данных без согласия субъекта или наличия иного законного основания.</p>

      <h2>3. Состав и категории обрабатываемых персональных данных</h2>
      <p>Оператор обрабатывает следующие категории данных, добровольно предоставляемые Пользователем при заполнении контактных форм, квиза, заявок на обратный звонок и бронирование упаковки на сайте:</p>
      <ul>
        <li><strong>Фамилия, имя</strong> — для персонализации каллиграфической открытки и оформления договора;</li>
        <li><strong>Номер контактного мобильного телефона</strong> — для связи, согласования эскизов и отправки уведомлений;</li>
        <li><strong>Никнейм / профиль в мессенджерах</strong> (Telegram, MAX, ВКонтакте) — для удобной коммуникации с клиентом;</li>
        <li><strong>Адрес доставки</strong> (город, улица, номер дома/квартиры или пункт выдачи СДЭК / Почты России) — для организации логистики;</li>
        <li><strong>Обезличенные технические данные</strong> (файлы cookie, IP-адрес, данные Яндекс.Метрики) — для аналитики и оптимизации работы сайта.</li>
      </ul>
      <p>Оператор не обрабатывает специальные категории персональных данных (расовая принадлежность, религиозные убеждения, биометрия, состояние здоровья).</p>

      <h2>4. Правовые основания и цели обработки персональных данных</h2>
      <p><strong>4.1. Исполнение договора (ст. 6 ч. 1 п. 1 152-ФЗ):</strong></p>
      <ul>
        <li>Оформление индивидуального заказа на авторские часы и декор;</li>
        <li>Подбор габаритов, палитры смолы и согласование эскизов под интерьер клиента;</li>
        <li>Предоставление промежуточных фото- и видеоотчетов заливки смолы;</li>
        <li>Организация доставки курьерскими службами СДЭК / Почта России со страховкой 100% стоимости отправления;</li>
        <li>Информирование о статусе отправки и передача трек-номеров.</li>
      </ul>
      <p><strong>4.2. Согласие субъекта (ст. 6 ч. 1 п. 1 152-ФЗ):</strong> обработка данных, предоставленных Пользователем через веб-формы на сайте.</p>
      <p><strong>4.3. Законные интересы Оператора (ст. 6 ч. 1 п. 5 152-ФЗ):</strong> обработка обезличенных технических данных (cookie, счетчик Яндекс.Метрики) для улучшения пользовательского опыта.</p>

      <h2>5. Согласие на обработку персональных данных</h2>
      <p>5.1. Отправка Пользователем любой веб-формы на сайте («Получить консультацию», «Заказать в 1 клик», «Забронировать бесплатно», «Рассчитать доставку», отправка квиза) является осознанным активным действием и означает свободное согласие Пользователя на обработку его данных на условиях настоящей Политики.</p>
      <p>5.2. Согласие действует с момента отправки формы до момента его отзыва Пользователем.</p>

      <h2>6. Порядок сбора, хранения и защиты данных</h2>
      <p><strong>6.1. Место хранения:</strong> базы данных и веб-серверы размещены на территории Российской Федерации. Локальные данные хранятся на защищенных устройствах Оператора.</p>
      <p><strong>6.2. Доступ и передача третьим лицам:</strong> доступ имеет исключительно Оператор (Шульц Ольга Алексеевна). Передача третьим лицам осуществляется строго для исполнения заказа: ООО «СДЭК» и АО «Почта России» (для доставки).</p>
      <p><strong>6.3. Сроки хранения:</strong> до 6 месяцев для незавершенных обращений; до 3 лет для исполненных заказов (в рамках общего срока исковой давности по ст. 196 ГК РФ); до 13 месяцев для файлов cookie.</p>

      <h2>7. Использование файлов Cookie и систем аналитики</h2>
      <p>На сайте используется счетчик веб-аналитики Яндекс.Метрика для сбора обезличенных статистических данных. Пользователь может в любой момент отключить сохранение cookie в настройках своего браузера.</p>

      <h2>8. Права Пользователя и порядок отзыва согласия</h2>
      <p>8.1. Пользователь имеет право на получение сведений об обработке его персональных данных, их уточнение, блокирование или уничтожение.</p>
      <p>8.2. Для отзыва согласия направьте заявление на электронную почту: <strong>shults_art_resin@mail.ru</strong> либо по телефону <strong>+7 (961) 922-16-10</strong>. Оператор прекращает обработку данных и уничтожает их в срок не более 30 календарных дней.</p>
      <p>8.3. Контролирующий орган: Федеральная служба по надзору в сфере связи, информационных технологий и массовых коммуникаций (Роскомнадзор), сайт: https://rkn.gov.ru/.</p>

      <h2>9. Заключительные положения</h2>
      <p>Политика действует бессрочно до утверждения новой редакции. Актуальная версия всегда доступна на сайте.</p>
      <hr>
      <p><a href="privacy.html" target="_blank" style="color:var(--color-gold);">Открыть в отдельной вкладке ↗</a></p>
    `
  },
  consent: {
    title: "Согласие на обработку персональных данных",
    content: `
      <h2>Согласие субъекта на обработку персональных данных</h2>
      <p>В соответствии с Федеральным законом РФ от 27.07.2006 № 152-ФЗ «О персональных данных», действуя свободно, своей волей и в своем интересе, а также подтверждая свою дееспособность, я даю свое согласие самозанятой <strong>Шульц Ольге Алексеевне (Мастерская Шульц: арт – смола)</strong>, зарегистрированной по адресу: РФ, г. Оренбург, ул. Перовского, д. 1а, на обработку моих персональных данных на следующих условиях:</p>

      <h2>1. Перечень обрабатываемых персональных данных</h2>
      <ul>
        <li>Фамилия, имя (для договора, открытки и логистики);</li>
        <li>Контактный номер мобильного телефона (для связи и СМС);</li>
        <li>Никнейм / аккаунт в мессенджерах (Telegram, MAX, ВКонтакте);</li>
        <li>Адрес доставки (город, улица, дом, квартира или пункт выдачи СДЭК / Почта России);</li>
        <li>Обезличенные технические данные (IP-адрес, cookie, сведения о браузере).</li>
      </ul>

      <h2>2. Цели обработки</h2>
      <ul>
        <li>Обработка входящих обращений, расчет стоимости авторских изделий и доставки;</li>
        <li>Согласование эскизов, палитры смолы и габаритов часов под интерьер;</li>
        <li>Предоставление фото- и видеоотчетов о ходе выполнения индивидуального заказа;</li>
        <li>Заключение и исполнение договоров купли-продажи и авторского заказа;</li>
        <li>Организация доставки изделий курьерскими службами со страховкой 100% стоимости;</li>
        <li>Информирование о статусе заказа и предоставление трек-номеров.</li>
      </ul>

      <h2>3. Действия с персональными данными</h2>
      <p>Настоящее согласие дается на совершение любых действий (операций) с использованием средств автоматизации или без таковых: сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (предоставление курьерским службам ООО «СДЭК» и АО «Почта России»), обезличивание, блокирование, удаление и уничтожение.</p>

      <h2>4. Срок действия и порядок отзыва</h2>
      <p>Согласие вступает в силу с момента отправки веб-формы на сайте и действует бессрочно до достижения целей обработки или до момента отзыва.</p>
      <p>Согласие может быть отозвано в любой момент путем направления письменного уведомления на электронную почту: <strong>shults_art_resin@mail.ru</strong> с темой «Отзыв согласия на обработку персональных данных». Срок прекращения обработки и удаления данных — не более 30 календарных дней.</p>
      <hr>
      <p><a href="privacy.html#consent" target="_blank" style="color:var(--color-gold);">Открыть раздел в отдельной вкладке ↗</a></p>
    `
  },
  terms: {
    title: "Публичная оферта и условия заказа",
    content: `
      <h2>Публичная оферта на изготовление и продажу изделий ручной работы</h2>
      <p>Настоящий документ является официальным предложением (публичной офертой в соответствии со ст. 435 и ч. 2 ст. 437 Гражданского кодекса РФ) самозанятой <strong>Шульц Ольги Алексеевны (Мастерская Шульц: арт – смола)</strong> заключить договор купли-продажи и изготовления авторских изделий из эпоксидной смолы дистанционным способом.</p>

      <h2>1. Общие положения и акцепт оферты</h2>
      <p>1.1. Заказ Покупателем товара на сайте, отправка любой веб-формы, подтверждение заявки через мессенджеры или оплата счета является полным и безоговорочным акцептом настоящей Оферты.</p>
      <p>1.2. Продавец осуществляет деятельность в статусе плательщика налога на профессиональный доход (самозанятая), г. Оренбург, ул. Перовского, 1а. Тел.: +7 (961) 922-16-10. Email: shults_art_resin@mail.ru.</p>

      <h2>2. Особенности авторских изделий ручной работы</h2>
      <p>2.1. Каждое изделие уникально и изготавливается вручную из сертифицированной итальянской смолы, спилов древесины и минеральных пигментов. Текстура дерева, глубина волн и рисунок прожилок неповторимы и могут иметь естественные вариации, что подчеркивает аутентичность ручной работы и не признается браком.</p>
      <p>2.2. В часах применяются надежные бесшумные кварцевые механизмы Hermle (Германия) с плавным ходом стрелок.</p>

      <h2>3. Сроки изготовления и оплата</h2>
      <p>3.1. Изделия из наличия передаются в службу доставки в течение 24–48 часов после оплаты.</p>
      <p>3.2. Срок изготовления авторских изделий по индивидуальным параметрам составляет от 3 до 7 рабочих дней с момента согласования цветовой гаммы и внесения предоплаты.</p>
      <p>3.3. В процессе работы Продавец предоставляет Покупателю фото- и видеоотчеты промежуточных этапов заливки.</p>
      <p>3.4. Оплата производится официально в безналичном порядке с формированием фискального чека в приложении ФНС «Мой налог».</p>

      <h2>4. Доставка и 100% гарантия сохранности</h2>
      <p>4.1. Доставка по всей территории РФ осуществляется курьерскими службами СДЭК и Почта России.</p>
      <p>4.2. Каждое изделие помещается в индивидуальную защитную упаковку со страховкой 100% объявленной стоимости.</p>
      <p>4.3. При повреждении отправления в процессе транспортировки Продавец обязуется бесплатно изготовить и отправить новое аналогичное изделие в приоритетном порядке либо вернуть полную сумму оплаты.</p>

      <h2>5. Права Потребителя и возврат</h2>
      <p>5.1. Покупатель вправе отказаться от готового товара надлежащего качества из наличия в любое время до его передачи, а после передачи — в течение 7 дней (ст. 26.1 Закона РФ «О защите прав потребителей») при условии сохранения товарного вида и потребительских свойств.</p>
      <p>5.2. Товар индивидуального изготовления, созданный по индивидуально-определенным параметрам Покупателя, возврату не подлежит на основании ч. 4 ст. 26.1 Закона РФ «О защите прав потребителей».</p>
      <hr>
      <p><a href="terms.html" target="_blank" style="color:var(--color-gold);">Открыть полный текст Оферты в отдельной вкладке ↗</a></p>
    `
  },
  cookies: {
    title: "Политика использования файлов Cookie",
    content: `
      <h2>1. Что такое файлы Cookie и для чего они нужны</h2>
      <p>Файлы cookie — это небольшие фрагменты текстовых данных, которые веб-сервер сохраняет в браузере Пользователя. Они позволяют сайту запоминать ваши предпочтения (например, выбор мессенджера или ответы в интерактивном квизе) и обеспечивают корректную работу всех интерактивных модулей.</p>

      <h2>2. Категории используемых файлов Cookie</h2>
      <ul>
        <li><strong>Технические и сессионные:</strong> необходимы для функционирования квиза, запоминания этапов расчета доставки и работы модальных окон;</li>
        <li><strong>Аналитические:</strong> файлы системы веб-аналитики Яндекс.Метрика, позволяющие анонимно анализировать посещаемость, поведение пользователей и оптимизировать структуру сайта.</li>
      </ul>

      <h2>3. Сроки хранения</h2>
      <p>Сессионные файлы cookie удаляются сразу после закрытия браузера. Постоянные аналитические cookie хранятся не более 13 месяцев с момента последнего визита.</p>

      <h2>4. Как отключить cookie в браузере</h2>
      <p>Пользователь может в любой момент заблокировать сохранение файлов cookie или удалить уже сохраненные файлы в настройках безопасности своего браузера:</p>
      <ul>
        <li><strong>Яндекс.Браузер:</strong> Настройки → Сайты → Расширенные настройки сайтов → Cookie-файлы;</li>
        <li><strong>Google Chrome:</strong> Настройки → Конфиденциальность и безопасность → Сторонние файлы cookie;</li>
        <li><strong>Safari:</strong> Настройки → Конфиденциальность → Блокировать все cookie;</li>
        <li><strong>Mozilla Firefox:</strong> Настройки → Приватность и защита → Куки и данные сайтов.</li>
      </ul>
      <p>Обратите внимание: при полном отключении cookie работа некоторых интерактивных элементов сайта (сохранение шагов квиза) может стать недоступной.</p>
      <hr>
      <p><a href="privacy.html#cookies" target="_blank" style="color:var(--color-gold);">Открыть в отдельной вкладке ↗</a></p>
    `
  }
};

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

function openLegalModal(docType) {
  const doc = LEGAL_DOCS_DATA[docType] || LEGAL_DOCS_DATA.privacy;
  const modal = document.getElementById('legalModal');
  const titleEl = document.getElementById('legalModalTitle');
  const bodyEl = document.getElementById('legalModalBody');
  
  if (modal && titleEl && bodyEl) {
    titleEl.textContent = doc.title;
    bodyEl.innerHTML = doc.content;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    bodyEl.scrollTop = 0;
  }
}

// Делегирование кликов: открытие модалки и закрытие (крестик, кнопка, фон)
document.addEventListener('click', function(e) {
  const link = e.target.closest('.legal-link');
  if (link) {
    e.preventDefault();
    const docType = link.getAttribute('data-doc') || 'privacy';
    openLegalModal(docType);
    return;
  }

  if (
    e.target.closest('[data-close="legalModal"]') || 
    e.target.closest('#legalModalClose') || 
    e.target.closest('#legalModalCloseBtn') ||
    e.target.id === 'legalModalBackdrop' ||
    e.target.id === 'legalModal'
  ) {
    closeLegalModal();
  }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('legalModal');
    if (modal && modal.classList.contains('active')) {
      closeLegalModal();
    }
  }
});


  // --- SMOOTH SCROLLING FOR ALL INTERNAL ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile drawer if open
        if (typeof closeMobileMenu === 'function') {
          closeMobileMenu();
        }
        document.body.style.overflow = '';
        
        const headerEl = document.querySelector('.site-header');
        const headerOffset = headerEl ? headerEl.offsetHeight : 70;
        const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      }
    });
  });
