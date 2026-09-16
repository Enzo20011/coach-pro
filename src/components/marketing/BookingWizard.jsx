import { useMemo, useState } from 'react';

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DEFAULT_TIME_SLOTS = ['08:30 AM', '10:00 AM', '11:30 AM', '03:30 PM', '05:00 PM', '06:30 PM'];

function buildCalendarDays() {
  const today = new Date();
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayLabel = i === 0 ? 'Hoy' : DAY_NAMES[d.getDay()];
    return {
      key: i,
      dayLabel,
      dayNum: d.getDate(),
      fullLabel: `${dayLabel} ${d.getDate()} de ${MONTHS[d.getMonth()]}`,
    };
  });
}

/**
 * Wizard de reserva de turno compartido entre la demo de marketing (turnos.html)
 * y la reserva real por coach (reservar.html) — la diferencia entre ambas está
 * 100% en `services`, `timeSlots` y `onSubmit`, nunca en este componente.
 */
export default function BookingWizard({
  services,
  timeSlots = DEFAULT_TIME_SLOTS,
  submitLabel = 'Confirmar Turno por WhatsApp',
  topBar = null,
  onSubmit,
}) {
  const calendarDays = useMemo(buildCalendarDays, []);
  const [serviceId, setServiceId] = useState(services[0]?.id);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState(timeSlots[0]);
  const [form, setForm] = useState({ name: '', phone: '', note: '' });
  const [submitting, setSubmitting] = useState(false);

  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const dateLabel = calendarDays[dateIndex]?.fullLabel ?? 'Hoy';
  const step2Active = dateIndex !== 0 || time !== timeSlots[0] || serviceId !== services[0]?.id;
  const step3Active = Boolean(time);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.priceLabel,
        dateLabel,
        time,
        name: form.name,
        phone: form.phone,
        note: form.note,
      });
      setForm({ name: '', phone: '', note: '' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="stepper-header">
        <div className="step-item active">
          <div className="step-bubble">1</div>
          <div className="step-label">Servicio</div>
        </div>
        <div className={`step-item${step2Active ? ' active' : ''}`}>
          <div className="step-bubble">2</div>
          <div className="step-label">Fecha & Hora</div>
        </div>
        <div className={`step-item${step3Active ? ' active' : ''}`}>
          <div className="step-bubble">3</div>
          <div className="step-label">Confirmación</div>
        </div>
      </div>

      <div className="booking-wrapper">
        {topBar}

        <div className="booking-grid">
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 16, color: 'var(--text-white)' }}>1. Selecciona el Servicio</h3>
            <div className="services-selection">
              {services.map((s) => (
                <div
                  key={s.id}
                  className={`service-card-radio${serviceId === s.id ? ' active' : ''}`}
                  onClick={() => setServiceId(s.id)}
                >
                  <div className="service-info">
                    <h4>{s.name}</h4>
                    <p>{s.description}</p>
                  </div>
                  <div className="service-price">{s.priceLabel}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.15rem', marginBottom: 16, color: 'var(--text-white)' }}>2. Selecciona Día y Horario</h3>
            <div className="date-selector">
              <div className="calendar-strip">
                {calendarDays.map((d) => (
                  <div
                    key={d.key}
                    className={`cal-day-btn${dateIndex === d.key ? ' active' : ''}`}
                    onClick={() => setDateIndex(d.key)}
                  >
                    <div className="cal-day-name">{d.dayLabel}</div>
                    <div className="cal-day-num">{d.dayNum}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="slots-grid">
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className={`time-slot-btn${time === slot ? ' active' : ''}`}
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 16, color: 'var(--text-white)' }}>3. Completa tus Datos</h3>
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bookName">Nombre y Apellido</label>
                <input
                  type="text"
                  id="bookName"
                  className="form-input"
                  placeholder="Ej: Lucas Martínez"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bookPhone">Número de WhatsApp</label>
                <input
                  type="tel"
                  id="bookPhone"
                  className="form-input"
                  placeholder="+54 9 11 2345-6789"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bookNote">Nota u Objetivo (Opcional)</label>
                <input
                  type="text"
                  id="bookNote"
                  className="form-input"
                  placeholder="Ej: Mejorar técnica en sentadilla"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                />
              </div>

              <div className="booking-summary-box">
                <div className="summary-row">
                  <span>Servicio:</span>
                  <span>{service?.name}</span>
                </div>
                <div className="summary-row">
                  <span>Fecha:</span>
                  <span>{dateLabel}</span>
                </div>
                <div className="summary-row">
                  <span>Horario:</span>
                  <span>{time}</span>
                </div>
                <div className="summary-row">
                  <span>Costo:</span>
                  <span>{service?.priceLabel}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-whatsapp btn-full" style={{ marginTop: 10 }} disabled={submitting}>
                <i className="fa-brands fa-whatsapp" /> {submitting ? 'Enviando...' : submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
