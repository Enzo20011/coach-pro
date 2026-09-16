import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';
import { getAlumnosForCoach, createAlumno } from '../../lib/firestore/alumnos.js';
import { getRoutineForStudent, saveRoutine, countRoutinesForCoach } from '../../lib/firestore/routines.js';
import { getBookingsForCoach } from '../../lib/firestore/bookings.js';
import { defaultRoutineFor, starterRoutineFor } from '../../data/routineDefaults.js';
import AdminNavbar from './AdminNavbar.jsx';
import DashboardTab from './DashboardTab.jsx';
import AlumnosTab from './AlumnosTab.jsx';
import RoutineBuilderTab from './RoutineBuilderTab.jsx';
import TurnosTab from './TurnosTab.jsx';
import NewStudentModal from './NewStudentModal.jsx';
import SendRoutineModal from './SendRoutineModal.jsx';
import PdfExportModal from './PdfExportModal.jsx';
import EditRateModal from './EditRateModal.jsx';
import a from '../../styles/admin.module.css';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
  { key: 'alumnos', label: 'Alumnos', icon: 'fa-solid fa-users' },
  { key: 'builder', label: 'Crear Rutinas', icon: 'fa-solid fa-dumbbell' },
  { key: 'turnos', label: 'Turnos Online', icon: 'fa-regular fa-calendar-check' },
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

  const alumnos = alumnosQuery.data ?? [];
  const bookings = bookingsQuery.data ?? [];

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
    onSuccess: (_data, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: ['routine', studentId] });
      queryClient.invalidateQueries({ queryKey: ['routinesCount', coachId] });
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (form) => {
      const newId = String(Date.now());
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
      exercises: [...day.exercises, { name: 'Nuevo Ejercicio', sets: '3', reps: '10-12', rir: 'RIR 2', rest: '90s', cue: 'Técnica biomecánica estricta' }],
    }));
  }

  function handleDeleteExercise(index) {
    updateDay(activeDay, (day) => ({ ...day, exercises: day.exercises.filter((_, i) => i !== index) }));
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

      <AdminNavbar
        coach={coach}
        onEditRate={() => setEditRateOpen(true)}
        onLogout={() => {
          if (confirm(`¿Deseas cerrar sesión de ${coach.displayName}?`)) logout();
        }}
      />

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
              countBookings={bookings.length}
              onOpenNewStudent={() => setNewStudentOpen(true)}
              onGoToBuilder={() => setTab('builder')}
            />
          )}

          {tab === 'alumnos' && (
            <AlumnosTab
              alumnos={alumnos}
              coach={coach}
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
              onDeleteExercise={handleDeleteExercise}
              onSave={handleSaveRoutine}
              onPreview={() => window.open(`/alumno?id=${activeStudentId}`, '_blank')}
              onExportPdf={() => openPdfModal(activeStudentId)}
              onSend={() => openSendModal(activeStudentId)}
              saving={saveRoutineMutation.isPending}
            />
          )}

          {tab === 'turnos' && <TurnosTab bookings={bookings} coach={coach} />}
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

      <PdfExportModal
        isOpen={Boolean(pdfModal)}
        onClose={() => setPdfModal(null)}
        student={pdfModal?.student}
        routine={pdfModal?.routine}
        coach={coach}
      />

      <EditRateModal
        isOpen={editRateOpen}
        currentPrice={coach.pricePersonalizado ?? 49}
        onClose={() => setEditRateOpen(false)}
        onSave={async (price) => {
          await updateCoachPrice(price);
          setEditRateOpen(false);
          showToast(`¡Tarifa de personalizado actualizada a $${price}/mes!`);
        }}
      />
    </div>
  );
}
