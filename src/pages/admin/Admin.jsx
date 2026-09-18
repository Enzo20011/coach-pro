import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';
import { getAlumnosForCoach, createAlumno } from '../../lib/firestore/alumnos.js';
import {
  getRoutineForStudent,
  saveRoutine,
  autosaveRoutine,
  countRoutinesForCoach,
  getRoutineHistory,
} from '../../lib/firestore/routines.js';
import { getBookingsForCoach } from '../../lib/firestore/bookings.js';
import { getProgressForCoach } from '../../lib/firestore/progress.js';
import { getExerciseLibrary, saveExercisesToLibrary } from '../../lib/firestore/exerciseLibrary.js';
import { formatARS } from '../../lib/formatCurrency.js';
import { defaultRoutineFor, starterRoutineFor } from '../../data/routineDefaults.js';
import { COMMON_EXERCISES } from '../../data/commonExercises.js';
import AdminNavbar from './AdminNavbar.jsx';
import DashboardTab from './DashboardTab.jsx';
import AlumnosTab from './AlumnosTab.jsx';
import RoutineBuilderTab from './RoutineBuilderTab.jsx';
import TurnosTab from './TurnosTab.jsx';
import AyudaTab from './AyudaTab.jsx';
import NewStudentModal from './NewStudentModal.jsx';
import SendRoutineModal from './SendRoutineModal.jsx';
import EditRateModal from './EditRateModal.jsx';
import RoutineHistoryModal from './RoutineHistoryModal.jsx';
import ExercisePickerModal from './ExercisePickerModal.jsx';
import ModalShell from './ModalShell.jsx';
import a from '../../styles/admin.module.css';

// @react-pdf/renderer es una librería pesada — se carga sola recién cuando el
// coach abre el modal de PDF, no en cada carga del panel.
const PdfExportModal = lazy(() => import('./PdfExportModal.jsx'));

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
  { key: 'alumnos', label: 'Alumnos', icon: 'fa-solid fa-users' },
  { key: 'builder', label: 'Crear Rutinas', icon: 'fa-solid fa-dumbbell' },
  { key: 'turnos', label: 'Turnos Online', icon: 'fa-regular fa-calendar-check' },
  { key: 'ayuda', label: 'Ayuda', icon: 'fa-solid fa-circle-question' },
];

function cleanDraftDays(days) {
  const cleaned = {};
  Object.keys(days || {}).forEach((k) => {
    const d = days[k];
    if (d && d.exercises && d.exercises.length > 0) cleaned[k] = d;
  });
  return cleaned;
}

