# Seguridad y despliegue

Orden de despliegue (importa: si las reglas salen antes que la función, nadie puede activar su cuenta):

1. Plan Blaze en Firebase (requerido por Cloud Functions).
2. `firebase functions:secrets:set ACTIVATION_CODE` (usar un código nuevo, el viejo ya fue público).
3. `cd functions && npm install`
4. `firebase deploy --only functions`
5. `npm run build && firebase deploy --only firestore:rules,hosting`
6. App Check: crear clave reCAPTCHA v3, definir `VITE_RECAPTCHA_SITE_KEY` en `.env` y activar "Enforce" (Firestore, Auth, Functions).
7. Authentication → Settings: activar protección contra enumeración de emails y, en Sign-in method → Multi-factor, habilitar TOTP (requiere Identity Platform).
8. Borrar de la base real las cuentas demo (`coach123`, `sofia123`) si existen.

Notas:
- `isActive` solo lo cambia la función `activateAccount`; las reglas lo bloquean desde el cliente.
- El borrado de alumnos pasa por la función `deleteStudent` (las reglas prohíben `delete`).
- El seed de desarrollo (`src/lib/seed.js`) escribe `isActive: true`, por lo que solo funciona contra el emulador.
