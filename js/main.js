/**
 * COACH PRO – INTERACTIVE LOGIC v3.0
 * Tab-based SPA Navigation + All Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 0. PAGE TRANSITIONS (fade between pages instead of a hard reload)
  // ==========================================================================
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageMain = document.querySelector('body > main');

  document.querySelectorAll('a[href*=".html"]:not([target="_blank"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const isSamePage = href === window.location.pathname.split('/').pop();
      if (!href || isSamePage || e.metaKey || e.ctrlKey) return;

      e.preventDefault();
      if (pageMain) pageMain.classList.add('page-fade-out');
      setTimeout(() => { window.location.href = href; }, reduceMotion || !pageMain ? 0 : 180);
    });
  });

  // ==========================================================================
  // 1. HEADER SCROLL EFFECT & SCROLL PROGRESS BAR
  // ==========================================================================
  const header = document.querySelector('.header');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    if (scrollProgressBar) {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgressBar.style.width = scrolled + '%';
    }
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ==========================================================================
  // 2. MOBILE MENU TOGGLE
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });
  }

  // ==========================================================================
  // 3. PRICING BILLING TOGGLE (Monthly vs Quarterly)
  // ==========================================================================
  const billingSwitch = document.getElementById('billingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelQuarterly = document.getElementById('labelQuarterly');
  let isQuarterly = false;

  function updatePricing() {
    const planAmounts = document.querySelectorAll('.amount[data-monthly]');
    if (billingSwitch) billingSwitch.classList.toggle('quarterly', isQuarterly);
    if (labelMonthly) labelMonthly.classList.toggle('active', !isQuarterly);
    if (labelQuarterly) labelQuarterly.classList.toggle('active', isQuarterly);

    planAmounts.forEach(elem => {
      const periodElem = elem.parentElement.querySelector('.period');
      if (isQuarterly) {
        elem.textContent = parseInt(elem.getAttribute('data-quarterly'), 10);
        if (periodElem) periodElem.textContent = '/trimestre';
      } else {
        elem.textContent = parseInt(elem.getAttribute('data-monthly'), 10);
        if (periodElem) periodElem.textContent = '/mes';
      }
    });
  }

  if (billingSwitch) billingSwitch.addEventListener('click', () => { isQuarterly = !isQuarterly; updatePricing(); });
  if (labelMonthly) labelMonthly.addEventListener('click', () => { isQuarterly = false; updatePricing(); });
  if (labelQuarterly) labelQuarterly.addEventListener('click', () => { isQuarterly = true; updatePricing(); });

  // ==========================================================================
  // 4. CHECKOUT MODAL
  // ==========================================================================
  const checkoutModal = document.getElementById('checkoutModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalPlanName = document.getElementById('modalPlanName');
  const modalPlanPrice = document.getElementById('modalPlanPrice');
  const checkoutForm = document.getElementById('checkoutForm');
  let selectedCheckoutPlan = '';
  let selectedCheckoutPrice = '';

  document.querySelectorAll('.btn-select-plan').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planCard = btn.closest('.pricing-card');
      selectedCheckoutPlan = planCard ? planCard.querySelector('.plan-name').textContent : 'Demo de COACH PRO';
      selectedCheckoutPrice = '';
      if (planCard) {
        const amount = planCard.querySelector('.amount').textContent;
        const currency = planCard.querySelector('.currency').textContent;
        const period = planCard.querySelector('.period').textContent;
        selectedCheckoutPrice = `${currency}${amount} ${period}`;
      }

      if (modalPlanName) modalPlanName.textContent = selectedCheckoutPlan;
      if (modalPlanPrice) modalPlanPrice.textContent = selectedCheckoutPrice;
      if (checkoutModal) checkoutModal.classList.add('open');
    });
  });

  if (closeModalBtn && checkoutModal) {
    closeModalBtn.addEventListener('click', () => checkoutModal.classList.remove('open'));
    checkoutModal.addEventListener('click', (e) => { if (e.target === checkoutModal) checkoutModal.classList.remove('open'); });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const phone = document.getElementById('clientPhone').value;
      const email = document.getElementById('clientEmail').value;
      const goal = document.getElementById('clientGoal').value;

      if (checkoutModal) checkoutModal.classList.remove('open');
      const text = encodeURIComponent(
        `¡Hola equipo de COACH PRO! Soy entrenador/a y quiero más información.\n` +
        `🎯 *Motivo:* ${goal}\n👤 *Nombre:* ${name}\n📱 *WhatsApp:* ${phone}\n✉️ *Email:* ${email}\n\n` +
        `¿Podemos coordinar una charla para conocer la plataforma?`
      );
      showToast('¡Consulta enviada! Abriendo WhatsApp...');
      setTimeout(() => window.open(`https://wa.me/5491100000000?text=${text}`, '_blank'), 1000);
      checkoutForm.reset();
    });
  }

  // ==========================================================================
  // 5. WORKOUT APP DEMO
  // ==========================================================================
  const workoutDaysData = {
    day1: {
      title: 'Día 1: Tren Superior (Empujes de Fuerza)',
      stats: '5 Ejercicios • 17 Series Totales • ~65 min',
      exercises: [
        { num: '1', name: 'Press Banca con Barra', cues: ['Retracción escapular firme', 'Pausa de 1s en pecho'], highlightCue: 'Básico de Fuerza', setsReps: '4 x 6–8', rir: 'RIR 2', rest: '2.5 min' },
        { num: '2', name: 'Press Inclinado con Mancuernas', cues: ['Ángulo de 30 grados', 'Rango articular completo'], highlightCue: 'Haz Clavicular', setsReps: '3 x 8–10', rir: 'RIR 1–2', rest: '2 min' },
        { num: '3', name: 'Fondos en Paralelas Lastrados', cues: ['Ligera inclinación de torso', 'Control excéntrico 3s'], highlightCue: 'Tríceps & Pectoral', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '90s' },
        { num: '4', name: 'Elevaciones Laterales en Polea', cues: ['Tensión continua', 'Sin balanceo'], highlightCue: 'Aislamiento Deltoides', setsReps: '4 x 12–15', rir: 'RIR 0', rest: '60s' },
        { num: '5', name: 'Press Francés con Mancuernas', cues: ['Codos cerrados y estables'], highlightCue: 'Cabeza Larga Tríceps', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '75s' }
      ]
    },
    day2: {
      title: 'Día 2: Pierna Completa & Glúteos (Sentadilla)',
      stats: '5 Ejercicios • 18 Series Totales • ~70 min',
      exercises: [
        { num: '1', name: 'Sentadilla Libre con Barra', cues: ['Presión trípode en pies', 'Romper paralelo con control'], highlightCue: 'Pilar de Fuerza', setsReps: '4 x 5–7', rir: 'RIR 2', rest: '3 min' },
        { num: '2', name: 'Peso Muerto Rumano con Mancuernas', cues: ['Bisagra de cadera pura'], highlightCue: 'Cadena Posterior', setsReps: '3 x 8–10', rir: 'RIR 1–2', rest: '2 min' },
        { num: '3', name: 'Prensa Inclinada a 45°', cues: ['Pies al ancho de hombros', 'Descenso profundo'], highlightCue: 'Volumen Cuádriceps', setsReps: '4 x 10–12', rir: 'RIR 1', rest: '90s' },
        { num: '4', name: 'Curl Femoral Tumbado', cues: ['Contracción isométrica 1s'], highlightCue: 'Hipertrofia Isquios', setsReps: '4 x 10–12', rir: 'RIR 0', rest: '60s' },
        { num: '5', name: 'Elevación de Talones en Máquina', cues: ['Pausa profunda abajo', 'Pico 2s arriba'], highlightCue: 'Rango Máximo Gemelos', setsReps: '3 x 15–20', rir: 'RIR 0', rest: '60s' }
      ]
    },
    day3: {
      title: 'Día 3: Espalda, Bíceps & Core (Tracciones)',
      stats: '5 Ejercicios • 17 Series Totales • ~60 min',
      exercises: [
        { num: '1', name: 'Dominadas Pronas (Lastradas)', cues: ['Depresión escapular', 'Pecho hacia la barra'], highlightCue: 'Dorsal Ancho & Fuerza', setsReps: '4 x 6–8', rir: 'RIR 1–2', rest: '2.5 min' },
        { num: '2', name: 'Remo con Barra en Pronación', cues: ['Traccionar hacia la cadera', 'Codos pegados'], highlightCue: 'Densidad Espalda', setsReps: '4 x 8–10', rir: 'RIR 2', rest: '2 min' },
        { num: '3', name: 'Jalón al Pecho Agarre Neutro', cues: ['Máximo estiramiento arriba'], highlightCue: 'Amplitud Dorsal', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '90s' },
        { num: '4', name: 'Curl con Barra Z de Pie', cues: ['Codos fijos', 'Sin balanceo lumbar'], highlightCue: 'Pico de Bíceps', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '75s' },
        { num: '5', name: 'Rueda Abdominal (Ab Wheel)', cues: ['Retroversión pélvica', 'Control excéntrico total'], highlightCue: 'Anti-Extensión Core', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '60s' }
      ]
    }
  };

  function renderWorkoutDay(dayKey) {
    const workoutDayName = document.getElementById('workoutDayName');
    const workoutDayStats = document.getElementById('workoutDayStats');
    const exerciseListContainer = document.getElementById('exerciseListContainer');
    const data = workoutDaysData[dayKey];
    if (!data || !exerciseListContainer) return;

    if (workoutDayName) workoutDayName.textContent = data.title;
    if (workoutDayStats) workoutDayStats.textContent = data.stats;

    exerciseListContainer.innerHTML = '';
    data.exercises.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'exercise-card';
      const cuesHtml = ex.cues.map(c => `<span class="cue-tag">${c}</span>`).join('');
      card.innerHTML = `
        <div class="exercise-main">
          <div class="exercise-num">${ex.num}</div>
          <div class="exercise-details">
            <h4>${ex.name}</h4>
            <div class="exercise-cues">
              <span class="cue-tag highlight">${ex.highlightCue}</span>
              ${cuesHtml}
            </div>
          </div>
        </div>
        <div class="exercise-meta-pills">
          <div class="meta-pill">
            <div class="pill-val">${ex.setsReps}</div>
            <div class="pill-label">Series x Reps</div>
          </div>
          <div class="meta-pill">
            <div class="pill-val" style="color: var(--primary);">${ex.rir}</div>
            <div class="pill-label">Esfuerzo</div>
          </div>
          <div class="meta-pill">
            <div class="pill-val">${ex.rest}</div>
            <div class="pill-label">Descanso</div>
          </div>
        </div>
      `;
      exerciseListContainer.appendChild(card);
    });
  }

  renderWorkoutDay('day1');

  document.querySelectorAll('.workout-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.workout-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderWorkoutDay(btn.getAttribute('data-day'));
    });
  });

  // ==========================================================================
  // 6. BEFORE/AFTER DRAG SLIDER
  // ==========================================================================
  const dragSliderInput = document.getElementById('dragSliderInput');
  const imgModifiedWrap = document.getElementById('imgModifiedWrap');
  const dragHandleIndicator = document.getElementById('dragHandleIndicator');

  if (dragSliderInput && imgModifiedWrap && dragHandleIndicator) {
    const updateSlider = (val) => {
      imgModifiedWrap.style.width = val + '%';
      dragHandleIndicator.style.left = val + '%';
    };
    dragSliderInput.addEventListener('input', (e) => updateSlider(e.target.value));
  }

  // ==========================================================================
  // 7. BOOKING CALENDAR & STEPPER
  // ==========================================================================
  function initCalendar() {
    const calendarStrip = document.getElementById('calendarStrip');
    const slotsContainer = document.getElementById('slotsContainer');
    const summaryDate = document.getElementById('summaryDate');
    const summaryTime = document.getElementById('summaryTime');
    const summaryCost = document.getElementById('summaryCost');
    const summaryService = document.getElementById('summaryService');
    const step2Indicator = document.getElementById('step2Indicator');
    const step3Indicator = document.getElementById('step3Indicator');

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let selectedDateText = 'Hoy';
    let selectedTimeSlot = '08:30 AM';

    // Service Cards
    const serviceCards = document.querySelectorAll('.service-card-radio');
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        serviceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const name = card.querySelector('h4').textContent;
        const cost = card.querySelector('.service-price').textContent;
        if (summaryService) summaryService.textContent = name;
        if (summaryCost) summaryCost.textContent = cost;
        if (step2Indicator) step2Indicator.classList.add('active');
      });
    });

    // Calendar
    if (calendarStrip && !calendarStrip.hasAttribute('data-initialized')) {
      calendarStrip.setAttribute('data-initialized', 'true');
      calendarStrip.innerHTML = '';
      const today = new Date();

      for (let i = 0; i < 6; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayBtn = document.createElement('div');
        dayBtn.className = `cal-day-btn${i === 0 ? ' active' : ''}`;
        const dayLabel = i === 0 ? 'Hoy' : daysOfWeek[d.getDay()];
        dayBtn.innerHTML = `<div class="cal-day-name">${dayLabel}</div><div class="cal-day-num">${d.getDate()}</div>`;

        dayBtn.addEventListener('click', () => {
          document.querySelectorAll('.cal-day-btn').forEach(b => b.classList.remove('active'));
          dayBtn.classList.add('active');
          selectedDateText = `${dayLabel} ${d.getDate()} de ${months[d.getMonth()]}`;
          if (summaryDate) summaryDate.textContent = selectedDateText;
          if (step2Indicator) step2Indicator.classList.add('active');
        });

        calendarStrip.appendChild(dayBtn);
      }
    }

    // Time slots
    if (slotsContainer) {
      slotsContainer.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          slotsContainer.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedTimeSlot = btn.textContent.trim();
          if (summaryTime) summaryTime.textContent = selectedTimeSlot;
          if (step2Indicator) step2Indicator.classList.add('active');
          if (step3Indicator) step3Indicator.classList.add('active');
        });
      });
    }

    // Booking submit
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm && !bookingForm.hasAttribute('data-initialized')) {
      bookingForm.setAttribute('data-initialized', 'true');
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bName = document.getElementById('bookName').value;
        const bPhone = document.getElementById('bookPhone').value;
        const bNote = document.getElementById('bookNote').value;
        const bService = summaryService ? summaryService.textContent : 'Evaluación Inicial';
        const message = encodeURIComponent(
          `¡Hola equipo de COACH PRO! Probé la demo de Agenda Online y quiero coordinar una charla:\n` +
          `📌 *Interés:* ${bService}\n` +
          `📅 *Día preferido:* ${selectedDateText}\n⏰ *Horario:* ${selectedTimeSlot}\n` +
          `👤 *Nombre:* ${bName}\n📱 *Contacto:* ${bPhone}\n` +
          (bNote ? `🎯 *Nota:* ${bNote}\n\n` : '\n') +
          `¡Quedo a la espera de confirmación!`
        );
        showToast('¡Consulta enviada! Abriendo WhatsApp...');
        setTimeout(() => window.open(`https://wa.me/5491100000000?text=${message}`, '_blank'), 1000);
        bookingForm.reset();
      });
    }
  }

  initCalendar();

  // ==========================================================================
  // 8. FAQ ACCORDION
  // ==========================================================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // ==========================================================================
  // 9. WHATSAPP WIDGET
  // ==========================================================================
  const whatsappChatBubble = document.getElementById('whatsappChatBubble');
  const closeBubble = document.getElementById('closeBubble');

  if (closeBubble && whatsappChatBubble) {
    closeBubble.addEventListener('click', (e) => {
      e.stopPropagation();
      whatsappChatBubble.style.display = 'none';
    });
    whatsappChatBubble.addEventListener('click', () => {
      window.open('https://wa.me/5491100000000?text=Hola!%20Quiero%20conocer%20m%C3%A1s%20sobre%20COACH%20PRO%20para%20mi%20negocio%20de%20entrenador.', '_blank');
    });
  }

  // ==========================================================================
  // 10. TOAST NOTIFICATION
  // ==========================================================================
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // Make showToast globally accessible for other scripts
  window.showToast = showToast;

});