export default function Admin() {
  useDocumentMeta({ title: 'Panel de Control | COACH PRO' });

  const { user, coach, loading, logout, updateCoachPrice } = useAuth();
  const showToast = useToast();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState('dashboard');
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [activeDay, setActiveDay] = useState('day1');

  const [newStudentOpen, setNewStudentOpen] = useState(false);
  const [editRateOpen, setEditRateOpen] = useState(false);
  const [sendModal, setSendModal] = useState(null); // { student, routine }
  const [pdfModal, setPdfModal] = useState(null); // { student, routine }
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);

  const coachId = coach?.id;

  const alumnosQuery = useQuery({
    queryKey: ['alumnos', coachId],
    queryFn: () => getAlumnosForCoach(coachId),
    enabled: Boolean(coachId),
  });
  const bookingsQuery = useQuery({
    queryKey: ['bookings', coachId],
    queryFn: () => getBookingsForCoach(coachId),
    enabled: Boolean(coachId),
  });
  const routinesCountQuery = useQuery({
    queryKey: ['routinesCount', coachId],
    queryFn: () => countRoutinesForCoach(coachId),
    enabled: Boolean(coachId),
  });
  const routineQuery = useQuery({
    queryKey: ['routine', activeStudentId],
    queryFn: () => getRoutineForStudent(activeStudentId),
    enabled: Boolean(activeStudentId),
  });
  const routineHistoryQuery = useQuery({
    queryKey: ['routineHistory', activeStudentId],
    queryFn: () => getRoutineHistory(activeStudentId),
    enabled: historyOpen && Boolean(activeStudentId),
  });
  const progressQuery = useQuery({
    queryKey: ['progress', coachId],
    queryFn: () => getProgressForCoach(coachId),
    enabled: Boolean(coachId),
  });
  const exerciseLibraryQuery = useQuery({
    queryKey: ['exerciseLibrary', coachId],
    queryFn: () => getExerciseLibrary(coachId),
    enabled: Boolean(coachId),
  });

  const alumnos = alumnosQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];
  const progressByStudent = useMemo(() => {
    const map = {};
    (progressQuery.data ?? []).forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [progressQuery.data]);
  const sessionsThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return (progressQuery.data ?? []).reduce(
      (total, p) => total + (p.sessions ?? []).filter((s) => s.completedAt >= weekAgo).length,
      0
    );
  }, [progressQuery.data]);

  // Catálogo común + lo que el coach ya usó antes (esto último gana si hay
  // choque de nombre, ya que refleja cómo ESE coach arma ese ejercicio).
  // Lo que el coach ya usó va primero (más reciente primero) — es lo más
  // relevante para ÉL — y el catálogo común completa el resto alfabéticamente.
  // Antes el dropdown vacío siempre mostraba las mismas 8 primeras en orden
  // alfabético del catálogo genérico, sin importar el uso real de cada coach.
  const exerciseSuggestions = useMemo(() => {
    const library = (exerciseLibraryQuery.data ?? [])
      .slice()
      .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
    const libraryNames = new Set(library.map((ex) => ex.name.toLowerCase()));
    const commonRest = COMMON_EXERCISES.filter((ex) => !libraryNames.has(ex.name.toLowerCase())).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return [...library, ...commonRest];
  }, [exerciseLibraryQuery.data]);

  // Auto-select the first alumno once the list loads (matches the original's initial load).
  useEffect(() => {
    if (!activeStudentId && alumnos.length > 0) setActiveStudentId(alumnos[0].id);
  }, [alumnos, activeStudentId]);

  // Load the fetched (or default) routine into the editable draft whenever the target student changes.
  useEffect(() => {
    if (!activeStudentId || !coach) return;
    if (routineQuery.isLoading) return;
    setDraft(routineQuery.data || defaultRoutineFor(activeStudentId, coach));
    setActiveDay('day1');
  }, [activeStudentId, routineQuery.data, routineQuery.isLoading, coach]);

  const saveRoutineMutation = useMutation({
    mutationFn: ({ studentId, routineData }) => saveRoutine(studentId, routineData),
    onSuccess: (_data, { studentId, routineData }) => {
      queryClient.invalidateQueries({ queryKey: ['routine', studentId] });
      queryClient.invalidateQueries({ queryKey: ['routinesCount', coachId] });
      // Todo ejercicio que se guarda queda disponible como sugerencia la próxima
      // vez, para no tener que volver a tipearlo de cero.
      const allExercises = Object.values(routineData.days || {}).flatMap((d) => d.exercises || []);
      saveExercisesToLibrary(coachId, allExercises)
        .then(() => queryClient.invalidateQueries({ queryKey: ['exerciseLibrary', coachId] }))
        .catch((err) => console.error('No se pudo actualizar la biblioteca de ejercicios:', err));
    },
  });

  // Autoguardado: persiste solo (sin archivar en Historial ni tocar la
  // biblioteca de ejercicios) unos segundos después de que el coach deja de
  // editar, para que nunca se pierda trabajo por olvidarse de tocar "Guardar".
  const autosaveMutation = useMutation({
    mutationFn: ({ studentId, routineData }) => autosaveRoutine(studentId, routineData),
  });
  const [autosaveStatus, setAutosaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const skipNextAutosaveRef = useRef(true);
  const autosaveTimeoutRef = useRef(null);
  const savedStatusTimeoutRef = useRef(null);

  // Cambiar de alumno carga un draft nuevo — eso no es una edición del coach,
  // así que ese cambio de `draft` no debe disparar un autoguardado.
  useEffect(() => {
    skipNextAutosaveRef.current = true;
  }, [activeStudentId]);

  useEffect(() => {
    if (!draft || !activeStudentId) return undefined;
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return undefined;
    }

    setAutosaveStatus('saving');
    clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current = setTimeout(() => {
      const cleaned = { ...draft, coachId, studentId: activeStudentId, days: cleanDraftDays(draft?.days) };
      autosaveMutation.mutate(
        { studentId: activeStudentId, routineData: cleaned },
        {
          onSuccess: () => {
            setAutosaveStatus('saved');
            clearTimeout(savedStatusTimeoutRef.current);
            savedStatusTimeoutRef.current = setTimeout(() => setAutosaveStatus('idle'), 2500);
          },
          onError: (err) => {
            console.error('No se pudo autoguardar la rutina:', err);
            setAutosaveStatus('idle');
          },
        }
      );
    }, 1500);

    return () => clearTimeout(autosaveTimeoutRef.current);
  }, [draft, activeStudentId, coachId]);

  useEffect(
    () => () => {
      clearTimeout(autosaveTimeoutRef.current);
      clearTimeout(savedStatusTimeoutRef.current);
    },
    []
  );

  const createStudentMutation = useMutation({
    mutationFn: async (form) => {
      // UUID en vez de Date.now(): el link del portal (/alumno?id=...) no tiene
      // login, así que el id hace de "token" — antes era adivinable/enumerable.
      const newId = crypto.randomUUID();
      const newStudent = {
        id: newId,
        coachId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        plan: form.plan,
        goal: form.goal.trim(),
        status: 'Activo',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      };
      await createAlumno(newId, newStudent);
      await saveRoutine(newId, starterRoutineFor(newId, coach, newStudent.goal));
      return newStudent;
    },
    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', coachId] });
      queryClient.invalidateQueries({ queryKey: ['routinesCount', coachId] });
      setNewStudentOpen(false);
      showToast(`¡Alumno ${newStudent.name} registrado con éxito en tu panel!`);
    },
    onError: () => showToast('No se pudo registrar el alumno. Probá de nuevo.'),
  });

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (coach && !coach.isActive) return <Navigate to="/activar" replace />;
  if (!coach) return null;

  function buildCleanedDraft() {
    return { ...draft, coachId, studentId: activeStudentId, days: cleanDraftDays(draft?.days) };
  }

  async function persistCurrentDraft() {
    const cleaned = buildCleanedDraft();
    await saveRoutineMutation.mutateAsync({ studentId: activeStudentId, routineData: cleaned });
    return cleaned;
  }

  async function handleSaveRoutine() {
    try {
      await persistCurrentDraft();
      showToast('¡Rutina guardada con éxito en tu panel de entrenador!');
    } catch (err) {
      console.error(err);
      showToast('No se pudo guardar la rutina. Probá de nuevo.');
    }
  }

  function updateDay(dayKey, updater) {
    setDraft((d) => {
      if (!d) return d;
      const existing = d.days[dayKey] || { name: `Día ${dayKey.replace('day', '')}`, exercises: [] };
      return { ...d, days: { ...d.days, [dayKey]: updater(existing) } };
    });
  }

  function handleDayNameChange(dayKey, value) {
    updateDay(dayKey, (day) => ({ ...day, name: value }));
  }

  function handleExerciseChange(index, field, value) {
    updateDay(activeDay, (day) => {
      const exercises = day.exercises.slice();
      exercises[index] = { ...exercises[index], [field]: value };
      return { ...day, exercises };
    });
  }

  function handleAddExercise() {
    updateDay(activeDay, (day) => ({
      ...day,
      exercises: [...day.exercises, { name: '', sets: '', reps: '', rir: '', rest: '', cue: '' }],
    }));
  }

  function handleAddMultipleExercises(newExercises) {
    if (newExercises.length === 0) return;
    updateDay(activeDay, (day) => ({ ...day, exercises: [...day.exercises, ...newExercises] }));
    showToast(`${newExercises.length} ejercicio${newExercises.length === 1 ? '' : 's'} agregado${newExercises.length === 1 ? '' : 's'} al día.`);
  }

  function handleDeleteExercise(index) {
    updateDay(activeDay, (day) => ({ ...day, exercises: day.exercises.filter((_, i) => i !== index) }));
  }

  function handleApplyExerciseTemplate(index, template) {
    updateDay(activeDay, (day) => {
      const exercises = day.exercises.slice();
      exercises[index] = { ...exercises[index], ...template };
      return { ...day, exercises };
    });
  }

  async function openSendModal(studentId) {
    const student = alumnos.find((al) => al.id === studentId);
    if (!student) return;
    const routine = studentId === activeStudentId ? draft : (await getRoutineForStudent(studentId)) || { title: 'Plan de Entrenamiento' };
    setSendModal({ student, routine });
  }

  async function openPdfModal(studentId) {
    const student = alumnos.find((al) => al.id === studentId);
    if (!student) return;
    let routine;
    if (studentId === activeStudentId) {
      routine = await persistCurrentDraft();
    } else {
      routine = (await getRoutineForStudent(studentId)) || defaultRoutineFor(studentId, coach);
    }
    setPdfModal({ student, routine });
  }

  function handleTabClick(key) {
    setTab(key);
    if (key === 'alumnos') alumnosQuery.refetch();
    if (key === 'turnos') bookingsQuery.refetch();
    if (key === 'dashboard') {
      alumnosQuery.refetch();
      routinesCountQuery.refetch();
      bookingsQuery.refetch();
    }
  }

  return (
    <div className={a['admin-root']}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <AdminNavbar coach={coach} onEditRate={() => setEditRateOpen(true)} onLogout={() => setConfirmLogoutOpen(true)} />

      <div className={a['admin-layout']}>
        <nav className={a['admin-tabbar']}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${a['sidebar-btn']} ${tab === t.key ? a.active : ''}`}
              onClick={() => handleTabClick(t.key)}
            >
              <i className={t.icon} /> {t.label}
            </button>
          ))}
        </nav>

        <main className={a['admin-content']} id="main-content">
          {tab === 'dashboard' && (
            <DashboardTab
              countAlumnos={alumnos.length}
              countRoutines={routinesCountQuery.data ?? 0}
              countBookings={bookings.filter((b) => b.status === 'Pendiente').length}
              sessionsThisWeek={sessionsThisWeek}
              onOpenNewStudent={() => setNewStudentOpen(true)}
              onGoToBuilder={() => setTab('builder')}
            />
          )}

          {tab === 'alumnos' && (
            <AlumnosTab
              alumnos={alumnos}
              coach={coach}
              progressByStudent={progressByStudent}
              onOpenNewStudent={() => setNewStudentOpen(true)}
              onEditRoutine={(id) => {
                setActiveStudentId(id);
                setTab('builder');
              }}
              onExportPdf={openPdfModal}
              onSendWhatsApp={openSendModal}
            />
          )}

          {tab === 'builder' && (
            <RoutineBuilderTab
              studentId={activeStudentId}
              students={alumnos}
              draft={draft}
              activeDay={activeDay}
              onStudentChange={setActiveStudentId}
              onDayChange={setActiveDay}
              onTitleChange={(v) => setDraft((d) => (d ? { ...d, title: v } : d))}
              onNotesChange={(v) => setDraft((d) => (d ? { ...d, notes: v } : d))}
              onDayNameChange={handleDayNameChange}
              onExerciseChange={handleExerciseChange}
              onAddExercise={handleAddExercise}
              onOpenExercisePicker={() => setExercisePickerOpen(true)}
              onDeleteExercise={handleDeleteExercise}
              onApplyExerciseTemplate={handleApplyExerciseTemplate}
              exerciseSuggestions={exerciseSuggestions}
              onSave={handleSaveRoutine}
              autosaveStatus={autosaveStatus}
              onPreview={() => window.open(`/alumno?id=${activeStudentId}`, '_blank')}
              onExportPdf={() => openPdfModal(activeStudentId)}
              onSend={() => openSendModal(activeStudentId)}
              onShowHistory={() => setHistoryOpen(true)}
              saving={saveRoutineMutation.isPending}
            />
          )}

          {tab === 'turnos' && (
            <TurnosTab bookings={bookings} coach={coach} onBookingUpdated={() => bookingsQuery.refetch()} />
          )}

          {tab === 'ayuda' && <AyudaTab />}
        </main>
      </div>

      <NewStudentModal
        isOpen={newStudentOpen}
        onClose={() => setNewStudentOpen(false)}
        onCreate={(form) => createStudentMutation.mutateAsync(form)}
      />

      <SendRoutineModal
        isOpen={Boolean(sendModal)}
        onClose={() => setSendModal(null)}
        student={sendModal?.student}
        routine={sendModal?.routine}
        coach={coach}
        onExportPdf={openPdfModal}
      />

      {Boolean(pdfModal) && (
        <Suspense fallback={null}>
          <PdfExportModal
            isOpen={Boolean(pdfModal)}
            onClose={() => setPdfModal(null)}
            student={pdfModal?.student}
            routine={pdfModal?.routine}
            coach={coach}
          />
        </Suspense>
      )}

      <RoutineHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        versions={routineHistoryQuery.data ?? []}
        isLoading={routineHistoryQuery.isLoading}
        onRestore={(version) => {
          setDraft((d) => (d ? { ...d, title: version.title, notes: version.notes, days: version.days } : d));
          setHistoryOpen(false);
          showToast('Versión restaurada en el editor. Guardá para confirmar los cambios.');
        }}
      />

      <ExercisePickerModal
        isOpen={exercisePickerOpen}
        onClose={() => setExercisePickerOpen(false)}
        suggestions={exerciseSuggestions}
        onAddSelected={handleAddMultipleExercises}
      />

      <EditRateModal
        isOpen={editRateOpen}
        currentPrice={coach.pricePersonalizado ?? 50000}
        onClose={() => setEditRateOpen(false)}
        onSave={async (price) => {
          await updateCoachPrice(price);
          setEditRateOpen(false);
          showToast(`¡Tarifa de personalizado actualizada a ${formatARS(price)}/mes!`);
        }}
      />

      <ModalShell
        isOpen={confirmLogoutOpen}
        onClose={() => setConfirmLogoutOpen(false)}
        titleIcon="fa-solid fa-right-from-bracket"
        title="Cerrar Sesión"
        maxWidth={400}
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          ¿Deseás cerrar sesión de {coach.displayName}?
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className={`${a.btn} ${a['btn-secondary']}`} onClick={() => setConfirmLogoutOpen(false)}>
            Cancelar
          </button>
          <button
            type="button"
            className={`${a.btn} ${a['btn-danger']}`}
            onClick={() => {
              setConfirmLogoutOpen(false);
              logout();
            }}
          >
            <i className="fa-solid fa-right-from-bracket" /> Cerrar Sesión
          </button>
        </div>
      </ModalShell>
    </div>
  );
}
