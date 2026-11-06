# Coach Pro

Plataforma para entrenadores personales: un sitio público, un panel donde el coach arma las rutinas de sus alumnos, un portal para que el alumno las siga y un asistente de reservas.

Más trabajos en mi portfolio: https://portfolio-fawn-kappa-35.vercel.app

![Página principal de Coach Pro para entrenadores personales](docs/img/coach-1.webp)
![Sección de Coach Pro con los tres pasos para empezar](docs/img/coach-2.webp)

## Qué tiene

Sitio público: inicio, planes, una rutina de demostración, preguntas frecuentes, privacidad, términos y un botón de WhatsApp.

Panel del coach, en `/admin`: resumen, alumnos (con alta de alumnos nuevos), constructor de rutinas con biblioteca de ejercicios y autocompletado, historial de versiones de cada rutina, envío de la rutina al alumno, exportación a PDF, turnos y una pestaña de ayuda.

Portal del alumno, en `/alumno`: muestra la rutina, permite marcar las series completadas y tiene un cronómetro de descanso. El progreso y las sesiones completadas quedan guardados.

Reservas, en `/reservar`: un asistente paso a paso para pedir un turno con un coach.

## Modo invitado

El botón "Entrar como invitado" abre el panel con un coach de ejemplo, sin cuenta. Los datos de ese modo viven en el `localStorage` del navegador (`src/lib/demo/localStore.js`), son propios de cada visitante y no tocan Firebase.

## Stack

React 19, Vite, React Router 7, TanStack Query, Firebase (Authentication y Firestore), `@react-pdf/renderer` para los PDF y Oxlint.

## Reglas de Firestore

El acceso a los datos lo definen las reglas de `firestore.rules`:

- Cada coach crea y edita solo a sus alumnos, y solo él puede listarlos.
- Los perfiles de coach y de alumno se leen de a uno. El portal del alumno entra con un identificador que no se puede adivinar.
- La configuración web de Firebase que está en `src/firebase.js` es pública por diseño. Lo que protege los datos son las reglas.

## Cómo correrlo

```bash
npm install
npm run dev
npm run build
npm run lint
```

Para usar tu propio proyecto de Firebase, cambiá la configuración de `src/firebase.js` y publicá las reglas y los índices:

```bash
firebase deploy --only firestore
```

## Estructura

```
src/pages/marketing   sitio público
src/pages/admin       panel del coach
src/pages/alumno      portal del alumno
src/pages/reservar    asistente de reservas
src/lib/firestore     acceso a los datos
src/context           sesión, avisos y modal de contratación
src/hooks             cronómetro de descanso y accesibilidad de modales, entre otros
legacy-static         versión estática en HTML, CSS y JavaScript
firestore.rules       reglas de seguridad
```
