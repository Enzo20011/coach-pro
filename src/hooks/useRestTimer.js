import { useCallback, useEffect, useRef, useState } from 'react';

const DONE_LABEL = '¡A ENTRENAR!';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/** Cronómetro de descanso: réplica de startRestTimer/updateTimerDisplay de alumno.js. */
export default function useRestTimer() {
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  useEffect(
    () => () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideTimeoutRef.current);
    },
    []
  );

  const start = useCallback((seconds = 90) => {
    clearInterval(intervalRef.current);
    clearTimeout(hideTimeoutRef.current);
    setSecondsLeft(seconds);
    setDone(false);
    setActive(true);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setDone(true);
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          hideTimeoutRef.current = setTimeout(() => setActive(false), 3000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const addSeconds = useCallback((n) => setSecondsLeft((s) => s + n), []);

  const close = useCallback(() => {
    clearInterval(intervalRef.current);
    clearTimeout(hideTimeoutRef.current);
    setActive(false);
  }, []);

  return { active, done, label: done ? DONE_LABEL : formatTime(secondsLeft), addSeconds, start, close };
}
