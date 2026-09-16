export default function ExerciseCard({ exercise }) {
  return (
    <div className="exercise-card">
      <div className="exercise-main">
        <div className="exercise-num">{exercise.num}</div>
        <div className="exercise-details">
          <h4>{exercise.name}</h4>
          <div className="exercise-cues">
            <span className="cue-tag highlight">{exercise.highlightCue}</span>
            {exercise.cues.map((cue) => (
              <span className="cue-tag" key={cue}>
                {cue}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="exercise-meta-pills">
        <div className="meta-pill">
          <div className="pill-val">{exercise.setsReps}</div>
          <div className="pill-label">Series x Reps</div>
        </div>
        <div className="meta-pill">
          <div className="pill-val" style={{ color: 'var(--primary)' }}>
            {exercise.rir}
          </div>
          <div className="pill-label">Esfuerzo</div>
        </div>
        <div className="meta-pill">
          <div className="pill-val">{exercise.rest}</div>
          <div className="pill-label">Descanso</div>
        </div>
      </div>
    </div>
  );
}
