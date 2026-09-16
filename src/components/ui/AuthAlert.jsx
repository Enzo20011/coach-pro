/** `styles` es el objeto de un CSS module con las clases .authAlert/.error/.success. */
export default function AuthAlert({ status, message, styles }) {
  if (!status || !message) return null;
  return <div className={`${styles.authAlert} ${styles[status]}`}>{message}</div>;
}
