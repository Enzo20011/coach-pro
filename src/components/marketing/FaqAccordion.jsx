import { useState } from 'react';

/** Abrir uno cierra los demás; clickear el ya abierto lo cierra (no queda ninguno abierto). */
export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-container">
      {items.map((item, i) => {
        const isActive = openIndex === i;
        return (
          <div className={`faq-item${isActive ? ' active' : ''}`} key={item.question}>
            <button
              className="faq-question"
              type="button"
              onClick={() => setOpenIndex(isActive ? null : i)}
            >
              {item.question}
              <i className="fa-solid fa-plus faq-icon" />
            </button>
            <div className="faq-answer">{item.answer}</div>
          </div>
        );
      })}
    </div>
  );
}
