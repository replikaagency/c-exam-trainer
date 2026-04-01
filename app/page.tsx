'use client';

import { useState, useEffect } from 'react';
import { BLOCKS } from '@/lib/blocks';
import { EXERCISES, getExercisesByBlock } from '@/lib/exercises';
import { getAllProgress, getBlockProgress, getWeakBlocks, type ExerciseProgressData } from '@/lib/progress';
import { ExerciseView } from '@/components/exercise-view';
import { CDictionary } from '@/components/c-dictionary';
import type { ExerciseStatus } from '@/lib/types';

export type Phase = 'learn' | 'practice' | 'test';

const STATUS_LABELS: Record<ExerciseStatus, string> = {
  not_started: 'Por hacer',
  attempted: 'En progreso',
  with_hints: 'Con ayuda',
  dominated: 'Lo tengo',
};

const STATUS_COLORS: Record<ExerciseStatus, string> = {
  not_started: 'bg-gray-100 text-gray-500',
  attempted: 'bg-blue-100 text-blue-700',
  with_hints: 'bg-amber-100 text-amber-700',
  dominated: 'bg-emerald-100 text-emerald-700',
};

type View =
  | { type: 'home' }
  | { type: 'block'; blockId: number }
  | { type: 'phase-select'; slug: string }
  | { type: 'exercise'; slug: string; phase: Phase };

