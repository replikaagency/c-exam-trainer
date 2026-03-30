'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getExercise, getExercisesByBlock } from '@/lib/exercises';
import { BLOCKS } from '@/lib/blocks';
import { getProgress, updateProgress, type Understanding } from '@/lib/progress';
import type { Exercise } from '@/lib/types';
import type { Phase } from '@/app/page';

const PHASE_LABEL: Record<Phase, string> = { learn: 'Aprender', practice: 'Practicar', test: 'Demostrar' };
const PHASE_COLOR: Record<Phase, string> = { learn: 'bg-emerald-500', practice: 'bg-blue-500', test: 'bg-purple-500' };

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
  return <StepFlow exercise={exercise} phase={phase} onBack={onBack} onNavigate={onNavigate} onChangePhase={onChangePhase} />;
}

// ════════════════════════════════════════════════
// STEP FLOW
// ════════════════════════════════════════════════

function StepFlow({ exercise, phase, onBack, onNavigate, onChangePhase }: { exercise: Exercise; phase: Phase; onBack: () => void; onNavigate: (slug: string) => void; onChangePhase: (phase: Phase) => void }) {
  const block = BLOCKS.find(b => b.id === exercise.blockId);
  const blockExercises = getExercisesByBlock(exercise.blockId);
  const currentIndex = blockExercises.findIndex(e => e.slug === exercise.slug);
  const nextExercise = currentIndex < blockExercises.length - 1 ? blockExercises[currentIndex + 1] : null;

  // All existing state
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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const usefulHints = exercise.hints.filter(h => {
    const lower = h.content.toLowerCase();
    return !(lower.includes('ver solución completa') || lower.includes('ver código de solución'));
  });

  // Load progress
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
    setStep(0);
    setQuizAnswer(null);
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

  // ── Define steps per phase ──
  const steps = buildSteps(phase);
  const totalSteps = steps.length;
  const currentStep = steps[Math.min(step, totalSteps - 1)];

  function buildSteps(p: Phase): string[] {
    if (p === 'learn') return ['intro', 'problem', 'example', 'quiz', 'pattern', 'mistakes', 'hints', 'pseudocode', 'solution', 'ai', 'takeaway'];
    if (p === 'practice') return ['intro', 'problem', 'example', 'quiz', 'think', 'code', 'help', 'solution', 'feeling'];
    return ['intro', 'problem', 'example', 'code', 'justify', 'review', 'compare', 'feeling'];
  }

  // Generate a quiz question from the first common mistake
  function getQuiz(): { question: string; correctAnswer: boolean; explanation: string } {
    const mistake = exercise.commonMistakes[0] || '';
    // Generate yes/no questions based on common mistake patterns
    if (mistake.toLowerCase().includes('olvidar') || mistake.toLowerCase().includes('no ')) {
      return {
        question: mistake.replace(/^Olvidar /i, '¿Hace falta ').replace(/^No /i, '¿Hay que ') + '?',
        correctAnswer: true,
        explanation: mistake,
      };
    }
    if (mistake.toLowerCase().includes('usar') && mistake.toLowerCase().includes('en vez de')) {
      return { question: '¿Sabrías decir cuál es la trampa más común aquí?', correctAnswer: false, explanation: mistake };
    }
    // Default: turn mistake into a challenge
    return {
      question: `¿Esto te suena? "${mistake.slice(0, 60)}${mistake.length > 60 ? '...' : ''}"`,
      correctAnswer: true,
      explanation: 'Exacto. Es una de las trampas más comunes en este tipo de ejercicio. Tenlo en cuenta.',
    };
  }

  const advance = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-dvh px-4 py-6">
      <div className="w-full max-w-md flex flex-col flex-1">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground">← Salir</button>
          <div className="flex items-center gap-2">
            {phase !== 'learn' && <span className="text-xs font-mono text-muted-foreground">{formatTime(seconds)}</span>}
            <span className="text-xs text-muted-foreground">{currentIndex + 1}/{blockExercises.length}</span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <div className={`h-full ${PHASE_COLOR[phase]} transition-all duration-300`} style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        {/* ── Step content ── */}
        <div className="flex-1 flex flex-col">

          {currentStep === 'intro' && (
            <StepCard>
              <p className="text-xs text-muted-foreground mb-2">{block?.title} · {exercise.estimatedMinutes} min</p>
              <h1 className="text-2xl font-bold mb-4">{exercise.title}</h1>
              <p className="text-base leading-relaxed mb-6">{exercise.pattern}</p>
              <div className="flex gap-1 mb-4">
                {(['learn', 'practice', 'test'] as Phase[]).map(p => (
                  <button key={p} onClick={() => onChangePhase(p)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${p === phase ? PHASE_COLOR[p] + ' text-white border-transparent' : 'text-muted-foreground hover:bg-muted'}`}>
                    {PHASE_LABEL[p]}
                  </button>
                ))}
              </div>
              <BigButton onClick={advance}>Empezar</BigButton>
            </StepCard>
          )}

          {currentStep === 'problem' && (
            <StepCard>
              <StepLabel>Esto es lo que tienes que hacer</StepLabel>
              <div className="text-sm leading-relaxed whitespace-pre-wrap mb-6">{exercise.statement}</div>
              <BigButton onClick={advance}>Entendido</BigButton>
            </StepCard>
          )}

          {currentStep === 'example' && (
            <StepCard>
              <StepLabel>Ejemplo</StepLabel>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Si le das esto:</p>
                <pre className="bg-muted rounded-lg p-3 font-mono text-sm">{exercise.exampleInput}</pre>
              </div>
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-1">Tiene que mostrar:</p>
                <pre className="bg-muted rounded-lg p-3 font-mono text-sm">{exercise.exampleOutput}</pre>
              </div>
              <BigButton onClick={advance}>Vale, lo veo</BigButton>
            </StepCard>
          )}

          {currentStep === 'quiz' && (() => {
            const quiz = getQuiz();
            return (
              <StepCard>
                <StepLabel>Antes de seguir...</StepLabel>
                <p className="text-base leading-relaxed mb-6">{quiz.question}</p>
                {quizAnswer === null ? (
                  <div className="flex gap-3">
                    <button onClick={() => setQuizAnswer(true)}
                      className="flex-1 py-4 rounded-xl border-2 text-base font-medium hover:bg-emerald-50 hover:border-emerald-300 transition-colors">Sí</button>
                    <button onClick={() => setQuizAnswer(false)}
                      className="flex-1 py-4 rounded-xl border-2 text-base font-medium hover:bg-red-50 hover:border-red-300 transition-colors">No</button>
                  </div>
                ) : (
                  <div>
                    <div className={`rounded-xl p-4 mb-4 ${quizAnswer === quiz.correctAnswer ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <p className={`text-sm font-medium mb-1 ${quizAnswer === quiz.correctAnswer ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {quizAnswer === quiz.correctAnswer ? 'Bien visto.' : 'No pasa nada, fíjate en esto:'}
                      </p>
                      <p className="text-sm">{quiz.explanation}</p>
                    </div>
                    <BigButton onClick={() => { setQuizAnswer(null); advance(); }}>Seguir</BigButton>
                  </div>
                )}
              </StepCard>
            );
          })()}

          {currentStep === 'pattern' && (
            <StepCard>
              <StepLabel>Cómo se resuelve</StepLabel>
              <p className="text-base text-muted-foreground mb-3">{exercise.pattern}</p>
              <ol className="space-y-2 mb-6">
                {exercise.patternSteps.map((s, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
              <BigButton onClick={advance}>Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'think' && (
            <StepCard>
              <StepLabel>Piensa antes de escribir</StepLabel>
              <p className="text-base text-muted-foreground mb-4">Repasa estos pasos en tu cabeza. No toques el teclado todavía.</p>
              <ol className="space-y-2 mb-6">
                {exercise.patternSteps.map((s, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
              <BigButton onClick={advance}>Vamos, a escribir</BigButton>
            </StepCard>
          )}

          {currentStep === 'mistakes' && (
            <StepCard>
              <StepLabel>Ojo con esto</StepLabel>
              <p className="text-base text-muted-foreground mb-3">Le pasa a casi todo el mundo:</p>
              <ul className="space-y-2 mb-6">
                {exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-orange-400 shrink-0 mt-0.5">→</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <BigButton onClick={advance}>Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'hints' && (
            <StepCard>
              <StepLabel>Pistas</StepLabel>
              <div className="space-y-2 mb-6">
                {usefulHints.map((hint, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">{hint.label}</p>
                    <p className="text-sm whitespace-pre-wrap">{hint.content}</p>
                  </div>
                ))}
              </div>
              <BigButton onClick={advance}>Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'pseudocode' && (
            <StepCard>
              <StepLabel>Pseudocódigo</StepLabel>
              <p className="text-xs text-muted-foreground mb-2">Esto no es C. Son los pasos sin preocuparte por la sintaxis.</p>
              <pre className="bg-muted rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-6">{exercise.pseudocode}</pre>
              <BigButton onClick={advance}>Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'solution' && (
            <StepCard>
              {phase === 'learn' ? (
                <>
                  <StepLabel>Solución en C</StepLabel>
                  <p className="text-xs text-muted-foreground mb-2">Estúdiala línea por línea.</p>
                  <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-6">{exercise.solutionCode}</pre>
                  <BigButton onClick={advance}>Seguir</BigButton>
                </>
              ) : (
                <>
                  <StepLabel>¿Necesitas ver la solución?</StepLabel>
                  {!solutionVisible ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Si quieres intentarlo más, vuelve atrás. Si ya terminaste, puedes ver la solución.</p>
                      <div className="flex gap-2">
                        <BigButton onClick={() => { revealSolution(); }}>Ver solución</BigButton>
                        <button onClick={goBack} className="flex-1 py-3 rounded-xl border text-sm hover:bg-muted transition-colors">Volver a intentar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mb-2">Compara con tu intento.</p>
                      <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-6">{exercise.solutionCode}</pre>
                      <BigButton onClick={advance}>Seguir</BigButton>
                    </>
                  )}
                </>
              )}
            </StepCard>
          )}

          {currentStep === 'code' && (
            <StepCard>
              <StepLabel>{phase === 'test' ? 'A por ello' : 'Tu turno'}</StepLabel>
              <p className="text-base text-muted-foreground mb-3">
                {phase === 'test' ? 'Sin ayudas. Tú solo.' : 'Escribe lo que te salga. Si te atascas, sigue al siguiente paso.'}
              </p>
              <textarea value={attemptText} onChange={e => handleAttemptChange(e.target.value)}
                placeholder={"#include <stdio.h>\n\nint main() {\n    \n\n    return 0;\n}"}
                className="w-full h-52 bg-card border rounded-xl p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-4" spellCheck={false} />
              <BigButton onClick={advance} disabled={!attemptText.trim()}>
                {attemptText.trim() ? 'Seguir' : 'Escribe algo primero'}
              </BigButton>
            </StepCard>
          )}

          {currentStep === 'help' && (
            <StepCard>
              <StepLabel>¿Te echo una mano?</StepLabel>
              <div className="space-y-2 mb-4">
                <button onClick={() => requestAI('explain')} className="w-full text-left px-4 py-4 border-2 rounded-xl text-base hover:bg-indigo-50 hover:border-indigo-200 transition-colors">No lo pillo</button>
                <button onClick={() => requestAI('start')} className="w-full text-left px-4 py-4 border-2 rounded-xl text-base hover:bg-indigo-50 hover:border-indigo-200 transition-colors">No sé ni por dónde empezar</button>
                {attemptText.trim() && <button onClick={() => requestAI('review')} className="w-full text-left px-4 py-4 border-2 rounded-xl text-base hover:bg-indigo-50 hover:border-indigo-200 transition-colors">Mira lo que llevo</button>}
                {hintsRevealed < usefulHints.length && <button onClick={revealHint} className="w-full text-left px-4 py-4 border-2 rounded-xl text-base hover:bg-amber-50 hover:border-amber-200 transition-colors">Dame una pista</button>}
                {!pseudocodeVisible && <button onClick={revealPseudocode} className="w-full text-left px-4 py-4 border-2 rounded-xl text-base hover:bg-muted transition-colors">Ver los pasos escritos</button>}
              </div>

              {/* Show revealed content */}
              {aiLoading && <p className="text-sm text-indigo-600 animate-pulse mb-3">Pensando...</p>}
              {aiError && <p className="text-sm text-red-600 mb-3">{aiError}</p>}
              {aiExplanation && <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm mb-3 whitespace-pre-wrap">{aiExplanation}</div>}
              {hintsRevealed > 0 && (
                <div className="space-y-2 mb-3">
                  {usefulHints.slice(0, hintsRevealed).map((h, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm whitespace-pre-wrap">{h.content}</div>
                  ))}
                </div>
              )}
              {pseudocodeVisible && <pre className="bg-muted rounded-xl p-3 text-sm font-mono whitespace-pre-wrap mb-3">{exercise.pseudocode}</pre>}

              <BigButton onClick={advance}>Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'justify' && (
            <StepCard>
              <StepLabel>¿Por qué lo has hecho así?</StepLabel>
              <p className="text-base text-muted-foreground mb-3">Explícalo como si se lo contaras a alguien.</p>
              <textarea value={justification} onChange={e => setJustification(e.target.value)}
                placeholder="He usado un for porque... La validación va primero porque..."
                className="w-full h-32 bg-card border rounded-xl p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring mb-4" spellCheck={false} />
              <BigButton onClick={advance} disabled={!justification.trim()}>
                {justification.trim() ? 'Evaluar' : 'Escribe tu explicación'}
              </BigButton>
            </StepCard>
          )}

          {currentStep === 'review' && (
            <StepCard>
              <StepLabel>Revisión</StepLabel>
              {!aiExplanation && !aiLoading && !aiError && (
                <div className="space-y-2 mb-4">
                  <button onClick={() => requestAI('review', { userAttempt: `CÓDIGO:\n${attemptText}\n\nJUSTIFICACIÓN:\n${justification}` })} className="w-full py-3 bg-purple-100 border border-purple-300 text-purple-800 rounded-xl text-sm hover:bg-purple-200 transition-colors">Evaluar mi respuesta</button>
                  <button onClick={() => requestAI('exam_explain', { justification: justification.trim() })} className="w-full py-3 border rounded-xl text-sm hover:bg-muted transition-colors">¿Cómo explicaría esto en el examen?</button>
                </div>
              )}
              {aiLoading && <p className="text-sm text-purple-600 animate-pulse mb-4">Revisando...</p>}
              {aiError && <p className="text-sm text-red-600 mb-4">{aiError}</p>}
              {aiExplanation && <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm whitespace-pre-wrap mb-4">{aiExplanation}</div>}
              {(aiExplanation || aiError) && <BigButton onClick={advance}>Seguir</BigButton>}
            </StepCard>
          )}

          {currentStep === 'compare' && (
            <StepCard>
              <StepLabel>Compara con la solución</StepLabel>
              {!solutionVisible ? (
                <div className="space-y-3">
                  <button onClick={revealSolution} className="w-full py-3 border rounded-xl text-sm hover:bg-muted transition-colors">Ver solución de referencia</button>
                </div>
              ) : (
                <pre className="bg-zinc-900 text-zinc-100 rounded-xl p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto mb-4">{exercise.solutionCode}</pre>
              )}
              <BigButton onClick={advance} className="mt-4">Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'ai' && (
            <StepCard>
              <StepLabel>¿Algo no te queda claro?</StepLabel>
              <button onClick={() => requestAI('explain')} className="w-full text-left px-4 py-3 border rounded-xl text-sm hover:bg-indigo-50 transition-colors mb-2">Explícamelo con otras palabras</button>
              {aiLoading && <p className="text-sm text-indigo-600 animate-pulse mb-3">Pensando...</p>}
              {aiError && <p className="text-sm text-red-600 mb-3">{aiError}</p>}
              {aiExplanation && <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm mb-3 whitespace-pre-wrap">{aiExplanation}</div>}
              <BigButton onClick={advance}>Seguir</BigButton>
            </StepCard>
          )}

          {currentStep === 'takeaway' && (
            <StepCard>
              <div className="text-center py-4">
                <p className="text-3xl mb-4">✓</p>
                <h2 className="text-xl font-bold mb-2">Ejercicio completado</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Has estudiado: <strong>{exercise.pattern}</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-6">Cuando estés listo, pruébalo en modo Practicar.</p>
                <div className="space-y-2">
                  <BigButton onClick={() => onChangePhase('practice')}>Practicar ahora</BigButton>
                  {nextExercise && <button onClick={() => handleNavigate(nextExercise.slug)} className="w-full py-3 border rounded-xl text-sm hover:bg-muted transition-colors">Siguiente: {nextExercise.title}</button>}
                  <button onClick={handleBack} className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Volver al bloque</button>
                </div>
              </div>
            </StepCard>
          )}

          {currentStep === 'feeling' && (
            <StepCard>
              <div className="text-center py-4">
                <p className="text-3xl mb-4">{phase === 'test' ? '📝' : '💪'}</p>
                <h2 className="text-xl font-bold mb-2">{phase === 'test' ? 'Ejercicio terminado' : 'Buen trabajo'}</h2>
                <p className="text-sm text-muted-foreground mb-6">¿Cómo te has sentido?</p>
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
                        if (!dominated && attemptText.trim() && opt.value === 'good') {
                          setDominated(true);
                          updateProgress(exercise.slug, { status: 'dominated', lastAttempt: new Date().toISOString() });
                        }
                      }}
                      className={`flex flex-col items-center gap-1 px-5 py-3 border rounded-xl transition-colors ${understanding === opt.value ? 'bg-muted border-foreground/20' : 'hover:bg-muted/50'}`}>
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
                {understanding && (
                  <p className="text-xs text-muted-foreground mb-4">
                    {understanding === 'good' && 'Genial. Sigue avanzando.'}
                    {understanding === 'medium' && 'Está bien. Prueba a repetirlo otro día.'}
                    {understanding === 'bad' && 'No pasa nada. Repásalo en modo Aprender.'}
                  </p>
                )}
                <div className="space-y-2">
                  {nextExercise && <BigButton onClick={() => handleNavigate(nextExercise.slug)}>Siguiente: {nextExercise.title}</BigButton>}
                  <button onClick={handleBack} className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Volver al bloque</button>
                </div>
              </div>
            </StepCard>
          )}
        </div>

        {/* ── Step navigation dots ── */}
        {step > 0 && step < totalSteps - 1 && (
          <div className="flex justify-center pt-4">
            <button onClick={goBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Paso anterior</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── UI primitives ──
function StepCard({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col justify-center">{children}</div>;
}

function StepLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold mb-3">{children}</h2>;
}

function BigButton({ children, onClick, disabled, className }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full py-3.5 rounded-xl font-medium text-sm transition-colors ${disabled ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-foreground text-background hover:bg-foreground/90'} ${className ?? ''}`}>
      {children}
    </button>
  );
}
