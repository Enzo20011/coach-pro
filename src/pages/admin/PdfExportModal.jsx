import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { sortDayKeys } from '../../lib/routineUtils.js';
import { formatARS } from '../../lib/formatCurrency.js';
import { useToast } from '../../context/ToastContext.jsx';
import ModalShell from './ModalShell.jsx';
import RoutinePdfDocument from './RoutinePdfDocument.jsx';
import a from '../../styles/admin.module.css';

function buildRoutineSummaryText({ student, routine, coach }) {
  let summary = `📋 *COACH PRO - FICHA DE ENTRENAMIENTO*\n`;
  summary += `⚡ *Coach:* ${coach.displayName} (${coach.specialty})\n`;
  summary += `👤 *Alumno:* ${student.name}\n`;
  summary += `🎯 *Objetivo:* ${student.goal}\n`;
  summary += `🔥 *Fase:* ${routine.title || 'Fuerza & Hipertrofia'}\n`;
  summary += `💰 *Tarifa Personalizado:* ${formatARS(coach.pricePersonalizado)}/mes\n`;
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

  const fileName = student ? `Rutina-${student.name.replace(/\s+/g, '-')}.pdf` : 'Rutina.pdf';

  const headerExtra = (
    <>
      {student && routine && (
        <PDFDownloadLink
          document={<RoutinePdfDocument student={student} routine={routine} coach={coach} />}
          fileName={fileName}
          className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`}
        >
          {({ loading }) => (
            <>
              <i className="fa-solid fa-download" /> {loading ? 'Generando...' : 'Descargar PDF'}
            </>
          )}
        </PDFDownloadLink>
      )}
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
        {student && routine && (
          <PDFViewer style={{ width: '100%', height: '75vh', border: 'none' }} showToolbar>
            <RoutinePdfDocument student={student} routine={routine} coach={coach} />
          </PDFViewer>
        )}
      </div>
    </ModalShell>
  );
}
