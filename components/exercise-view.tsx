'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getExercise, getExercisesByBlock } from '@/lib/exercises';
import { BLOCKS } from '@/lib/blocks';
import { EXERCISES } from '@/lib/exercises';
import { getProgress, updateProgress, getAllProgress, type Understanding } from '@/lib/progress';
import { getScreens, buildPracticeScreens, type Screen, type PracticeLevel } from '@/lib/screens';
import type { Exercise } from '@/lib/types';
import type { Phase } from '@/app/page';

const PHASE_LABEL: Record<Phase, string> = { learn: 'Aprender', practice: 'Practicar', test: 'Demostrar' };
const PHASE_COLOR: Record<Phase, string> = { learn: 'bg-emerald-500', practice: 'bg-blue-500', test: 'bg-purple-500' };

const ENCOURAGEMENTS = ['Bien visto.', 'Eso es.', 'Vas bien.', 'Correcto.', 'Exacto.'];
const randomEncouragement = () => ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

interface Props {
  slug: string;
  phase: Phase;
  onBack: () => void;
  onNavigate: (slug: string) => void;
  onChangePhase: (phase: Phase) => void;
}

export function ExerciseView({ slug, phase, onBack, onNavigate, onChangePhase }: Props) {
  const exercise = getExercise(slug);
  if (!exercise) return <div className="p-16 text-center text-muted-foreground">Ejercicio no encontrado.</div>;

  // Use ScreenFlow for Learn and Practice
  if (phase === 'learn') {
    const screens = getScreens(slug);
    if (screens) {
      return <ScreenFlow exercise={exercise} screens={screens} phase={phase} onBack={onBack} onNavigate={onNavigate} onChangePhase={onChangePhase} />;
    }
  }

  if (phase === 'practice') {
    return <PracticeFlow exercise={exercise} onBack={onBack} onNavigate={onNavigate} onChangePhase={onChangePhase} />;
  }

  // Test mode uses StepFlow
  return <StepFlow exercise={exercise} phase={phase} onBack={onBack} onNavigate={onNavigate} onChangePhase={onChangePhase} />;
}

// ════════════════════════════════════════════════
// SCREEN FLOW (micro-learning, one screen at a time)
// ════════════════════════════════════════════════

