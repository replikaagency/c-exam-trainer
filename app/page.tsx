'use client';

import { useState, useEffect } from 'react';
import { BLOCKS } from '@/lib/blocks';
import { EXERCISES, getExercisesByBlock } from '@/lib/exercises';
import { getAllProgress, getBlockProgress, getWeakBlocks, type ExerciseProgressData } from '@/lib/progress';
import { ExerciseView } from '@/components/exercise-view';
import { Badge } from '@/components/ui/badge';
import type { ExerciseStatus } from '@/lib/types';

export type Phase = 'learn' | 'practice' | 'test';

const STATUS_LABELS: Record<ExerciseStatus, string> = {
  not_started: 'Por hacer',
  attempted: 'En progreso',
  with_hints: 'Con ayuda',
  dominated: 'Lo tengo',
};

const STATUS_COLORS: Record<ExerciseStatus, string> = {
  not_started: 'bg-muted text-muted-foreground',
  attempted: 'bg-blue-100 text-blue-800',
  with_hints: 'bg-amber-100 text-amber-800',
  dominated: 'bg-green-100 text-green-800',
};

const DIFFICULTY_LABEL = (d: number) => {
  const labels = ['', 'Introductorio', 'Básico', 'Intermedio', 'Avanzado', 'Desafiante'];
  return labels[d] || '';
};

const PHASE_INFO: Record<Phase, { label: string; color: string; desc: string }> = {
  learn:    { label: 'Aprender',  color: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'Entiende el ejercicio sin presión. Todo abierto.' },
  practice: { label: 'Practicar', color: 'bg-blue-100 text-blue-800 border-blue-300', desc: 'Intenta resolverlo. Ayuda disponible si la necesitas.' },
  test:     { label: 'Demostrar', color: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'Como en un examen. Sin ayudas, con timer.' },
};

type View =
  | { type: 'home' }
  | { type: 'block'; blockId: number }
  | { type: 'phase-select'; slug: string }
  | { type: 'exercise'; slug: string; phase: Phase };

