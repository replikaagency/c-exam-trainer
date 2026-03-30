'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getExercise, getExercisesByBlock } from '@/lib/exercises';
import { BLOCKS } from '@/lib/blocks';
import { getProgress, updateProgress, type Understanding } from '@/lib/progress';
import type { Exercise } from '@/lib/types';
import type { Phase } from '@/app/page';

const PHASE_CONFIG: Record<Phase, { label: string; color: string; bg: string; border: string; message: string }> = {
  learn:    { label: 'Aprender',  color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', message: 'Estás aprendiendo. Todo está visible, sin presión. Lee, entiende y avanza cuando quieras.' },
  practice: { label: 'Practicar', color: 'text-blue-800',    bg: 'bg-blue-50',    border: 'border-blue-200',    message: 'Estás practicando. Intenta resolver por tu cuenta. La ayuda está ahí si la necesitas.' },
  test:     { label: 'Demostrar', color: 'text-purple-800',  bg: 'bg-purple-50',  border: 'border-purple-200',  message: 'Modo examen. Sin ayudas, con timer. Demuestra lo que sabes.' },
};

const DIFFICULTY_LABEL = ['', 'Introductorio', 'Básico', 'Intermedio', 'Avanzado', 'Desafiante'];

interface Props {
  slug: string;
  phase: Phase;
  onBack: () => void;
  onNavigate: (slug: string) => void;
  onChangePhase: (phase: Phase) => void;
}

export function ExerciseView({ slug, phase, onBack, onNavigate, onChangePhase }: Props) {
  const exercise = getExercise(slug);
  if (!exercise) return <div className="p-8">Ejercicio no encontrado.</div>;
  return <ExerciseContent exercise={exercise} phase={phase} onBack={onBack} onNavigate={onNavigate} onChangePhase={onChangePhase} />;
}

function ExerciseContent({ exercise, phase, onBack, onNavigate, onChangePhase }: { exercise: Exercise; phase: Phase; onBack: () => void; onNavigate: (slug: string) => void; onChangePhase: (phase: Phase) => void }) {
  const block = BLOCKS.find(b => b.id === exercise.blockId);
  const blockExercises = getExercisesByBlock(exercise.blockId);
  const currentIndex = blockExercises.findIndex(e => e.slug === exercise.slug);
  const prevExercise = currentIndex > 0 ? blockExercises[currentIndex - 1] : null;
  const nextExercise = currentIndex < blockExercises.length - 1 ? blockExercises[currentIndex + 1] : null;

  const pc = PHASE_CONFIG[phase];

  // State
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [pseudocodeVisible, setPseudocodeVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const [attemptText, setAttemptText] = useState('');
  const [dominated, setDominated] = useState(false);
  const [patternOpen, setPatternOpen] = useState(phase === 'learn');
  const [mistakesOpen, setMistakesOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [justification, setJustification] = useState('');
  const [understanding, setUnderstanding] = useState<Understanding | null>(null);

  // AI state
  const [aiMode, setAiMode] = useState<'explain' | 'start' | 'review'>('explain');
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiError, setAiError] = useState('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasEngaged = attemptText.trim().length > 0 || hintsRevealed > 0;

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
    setAiExplanation(''); setAiOpen(false); setAiError(''); setAiLoading(false);
    setJustification('');
    setPatternOpen(phase === 'learn');
  }, [exercise.slug, phase]);

  // Timer — only tick in practice and test
  useEffect(() => {
    if (phase === 'learn') return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

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

  const toggleDominated = () => {
    if (!dominated && !attemptText.trim()) return;
    const next = !dominated;
    setDominated(next);
    updateProgress(exercise.slug, {
      status: next ? 'dominated' : (hintsRevealed > 0 || solutionVisible ? 'with_hints' : attemptText.trim() ? 'attempted' : 'not_started'),
      lastAttempt: new Date().toISOString(),
    });
  };

  const requestExplanation = async (mode: 'explain' | 'start' | 'review') => {
    setAiMode(mode); setAiLoading(true); setAiError(''); setAiExplanation(''); setAiOpen(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: { title: exercise.title, blockId: exercise.blockId, difficulty: exercise.difficulty, pattern: exercise.pattern, patternSteps: exercise.patternSteps, statement: exercise.statement, concepts: exercise.concepts, hints: exercise.hints },
          userAttempt: attemptText.trim() || undefined, hintsRevealed, mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) setAiError(data.error || 'No se pudo generar la explicación.');
      else setAiExplanation(data.explanation);
    } catch { setAiError('No se pudo conectar. Comprueba tu conexión.'); }
    finally { setAiLoading(false); }
  };

  const requestJustificationReview = async () => {
    setAiMode('review'); setAiLoading(true); setAiError(''); setAiExplanation(''); setAiOpen(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: { title: exercise.title, blockId: exercise.blockId, difficulty: exercise.difficulty, pattern: exercise.pattern, patternSteps: exercise.patternSteps, statement: exercise.statement, concepts: exercise.concepts, hints: exercise.hints },
          userAttempt: `CÓDIGO:\n${attemptText}\n\nJUSTIFICACIÓN DEL ALUMNO:\n${justification}`,
          hintsRevealed: 0,
          mode: 'review',
        }),
      });
      const data = await res.json();
      if (!res.ok) setAiError(data.error || 'No se pudo revisar.');
      else setAiExplanation(data.explanation);
    } catch { setAiError('No se pudo conectar.'); }
    finally { setAiLoading(false); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const usefulHints = exercise.hints.filter(h => {
    const lower = h.content.toLowerCase();
    return !(lower.includes('ver solución completa') || lower.includes('ver código de solución'));
  });

  const canMarkDominated = attemptText.trim().length > 0;

  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full px-4 py-8">

      {/* ═══════ PHASE BANNER ═══════ */}
      <div className={`${pc.bg} ${pc.border} border rounded-lg px-4 py-2 mb-4 flex items-center justify-between`}>
        <p className={`text-sm ${pc.color}`}>{pc.message}</p>
        <div className="flex gap-1 ml-3 shrink-0">
          {(['learn', 'practice', 'test'] as Phase[]).map(p => (
            <button key={p} onClick={() => onChangePhase(p)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                p === phase ? PHASE_CONFIG[p].color + ' ' + PHASE_CONFIG[p].bg + ' ' + PHASE_CONFIG[p].border
                  : 'text-muted-foreground border-transparent hover:border-muted'
              }`}>
              {PHASE_CONFIG[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground">← Volver</button>
        <div className="flex items-center gap-3">
          {phase !== 'learn' && <span className="text-sm font-mono text-muted-foreground">{formatTime(seconds)}</span>}
          {phase !== 'test' && (
            <button onClick={toggleDominated} disabled={!canMarkDominated && !dominated}
              title={!canMarkDominated && !dominated ? 'Primero intenta escribir algo' : ''}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${dominated ? 'bg-green-100 text-green-800 border-green-300' : canMarkDominated ? 'text-muted-foreground hover:text-foreground hover:border-foreground/30' : 'text-muted-foreground/40 border-muted cursor-not-allowed'}`}>
              {dominated ? '✓ Lo tengo' : 'Ya lo domino'}
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-1">{block?.title} · {DIFFICULTY_LABEL[exercise.difficulty]} · ~{exercise.estimatedMinutes} min</div>
        <h1 className="text-xl font-bold mb-2">{exercise.title}</h1>
        {phase !== 'test' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900 mb-1">Qué vas a practicar</p>
            <p className="text-sm text-blue-800">{exercise.pattern}</p>
          </div>
        )}
      </div>

      {/* Statement */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2">El problema</h2>
        <div className="bg-card border rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">{exercise.statement}</div>
      </div>

      {/* Input/Output */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-2">Qué entra y qué sale</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">El programa recibe</p>
            <p className="text-sm">{exercise.inputSpec}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">El programa muestra</p>
            <p className="text-sm">{exercise.outputSpec}</p>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Ejemplo: si le das esto</p>
          <pre className="text-sm bg-muted rounded-lg p-2.5 font-mono">{exercise.exampleInput}</pre>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Tiene que mostrar esto</p>
          <pre className="text-sm bg-muted rounded-lg p-2.5 font-mono">{exercise.exampleOutput}</pre>
        </div>
      </div>

      {/* ═══════ LEARN: show everything open ═══════ */}
      {phase === 'learn' && (
        <>
          {/* Pattern — open by default */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-violet-900 mb-1">Patrón que vas a aprender</p>
            <p className="text-sm text-violet-800 mb-2">{exercise.pattern}</p>
            <ol className="text-sm space-y-1">
              {exercise.patternSteps.map((step, i) => (
                <li key={i} className="text-violet-800 flex gap-2">
                  <span className="font-mono text-xs text-violet-500 shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Mistakes — visible in learn */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-orange-900 mb-1">Trampas habituales</p>
            <p className="text-xs text-orange-700 mb-2">Cosas que le pasan a mucha gente en este tipo de problema:</p>
            <ul className="text-sm space-y-1.5">
              {exercise.commonMistakes.map((m, i) => (
                <li key={i} className="text-orange-800 flex gap-2"><span className="text-orange-400 shrink-0">→</span><span>{m}</span></li>
              ))}
            </ul>
          </div>

          {/* Full help ladder open */}
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-muted/30 px-4 py-2.5 border-b">
              <h2 className="text-sm font-semibold">Todo el contenido de ayuda</h2>
              <p className="text-xs text-muted-foreground">En modo Aprender puedes verlo todo sin penalización.</p>
            </div>
            <div className="p-4 border-b">
              <div className="text-sm font-medium mb-2">Pistas</div>
              <div className="space-y-2">
                {usefulHints.map((hint, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-amber-700 mb-1">{hint.label}</div>
                    <p className="text-sm whitespace-pre-wrap text-amber-900">{hint.content}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="text-sm font-medium mb-1">Pseudocódigo</div>
              <p className="text-xs text-muted-foreground mb-2">Esto no es C, pero te muestra la lógica sin preocuparte por la sintaxis.</p>
              <pre className="bg-muted rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">{exercise.pseudocode}</pre>
            </div>
            <div className="p-4">
              <div className="text-sm font-medium mb-1">Solución en C</div>
              <p className="text-xs text-muted-foreground mb-2">Estúdiala línea por línea. Fíjate en cómo se conecta con los pasos de arriba.</p>
              <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">{exercise.solutionCode}</pre>
            </div>
          </div>

          {/* AI in learn mode */}
          <div className="mb-6">
            {!aiOpen ? (
              <button onClick={() => requestExplanation('explain')}
                className="text-sm px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">
                Explícamelo con otras palabras
              </button>
            ) : (
              <AIPanel aiMode={aiMode} aiLoading={aiLoading} aiError={aiError} aiExplanation={aiExplanation}
                onClose={() => setAiOpen(false)} onRequest={requestExplanation} attemptText={attemptText} />
            )}
          </div>

          {/* Takeaway */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-green-900 mb-1">Qué te llevas</p>
            <p className="text-sm text-green-800">
              Has estudiado el patrón: <strong>{exercise.pattern}</strong>. Cuando estés listo, prueba este mismo ejercicio en modo Practicar.
            </p>
          </div>
        </>
      )}

      {/* ═══════ PRACTICE: current flow ═══════ */}
      {phase === 'practice' && (
        <>
          {/* Pattern — collapsible */}
          <div className="mb-6">
            <button onClick={() => setPatternOpen(!patternOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xs">{patternOpen ? '▼' : '▶'}</span> Antes de escribir código — piensa los pasos
            </button>
            {patternOpen && (
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mt-2">
                <p className="text-sm text-violet-900 mb-2">Este ejercicio sigue este patrón: <strong>{exercise.pattern}</strong></p>
                <ol className="text-sm space-y-1">
                  {exercise.patternSteps.map((step, i) => (
                    <li key={i} className="text-violet-800 flex gap-2"><span className="font-mono text-xs text-violet-500 shrink-0 mt-0.5">{i + 1}.</span><span>{step}</span></li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Attempt */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-1">Tu intento</h2>
            <p className="text-xs text-muted-foreground mb-2">No pasa nada si no sale a la primera. Escribe lo que puedas y luego usa la ayuda de abajo.</p>
            <textarea value={attemptText} onChange={e => handleAttemptChange(e.target.value)}
              placeholder={"#include <stdio.h>\n\nint main() {\n    // tu código aquí\n\n    return 0;\n}"}
              className="w-full h-48 bg-card border rounded-lg p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          </div>

          {/* AI buttons */}
          <div className="mb-6">
            {!aiOpen ? (
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => requestExplanation('explain')} className="text-sm px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">No entiendo el ejercicio</button>
                <button onClick={() => requestExplanation('start')} className="text-sm px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">No sé por dónde empezar</button>
                {attemptText.trim() && <button onClick={() => requestExplanation('review')} className="text-sm px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">Revisa mi intento</button>}
              </div>
            ) : (
              <AIPanel aiMode={aiMode} aiLoading={aiLoading} aiError={aiError} aiExplanation={aiExplanation}
                onClose={() => setAiOpen(false)} onRequest={requestExplanation} attemptText={attemptText} />
            )}
          </div>

          {/* Mistakes */}
          {hasEngaged && (
            <div className="mb-6">
              <button onClick={() => setMistakesOpen(!mistakesOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-xs">{mistakesOpen ? '▼' : '▶'}</span> Trampas habituales en este ejercicio
              </button>
              {mistakesOpen && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
                  <p className="text-xs text-orange-700 mb-2">Cosas que le pasan a mucha gente:</p>
                  <ul className="text-sm space-y-1.5">
                    {exercise.commonMistakes.map((m, i) => (
                      <li key={i} className="text-orange-800 flex gap-2"><span className="text-orange-400 shrink-0">→</span><span>{m}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Help ladder */}
          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="bg-muted/30 px-4 py-2.5 border-b">
              <h2 className="text-sm font-semibold">Ayuda paso a paso</h2>
              <p className="text-xs text-muted-foreground">Intenta llegar lo más lejos posible por tu cuenta.</p>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Pistas ({hintsRevealed}/{usefulHints.length})</div>
                {hintsRevealed < usefulHints.length && (
                  <button onClick={revealHint} className="text-sm px-3 py-1 border rounded-md hover:bg-muted transition-colors">
                    {hintsRevealed === 0 ? 'Dame una pista' : 'Necesito otra pista'}
                  </button>
                )}
              </div>
              {hintsRevealed > 0 && (
                <div className="space-y-2">
                  {usefulHints.slice(0, hintsRevealed).map((hint, i) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-amber-700 mb-1">{hint.label}</div>
                      <p className="text-sm whitespace-pre-wrap text-amber-900">{hint.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-b">
              {!pseudocodeVisible
                ? <button onClick={revealPseudocode} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><span className="text-xs">▶</span> Ver pseudocódigo</button>
                : <div><div className="text-sm font-medium mb-1">Pseudocódigo</div><pre className="bg-muted rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">{exercise.pseudocode}</pre></div>
              }
            </div>
            <div className="p-4">
              {!solutionVisible
                ? <button onClick={revealSolution} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"><span className="text-xs">▶</span> Ver la solución completa en C</button>
                : <div><div className="text-sm font-medium mb-1">Solución en C</div><p className="text-xs text-muted-foreground mb-2">Compara con tu intento.</p><pre className="bg-zinc-900 text-zinc-100 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">{exercise.solutionCode}</pre></div>
              }
            </div>
          </div>

          {/* Takeaway */}
          {(solutionVisible || dominated) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-green-900 mb-1">Qué te llevas</p>
              <p className="text-sm text-green-800">
                Has practicado: <strong>{exercise.pattern}</strong>.{' '}
                {exercise.concepts.length <= 4 ? `Conceptos: ${exercise.concepts.join(', ')}.` : `Conceptos: ${exercise.concepts.slice(0, 4).join(', ')}.`}
              </p>
              {!dominated && canMarkDominated && <p className="text-xs text-green-700 mt-2">Si lo resolverías sin ayuda, marca &quot;Ya lo domino&quot; arriba.</p>}
            </div>
          )}
        </>
      )}

      {/* ═══════ TEST: exam mode ═══════ */}
      {phase === 'test' && (
        <>
          {/* Attempt */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-1">Tu solución</h2>
            <p className="text-xs text-muted-foreground mb-2">Escribe tu código como si fuera un examen. Sin ayudas disponibles.</p>
            <textarea value={attemptText} onChange={e => handleAttemptChange(e.target.value)}
              placeholder={"#include <stdio.h>\n\nint main() {\n    \n\n    return 0;\n}"}
              className="w-full h-56 bg-card border rounded-lg p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          </div>

          {/* Justification */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-1">Explica por qué has hecho esto</h2>
            <p className="text-xs text-muted-foreground mb-2">Describe en tus palabras qué hace tu programa y por qué lo has estructurado así. Esto te ayuda a asentar lo aprendido.</p>
            <textarea value={justification} onChange={e => setJustification(e.target.value)}
              placeholder="He usado un for porque... La validación va primero porque... He elegido float porque..."
              className="w-full h-28 bg-card border rounded-lg p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          </div>

          {/* Submit for AI review */}
          {attemptText.trim() && justification.trim() && (
            <div className="mb-6">
              {!aiOpen ? (
                <button onClick={requestJustificationReview}
                  className="text-sm px-4 py-2 bg-purple-100 border border-purple-300 text-purple-800 rounded-md hover:bg-purple-200 transition-colors">
                  Evaluar mi respuesta
                </button>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-purple-900">Revisión</p>
                    <button onClick={() => setAiOpen(false)} className="text-xs text-purple-400 hover:text-purple-700 transition-colors">Cerrar</button>
                  </div>
                  {aiLoading && <p className="text-sm text-purple-600 animate-pulse">Revisando...</p>}
                  {aiError && <p className="text-sm text-red-700">{aiError}</p>}
                  {aiExplanation && <div className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed">{aiExplanation}</div>}
                </div>
              )}
            </div>
          )}

          {/* Exam explain button */}
          {attemptText.trim() && (
            <div className="mb-6">
              <button
                onClick={async () => {
                  setAiMode('review'); setAiLoading(true); setAiError(''); setAiExplanation(''); setAiOpen(true);
                  try {
                    const res = await fetch('/api/explain', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        exercise: { title: exercise.title, blockId: exercise.blockId, difficulty: exercise.difficulty, pattern: exercise.pattern, patternSteps: exercise.patternSteps, statement: exercise.statement, concepts: exercise.concepts, hints: exercise.hints },
                        userAttempt: attemptText.trim(), justification: justification.trim() || undefined,
                        mode: 'exam_explain',
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) setAiError(data.error || 'No se pudo generar.');
                    else setAiExplanation(data.explanation);
                  } catch { setAiError('No se pudo conectar.'); }
                  finally { setAiLoading(false); }
                }}
                className="text-sm px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
                ¿Cómo explicaría esto en el examen?
              </button>
            </div>
          )}

          {/* Reveal solution after attempt */}
          {attemptText.trim() && (
            <div className="mb-6">
              {!solutionVisible ? (
                <button onClick={revealSolution} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <span className="text-xs">▶</span> Terminé — ver la solución para comparar
                </button>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">Solución de referencia</div>
                  <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto">{exercise.solutionCode}</pre>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ═══════ UNDERSTANDING SEMAPHORE ═══════ */}
      {phase !== 'learn' && hasEngaged && (
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2">¿Cómo te has sentido con este ejercicio?</p>
          <div className="flex gap-2">
            {([
              { value: 'good' as Understanding, emoji: '🟢', label: 'Lo he entendido bien' },
              { value: 'medium' as Understanding, emoji: '🟡', label: 'Más o menos' },
              { value: 'bad' as Understanding, emoji: '🔴', label: 'No lo tengo claro' },
            ]).map(opt => (
              <button key={opt.value}
                onClick={() => {
                  setUnderstanding(opt.value);
                  updateProgress(exercise.slug, { understanding: opt.value, lastAttempt: new Date().toISOString() });
                }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-md transition-colors ${
                  understanding === opt.value
                    ? 'bg-muted border-foreground/20 font-medium'
                    : 'hover:bg-muted/50'
                }`}>
                <span>{opt.emoji}</span> {opt.label}
              </button>
            ))}
          </div>
          {understanding && (
            <p className="text-xs text-muted-foreground mt-1.5">
              {understanding === 'good' && 'Genial. Sigue avanzando.'}
              {understanding === 'medium' && 'Normal. Prueba a repetirlo otro día.'}
              {understanding === 'bad' && 'No pasa nada. Vuelve a modo Aprender y repásalo sin presión.'}
            </p>
          )}
        </div>
      )}

      {/* ═══════ NAVIGATION ═══════ */}
      <div className="flex items-center justify-between pt-4 border-t">
        {prevExercise ? <button onClick={() => handleNavigate(prevExercise.slug)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Anterior</button> : <div />}
        <span className="text-xs text-muted-foreground">{currentIndex + 1} de {blockExercises.length}</span>
        {nextExercise ? <button onClick={() => handleNavigate(nextExercise.slug)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Siguiente →</button> : <div />}
      </div>
    </div>
  );
}

// ── AI Panel component ──
function AIPanel({ aiMode, aiLoading, aiError, aiExplanation, onClose, onRequest, attemptText }: {
  aiMode: string; aiLoading: boolean; aiError: string; aiExplanation: string;
  onClose: () => void; onRequest: (mode: 'explain' | 'start' | 'review') => void; attemptText: string;
}) {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-indigo-900">
          {aiMode === 'explain' && 'Te lo explico'}
          {aiMode === 'start' && 'Por dónde empezar'}
          {aiMode === 'review' && 'Sobre tu intento'}
        </p>
        <button onClick={onClose} className="text-xs text-indigo-400 hover:text-indigo-700 transition-colors">Cerrar</button>
      </div>
      {aiLoading && <p className="text-sm text-indigo-600 animate-pulse">Pensando...</p>}
      {aiError && <p className="text-sm text-red-700">{aiError}</p>}
      {aiExplanation && <div className="text-sm text-indigo-900 whitespace-pre-wrap leading-relaxed">{aiExplanation}</div>}
      {!aiLoading && (aiExplanation || aiError) && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-indigo-200">
          <button onClick={() => onRequest('explain')} className="text-xs px-2 py-1 border border-indigo-300 rounded hover:bg-indigo-100 text-indigo-700 transition-colors">Explícamelo de otra forma</button>
          <button onClick={() => onRequest('start')} className="text-xs px-2 py-1 border border-indigo-300 rounded hover:bg-indigo-100 text-indigo-700 transition-colors">Dime por dónde empezar</button>
          {attemptText.trim() && <button onClick={() => onRequest('review')} className="text-xs px-2 py-1 border border-indigo-300 rounded hover:bg-indigo-100 text-indigo-700 transition-colors">Revisa mi código</button>}
        </div>
      )}
    </div>
  );
}
