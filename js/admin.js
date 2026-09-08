/**
 * COACH PRO - ADMIN DASHBOARD, MULTI-COACH & ROUTINE BUILDER LOGIC (Firestore-backed)
 * Sistema Multi-Entrenador, Precio de Personalizado, Rutinas de hasta 6 Días y Exportación PDF.
 * Alumnos, rutinas y turnos viven en Firestore, compartidos entre cualquier dispositivo.
 */

// Firestore maps don't preserve field order, so "day3" can come back before "day1".
// Always sort by the numeric suffix before rendering printed sheets / WhatsApp summaries.
function sortDayKeys(keys) {
  return keys.slice().sort((a, b) => (parseInt(a.replace(/\D/g, ''), 10) || 0) - (parseInt(b.replace(/\D/g, ''), 10) || 0));
}

document.addEventListener('DOMContentLoaded', async () => {
  // --- 0. ACTIVE COACH SESSION VERIFICATION ---
  const activeCoach = window.ValenAuth ? window.ValenAuth.getActiveCoach() : null;
  if (!activeCoach) {
    window.location.href = 'login.html';
    return;
  }
  if (!activeCoach.isActive) {
    window.location.href = 'activar.html';
    return;
  }
  // Silently resync this device's cached coach record with Firestore (price/activation
  // could have changed elsewhere) without blocking the rest of the page from rendering.
  // If the record is gone (e.g. leftover/stale test session), force a clean re-login
  // instead of silently rendering a session that no longer exists in the cloud.
  if (window.ValenAuth.refreshActiveCoach) {
    window.ValenAuth.refreshActiveCoach().then(refreshed => {
      if (!refreshed) window.ValenAuth.logoutCoach();
    });
  }

  // Populate Coach UI in Navbar
  const coachAvatarImg = document.getElementById('coachAvatarImg');
  const coachNameDisplay = document.getElementById('coachNameDisplay');
  const coachSpecialtyDisplay = document.getElementById('coachSpecialtyDisplay');
  const coachPersonalizadoPrice = document.getElementById('coachPersonalizadoPrice');
  const btnLogoutCoach = document.getElementById('btnLogoutCoach');
  const btnEditCoachRate = document.getElementById('btnEditCoachRate');
  const editRateModal = document.getElementById('editRateModal');
  const closeEditRateModal = document.getElementById('closeEditRateModal');
  const editRateForm = document.getElementById('editRateForm');
  const inputNewRate = document.getElementById('inputNewRate');

  if (coachAvatarImg) coachAvatarImg.src = activeCoach.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=150&auto=format&fit=crop';
  if (coachNameDisplay) coachNameDisplay.innerHTML = `${activeCoach.displayName || 'Coach ' + activeCoach.name.split(' ')[0]}`;
  if (coachSpecialtyDisplay) coachSpecialtyDisplay.textContent = activeCoach.specialty || 'Preparador Físico';
  if (coachPersonalizadoPrice) coachPersonalizadoPrice.textContent = `$${activeCoach.pricePersonalizado || 49}`;

  // Personal Booking Link (shared with students so their bookings land in this coach's Turnos tab)
  const myBookingLinkText = document.getElementById('myBookingLinkText');
  const btnCopyBookingLink = document.getElementById('btnCopyBookingLink');
  const myBookingUrl = `${window.location.origin}${window.location.pathname.replace('admin.html', '')}reservar.html?coach=${activeCoach.id}`;
  if (myBookingLinkText) myBookingLinkText.textContent = myBookingUrl;
  if (btnCopyBookingLink) {
    btnCopyBookingLink.addEventListener('click', () => {
      navigator.clipboard.writeText(myBookingUrl).then(() => {
        showToast('¡Enlace de reservas copiado al portapapeles!');
      });
    });
  }

  // Logout
  if (btnLogoutCoach) {
    btnLogoutCoach.addEventListener('click', () => {
      if (confirm(`¿Deseas cerrar sesión de ${activeCoach.displayName}?`)) {
        window.ValenAuth.logoutCoach();
      }
    });
  }

  // Edit Rate Modal
  if (btnEditCoachRate && editRateModal && inputNewRate) {
    btnEditCoachRate.addEventListener('click', () => {
      inputNewRate.value = activeCoach.pricePersonalizado || 49;
      editRateModal.classList.add('open');
      setTimeout(() => inputNewRate.focus(), 100);
    });
  }

  if (closeEditRateModal && editRateModal) {
    closeEditRateModal.addEventListener('click', () => editRateModal.classList.remove('open'));
  }

  if (editRateModal) {
    editRateModal.addEventListener('click', (e) => {
      if (e.target === editRateModal) editRateModal.classList.remove('open');
    });
  }

  if (editRateForm) {
    editRateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPrice = parseInt(inputNewRate.value, 10);
      if (newPrice && newPrice > 0) {
        await window.ValenAuth.updateCoachPrice(activeCoach.id, newPrice);
        activeCoach.pricePersonalizado = newPrice;
        if (coachPersonalizadoPrice) coachPersonalizadoPrice.textContent = `$${newPrice}`;
        editRateModal.classList.remove('open');
        showToast(`¡Tarifa de personalizado actualizada a $${newPrice}/mes!`);
      }
    });
  }

  // --- Scoped Firestore Data Access (all data isolated by this coach's id) ---
  async function getAlumnos() {
    const snap = await db.collection('alumnos').where('coachId', '==', activeCoach.id).get();
    return snap.docs.map(d => d.data());
  }

  async function getRoutineForStudent(studentId) {
    const doc = await db.collection('routines').doc(studentId).get();
    return doc.exists ? doc.data() : null;
  }

  async function saveRoutineDoc(studentId, routineData) {
    await db.collection('routines').doc(studentId).set(routineData);
  }

  async function getRoutinesCountForCoach() {
    const snap = await db.collection('routines').where('coachId', '==', activeCoach.id).get();
    return snap.size;
  }

  async function getBookings() {
    const snap = await db.collection('bookings').where('coachId', '==', activeCoach.id).get();
    return snap.docs.map(d => d.data());
  }

  // --- 1. Sidebar Navigation Tabs ---
  const sidebarBtns = document.querySelectorAll('.sidebar-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetTab = btn.getAttribute('data-tab');
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${targetTab}`);
      });

      // Refresh content if switching to specific tabs
      if (targetTab === 'alumnos') await renderAlumnosTable();
      if (targetTab === 'turnos') await renderBookingsTable();
      if (targetTab === 'dashboard') await updateDashboardMetrics();
    });
  });

  // --- 2. Dashboard Metrics Update ---
  async function updateDashboardMetrics() {
    const [alumnos, coachRoutinesCount, bookings] = await Promise.all([
      getAlumnos(),
      getRoutinesCountForCoach(),
      getBookings()
    ]);

    const countAlumnos = document.getElementById('countAlumnos');
    const countRoutines = document.getElementById('countRoutines');
    const countBookings = document.getElementById('countBookings');

    if (countAlumnos) countAlumnos.textContent = alumnos.length;
    if (countRoutines) countRoutines.textContent = coachRoutinesCount;
    if (countBookings) countBookings.textContent = bookings.length;
  }
  await updateDashboardMetrics();

  // --- 3. Alumnos Table Rendering ---
  const alumnosTableBody = document.getElementById('alumnosTableBody');
  const routineStudentSelect = document.getElementById('routineStudentSelect');

  async function renderAlumnosTable() {
    const alumnos = await getAlumnos();
    if (!alumnosTableBody) return;

    alumnosTableBody.innerHTML = '';

    if (alumnos.length === 0) {
      alumnosTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 30px; color: var(--text-muted);">
            <i class="fa-solid fa-user-clock" style="font-size: 1.8rem; margin-bottom: 8px; display: block; color: var(--primary);"></i>
            Aún no tienes alumnos registrados en tu cuenta de ${activeCoach.displayName}.
            <br>
            <button type="button" class="btn btn-primary btn-sm btn-trigger-new-student" style="margin-top: 12px;">
              <i class="fa-solid fa-plus"></i> Registrar mi Primer Alumno
            </button>
          </td>
        </tr>
      `;
    } else {
      alumnos.forEach(al => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div class="student-meta">
              <img src="${al.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}" alt="${al.name}" class="student-avatar">
              <div>
                <span class="student-name">${al.name}</span>
                <span class="student-goal">${al.goal}</span>
              </div>
            </div>
          </td>
          <td>
            <span style="font-weight: 600; color: var(--text-white);">${al.plan}</span>
            <div style="font-size: 0.72rem; color: var(--primary);">Personalizado $${activeCoach.pricePersonalizado}/mes</div>
          </td>
          <td>${al.phone}</td>
          <td><span class="status-badge active">${al.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn btn-primary btn-sm btn-edit-routine" data-id="${al.id}" title="Editar o Crear Rutina">
                <i class="fa-solid fa-dumbbell"></i> Rutina
              </button>
              <button class="btn btn-secondary btn-sm btn-export-pdf" data-id="${al.id}" title="Descargar Ficha PDF / Imprimir">
                <i class="fa-solid fa-file-pdf" style="color: #ff5e57;"></i> PDF
              </button>
              <button class="btn btn-whatsapp btn-sm btn-send-whatsapp" data-id="${al.id}" title="Enviar por WhatsApp">
                <i class="fa-brands fa-whatsapp"></i> Enviar
              </button>
              <a href="alumno.html?id=${al.id}" target="_blank" class="btn btn-secondary btn-sm" title="Ver como Alumno">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </td>
        `;
        alumnosTableBody.appendChild(tr);
      });
    }

    // Populate Routine Builder select
    if (routineStudentSelect) {
      routineStudentSelect.innerHTML = '';
      if (alumnos.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Sin alumnos registrados';
        routineStudentSelect.appendChild(opt);
      } else {
        alumnos.forEach(al => {
          const opt = document.createElement('option');
          opt.value = al.id;
          opt.textContent = `${al.name} (${al.plan})`;
          routineStudentSelect.appendChild(opt);
        });
      }
    }

    // Attach Action Events
    document.querySelectorAll('.btn-edit-routine').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        openRoutineBuilderForStudent(studentId);
      });
    });

    document.querySelectorAll('.btn-export-pdf').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        openPdfModalForStudent(studentId);
      });
    });

    document.querySelectorAll('.btn-send-whatsapp').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        openSendRoutineModal(studentId);
      });
    });

    document.querySelectorAll('.btn-trigger-new-student').forEach(btn => {
      btn.addEventListener('click', openNewStudentModal);
    });
  }
  await renderAlumnosTable();

  // --- 4. New Student Modal Logic ---
  const newStudentModal = document.getElementById('newStudentModal');
  const btnOpenNewStudent = document.getElementById('btnOpenNewStudent');
  const btnOpenNewStudent2 = document.getElementById('btnOpenNewStudent2');
  const closeStudentModal = document.getElementById('closeStudentModal');
  const newStudentForm = document.getElementById('newStudentForm');

  function openNewStudentModal() {
    if (newStudentModal) {
      newStudentModal.classList.add('open');
      const firstInput = document.getElementById('newStudentName');
      if (firstInput) setTimeout(() => firstInput.focus(), 120);
    }
  }

  if (btnOpenNewStudent) btnOpenNewStudent.addEventListener('click', openNewStudentModal);
  if (btnOpenNewStudent2) btnOpenNewStudent2.addEventListener('click', openNewStudentModal);

  document.querySelectorAll('.btn-trigger-new-student').forEach(btn => {
    btn.addEventListener('click', openNewStudentModal);
  });

  if (closeStudentModal && newStudentModal) {
    closeStudentModal.addEventListener('click', () => newStudentModal.classList.remove('open'));
  }

  if (newStudentModal) {
    newStudentModal.addEventListener('click', (e) => {
      if (e.target === newStudentModal) newStudentModal.classList.remove('open');
    });
  }

  if (newStudentForm) {
    newStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = newStudentForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const newId = String(Date.now());
      const name = document.getElementById('newStudentName').value.trim();
      const phone = document.getElementById('newStudentPhone').value.trim();
      const email = document.getElementById('newStudentEmail').value.trim();
      const plan = document.getElementById('newStudentPlan').value;
      const goal = document.getElementById('newStudentGoal').value.trim();

      const newStudent = {
        id: newId,
        coachId: activeCoach.id, // Assigned to this active coach
        name: name,
        phone: phone,
        email: email,
        plan: plan,
        goal: goal,
        status: 'Activo',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
      };

      try {
        await db.collection('alumnos').doc(newId).set(newStudent);

        // Create an initial template routine for this new student
        await saveRoutineDoc(newId, {
          studentId: newId,
          coachId: activeCoach.id,
          title: `Fase 1: Adaptación & Fuerza`,
          notes: `Plan adaptado a objetivo: ${goal}. Tarifa acordada: $${activeCoach.pricePersonalizado}/mes. Priorizar técnica biomecánica estricta.`,
          days: {
            day1: {
              name: 'Día 1: Empujes de Pecho, Hombro & Tríceps',
              exercises: [
                { name: 'Press Banca con Barra', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Retracción escapular firme' },
                { name: 'Press Militar con Mancuernas', sets: '3', reps: '10-12', rir: 'RIR 1-2', rest: '90s', cue: 'Core compacto y glúteos activos' },
                { name: 'Elevaciones Laterales en Polea', sets: '4', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Control excéntrico de 2 segundos' }
              ]
            },
            day2: {
              name: 'Día 2: Piernas & Glúteos (Sentadilla)',
              exercises: [
                { name: 'Sentadilla Libre con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Presión trípode en pies' },
                { name: 'Prensa Inclinada a 45°', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Descenso profundo y controlado' },
                { name: 'Curl Femoral Tumbado', sets: '4', reps: '10-12', rir: 'RIR 0', rest: '60s', cue: 'Pausa de 1s en contracción' }
              ]
            },
            day3: {
              name: 'Día 3: Tracciones & Bíceps (Espalda)',
              exercises: [
                { name: 'Jalón al Pecho Agarre Neutro', sets: '4', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Depresión escapular antes de tirar' },
                { name: 'Remo con Barra 45°', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Codos pegados al cuerpo' },
                { name: 'Curl con Barra Z', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Sin balanceo lumbar' }
              ]
            }
          }
        });

        await renderAlumnosTable();
        await updateDashboardMetrics();
        newStudentModal.classList.remove('open');
        newStudentForm.reset();
        showToast(`¡Alumno ${newStudent.name} registrado con éxito en tu panel!`);
      } catch (err) {
        console.error(err);
        showToast('No se pudo registrar el alumno. Probá de nuevo.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // --- 5. ROUTINE BUILDER LOGIC (UP TO 6 DAYS MAXIMUM) ---
  let activeStudentId = '1';
  let activeRoutineDay = 'day1';
  let currentBuilderRoutine = null;

  const routineTitleInput = document.getElementById('routineTitleInput');
  const routineNotesInput = document.getElementById('routineNotesInput');
  const currentDayNameInput = document.getElementById('currentDayNameInput');
  const exercisesEditorList = document.getElementById('exercisesEditorList');
  const dayPills = document.querySelectorAll('#builderDayPills .day-pill-btn');
  const btnAddExercise = document.getElementById('btnAddExercise');
  const btnSaveRoutine = document.getElementById('btnSaveRoutine');
  const btnSendCurrentRoutine = document.getElementById('btnSendCurrentRoutine');
  const btnPreviewCurrentRoutine = document.getElementById('btnPreviewCurrentRoutine');

  async function openRoutineBuilderForStudent(studentId) {
    activeStudentId = studentId;
    if (routineStudentSelect) routineStudentSelect.value = studentId;

    // Switch tab
    sidebarBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === 'builder'));
    tabPanels.forEach(p => p.classList.toggle('active', p.id === 'tab-builder'));

    await loadRoutineForActiveStudent();
  }

  async function loadRoutineForActiveStudent() {
    currentBuilderRoutine = await getRoutineForStudent(activeStudentId) || {
      studentId: activeStudentId,
      coachId: activeCoach.id,
      title: 'Plan de Fuerza & Hipertrofia',
      notes: `Directiva técnica de ${activeCoach.displayName}: Mantener sobrecarga progresiva y registrar kilajes en cada serie.`,
      days: {
        day1: { name: 'Día 1: Empujes (Pecho, Hombro, Tríceps)', exercises: [] },
        day2: { name: 'Día 2: Piernas & Glúteos (Sentadilla)', exercises: [] },
        day3: { name: 'Día 3: Tracciones (Espalda, Bíceps, Core)', exercises: [] }
      }
    };

    if (routineTitleInput) routineTitleInput.value = currentBuilderRoutine.title || '';
    if (routineNotesInput) routineNotesInput.value = currentBuilderRoutine.notes || '';

    // Set first active day
    activeRoutineDay = 'day1';
    dayPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-day') === 'day1'));

    renderExercisesForActiveDay();
  }

  if (routineStudentSelect) {
    routineStudentSelect.addEventListener('change', async () => {
      activeStudentId = routineStudentSelect.value;
      if (activeStudentId) await loadRoutineForActiveStudent();
    });
  }

  // Switch Day in Builder (Up to 6 Days Max)
  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Save current day exercises and name before switching
      collectCurrentDayExercises();

      dayPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeRoutineDay = pill.getAttribute('data-day');
      renderExercisesForActiveDay();
    });
  });

  // Edit current day name input
  if (currentDayNameInput) {
    currentDayNameInput.addEventListener('input', () => {
      if (currentBuilderRoutine && currentBuilderRoutine.days[activeRoutineDay]) {
        currentBuilderRoutine.days[activeRoutineDay].name = currentDayNameInput.value;
      }
    });
  }

  function renderExercisesForActiveDay() {
    if (!exercisesEditorList || !currentBuilderRoutine) return;
    exercisesEditorList.innerHTML = '';

    // Initialize day if doesn't exist yet (days 1 to 6)
    if (!currentBuilderRoutine.days[activeRoutineDay]) {
      const dayNum = activeRoutineDay.replace('day', '');
      const defaultNames = {
        '1': 'Día 1: Empujes de Pecho & Hombro',
        '2': 'Día 2: Piernas & Glúteos',
        '3': 'Día 3: Tracciones & Bíceps',
        '4': 'Día 4: Hombros, Brazos & Core',
        '5': 'Día 5: Pierna & Isquiosurarios',
        '6': 'Día 6: Torso Completo / Full Body'
      };
      currentBuilderRoutine.days[activeRoutineDay] = {
        name: defaultNames[dayNum] || `Día ${dayNum}: Entrenamiento`,
        exercises: []
      };
    }

    const dayData = currentBuilderRoutine.days[activeRoutineDay];
    if (currentDayNameInput) {
      currentDayNameInput.value = dayData.name || `Día ${activeRoutineDay.replace('day', '')}`;
    }

    if (dayData.exercises.length === 0) {
      exercisesEditorList.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); background: rgba(255,255,255,0.02); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); margin-bottom: 12px;">
          <p style="font-size: 0.88rem;">No hay ejercicios agregados a este día todavía.</p>
          <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">Presiona el botón "+ Añadir Ejercicio" para diagramar la sesión.</p>
        </div>
      `;
    } else {
      dayData.exercises.forEach((ex, index) => {
        const row = document.createElement('div');
        row.className = 'exercise-edit-row';
        row.innerHTML = `
          <input type="text" class="form-input ex-name" value="${ex.name || ''}" placeholder="Nombre del Ejercicio">
          <input type="text" class="form-input ex-sets" value="${ex.sets || ''}" placeholder="Series (ej: 4)">
          <input type="text" class="form-input ex-reps" value="${ex.reps || ''}" placeholder="Reps (ej: 8-10)">
          <input type="text" class="form-input ex-rir" value="${ex.rir || ''}" placeholder="RIR (ej: RIR 2)">
          <input type="text" class="form-input ex-cue" value="${ex.cue || ''}" placeholder="Nota técnica (ej: Retracción escapular)">
          <button type="button" class="delete-row-btn" data-index="${index}" title="Eliminar Ejercicio">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;
        exercisesEditorList.appendChild(row);
      });
    }

    // Delete row event
    exercisesEditorList.querySelectorAll('.delete-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        dayData.exercises.splice(idx, 1);
        renderExercisesForActiveDay();
      });
    });
  }

  if (btnAddExercise) {
    btnAddExercise.addEventListener('click', () => {
      if (!currentBuilderRoutine) return;
      if (!currentBuilderRoutine.days[activeRoutineDay]) {
        currentBuilderRoutine.days[activeRoutineDay] = { name: `Día ${activeRoutineDay.replace('day', '')}`, exercises: [] };
      }
      currentBuilderRoutine.days[activeRoutineDay].exercises.push({
        name: 'Nuevo Ejercicio',
        sets: '3',
        reps: '10-12',
        rir: 'RIR 2',
        rest: '90s',
        cue: 'Técnica biomecánica estricta'
      });
      renderExercisesForActiveDay();
    });
  }

  // Save Routine
  if (btnSaveRoutine) {
    btnSaveRoutine.addEventListener('click', async () => {
      collectCurrentDayExercises();
      if (!currentBuilderRoutine) return;

      currentBuilderRoutine.title = routineTitleInput ? routineTitleInput.value : 'Plan de Fuerza';
      currentBuilderRoutine.notes = routineNotesInput ? routineNotesInput.value : '';
      currentBuilderRoutine.coachId = activeCoach.id;
      currentBuilderRoutine.studentId = activeStudentId;

      // Clean empty days
      const cleanedDays = {};
      Object.keys(currentBuilderRoutine.days || {}).forEach(k => {
        const d = currentBuilderRoutine.days[k];
        if (d && d.exercises && d.exercises.length > 0) {
          cleanedDays[k] = d;
        }
      });
      currentBuilderRoutine.days = cleanedDays;

      btnSaveRoutine.disabled = true;
      try {
        await saveRoutineDoc(activeStudentId, currentBuilderRoutine);
        await updateDashboardMetrics();
        showToast('¡Rutina guardada con éxito en tu panel de entrenador!');
      } catch (err) {
        console.error(err);
        showToast('No se pudo guardar la rutina. Probá de nuevo.');
      } finally {
        btnSaveRoutine.disabled = false;
      }
    });
  }

  function collectCurrentDayExercises() {
    if (!exercisesEditorList || !currentBuilderRoutine) return;
    const rows = exercisesEditorList.querySelectorAll('.exercise-edit-row');
    const updatedExercises = [];

    rows.forEach(row => {
      const name = row.querySelector('.ex-name').value.trim();
      const sets = row.querySelector('.ex-sets').value.trim();
      const reps = row.querySelector('.ex-reps').value.trim();
      const rir = row.querySelector('.ex-rir').value.trim();
      const cue = row.querySelector('.ex-cue').value.trim();

      if (name) {
        updatedExercises.push({ name, sets, reps, rir, rest: '90s', cue });
      }
    });

    if (currentBuilderRoutine.days[activeRoutineDay]) {
      currentBuilderRoutine.days[activeRoutineDay].exercises = updatedExercises;
      if (currentDayNameInput && currentDayNameInput.value.trim()) {
        currentBuilderRoutine.days[activeRoutineDay].name = currentDayNameInput.value.trim();
      }
    }
  }

  if (btnSendCurrentRoutine) {
    btnSendCurrentRoutine.addEventListener('click', () => {
      collectCurrentDayExercises();
      openSendRoutineModal(activeStudentId);
    });
  }

  if (btnPreviewCurrentRoutine) {
    btnPreviewCurrentRoutine.addEventListener('click', () => {
      window.open(`alumno.html?id=${activeStudentId}`, '_blank');
    });
  }

  // Initial routine load
  const currentAlumnos = await getAlumnos();
  if (currentAlumnos.length > 0) {
    activeStudentId = currentAlumnos[0].id;
    await loadRoutineForActiveStudent();
  }

  // --- 6. Send Routine Modal & WhatsApp Dispatcher ---
  const sendRoutineModal = document.getElementById('sendRoutineModal');
  const closeSendModal = document.getElementById('closeSendModal');
  const sendStudentName = document.getElementById('sendStudentName');
  const sendStudentPhone = document.getElementById('sendStudentPhone');
  const studentPortalLinkText = document.getElementById('studentPortalLinkText');
  const btnCopyPortalLink = document.getElementById('btnCopyPortalLink');
  const btnConfirmSendWhatsApp = document.getElementById('btnConfirmSendWhatsApp');
  const btnOpenPortalPreview = document.getElementById('btnOpenPortalPreview');

  let studentToSend = null;

  async function openSendRoutineModal(studentId) {
    const alumnos = await getAlumnos();
    studentToSend = alumnos.find(a => a.id === studentId) || alumnos[0];
    if (!studentToSend || !sendRoutineModal) return;

    if (sendStudentName) sendStudentName.textContent = studentToSend.name;
    if (sendStudentPhone) sendStudentPhone.textContent = studentToSend.phone;

    // Build absolute URL for student portal
    const portalUrl = `${window.location.origin}${window.location.pathname.replace('admin.html', '')}alumno.html?id=${studentToSend.id}`;
    if (studentPortalLinkText) studentPortalLinkText.textContent = portalUrl;

    sendRoutineModal.classList.add('open');
  }

  if (closeSendModal && sendRoutineModal) {
    closeSendModal.addEventListener('click', () => sendRoutineModal.classList.remove('open'));
  }

  if (btnCopyPortalLink) {
    btnCopyPortalLink.addEventListener('click', () => {
      const text = studentPortalLinkText ? studentPortalLinkText.textContent : '';
      navigator.clipboard.writeText(text).then(() => {
        showToast('¡Enlace del portal copiado al portapapeles!');
      });
    });
  }

  if (btnConfirmSendWhatsApp) {
    btnConfirmSendWhatsApp.addEventListener('click', async () => {
      if (!studentToSend) return;
      const routine = await getRoutineForStudent(studentToSend.id) || { title: 'Plan de Entrenamiento' };
      const portalUrl = studentPortalLinkText ? studentPortalLinkText.textContent : '';

      const cleanPhone = studentToSend.phone.replace(/[^0-9]/g, '');

      const message = encodeURIComponent(
        `¡Hola ${studentToSend.name}! 👋\n\n` +
        `Te saluda tu entrenador *${activeCoach.displayName}* (${activeCoach.specialty}).\n\n` +
        `Tu rutina personalizada de *${routine.title}* ya está lista en tu portal digital de *COACH PRO*.\n\n` +
        `📲 *Accede a tu rutina aquí:*\n${portalUrl}\n\n` +
        `Vas a encontrar los ejercicios detallados con series, repeticiones, descansos y notas biomecánicas. Podrás marcar cada serie en el gym.\n\n` +
        `Tarifa de tu plan personalizado: *$${activeCoach.pricePersonalizado}/mes*.\n\n` +
        `¡A darlo todo en el gym! Cualquier duda me escribes directamente por acá.`
      );

      showToast(`Abriendo WhatsApp para enviar a ${studentToSend.name}...`);
      setTimeout(() => {
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
      }, 700);
      sendRoutineModal.classList.remove('open');
    });
  }

  if (btnOpenPortalPreview) {
    btnOpenPortalPreview.addEventListener('click', () => {
      if (studentToSend) {
        window.open(`alumno.html?id=${studentToSend.id}`, '_blank');
      }
    });
  }

  // --- 6.5. PDF EXPORT & PRINTABLE SHEET SYSTEM ---
  const pdfExportModal = document.getElementById('pdfExportModal');
  const closePdfModal = document.getElementById('closePdfModal');
  const printableRoutineCard = document.getElementById('printableRoutineCard');
  const btnPrintRoutine = document.getElementById('btnPrintRoutine');
  const btnCopyRoutineText = document.getElementById('btnCopyRoutineText');
  const btnExportPDF = document.getElementById('btnExportPDF');
  const btnModalExportPDF = document.getElementById('btnModalExportPDF');

  let activePdfStudent = null;
  let activePdfRoutine = null;

  async function openPdfModalForStudent(studentId) {
    const alumnos = await getAlumnos();
    activePdfStudent = alumnos.find(a => a.id === studentId) || alumnos[0];
    if (!activePdfStudent || !pdfExportModal || !printableRoutineCard) return;

    if (studentId === activeStudentId && currentBuilderRoutine) {
      collectCurrentDayExercises();
      if (routineTitleInput) currentBuilderRoutine.title = routineTitleInput.value;
      if (routineNotesInput) currentBuilderRoutine.notes = routineNotesInput.value;
      await saveRoutineDoc(activeStudentId, currentBuilderRoutine);
    }

    activePdfRoutine = await getRoutineForStudent(studentId) || {
      studentId: studentId,
      coachId: activeCoach.id,
      title: 'Plan de Entrenamiento Personalizado',
      notes: `Directiva de ${activeCoach.displayName}: Ejecutar con técnica biomecánica estricta y sobrecarga progresiva.`,
      days: {}
    };

    renderPrintableSheet(activePdfStudent, activePdfRoutine);
    pdfExportModal.classList.add('open');
  }

  function renderPrintableSheet(student, routine) {
    if (!printableRoutineCard) return;

    const todayStr = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    let daysHtml = '';
    const daysKeys = sortDayKeys(Object.keys(routine.days || {}));

    if (daysKeys.length === 0) {
      daysHtml = `<p style="padding: 20px; text-align: center; color: #64748b;">No hay ejercicios registrados en esta rutina todavía.</p>`;
    } else {
      daysKeys.forEach(key => {
        const day = routine.days[key];
        const exercises = day.exercises || [];

        let rowsHtml = '';
        if (exercises.length === 0) {
          rowsHtml = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 12px;">Día sin ejercicios programados.</td></tr>`;
        } else {
          exercises.forEach((ex, idx) => {
            rowsHtml += `
              <tr>
                <td style="width: 38%; font-weight: 600;">
                  <span style="display: inline-block; width: 18px; color: #008744; font-weight: 800;">${idx + 1}.</span>
                  <span class="sheet-ex-name">${ex.name}</span>
                  ${ex.cue ? `<div class="sheet-ex-cue"><i class="fa-solid fa-circle-info" style="font-size: 0.68rem; margin-right: 3px;"></i>${ex.cue}</div>` : ''}
                </td>
                <td class="text-center" style="width: 14%;">
                  <span class="sheet-pill-tag">${ex.sets || '3'} x ${ex.reps || '10-12'}</span>
                </td>
                <td class="text-center" style="width: 12%;">
                  <span style="font-weight: 700; color: #0f172a; font-size: 0.78rem;">${ex.rir || 'RIR 2'}</span>
                </td>
                <td class="text-center" style="width: 12%;">
                  <span style="color: #64748b; font-size: 0.78rem;">${ex.rest || '90s'}</span>
                </td>
                <td style="width: 24%;">
                  <div class="sheet-tracking-grid">
                    <div class="sheet-tracker-box" title="Serie 1">S1</div>
                    <div class="sheet-tracker-box" title="Serie 2">S2</div>
                    <div class="sheet-tracker-box" title="Serie 3">S3</div>
                    <div class="sheet-tracker-box" title="Serie 4">S4</div>
                  </div>
                </td>
              </tr>
            `;
          });
        }

        daysHtml += `
          <div class="sheet-day-block">
            <div class="sheet-day-header">
              <span class="sheet-day-title">${day.name || key}</span>
              <span class="sheet-day-badge">${exercises.length} Ejercicios</span>
            </div>
            <table class="sheet-table">
              <thead>
                <tr>
                  <th>Ejercicio & Clave Biomecánica</th>
                  <th class="text-center">Series x Reps</th>
                  <th class="text-center">Esfuerzo</th>
                  <th class="text-center">Descanso</th>
                  <th>Registro en Gym (Cargas / Reps)</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        `;
      });
    }

    printableRoutineCard.innerHTML = `
      <!-- Header -->
      <div class="sheet-header">
        <div class="sheet-brand">
          <div class="sheet-brand-icon"><i class="fa-solid fa-bolt"></i></div>
          <div>
            <div class="sheet-brand-title">COACH PRO</div>
            <div class="sheet-brand-sub">${activeCoach.displayName} • ${activeCoach.specialty}</div>
          </div>
        </div>
        <div class="sheet-doc-meta">
          <div class="sheet-doc-title">Ficha Oficial de Rutina</div>
          <div class="sheet-doc-date">Emitido: ${todayStr} • ${activeCoach.displayName}</div>
        </div>
      </div>

      <!-- Athlete Info Card -->
      <div class="sheet-athlete-card">
        <div class="sheet-athlete-grid">
          <div class="sheet-athlete-item">
            <span class="sheet-athlete-label">Alumno / Atleta</span>
            <span class="sheet-athlete-val">${student.name}</span>
          </div>
          <div class="sheet-athlete-item">
            <span class="sheet-athlete-label">Modalidad / Plan</span>
            <span class="sheet-athlete-val">${student.plan} ($${activeCoach.pricePersonalizado}/mes)</span>
          </div>
          <div class="sheet-athlete-item">
            <span class="sheet-athlete-label">Fase Actual</span>
            <span class="sheet-athlete-val" style="color: #008744;">${routine.title || 'Fase 1: Fuerza & Hipertrofia'}</span>
          </div>
        </div>
        <div style="margin-top: 8px;">
          <span class="sheet-athlete-label">Objetivo de Rendimiento:</span>
          <strong style="color: #1e293b; font-size: 0.85rem; margin-left: 6px;">${student.goal}</strong>
        </div>
        ${routine.notes ? `
          <div class="sheet-coach-note">
            <i class="fa-solid fa-quote-left"></i>
            <div><strong>Directriz de ${activeCoach.displayName}:</strong> ${routine.notes}</div>
          </div>
        ` : ''}
      </div>

      <!-- Workout Days -->
      <div class="sheet-days-container">
        ${daysHtml}
      </div>

      <!-- Footer & Signature Seal -->
      <div class="sheet-footer">
        <div>
          <div class="sheet-footer-brand">COACH PRO • Preparación Física & Coaching 1 a 1</div>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">
            Sobrecarga Progresiva: Registrá tus pesos serie por serie para asegurar tu progresión técnica y muscular.
          </div>
        </div>
        <div class="sheet-seal">
          <div style="text-align: right;">
            <div style="font-weight: 700; color: #0f172a;">${activeCoach.displayName}</div>
            <div style="font-size: 0.68rem; color: #64748b;">${activeCoach.specialty} • WhatsApp: ${activeCoach.phone}</div>
          </div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #0f172a; color: #00ff87; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
            <i class="fa-solid fa-award"></i>
          </div>
        </div>
      </div>
    `;
  }

  // Print Trigger
  if (btnPrintRoutine) {
    btnPrintRoutine.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy routine text trigger
  if (btnCopyRoutineText) {
    btnCopyRoutineText.addEventListener('click', () => {
      if (!activePdfStudent || !activePdfRoutine) return;

      let summary = `📋 *COACH PRO - FICHA DE ENTRENAMIENTO*\n`;
      summary += `⚡ *Coach:* ${activeCoach.displayName} (${activeCoach.specialty})\n`;
      summary += `👤 *Alumno:* ${activePdfStudent.name}\n`;
      summary += `🎯 *Objetivo:* ${activePdfStudent.goal}\n`;
      summary += `🔥 *Fase:* ${activePdfRoutine.title || 'Fuerza & Hipertrofia'}\n`;
      summary += `💰 *Tarifa Personalizado:* $${activeCoach.pricePersonalizado}/mes\n`;
      if (activePdfRoutine.notes) summary += `💡 *Directriz:* ${activePdfRoutine.notes}\n`;
      summary += `\n--------------------------------\n`;

      const daysKeys = sortDayKeys(Object.keys(activePdfRoutine.days || {}));
      daysKeys.forEach(k => {
        const day = activePdfRoutine.days[k];
        summary += `\n📌 *${day.name || k}*\n`;
        (day.exercises || []).forEach((ex, i) => {
          summary += `${i + 1}. *${ex.name}*: ${ex.sets}x${ex.reps} (${ex.rir}) - Pausa: ${ex.rest}${ex.cue ? ` [Cue: ${ex.cue}]` : ''}\n`;
        });
      });

      summary += `\n📲 Acceso a tu app móvil: ${window.location.origin}${window.location.pathname.replace('admin.html', '')}alumno.html?id=${activePdfStudent.id}\n`;

      navigator.clipboard.writeText(summary).then(() => {
        showToast('¡Texto formateado de la rutina copiado al portapapeles!');
      });
    });
  }

  // Close PDF Modal
  if (closePdfModal && pdfExportModal) {
    closePdfModal.addEventListener('click', () => pdfExportModal.classList.remove('open'));
    pdfExportModal.addEventListener('click', (e) => {
      if (e.target === pdfExportModal) pdfExportModal.classList.remove('open');
    });
  }

  // Export buttons in builder & modal
  if (btnExportPDF) {
    btnExportPDF.addEventListener('click', () => {
      openPdfModalForStudent(activeStudentId);
    });
  }

  if (btnModalExportPDF) {
    btnModalExportPDF.addEventListener('click', () => {
      if (studentToSend) {
        sendRoutineModal.classList.remove('open');
        openPdfModalForStudent(studentToSend.id);
      }
    });
  }

  // --- 7. Bookings Table Rendering ---
  const bookingsTableBody = document.getElementById('bookingsTableBody');
  async function renderBookingsTable() {
    const bookings = await getBookings();
    if (!bookingsTableBody) return;

    bookingsTableBody.innerHTML = '';
    if (bookings.length === 0) {
      bookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">No tienes solicitudes de turnos pendientes para tu perfil.</td></tr>`;
      return;
    }

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.clientName}</strong></td>
        <td>${b.service}</td>
        <td>${b.date} • ${b.time}</td>
        <td>${b.phone}</td>
        <td><span class="status-badge active">${b.status}</span></td>
        <td>
          <a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(b.clientName)}!%20Te%20saluda%20${encodeURIComponent(activeCoach.displayName)}.%20Te%20confirmo%20tu%20turno%20en%20COACH%20PRO" target="_blank" class="btn btn-whatsapp btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Contactar
          </a>
        </td>
      `;
      bookingsTableBody.appendChild(tr);
    });
  }
  await renderBookingsTable();

  // --- 8. Toast Utility ---
  function showToast(msg) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i> <span id="toastAdminText"></span>`;
      document.body.appendChild(toast);
    }
    const tText = toast.querySelector('#toastAdminText');
    if (tText) tText.textContent = msg;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
});