export default function Home() {
  const [view, setView] = useState<View>({ type: 'home' });
  const [progress, setProgress] = useState<Record<string, ExerciseProgressData>>({});
  const [showDictionary, setShowDictionary] = useState(false);

  useEffect(() => { setProgress(getAllProgress()); }, []);
  const refreshProgress = () => setProgress(getAllProgress());

  const dictionaryButton = (
    <button
      onClick={() => setShowDictionary(true)}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-foreground text-background shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center text-xl"
      aria-label="Abrir Diccionario de C"
      title="Diccionario de C"
    >
      📖
    </button>
  );

  const dictionaryPanel = showDictionary ? (
    <CDictionary onClose={() => setShowDictionary(false)} />
  ) : null;

  // ─── HOME ───
  if (view.type === 'home') {
    const doneCount = EXERCISES.filter(e => {
      const s = progress[e.slug]?.status;
      return s === 'dominated' || s === 'with_hints' || s === 'attempted';
    }).length;
    const pct = Math.round((doneCount / EXERCISES.length) * 100);

    return (
      <>
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-5 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">C desde C-RO</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Aprende C desde cero, paso a paso
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => setView({ type: 'exercise', slug: RECOMMENDED.learn[0].slug, phase: 'learn' })}
          className="w-full h-14 rounded-2xl bg-foreground text-background font-medium text-base hover:opacity-90 transition-opacity mb-6"
        >
          Empezar ahora
        </button>

        {/* How it works - 3 steps visual */}
        <div className="bg-card rounded-2xl shadow-sm p-5 mb-8">
          <p className="text-sm font-semibold mb-3">As\u00ed funciona</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-medium">Aprende</p>
                <p className="text-sm text-gray-500">Te lo explicamos todo paso a paso</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-medium">Practica</p>
                <p className="text-sm text-gray-500">Intentas resolverlo tu solo</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-medium">Demuestra</p>
                <p className="text-sm text-gray-500">Como en un examen real</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        {doneCount > 0 && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2 text-center">
              {doneCount} de {EXERCISES.length} ejercicios
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Weak blocks */}
        <WeakBlocksAlert progress={progress} />

        {/* Recommended */}
        <RecommendedPath progress={progress} onNavigate={(slug, phase) => setView({ type: 'exercise', slug, phase })} />

        {/* Blocks */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-1">Todos los temas</h2>
          {BLOCKS.map(block => {
            const exercises = getExercisesByBlock(block.id);
            const bp = getBlockProgress(block.id, exercises.map(e => e.slug));
            const blockPct = bp.total > 0 ? Math.round(((bp.dominated + bp.withHints) / bp.total) * 100) : 0;
            return (
              <button key={block.id} onClick={() => setView({ type: 'block', blockId: block.id })}
                className="w-full text-left bg-card rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base">{block.title}</h3>
                  {blockPct > 0 && <span className="text-xs text-gray-400">{blockPct}%</span>}
                </div>
                <p className="text-sm text-gray-500 mb-3">{block.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{exercises.length} ejercicios</span>
                  <span className="text-sm font-medium">Entrar →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {dictionaryButton}
      {dictionaryPanel}
      </>
    );
  }

  // ─── BLOCK VIEW ───
  if (view.type === 'block') {
    const block = BLOCKS.find(b => b.id === view.blockId)!;
    const exercises = getExercisesByBlock(view.blockId);
    return (
      <>
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-5 py-10">
        <button onClick={() => { refreshProgress(); setView({ type: 'home' }); }}
          className="text-sm text-gray-400 hover:text-foreground mb-6 self-start">← Volver</button>
        <h1 className="text-2xl font-bold mb-1">{block.title}</h1>
        <p className="text-base text-gray-500 mb-6">{block.description}</p>
        <div className="space-y-2">
          {exercises.map(ex => {
            const p = progress[ex.slug];
            const status: ExerciseStatus = p?.status ?? 'not_started';
            return (
              <button key={ex.slug} onClick={() => setView({ type: 'phase-select', slug: ex.slug })}
                className="w-full text-left bg-card rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base">{ex.title}</div>
                  <div className="text-sm text-gray-400 mt-0.5">~{ex.estimatedMinutes} min</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
              </button>
            );
          })}
        </div>
      </div>
      {dictionaryButton}
      {dictionaryPanel}
      </>
    );
  }

  // ─── PHASE SELECT ───
  if (view.type === 'phase-select') {
    const exercise = EXERCISES.find(e => e.slug === view.slug);
    if (!exercise) { setView({ type: 'home' }); return null; }
    const p = progress[exercise.slug];

    return (
      <>
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-5 py-10">
        <button onClick={() => setView({ type: 'block', blockId: exercise.blockId })}
          className="text-sm text-gray-400 hover:text-foreground mb-8 self-start">← Volver</button>

        <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
        <p className="text-base text-gray-500 mb-6">~{exercise.estimatedMinutes} min</p>

        <p className="text-sm text-gray-500 mb-3">Elige como quieres trabajar</p>

        <div className="space-y-3">
          {/* Learn */}
          <button onClick={() => setView({ type: 'exercise', slug: view.slug, phase: 'learn' })}
            className="w-full text-left bg-card rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="font-semibold text-base">Aprender</h3>
            </div>
            <p className="text-sm text-gray-500 ml-8">Te lo explicamos paso a paso, sin prisa</p>
          </button>

          {/* Practice */}
          <button onClick={() => setView({ type: 'exercise', slug: view.slug, phase: 'practice' })}
            className="w-full text-left bg-card rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="font-semibold text-base">Practicar</h3>
            </div>
            <p className="text-sm text-gray-500 ml-8">Intentas resolverlo. Ayuda si la necesitas</p>
          </button>

          {/* Test */}
          <button onClick={() => setView({ type: 'exercise', slug: view.slug, phase: 'test' })}
            className="w-full text-left bg-card rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="font-semibold text-base">Demostrar</h3>
            </div>
            <p className="text-sm text-gray-500 ml-8">Como en un examen. Sin ayudas, con timer</p>
          </button>
        </div>

        {p && p.status !== 'not_started' && (
          <p className="text-xs text-gray-400 text-center mt-4">
            Puedes empezar por cualquier fase
          </p>
        )}
      </div>
      {dictionaryButton}
      {dictionaryPanel}
      </>
    );
  }

  // ─── EXERCISE VIEW ───
  if (view.type === 'exercise') {
    return (
      <>
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
      {dictionaryButton}
      {dictionaryPanel}
      </>
    );
  }

  return null;
}

// ── Recommended path ──
const RECOMMENDED = {
  learn: [
    { slug: 'datos-personales', label: 'Tu primer programa' },
    { slug: 'corriente', label: 'Comprobar datos' },
    { slug: 'patron-numeros', label: 'Tu primer bucle' },
  ],
  practice: [
    { slug: 'cambio-divisas', label: 'Constantes' },
    { slug: 'ajuste-grados', label: 'M\u00f3dulo' },
    { slug: 'media-desviacion', label: 'Estad\u00edstica' },
    { slug: 'resistencias-colores', label: 'Switch' },
    { slug: 'estadisticas-array', label: 'Arrays' },
  ],
  test: [
    { slug: 'insertar-centro', label: 'D\u00edgitos' },
    { slug: 'cuatro-cuadrados', label: 'Lagrange' },
    { slug: 'centroide-poligono', label: 'Geometr\u00eda' },
  ],
};

function RecommendedPath({ progress, onNavigate }: { progress: Record<string, ExerciseProgressData>; onNavigate: (slug: string, phase: Phase) => void }) {
  const started = Object.values(progress).filter(p => p.status !== 'not_started').length;
  if (started > 8) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-1">Empieza por aqu\u00ed</h2>
      <p className="text-sm text-gray-500 mb-4">Sigue este orden. De menos a m\u00e1s.</p>

      <div className="space-y-3">
        {([
          { phase: 'learn' as Phase, label: 'Aprender', color: 'bg-emerald-100 text-emerald-700', items: RECOMMENDED.learn },
          { phase: 'practice' as Phase, label: 'Practicar', color: 'bg-blue-100 text-blue-700', items: RECOMMENDED.practice },
          { phase: 'test' as Phase, label: 'Demostrar', color: 'bg-purple-100 text-purple-700', items: RECOMMENDED.test },
        ]).map(group => (
          <div key={group.phase} className="bg-card rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${group.color}`}>{group.label}</span>
            </div>
            <div className="space-y-2">
              {group.items.map(item => {
                const ex = EXERCISES.find(e => e.slug === item.slug);
                if (!ex) return null;
                const done = progress[item.slug]?.status === 'dominated';
                return (
                  <button key={item.slug} onClick={() => onNavigate(item.slug, group.phase)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-base transition-colors ${done ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'hover:bg-gray-50 border-gray-200'}`}>
                    {done && '\u2713 '}{ex.title}
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

// ── Weak blocks ──
function WeakBlocksAlert({ progress }: { progress: Record<string, ExerciseProgressData> }) {
  const blockSlugs: Record<number, string[]> = {};
  for (const block of BLOCKS) {
    blockSlugs[block.id] = getExercisesByBlock(block.id).map(e => e.slug);
  }
  const weak = getWeakBlocks(blockSlugs);
  if (weak.length === 0) return null;
  const weakNames = weak.map(id => BLOCKS.find(b => b.id === id)?.title).filter(Boolean);

  return (
    <div className="bg-amber-50 rounded-2xl px-5 py-4 mb-6">
      <p className="text-sm text-amber-800">
        Te vendr\u00eda bien reforzar: <strong>{weakNames.join(', ')}</strong>
      </p>
    </div>
  );
}