function ScreenFlow({ exercise, screens, phase, onBack, onNavigate, onChangePhase }: {
  exercise: Exercise; screens: Screen[]; phase: Phase; onBack: () => void; onNavigate: (slug: string) => void; onChangePhase: (phase: Phase) => void;
}) {
  const blockExercises = getExercisesByBlock(exercise.blockId);
  const currentIndex = blockExercises.findIndex(e => e.slug === exercise.slug);
  const nextExercise = currentIndex < blockExercises.length - 1 ? blockExercises[currentIndex + 1] : null;

  const [idx, setIdx] = useState(0);
  const [quizPicked, setQuizPicked] = useState<number | null>(null);
  const [attemptText, setAttemptText] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [understanding, setUnderstanding] = useState<Understanding | null>(null);
  const [showStuckHint, setShowStuckHint] = useState(false);

  // AI state for practice help
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stuckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIdx(0); setQuizPicked(null); setShowStuckHint(false);
    setAiExplanation(''); setAiError(''); setAiLoading(false);
    const saved = getProgress(exercise.slug);
    if (saved) {
      setAttemptText(saved.attemptText);
      setSeconds(saved.timeSpentSeconds);
      setUnderstanding(saved.understanding ?? null);
    }
  }, [exercise.slug]);

  // Timer for practice
  useEffect(() => {
    if (phase !== 'practice') return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Auto-save
  const save = useCallback(() => {
    if (phase === 'practice' && attemptText.trim()) {
      updateProgress(exercise.slug, { attemptText, timeSpentSeconds: seconds, lastAttempt: new Date().toISOString() });
    }
  }, [exercise.slug, attemptText, seconds, phase]);
  useEffect(() => { const id = setInterval(save, 15000); return () => clearInterval(id); }, [save]);

  const handleAttemptChange = (value: string) => {
    setAttemptText(value);
    setShowStuckHint(false);
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateProgress(exercise.slug, { attemptText: value, lastAttempt: new Date().toISOString() });
    }, 2000);
  };

  const requestAI = async (mode: string) => {
    setAiLoading(true); setAiError(''); setAiExplanation('');
    try {
      const res = await fetch('/api/explain', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: { title: exercise.title, blockId: exercise.blockId, difficulty: exercise.difficulty, pattern: exercise.pattern, patternSteps: exercise.patternSteps, statement: exercise.statement, concepts: exercise.concepts, hints: exercise.hints },
          userAttempt: attemptText.trim() || undefined, mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) setAiError(data.error || 'No se pudo generar.');
      else setAiExplanation(data.explanation);
    } catch { setAiError('No se pudo conectar.'); }
    finally { setAiLoading(false); }
  };

  const screen = screens[idx];
  const total = screens.length;
  const advance = () => { setQuizPicked(null); setShowStuckHint(false); setIdx(i => Math.min(i + 1, total - 1)); };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Stuck detection
  useEffect(() => {
    if (screen?.type === 'code' && !attemptText.trim() && phase === 'practice') {
      stuckTimerRef.current = setTimeout(() => setShowStuckHint(true), 30000);
      return () => { if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current); };
    }
  }, [idx, attemptText, phase, screen?.type]);

  return (
    <div className="flex flex-col flex-1 items-center min-h-dvh px-5 py-6">
      <div className="w-full max-w-md flex flex-col flex-1">

        {/* Top */}
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => { save(); onBack(); }} className="text-sm text-gray-400 hover:text-foreground">← Salir</button>
          <div className="flex items-center gap-3">
            {phase === 'practice' && <span className="text-xs font-mono text-gray-400">{formatTime(seconds)}</span>}
            <span className="text-xs text-gray-400">{idx + 1} / {total}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-gray-200 rounded-full mb-10 overflow-hidden">
          <div className={`h-full ${PHASE_COLOR[phase]} rounded-full transition-all duration-500 ease-out`} style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>

        {/* Screen */}
        <div className="flex-1 flex flex-col justify-center">

          {screen.type === 'intro' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">{exercise.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line mb-8">{screen.text}</p>
              <Btn onClick={advance}>Empezar</Btn>
            </div>
          )}

          {screen.type === 'concept' && (
            <div>
              <p className="text-lg leading-relaxed whitespace-pre-line mb-8">{screen.text}</p>
              <Btn onClick={advance}>Entendido</Btn>
            </div>
          )}

          {screen.type === 'quiz' && (
            <div>
              <p className="text-lg font-medium mb-6">{screen.question}</p>
              <div className="space-y-2 mb-4">
                {screen.options.map((opt, i) => {
                  const picked = quizPicked !== null;
                  const isCorrect = i === screen.correctIndex;
                  const isThis = i === quizPicked;
                  let style = 'border-2 border-gray-200 hover:border-gray-400';
                  if (picked && isCorrect) style = 'border-2 border-emerald-400 bg-emerald-50';
                  if (picked && isThis && !isCorrect) style = 'border-2 border-amber-400 bg-amber-50';
                  return (
                    <button key={i} onClick={() => { if (!picked) setQuizPicked(i); }}
                      disabled={picked}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-base transition-colors ${style}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizPicked !== null && (
                <div className={`rounded-2xl p-4 mb-4 ${quizPicked === screen.correctIndex ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  {quizPicked === screen.correctIndex && (
                    <p className="text-emerald-600 text-sm font-medium mb-1">{randomEncouragement()}</p>
                  )}
                  <p className={`text-base ${quizPicked === screen.correctIndex ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {quizPicked === screen.correctIndex ? screen.feedbackCorrect : screen.feedbackWrong}
                  </p>
                </div>
              )}
              {quizPicked !== null && <Btn onClick={advance}>Seguir</Btn>}
            </div>
          )}

          {screen.type === 'build' && (
            <div>
              <p className="text-sm text-gray-400 mb-2">{screen.title}</p>
              <pre className="bg-zinc-900 text-zinc-100 rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-3">{screen.code}</pre>
              <p className="text-base text-gray-600 mb-8">{screen.explanation}</p>
              <Btn onClick={advance}>Seguir</Btn>
            </div>
          )}

          {screen.type === 'code' && (
            <div>
              <Label>{screen.prompt}</Label>
              <textarea value={attemptText} onChange={e => handleAttemptChange(e.target.value)}
                placeholder={"#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}"}
                className="w-full h-52 bg-card border-2 rounded-2xl p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-3" spellCheck={false} />
              {showStuckHint && !attemptText.trim() && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 mb-3">
                  <p className="text-sm text-indigo-800 mb-2">Sin prisa. ¿Te echo una mano?</p>
                  <div className="flex gap-2">
                    <button onClick={() => requestAI('start')} className="text-sm text-indigo-700 font-medium hover:underline">Sí, ayúdame</button>
                    <button onClick={() => setShowStuckHint(false)} className="text-sm text-gray-400 hover:underline">No, sigo solo</button>
                  </div>
                </div>
              )}
              {aiLoading && <p className="text-sm text-indigo-600 animate-pulse mb-3">Pensando...</p>}
              {aiExplanation && <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-sm mb-3 whitespace-pre-wrap">{aiExplanation}</div>}
              {aiError && <p className="text-sm text-red-600 mb-3">{aiError}</p>}
              {phase === 'practice' && attemptText.trim() && (
                <div className="flex gap-2 mb-3">
                  <button onClick={() => requestAI('review')} className="text-sm text-indigo-600 hover:underline">Revisa mi código</button>
                </div>
              )}
              <Btn onClick={advance} disabled={phase === 'practice' && !attemptText.trim()}>
                {attemptText.trim() ? 'Seguir' : 'Escribe algo primero'}
              </Btn>
            </div>
          )}

          {screen.type === 'fill' && (
            <div>
              <Label>{screen.title}</Label>
              <p className="text-sm text-gray-500 mb-3">Rellena cada ___ con el valor correcto.</p>
              <pre className="bg-zinc-900 text-zinc-100 rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-4">{screen.codeWithGaps}</pre>
              <p className="text-xs text-gray-400 mb-4">Respuestas: {screen.answers.join(' · ')}</p>
              <Btn onClick={advance}>Seguir</Btn>
            </div>
          )}

          {screen.type === 'ghost' && (
            <div>
              <Label>{screen.title}</Label>
              <p className="text-sm text-gray-500 mb-3">Copia este codigo escribiendolo tu. Aprende haciendolo.</p>
              <pre className="bg-zinc-50 border-2 border-dashed border-zinc-300 text-zinc-400 rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-3">{screen.ghostCode}</pre>
              <textarea value={attemptText} onChange={e => handleAttemptChange(e.target.value)}
                placeholder="Escribe aqui tu version..."
                className="w-full h-48 bg-card border-2 rounded-2xl p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-3" spellCheck={false} />
              <Btn onClick={advance} disabled={!attemptText.trim()}>
                {attemptText.trim() ? 'Seguir' : 'Escribe algo primero'}
              </Btn>
            </div>
          )}

          {screen.type === 'partial' && (
            <div>
              <Label>{screen.title}</Label>
              <p className="text-sm text-gray-500 mb-3">Te damos la estructura. Completa la logica.</p>
              <textarea value={attemptText || screen.starterCode} onChange={e => handleAttemptChange(e.target.value)}
                className="w-full h-56 bg-card border-2 rounded-2xl p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-3" spellCheck={false} />
              <Btn onClick={advance} disabled={!attemptText.trim() || attemptText === screen.starterCode}>
                Seguir
              </Btn>
            </div>
          )}

          {screen.type === 'level-select' && (
            <div>
              <Label>Elige tu nivel</Label>
              <Btn onClick={advance}>Seguir</Btn>
            </div>
          )}

          {screen.type === 'final' && (
            <div className="text-center">
              <p className="text-4xl mb-4">{phase === 'practice' ? '💪' : '✓'}</p>
              <p className="text-lg leading-relaxed whitespace-pre-line mb-6">{screen.text}</p>

              {/* Understanding - practice only */}
              {phase === 'practice' && (
                <div className="flex gap-2 justify-center mb-6">
                  {([
                    { value: 'good' as Understanding, emoji: '🟢', label: 'Bien' },
                    { value: 'medium' as Understanding, emoji: '🟡', label: 'Regular' },
                    { value: 'bad' as Understanding, emoji: '🔴', label: 'Flojo' },
                  ]).map(opt => (
                    <button key={opt.value}
                      onClick={() => {
                        setUnderstanding(opt.value);
                        updateProgress(exercise.slug, { understanding: opt.value, lastAttempt: new Date().toISOString() });
                        if (attemptText.trim() && opt.value === 'good') {
                          updateProgress(exercise.slug, { status: 'dominated', lastAttempt: new Date().toISOString() });
                        }
                      }}
                      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border-2 transition-colors ${understanding === opt.value ? 'bg-muted border-foreground/20' : 'hover:bg-muted/50'}`}>
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {phase === 'learn' ? (
                  <Btn onClick={() => onChangePhase('practice')}>Ahora a practicar</Btn>
                ) : nextExercise ? (
                  <Btn onClick={() => { save(); onNavigate(nextExercise.slug); }}>Siguiente ejercicio</Btn>
                ) : (
                  <Btn onClick={() => { save(); onBack(); }}>Volver al bloque</Btn>
                )}
                {nextExercise && phase !== 'learn' && (
                  <button onClick={() => { save(); onBack(); }}
                    className="w-full py-3.5 rounded-2xl border-2 text-base font-medium hover:bg-gray-50 transition-colors">
                    Volver al bloque
                  </button>
                )}
                {phase === 'learn' && nextExercise && (
                  <button onClick={() => onNavigate(nextExercise.slug)}
                    className="w-full py-3.5 rounded-2xl border-2 text-base font-medium hover:bg-gray-50 transition-colors">
                    Siguiente: {nextExercise.title}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back step */}
        {idx > 0 && screen.type !== 'final' && (
          <div className="flex justify-center pt-4">
            <button onClick={() => { setQuizPicked(null); setIdx(i => i - 1); }}
              className="text-sm text-gray-400 hover:text-foreground">← Paso anterior</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// PRACTICE FLOW (with level selection)
// ════════════════════════════════════════════════

function PracticeFlow({ exercise, onBack, onNavigate, onChangePhase }: {
  exercise: Exercise; onBack: () => void; onNavigate: (slug: string) => void; onChangePhase: (phase: Phase) => void;
}) {
  const [level, setLevel] = useState<PracticeLevel | null>(null);
  useEffect(() => { setLevel(null); }, [exercise.slug]);

  // If no level selected, show selector
  if (!level) {
    return (
      <div className="flex flex-col flex-1 items-center min-h-dvh px-5 py-6">
        <div className="w-full max-w-md flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <button onClick={onBack} className="text-sm text-gray-400 hover:text-foreground">← Salir</button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mb-10" />
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
            <p className="text-base text-gray-500 mb-6">Elige cuanta ayuda quieres</p>

            <div className="space-y-2">
              <button onClick={() => setLevel(1)}
                className="w-full text-left px-5 py-4 border-2 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                <p className="font-medium text-base">Completar huecos</p>
                <p className="text-sm text-gray-500">El codigo esta casi hecho. Solo rellenas.</p>
              </button>
              <button onClick={() => setLevel(2)}
                className="w-full text-left px-5 py-4 border-2 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <p className="font-medium text-base">Escribir con guia</p>
                <p className="text-sm text-gray-500">Ves la solucion de fondo. Escribes encima.</p>
              </button>
              <button onClick={() => setLevel(3)}
                className="w-full text-left px-5 py-4 border-2 rounded-2xl hover:bg-amber-50 hover:border-amber-200 transition-colors">
                <p className="font-medium text-base">Solo la estructura</p>
                <p className="text-sm text-gray-500">Te damos el esqueleto. Tu escribes el resto.</p>
              </button>
              <button onClick={() => setLevel(4)}
                className="w-full text-left px-5 py-4 border-2 rounded-2xl hover:bg-purple-50 hover:border-purple-200 transition-colors">
                <p className="font-medium text-base">Desde cero</p>
                <p className="text-sm text-gray-500">Sin ayuda. Tu solo.</p>
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">Puedes probar cualquier nivel</p>
          </div>
        </div>
      </div>
    );
  }

  // Build screens for selected level
  const screens = buildPracticeScreens(exercise, level);
  return (
    <ScreenFlow exercise={exercise} screens={screens} phase="practice" onBack={() => setLevel(null)} onNavigate={onNavigate} onChangePhase={onChangePhase} />
  );
}

function StepFlow({ exercise, phase, onBack, onNavigate, onChangePhase }: { exercise: Exercise; phase: Phase; onBack: () => void; onNavigate: (slug: string) => void; onChangePhase: (phase: Phase) => void }) {
  const block = BLOCKS.find(b => b.id === exercise.blockId);
  const blockExercises = getExercisesByBlock(exercise.blockId);
  const currentIndex = blockExercises.findIndex(e => e.slug === exercise.slug);
  const nextExercise = currentIndex < blockExercises.length - 1 ? blockExercises[currentIndex + 1] : null;

  // Global progress count
  const [globalDone, setGlobalDone] = useState(0);
  useEffect(() => {
    const all = getAllProgress();
    setGlobalDone(Object.values(all).filter(p => p.status === 'dominated' || p.status === 'with_hints' || p.status === 'attempted').length);
  }, []);

  // State
  const [step, setStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<boolean | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [pseudocodeVisible, setPseudocodeVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [attemptText, setAttemptText] = useState('');
  const [dominated, setDominated] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [justification, setJustification] = useState('');
  const [understanding, setUnderstanding] = useState<Understanding | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showStuckHint, setShowStuckHint] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stuckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const usefulHints = exercise.hints.filter(h => {
    const lower = h.content.toLowerCase();
    return !(lower.includes('ver solución completa') || lower.includes('ver código de solución'));
  });

  // Load
  useEffect(() => {
    const saved = getProgress(exercise.slug);
    if (saved) {
      setHintsRevealed(saved.hintsRevealed);
      setSolutionVisible(saved.solutionViewed);
      setPseudocodeVisible(saved.pseudocodeViewed);
      setAttemptText(saved.attemptText);
      setSeconds(saved.timeSpentSeconds);
      setDominated(saved.status === 'dominated');
      setUnderstanding(saved.understanding ?? null);
    }
    setStep(0); setQuizAnswer(null); setShowStuckHint(false);
    setAiExplanation(''); setAiError(''); setAiLoading(false);
    setJustification('');
  }, [exercise.slug, phase]);

  // Timer
  useEffect(() => {
    if (phase === 'learn') return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Save
  const save = useCallback(() => {
    updateProgress(exercise.slug, {
      hintsRevealed, solutionViewed: solutionVisible, pseudocodeViewed: pseudocodeVisible,
      attemptText, timeSpentSeconds: seconds, lastAttempt: new Date().toISOString(),
      ...(dominated ? { status: 'dominated' } : {}),
    });
  }, [exercise.slug, hintsRevealed, solutionVisible, pseudocodeVisible, attemptText, seconds, dominated]);

  useEffect(() => { const id = setInterval(save, 15000); return () => clearInterval(id); }, [save]);

  const handleBack = () => { if (debounceRef.current) clearTimeout(debounceRef.current); save(); onBack(); };
  const handleNavigate = (slug: string) => { if (debounceRef.current) clearTimeout(debounceRef.current); save(); onNavigate(slug); };

  const handleAttemptChange = (value: string) => {
    setAttemptText(value);
    setShowStuckHint(false);
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateProgress(exercise.slug, { attemptText: value, lastAttempt: new Date().toISOString() });
    }, 2000);
  };

  const revealHint = () => { const n = Math.min(hintsRevealed + 1, usefulHints.length); setHintsRevealed(n); updateProgress(exercise.slug, { hintsRevealed: n, lastAttempt: new Date().toISOString() }); };
  const revealPseudocode = () => { setPseudocodeVisible(true); updateProgress(exercise.slug, { pseudocodeViewed: true, lastAttempt: new Date().toISOString() }); };
  const revealSolution = () => { setSolutionVisible(true); updateProgress(exercise.slug, { solutionViewed: true, lastAttempt: new Date().toISOString() }); };

  const requestAI = async (mode: string, extraBody?: Record<string, unknown>) => {
    setAiLoading(true); setAiError(''); setAiExplanation('');
    try {
      const res = await fetch('/api/explain', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: { title: exercise.title, blockId: exercise.blockId, difficulty: exercise.difficulty, pattern: exercise.pattern, patternSteps: exercise.patternSteps, statement: exercise.statement, concepts: exercise.concepts, hints: exercise.hints },
          userAttempt: attemptText.trim() || undefined, hintsRevealed, mode, ...extraBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) setAiError(data.error || 'No se pudo generar la explicación.');
      else setAiExplanation(data.explanation);
    } catch { setAiError('No se pudo conectar.'); }
    finally { setAiLoading(false); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Steps — reduced for speed
  const steps = buildSteps(phase);
  const totalSteps = steps.length;
  const currentStep = steps[Math.min(step, totalSteps - 1)];

  function buildSteps(p: Phase): string[] {
    if (p === 'learn') return ['intro', 'problem', 'example', 'quiz', 'howto', 'allhelp', 'done'];
    if (p === 'practice') return ['intro', 'problem', 'example', 'quiz', 'code', 'help', 'solution', 'done'];
    return ['intro', 'problem', 'example', 'code', 'justify', 'review', 'compare', 'done'];
  }

  function getQuiz(): { question: string; correctAnswer: boolean; explanation: string } {
    const mistake = exercise.commonMistakes[0] || '';
    if (mistake.toLowerCase().includes('olvidar') || mistake.toLowerCase().includes('no ')) {
      return { question: mistake.replace(/^Olvidar /i, '¿Hace falta ').replace(/^No /i, '¿Hay que ') + '?', correctAnswer: true, explanation: mistake };
    }
    return { question: `¿Esto te suena? "${mistake.slice(0, 80)}${mistake.length > 80 ? '...' : ''}"`, correctAnswer: true, explanation: 'Exacto. Tenlo en cuenta.' };
  }

  const advance = () => { setShowStuckHint(false); setStep(s => Math.min(s + 1, totalSteps - 1)); };
  const goBack = () => setStep(s => Math.max(s - 1, 0));

  // Stuck detection on code step
  useEffect(() => {
    if (currentStep === 'code' && !attemptText.trim() && phase !== 'test') {
      stuckTimerRef.current = setTimeout(() => setShowStuckHint(true), 30000);
      return () => { if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current); };
    }
  }, [currentStep, attemptText, phase]);

  return (
    <div className="flex flex-col flex-1 items-center min-h-dvh px-5 py-6">
      <div className="w-full max-w-md flex flex-col flex-1">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-1">
          <button onClick={handleBack} className="text-sm text-gray-400 hover:text-foreground">← Salir</button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400">{formatTime(seconds)}</span>
            <span className="text-xs text-gray-400">{globalDone}/{EXERCISES.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div className={`h-full ${PHASE_COLOR[phase]} rounded-full transition-all duration-500 ease-out`} style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        {/* Step content */}
        <div className="flex-1 flex flex-col justify-center">

          {currentStep === 'intro' && (
            <Step>
              <p className="text-xs text-gray-400 mb-3">{block?.title}</p>
              <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
              <p className="text-base text-gray-500 mb-6">Modo examen. Sin ayudas, con timer.</p>
              <Btn onClick={advance}>Empezar</Btn>
            </Step>
          )}

          {currentStep === 'problem' && (
            <Step>
              <Label>Qué tienes que hacer</Label>
              <p className="text-base leading-relaxed whitespace-pre-wrap mb-6">{exercise.statement}</p>
              <Btn onClick={advance}>Entendido</Btn>
            </Step>
          )}

          {currentStep === 'example' && (
            <Step>
              <Label>Ejemplo</Label>
              <p className="text-sm text-muted-foreground mb-1">Le das:</p>
              <pre className="bg-muted rounded-2xl p-3 font-mono text-sm mb-4">{exercise.exampleInput}</pre>
              <p className="text-sm text-muted-foreground mb-1">Y muestra:</p>
              <pre className="bg-muted rounded-2xl p-3 font-mono text-sm mb-6">{exercise.exampleOutput}</pre>
              <Btn onClick={advance}>Vale</Btn>
            </Step>
          )}

          {currentStep === 'quiz' && (() => {
            const quiz = getQuiz();
            return (
              <Step>
                <Label>Piensa un momento</Label>
                <p className="text-base leading-relaxed mb-8">{quiz.question}</p>
                {quizAnswer === null ? (
                  <div className="flex gap-3">
                    <button onClick={() => setQuizAnswer(true)} className="flex-1 py-4 rounded-2xl border-2 text-base font-medium hover:bg-emerald-50 hover:border-emerald-300 transition-colors">Sí</button>
                    <button onClick={() => setQuizAnswer(false)} className="flex-1 py-4 rounded-2xl border-2 text-base font-medium hover:bg-red-50 hover:border-red-300 transition-colors">No</button>
                  </div>
                ) : (
                  <>
                    <div className={`rounded-2xl p-4 mb-6 ${quizAnswer === quiz.correctAnswer ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <p className={`text-base font-medium ${quizAnswer === quiz.correctAnswer ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {quizAnswer === quiz.correctAnswer ? randomEncouragement() : 'Fíjate:'}
                      </p>
                      <p className="text-sm mt-1">{quiz.explanation}</p>
                    </div>
                    <Btn onClick={() => { setQuizAnswer(null); advance(); }}>Seguir</Btn>
                  </>
                )}
              </Step>
            );
          })()}

          {/* LEARN: howto = pattern + mistakes merged */}
          {currentStep === 'howto' && (
            <Step>
              <Label>Cómo se resuelve</Label>
              <ol className="space-y-2 mb-6">
                {exercise.patternSteps.map((s, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm">{s}</span>
                  </li>
                ))}
              </ol>
              {exercise.commonMistakes.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 mb-6">
                  <p className="text-xs font-medium text-orange-700 mb-1">Ojo</p>
                  <p className="text-sm text-orange-800">{exercise.commonMistakes[0]}</p>
                </div>
              )}
              <Btn onClick={advance}>Seguir</Btn>
            </Step>
          )}

          {/* LEARN: allhelp = hints + pseudocode + solution */}
          {currentStep === 'allhelp' && (
            <Step>
              <Label>La solución completa</Label>
              {usefulHints.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3">
                  <p className="text-sm whitespace-pre-wrap">{usefulHints[0].content}</p>
                </div>
              )}
              <pre className="bg-muted rounded-2xl p-3 text-xs font-mono whitespace-pre-wrap overflow-x-auto mb-3">{exercise.pseudocode}</pre>
              <pre className="bg-zinc-900 text-zinc-100 rounded-2xl p-3 text-xs font-mono whitespace-pre-wrap overflow-x-auto mb-6">{exercise.solutionCode}</pre>
              <Btn onClick={advance}>Seguir</Btn>
            </Step>
          )}

          {currentStep === 'code' && (
            <Step>
              <Label>{phase === 'test' ? 'A por ello' : 'Tu turno'}</Label>
              <textarea value={attemptText} onChange={e => handleAttemptChange(e.target.value)}
                placeholder={"#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}"}
                className="w-full h-52 bg-card border-2 rounded-2xl p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-3" spellCheck={false} />
              {showStuckHint && !attemptText.trim() && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 mb-3">
                  <p className="text-sm text-indigo-800 mb-2">Sin prisa. ¿Te echo una mano?</p>
                  <button onClick={() => { setShowStuckHint(false); advance(); }} className="text-sm text-indigo-700 font-medium hover:underline">Sí, ayúdame</button>
                </div>
              )}
              <Btn onClick={advance} disabled={!attemptText.trim()}>
                {attemptText.trim() ? 'Seguir' : 'Escribe algo primero'}
              </Btn>
            </Step>
          )}

          {currentStep === 'help' && (
            <Step>
              <Label>¿Te echo una mano?</Label>
              <div className="space-y-2 mb-4">
                <button onClick={() => requestAI('explain')} className="w-full text-left px-4 py-4 border-2 rounded-2xl text-base hover:bg-indigo-50 hover:border-indigo-200 transition-colors">No lo pillo</button>
                <button onClick={() => requestAI('start')} className="w-full text-left px-4 py-4 border-2 rounded-2xl text-base hover:bg-indigo-50 hover:border-indigo-200 transition-colors">No sé por dónde empezar</button>
                {attemptText.trim() && <button onClick={() => requestAI('review')} className="w-full text-left px-4 py-4 border-2 rounded-2xl text-base hover:bg-indigo-50 hover:border-indigo-200 transition-colors">Mira lo que llevo</button>}
                {hintsRevealed < usefulHints.length && <button onClick={revealHint} className="w-full text-left px-4 py-4 border-2 rounded-2xl text-base hover:bg-amber-50 hover:border-amber-200 transition-colors">Dame una pista</button>}
              </div>
              {aiLoading && <p className="text-sm text-indigo-600 animate-pulse mb-3">Pensando...</p>}
              {aiError && <p className="text-sm text-red-600 mb-3">{aiError}</p>}
              {aiExplanation && <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-sm mb-3 whitespace-pre-wrap">{aiExplanation}</div>}
              {hintsRevealed > 0 && usefulHints.slice(0, hintsRevealed).map((h, i) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-sm mb-2 whitespace-pre-wrap">{h.content}</div>
              ))}
              <Btn onClick={advance}>Seguir</Btn>
            </Step>
          )}

          {currentStep === 'solution' && (
            <Step>
              {!solutionVisible ? (
                <>
                  <Label>¿Quieres ver la solución?</Label>
                  <div className="flex gap-2">
                    <Btn onClick={() => revealSolution()}>Sí, verla</Btn>
                    <button onClick={goBack} className="flex-1 py-3.5 rounded-2xl border-2 text-sm font-medium hover:bg-muted transition-colors">Volver a intentar</button>
                  </div>
                </>
              ) : (
                <>
                  <Label>Solución</Label>
                  <pre className="bg-zinc-900 text-zinc-100 rounded-2xl p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-6">{exercise.solutionCode}</pre>
                  <Btn onClick={advance}>Seguir</Btn>
                </>
              )}
            </Step>
          )}

          {currentStep === 'justify' && (
            <Step>
              <Label>¿Por qué lo has hecho así?</Label>
              <textarea value={justification} onChange={e => setJustification(e.target.value)}
                placeholder="He usado un for porque..."
                className="w-full h-28 bg-card border-2 rounded-2xl p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-4" spellCheck={false} />
              <Btn onClick={advance} disabled={!justification.trim()}>
                {justification.trim() ? 'Evaluar' : 'Escribe algo'}
              </Btn>
            </Step>
          )}

          {currentStep === 'review' && (
            <Step>
              <Label>Revisión</Label>
              {!aiExplanation && !aiLoading && !aiError && (
                <div className="space-y-2 mb-4">
                  <Btn onClick={() => requestAI('review', { userAttempt: `CÓDIGO:\n${attemptText}\n\nJUSTIFICACIÓN:\n${justification}` })}>Evaluar mi respuesta</Btn>
                  <button onClick={() => requestAI('exam_explain', { justification: justification.trim() })} className="w-full py-3.5 rounded-2xl border-2 text-sm font-medium hover:bg-muted transition-colors">¿Cómo lo explicaría en el examen?</button>
                </div>
              )}
              {aiLoading && <p className="text-sm text-purple-600 animate-pulse mb-4">Revisando...</p>}
              {aiError && <p className="text-sm text-red-600 mb-4">{aiError}</p>}
              {aiExplanation && <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-sm whitespace-pre-wrap mb-4">{aiExplanation}</div>}
              {(aiExplanation || aiError) && <Btn onClick={advance}>Seguir</Btn>}
            </Step>
          )}

          {currentStep === 'compare' && (
            <Step>
              <Label>Compara</Label>
              {!solutionVisible ? (
                <Btn onClick={revealSolution}>Ver solución</Btn>
              ) : (
                <>
                  <pre className="bg-zinc-900 text-zinc-100 rounded-2xl p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-6">{exercise.solutionCode}</pre>
                  <Btn onClick={advance}>Seguir</Btn>
                </>
              )}
            </Step>
          )}

          {currentStep === 'done' && (
            <Step>
              <div className="text-center">
                <p className="text-4xl mb-4">{phase === 'test' ? '📝' : phase === 'learn' ? '✓' : '💪'}</p>
                <h2 className="text-xl font-bold mb-2">
                  {phase === 'learn' ? 'Ejercicio estudiado' : phase === 'test' ? 'Terminado' : 'Buen trabajo'}
                </h2>

                {/* Understanding - only practice & test */}
                {phase !== 'learn' && (
                  <div className="flex gap-2 justify-center my-6">
                    {([
                      { value: 'good' as Understanding, emoji: '🟢', label: 'Bien' },
                      { value: 'medium' as Understanding, emoji: '🟡', label: 'Regular' },
                      { value: 'bad' as Understanding, emoji: '🔴', label: 'Flojo' },
                    ]).map(opt => (
                      <button key={opt.value}
                        onClick={() => {
                          setUnderstanding(opt.value);
                          updateProgress(exercise.slug, { understanding: opt.value, lastAttempt: new Date().toISOString() });
                          if (!dominated && attemptText.trim() && opt.value === 'good') {
                            setDominated(true);
                            updateProgress(exercise.slug, { status: 'dominated', lastAttempt: new Date().toISOString() });
                          }
                        }}
                        className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border-2 transition-colors ${understanding === opt.value ? 'bg-muted border-foreground/20' : 'hover:bg-muted/50'}`}>
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Next action - the ONE thing to do */}
                <div className="space-y-2 mt-4">
                  {phase === 'learn' ? (
                    <Btn onClick={() => onChangePhase('practice')}>Practicar ahora</Btn>
                  ) : nextExercise ? (
                    <Btn onClick={() => handleNavigate(nextExercise.slug)}>Siguiente ejercicio</Btn>
                  ) : (
                    <Btn onClick={handleBack}>Volver al bloque</Btn>
                  )}
                  {phase !== 'learn' && nextExercise && (
                    <button onClick={handleBack} className="w-full py-3 text-sm text-muted-foreground hover:text-foreground">Volver al bloque</button>
                  )}
                </div>
              </div>
            </Step>
          )}
        </div>

        {/* Back nav */}
        {step > 0 && currentStep !== 'done' && (
          <div className="flex justify-center pt-4">
            <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground">← Paso anterior</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col justify-center">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold mb-4">{children}</h2>;
}

function Btn({ children, onClick, disabled, className }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full py-3.5 rounded-2xl font-medium text-base transition-colors ${disabled ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-foreground text-background hover:bg-foreground/90'} ${className ?? ''}`}>
      {children}
    </button>
  );
}
