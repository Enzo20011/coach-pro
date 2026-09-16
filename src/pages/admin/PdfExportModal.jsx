import { sortDayKeys } from '../../lib/routineUtils.js';
import { useToast } from '../../context/ToastContext.jsx';
import ModalShell from './ModalShell.jsx';
import PrintableRoutineSheet from './PrintableRoutineSheet.jsx';
import a from '../../styles/admin.module.css';

function buildRoutineSummaryText({ student, routine, coach }) {
  let summary = `📋 *COACH PRO - FICHA DE ENTRENAMIENTO*\n`;
  summary += `⚡ *Coach:* ${coach.displayName} (${coach.specialty})\n`;
  summary += `👤 *Alumno:* ${student.name}\n`;
  summary += `🎯 *Objetivo:* ${student.goal}\n`;
  summary += `🔥 *Fase:* ${routine.title || 'Fuerza & Hipertrofia'}\n`;
  summary += `💰 *Tarifa Personalizado:* $${coach.pricePersonalizado}/mes\n`;
  if (routine.notes) summary += `💡 *Directriz:* ${routine.notes}\n`;
  summary += `\n--------------------------------\n`;

  sortDayKeys(Object.keys(routine.days || {})).forEach((k) => {
    const day = routine.days[k];
    summary += `\n📌 *${day.name || k}*\n`;
    (day.exercises || []).forEach((ex, i) => {
      summary += `${i + 1}. *${ex.name}*: ${ex.sets}x${ex.reps} (${ex.rir}) - Pausa: ${ex.rest}${ex.cue ? ` [Cue: ${ex.cue}]` : ''}\n`;
    });
  });

  summary += `\n📲 Acceso a tu app móvil: ${window.location.origin}/alumno?id=${student.id}\n`;
  return summary;
}

export default function PdfExportModal({ isOpen, onClose, student, routine, coach }) {
  const showToast = useToast();

  function handleCopyText() {
    if (!student || !routine) return;
    navigator.clipboard.writeText(buildRoutineSummaryText({ student, routine, coach })).then(() => {
      showToast('¡Texto formateado de la rutina copiado al portapapeles!');
    });
  }

  const headerExtra = (
    <>
      <button type="button" className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`} onClick={() => window.print()}>
        <i className="fa-solid fa-print" /> Imprimir / Guardar en PDF
      </button>
      <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={handleCopyText} title="Copiar texto resumen">
        <i className="fa-regular fa-copy" /> Copiar Texto
      </button>
    </>
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      wide
      titleIcon="fa-solid fa-file-pdf"
      title={
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)' }}>Ficha de Entrenamiento para Imprimir / PDF</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Formato A4 profesional con membrete oficial y casilleros de registro
          </p>
        </div>
      }
      headerExtra={headerExtra}
    >
      <div className={a['pdf-preview-scroller']}>
        {student && routine && <PrintableRoutineSheet student={student} routine={routine} coach={coach} />}
      </div>
    </ModalShell>
  );
}
