/**
 * COACH PRO - RESERVAR TURNO (PER-COACH BOOKING PAGE) (Firestore-backed)
 * Lee el coach de la URL (?coach=coach_id), guarda el turno en Firestore ("bookings")
 * scopeado a ese coach, y confirma por WhatsApp directo al número del coach.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const coachId = params.get('coach');
  const coaches = window.ValenAuth ? await window.ValenAuth.getCoaches() : [];
  const coach = coaches.find(c => c.id === coachId && c.isActive);

  const bookingContent = document.getElementById('bookingContent');
  const coachNotFound = document.getElementById('coachNotFound');

  if (!coach) {
    if (bookingContent) bookingContent.style.display = 'none';
    if (coachNotFound) coachNotFound.style.display = 'block';
    return;
  }

  // --- Populate Coach Identity ---
  const coachAvatarPreview = document.getElementById('coachAvatarPreview');
  const coachIdentityName = document.getElementById('coachIdentityName');
  const coachIdentitySpecialty = document.getElementById('coachIdentitySpecialty');
  const personalizadoPriceLabel = document.getElementById('personalizadoPriceLabel');

  if (coachAvatarPreview) coachAvatarPreview.src = coach.avatar;
  if (coachIdentityName) coachIdentityName.textContent = coach.displayName;
  if (coachIdentitySpecialty) coachIdentitySpecialty.textContent = coach.specialty;
  if (personalizadoPriceLabel) personalizadoPriceLabel.textContent = `$${coach.pricePersonalizado}/mes`;

  // --- Service Selection ---
  const serviceCards = document.querySelectorAll('.service-card-radio');
  const summaryService = document.getElementById('summaryService');
  const summaryCost = document.getElementById('summaryCost');
  const step2Indicator = document.getElementById('step2Indicator');
  const step3Indicator = document.getElementById('step3Indicator');

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

  // --- Calendar Strip (Next 6 Days) ---
  const calendarStrip = document.getElementById('calendarStrip');
  const summaryDate = document.getElementById('summaryDate');
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  let selectedDateText = 'Hoy';
  let selectedTimeSlot = '08:30 AM';

  if (calendarStrip) {
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
        calendarStrip.querySelectorAll('.cal-day-btn').forEach(b => b.classList.remove('active'));
        dayBtn.classList.add('active');
        selectedDateText = `${dayLabel} ${d.getDate()} de ${months[d.getMonth()]}`;
        if (summaryDate) summaryDate.textContent = selectedDateText;
        if (step2Indicator) step2Indicator.classList.add('active');
      });

      calendarStrip.appendChild(dayBtn);
    }
  }

  // --- Time Slots ---
  const slotsContainer = document.getElementById('slotsContainer');
  const summaryTime = document.getElementById('summaryTime');

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

  // --- Booking Submit: saves to Firestore ("bookings") + opens WhatsApp to the coach ---
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const bName = document.getElementById('bookName').value.trim();
      const bPhone = document.getElementById('bookPhone').value.trim();
      const bNote = document.getElementById('bookNote').value.trim();
      const bService = summaryService ? summaryService.textContent : 'Evaluación Inicial';
      const bCost = summaryCost ? summaryCost.textContent : 'GRATIS';

      const bookingId = 'b_' + Date.now();
      try {
        await db.collection('bookings').doc(bookingId).set({
          id: bookingId,
          coachId: coach.id,
          clientName: bName,
          phone: bPhone,
          service: `${bService} (${bCost})`,
          date: selectedDateText,
          time: selectedTimeSlot,
          status: 'Pendiente'
        });

        const message = encodeURIComponent(
          `¡Hola ${coach.displayName}! Quiero reservar un turno:\n` +
          `📌 *Servicio:* ${bService} (${bCost})\n` +
          `📅 *Fecha:* ${selectedDateText}\n⏰ *Horario:* ${selectedTimeSlot}\n` +
          `👤 *Nombre:* ${bName}\n📱 *Contacto:* ${bPhone}\n` +
          (bNote ? `🎯 *Nota:* ${bNote}\n\n` : '\n') +
          `¡Quedo a la espera de confirmación!`
        );

        showToast('¡Turno enviado! Abriendo WhatsApp...');
        const cleanCoachPhone = (coach.phone || '').replace(/[^0-9]/g, '');
        setTimeout(() => window.open(`https://wa.me/${cleanCoachPhone}?text=${message}`, '_blank'), 900);
        bookingForm.reset();
      } catch (err) {
        console.error(err);
        showToast('No se pudo guardar el turno. Probá de nuevo.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // --- Toast Utility ---
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
});
