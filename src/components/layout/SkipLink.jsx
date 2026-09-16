export default function SkipLink({ target = '#main-content' }) {
  return (
    <a className="skip-link" href={target}>
      Saltar al contenido
    </a>
  );
}
