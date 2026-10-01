import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { timingSafeEqual } from 'node:crypto';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

initializeApp();
const db = getFirestore();

// El código vive como secreto del servidor (`firebase functions:secrets:set ACTIVATION_CODE`),
// nunca en el bundle del cliente.
const ACTIVATION_CODE = defineSecret('ACTIVATION_CODE');

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function safeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Activa la cuenta del coach logueado si el código es correcto. Es la única vía
 * para pasar `coaches/{uid}.isActive` a true (las reglas de Firestore lo prohíben
 * desde el cliente). Limita a 5 intentos fallidos por usuario cada 15 minutos.
 */
export const activateAccount = onCall(
  { secrets: [ACTIVATION_CODE], enforceAppCheck: false, region: 'us-central1' },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'No hay sesión activa.');

    const code = String(request.data?.code ?? '').trim().toUpperCase();
    if (!code || code.length > 64) throw new HttpsError('invalid-argument', 'Código inválido.');

    const coachRef = db.doc(`coaches/${uid}`);
    const attemptsRef = db.doc(`activationAttempts/${uid}`);

    await db.runTransaction(async (tx) => {
      const [coachSnap, attemptsSnap] = await Promise.all([tx.get(coachRef), tx.get(attemptsRef)]);
      if (!coachSnap.exists) throw new HttpsError('failed-precondition', 'Perfil de entrenador no encontrado.');

      const now = Date.now();
      const prev = attemptsSnap.data();
      const inWindow = prev && now - prev.windowStart < WINDOW_MS;
      const count = inWindow ? prev.count : 0;
      if (count >= MAX_ATTEMPTS) {
        throw new HttpsError('resource-exhausted', 'Demasiados intentos. Probá de nuevo en unos minutos.');
      }

      if (!safeEqual(code, ACTIVATION_CODE.value().trim().toUpperCase())) {
        tx.set(attemptsRef, { count: count + 1, windowStart: inWindow ? prev.windowStart : now });
        return { ok: false };
      }
      tx.update(coachRef, { isActive: true, activatedAt: FieldValue.serverTimestamp() });
      tx.delete(attemptsRef);
      return { ok: true };
    }).then((res) => {
      if (res && res.ok === false) throw new HttpsError('permission-denied', 'Código de activación incorrecto.');
    });

    return { success: true };
  }
);
