/**
 * COACH PRO - PORTAL DEL ALUMNO (CLIENT APP) LOGIC (Firestore-backed)
 * Renderizado de rutina personalizada, checklist de series y cronómetro de descanso.
 * Los datos se leen directo de Firestore, así que funcionan desde el celular del alumno,
 * no solo desde el navegador donde el coach los creó.
 */

// Firestore maps don't preserve field order, so "day3" can come back before "day1".
// Always sort by the numeric suffix before rendering day tabs / printed sheets.
function sortDayKeys(keys) {
  return keys.slice().sort((a, b) => (parseInt(a.replace(/\D/g, ''), 10) || 0) - (parseInt(b.replace(/\D/g, ''), 10) || 0));
}

document.addEventListener('DOMContentLoaded', async () => {
  // --- 1. Get Student ID from URL params ---
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id') || '1';

  // --- Retrieve data from Firestore ---
  const [studentDoc, routineDoc] = await Promise.all([
    db.collection('alumnos').doc(studentId).get(),
    db.collection('routines').doc(studentId).get()
  ]);

  const student = studentDoc.exists ? studentDoc.data() : {
    name: 'Alumno',
    coachId: 'coach_1',
    plan: 'Coaching Integral (Personalizado)',
    goal: 'Fuerza & Hipertrofia'
  };

  const studentRoutine = routineDoc.exists ? routineDoc.data() : {
    title: 'Plan de Fuerza & Hipertrofia',
    notes: 'Priorizar la técnica en cada levantamiento.',
    days: {
      day1: {
        name: 'Día 1: Empujes',
        exercises: [
          { name: 'Press Banca con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Retracción escapular firme' },
          { name: 'Press Inclinado con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Ángulo de 30°' }
        ]
      }
    }
  };

  const coachDoc = await db.collection('coaches').doc(student.coachId || 'coach_1').get();
  const assignedCoach = coachDoc.exists ? coachDoc.data() : {
    displayName: 'Tu entrenador',
    phone: '+5491100000000',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=150&auto=format&fit=crop',
    specialty: 'Biomecánica & Fuerza'
  };

  // --- 2. Populate Header & Greeting ---
  const studentNameHeader = document.getElementById('studentNameHeader');
  const studentPlanBadge = document.getElementById('studentPlanBadge');
  const routineTitleBadge = document.getElementById('routineTitleBadge');
  const coachNotesText = document.getElementById('coachNotesText');
  const coachWhatsAppBtn = document.getElementById('coachWhatsAppBtn');
  const appCoachAvatar = document.getElementById('appCoachAvatar');
  const appCoachName = document.getElementById('appCoachName');

  if (appCoachAvatar && assignedCoach.avatar) appCoachAvatar.src = assignedCoach.avatar;
  if (appCoachName) appCoachName.textContent = assignedCoach.displayName || 'Tu entrenador';
  if (studentNameHeader) studentNameHeader.textContent = `Hola, ${student.name.split(' ')[0]} 👋`;
  if (studentPlanBadge) studentPlanBadge.textContent = student.plan;
  if (routineTitleBadge) routineTitleBadge.textContent = studentRoutine.title || 'Plan de Entrenamiento';
  if (coachNotesText) coachNotesText.textContent = studentRoutine.notes || 'Mantener técnica estricta y sobrecarga progresiva.';

  if (coachWhatsAppBtn) {
    const cleanCoachPhone = (assignedCoach.phone || '+5491100000000').replace(/[^0-9]/g, '');
    coachWhatsAppBtn.href = `https://wa.me/${cleanCoachPhone}?text=${encodeURIComponent(`¡Hola ${assignedCoach.displayName}! Te consulto sobre mi rutina *${studentRoutine.title}*:`)}`;
  }

  const btnStudentPdf = document.getElementById('btnStudentPdf');
  if (btnStudentPdf) {
    btnStudentPdf.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 3. Render Day Tabs ---
  const daysNavScroll = document.getElementById('daysNavScroll');
  const exercisesContainer = document.getElementById('exercisesContainer');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercentLabel = document.getElementById('progressPercentLabel');
  const progressSummarySub = document.getElementById('progressSummarySub');
  let activeDayKey = sortDayKeys(Object.keys(studentRoutine.days))[0] || 'day1';

  function updateProgressSummary() {
    if (!progressBarFill) return;
    const totalRows = exercisesContainer.querySelectorAll('.set-row').length;
    const completedRows = exercisesContainer.querySelectorAll('.set-row.completed').length;
    const pct = totalRows > 0 ? Math.round((completedRows / totalRows) * 100) : 0;

    progressBarFill.style.width = `${pct}%`;
    if (progressPercentLabel) progressPercentLabel.textContent = `${pct}%`;
    if (progressSummarySub) progressSummarySub.textContent = `${completedRows} de ${totalRows} series completadas`;
  }

  function renderDayTabs() {
    if (!daysNavScroll) return;
    daysNavScroll.innerHTML = '';

    const dayKeys = sortDayKeys(Object.keys(studentRoutine.days));
    dayKeys.forEach((key, index) => {
      const dayData = studentRoutine.days[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `day-tab-pill ${key === activeDayKey ? 'active' : ''}`;
      btn.textContent = dayData.name || `Día ${index + 1}`;
      btn.addEventListener('click', () => {
        activeDayKey = key;
        renderDayTabs();
        renderExercisesForDay();
      });
      daysNavScroll.appendChild(btn);
    });
  }
  renderDayTabs();

  // --- 4. Render Exercises for Active Day ---
  function renderExercisesForDay() {
    if (!exercisesContainer) return;
    exercisesContainer.innerHTML = '';

    const dayData = studentRoutine.days[activeDayKey];
    if (!dayData || !dayData.exercises || dayData.exercises.length === 0) {
      exercisesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-dumbbell" style="font-size: 2rem; margin-bottom: 12px; color: var(--primary);"></i>
          <p>No hay ejercicios programados para este día.</p>
        </div>
      `;
      return;
    }

    dayData.exercises.forEach((ex, exIndex) => {
      const card = document.createElement('div');
      card.className = 'exercise-client-card';

      // Parse number of sets
      const numSets = parseInt(ex.sets, 10) || 3;
      let setsHtml = '';

      for (let s = 1; s <= numSets; s++) {
        setsHtml += `
          <div class="set-row" data-ex="${exIndex}" data-set="${s}">
            <div class="set-left-group">
              <div class="set-checkbox"><i class="fa-solid fa-check"></i></div>
              <span class="set-label">Serie ${s}</span>
            </div>
            <div class="set-target">
              <strong>${ex.reps}</strong>
              ${ex.rir}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="exercise-client-header">
          <div class="ex-title-wrap">
            <h3>${exIndex + 1}. ${ex.name}</h3>
          </div>
          <span class="ex-meta-badge">${ex.sets} x ${ex.reps}</span>
        </div>

        ${ex.cue ? `<div class="cue-box"><i class="fa-solid fa-circle-info"></i> ${ex.cue}</div>` : ''}

        <div class="sets-grid-list">
          ${setsHtml}
        </div>

        <button type="button" class="btn-trigger-rest" data-rest="90">
          <i class="fa-solid fa-stopwatch"></i> Iniciar Descanso (90s)
        </button>
      `;

      exercisesContainer.appendChild(card);
    });

    // Attach Set Row Checklist Click
    exercisesContainer.querySelectorAll('.set-row').forEach(row => {
      row.addEventListener('click', () => {
        row.classList.toggle('completed');
        updateProgressSummary();
        if (row.classList.contains('completed')) {
          // Trigger rest timer automatically on set completion
          startRestTimer(90);
        }
      });
    });

    // Attach explicit rest buttons
    exercisesContainer.querySelectorAll('.btn-trigger-rest').forEach(btn => {
      btn.addEventListener('click', () => {
        startRestTimer(90);
      });
    });

    updateProgressSummary();
  }
  renderExercisesForDay();

  // --- 5. Rest Timer Logic ---
  const floatingTimerBar = document.getElementById('floatingTimerBar');
  const timerDigits = document.getElementById('timerDigits');
  const btnCloseTimer = document.getElementById('btnCloseTimer');
  const btnAdd30s = document.getElementById('btnAdd30s');

  let timerSecondsLeft = 90;
  let timerInterval = null;

  function startRestTimer(seconds = 90) {
    timerSecondsLeft = seconds;
    if (timerInterval) clearInterval(timerInterval);

    if (floatingTimerBar) floatingTimerBar.classList.add('active');
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timerSecondsLeft--;
      updateTimerDisplay();

      if (timerSecondsLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (timerDigits) timerDigits.textContent = '¡A ENTRENAR!';
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        setTimeout(() => {
          if (floatingTimerBar) floatingTimerBar.classList.remove('active');
        }, 3000);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!timerDigits) return;
    const mins = Math.floor(timerSecondsLeft / 60);
    const secs = timerSecondsLeft % 60;
    timerDigits.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  if (btnCloseTimer && floatingTimerBar) {
    btnCloseTimer.addEventListener('click', () => {
      if (timerInterval) clearInterval(timerInterval);
      floatingTimerBar.classList.remove('active');
    });
  }

  if (btnAdd30s) {
    btnAdd30s.addEventListener('click', () => {
      timerSecondsLeft += 30;
      updateTimerDisplay();
    });
  }

  // --- 6. Complete Workout Button ---
  const btnCompleteWorkout = document.getElementById('btnCompleteWorkout');
  if (btnCompleteWorkout) {
    btnCompleteWorkout.addEventListener('click', () => {
      const completedRows = document.querySelectorAll('.set-row.completed').length;
      const totalRows = document.querySelectorAll('.set-row').length;

      const finishMessage = encodeURIComponent(
        `¡Hola ${assignedCoach.displayName}! 🏋️‍♂️ Acabo de completar el entrenamiento de hoy:\n` +
        `✅ *Rutina:* ${studentRoutine.title}\n` +
        `📊 *Progreso:* Completé ${completedRows} de ${totalRows} series programadas.\n\n` +
        `¡Gran sesión de entrenamiento!`
      );

      alert(`¡Felicitaciones ${student.name.split(' ')[0]}! Has completado el entrenamiento de hoy. Registraste ${completedRows} series.`);

      const cleanCoachPhone = (assignedCoach.phone || '+5491100000000').replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanCoachPhone}?text=${finishMessage}`, '_blank');
    });
  }
});