export default function Home() {
  const [view, setView] = useState<View>({ type: 'home' });
  const [progress, setProgress] = useState<Record<string, ExerciseProgressData>>({});

  useEffect(() => { setProgress(getAllProgress()); }, []);
  const refreshProgress = () => setProgress(getAllProgress());

  // ─── HOME ───
  if (view.type === 'home') {
    const dominatedCount = EXERCISES.filter(e => progress[e.slug]?.status === 'dominated').length;

    return (
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Aprende C paso a paso</h1>
          <p className="text-muted-foreground mt-1">
            {dominatedCount === 0
              ? `${EXERCISES.length} ejercicios organizados de menor a mayor dificultad. Empieza por el Bloque 1.`
              : `Llevas ${dominatedCount} de ${EXERCISES.length} ejercicios. Sigue así.`}
          </p>
        </header>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6 text-sm">
          {(['dominated', 'with_hints', 'attempted', 'not_started'] as ExerciseStatus[]).map(s => {
            const count = EXERCISES.filter(e => (progress[e.slug]?.status ?? 'not_started') === s).length;
            if (count === 0) return null;
            return (
              <span key={s} className="flex items-center gap-1.5">
                <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLORS[s].split(' ')[0]}`} />
                {count} {STATUS_LABELS[s].toLowerCase()}
              </span>
            );
          })}
        </div>

        {/* Recommended path */}
        <RecommendedPath progress={progress} onNavigate={(slug, phase) => setView({ type: 'exercise', slug, phase })} />

        {/* Weak blocks alert */}
        <WeakBlocksAlert progress={progress} />

        <div className="flex flex-col gap-3">
          {BLOCKS.map(block => {
            const exercises = getExercisesByBlock(block.id);
            const bp = getBlockProgress(block.id, exercises.map(e => e.slug));
            const pct = bp.total > 0 ? Math.round(((bp.dominated + bp.withHints) / bp.total) * 100) : 0;
            return (
              <button key={block.id} onClick={() => setView({ type: 'block', blockId: block.id })}
                className="text-left border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold">{block.title}</h2>
                  <span className="text-sm text-muted-foreground">{exercises.length} ejercicios</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{block.description}</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
                {(bp.dominated > 0 || bp.withHints > 0 || bp.attempted > 0) && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-muted-foreground">
                    {bp.dominated > 0 && <span>{bp.dominated} completados</span>}
                    {bp.withHints > 0 && <span>{bp.withHints} con ayuda</span>}
                    {bp.attempted > 0 && <span>{bp.attempted} en progreso</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── BLOCK VIEW ───
  if (view.type === 'block') {
    const block = BLOCKS.find(b => b.id === view.blockId)!;
    const exercises = getExercisesByBlock(view.blockId);
    return (
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-4 py-8">
        <button onClick={() => { refreshProgress(); setView({ type: 'home' }); }}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 self-start">← Todos los bloques</button>
        <header className="mb-6">
          <h1 className="text-xl font-bold">{block.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{block.description}</p>
        </header>
        <div className="flex flex-col gap-2">
          {exercises.map(ex => {
            const p = progress[ex.slug];
            const status: ExerciseStatus = p?.status ?? 'not_started';
            return (
              <button key={ex.slug} onClick={() => setView({ type: 'phase-select', slug: ex.slug })}
                className="text-left border rounded-lg p-3 hover:bg-muted/50 transition-colors flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{ex.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{DIFFICULTY_LABEL(ex.difficulty)} · ~{ex.estimatedMinutes} min</div>
                </div>
                <Badge variant="secondary" className={`text-xs shrink-0 ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</Badge>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── PHASE SELECT ───
  if (view.type === 'phase-select') {
    const exercise = EXERCISES.find(e => e.slug === view.slug);
    if (!exercise) { setView({ type: 'home' }); return null; }
    const block = BLOCKS.find(b => b.id === exercise.blockId);

    return (
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-4 py-8">
        <button onClick={() => setView({ type: 'block', blockId: exercise.blockId })}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 self-start">← Volver</button>

        <h1 className="text-xl font-bold mb-1">{exercise.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {block?.title} · {DIFFICULTY_LABEL(exercise.difficulty)} · ~{exercise.estimatedMinutes} min
        </p>

        <h2 className="text-sm font-semibold mb-3">Elige cómo quieres trabajar este ejercicio</h2>

        <div className="flex flex-col gap-3">
          {(['learn', 'practice', 'test'] as Phase[]).map(phase => {
            const info = PHASE_INFO[phase];
            return (
              <button key={phase}
                onClick={() => setView({ type: 'exercise', slug: view.slug, phase })}
                className="text-left border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${info.color}`}>{info.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{info.desc}</p>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          No hay orden obligatorio. Puedes empezar por donde quieras y cambiar en cualquier momento.
        </p>
      </div>
    );
  }

  // ─── EXERCISE VIEW ───
  if (view.type === 'exercise') {
    return (
      <ExerciseView
        slug={view.slug}
        phase={view.phase}
        onBack={() => {
          refreshProgress();
          setView({ type: 'phase-select', slug: view.slug });
        }}
        onNavigate={(newSlug) => {
          refreshProgress();
          setView({ type: 'exercise', slug: newSlug, phase: view.phase });
        }}
        onChangePhase={(phase) => {
          setView({ type: 'exercise', slug: view.slug, phase });
        }}
      />
    );
  }

  return null;
}

// ── Recommended learning path ──
const RECOMMENDED = {
  learn: [
    { slug: 'datos-personales', reason: 'Tu primer programa en C' },
    { slug: 'corriente', reason: 'Validar datos con if/else' },
    { slug: 'patron-numeros', reason: 'Tu primer bucle for' },
  ],
  practice: [
    { slug: 'cambio-divisas', reason: 'Constantes y fórmulas' },
    { slug: 'ajuste-grados', reason: 'Módulo con negativos' },
    { slug: 'media-desviacion', reason: 'Centinela y estadística' },
    { slug: 'resistencias-colores', reason: 'Switch con caracteres' },
    { slug: 'estadisticas-array', reason: 'Arrays y recorrido' },
  ],
  test: [
    { slug: 'insertar-centro', reason: 'Manipulación de dígitos' },
    { slug: 'cuatro-cuadrados', reason: 'Fuerza bruta (Lagrange)' },
    { slug: 'centroide-poligono', reason: 'Geometría con arrays' },
  ],
};

function RecommendedPath({ progress, onNavigate }: { progress: Record<string, ExerciseProgressData>; onNavigate: (slug: string, phase: Phase) => void }) {
  // Don't show if user has already done 5+ exercises
  const started = Object.values(progress).filter(p => p.status !== 'not_started').length;
  if (started > 5) return null;

  return (
    <div className="border rounded-lg p-4 mb-6 bg-muted/20">
      <h2 className="text-sm font-semibold mb-1">Empieza por aquí (recomendado)</h2>
      <p className="text-xs text-muted-foreground mb-3">Una ruta guiada de 11 ejercicios clave. No es obligatoria — puedes explorar libremente.</p>

      <div className="space-y-3">
        {([
          { phase: 'learn' as Phase, label: 'Aprender', color: 'text-emerald-700', items: RECOMMENDED.learn },
          { phase: 'practice' as Phase, label: 'Practicar', color: 'text-blue-700', items: RECOMMENDED.practice },
          { phase: 'test' as Phase, label: 'Demostrar', color: 'text-purple-700', items: RECOMMENDED.test },
        ]).map(group => (
          <div key={group.phase}>
            <p className={`text-xs font-semibold ${group.color} mb-1`}>{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map(item => {
                const ex = EXERCISES.find(e => e.slug === item.slug);
                if (!ex) return null;
                const done = progress[item.slug]?.status === 'dominated';
                return (
                  <button key={item.slug} onClick={() => onNavigate(item.slug, group.phase)}
                    className={`text-xs px-2.5 py-1 border rounded-md transition-colors ${done ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-muted'}`}>
                    {done && '✓ '}{ex.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weak blocks detection ──
function WeakBlocksAlert({ progress }: { progress: Record<string, ExerciseProgressData> }) {
  const blockSlugs: Record<number, string[]> = {};
  for (const block of BLOCKS) {
    blockSlugs[block.id] = getExercisesByBlock(block.id).map(e => e.slug);
  }

  const weak = getWeakBlocks(blockSlugs);
  if (weak.length === 0) return null;

  const weakNames = weak.map(id => BLOCKS.find(b => b.id === id)?.title).filter(Boolean);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
      <p className="text-sm text-amber-800">
        Te vendría bien reforzar: <strong>{weakNames.join(', ')}</strong>.
        Prueba a repetir esos ejercicios en modo Aprender.
      </p>
    </div>
  );
}
