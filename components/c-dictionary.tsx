'use client'

import { useState, useEffect, useRef } from 'react'
import { DICTIONARY, CATEGORIES, type DictionaryItem } from '@/lib/c-dictionary'

const NOTES_KEY = 'c-dictionary-notes'

function loadNotes(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

export function CDictionary({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [openNote, setOpenNote] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNotes(loadNotes())
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const updateNote = (key: string, value: string) => {
    const next = { ...notes, [key]: value }
    if (!value.trim()) delete next[key]
    setNotes(next)
    saveNotes(next)
  }

  const filtered = DICTIONARY.filter(item => {
    const matchesSearch =
      !search ||
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      item.meaning.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const grouped = filtered.reduce<Record<string, DictionaryItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 transition-opacity" />

      {/* Panel */}
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-background h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 border-b border-gray-200 px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Diccionario de C</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-colors"
              aria-label="Cerrar diccionario"
            >
              ✕
            </button>
          </div>

          {/* Search */}
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar... (ej: printf, for, int)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
          />

          {/* Category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                !activeCategory
                  ? 'bg-foreground text-background'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todo
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-foreground text-background'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-6">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No se encontro nada para "{search}"</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory(null) }}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                Limpiar busqueda
              </button>
            </div>
          )}

          {CATEGORIES.filter(cat => grouped[cat]).map(cat => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {cat}
              </h3>
              <div className="space-y-3">
                {grouped[cat].map(item => (
                  <ItemCard
                    key={item.key}
                    item={item}
                    note={notes[item.key] || ''}
                    noteOpen={openNote === item.key}
                    onToggleNote={() =>
                      setOpenNote(openNote === item.key ? null : item.key)
                    }
                    onUpdateNote={val => updateNote(item.key, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            Pulsa <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px]">ESC</kbd> para cerrar
          </p>
        </div>
      </div>
    </div>
  )
}

function ItemCard({
  item,
  note,
  noteOpen,
  onToggleNote,
  onUpdateNote,
}: {
  item: DictionaryItem
  note: string
  noteOpen: boolean
  onToggleNote: () => void
  onUpdateNote: (val: string) => void
}) {
  return (
    <div className="bg-card rounded-2xl border-2 border-gray-100 p-4 shadow-sm">
      {/* Title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-base font-mono">{item.key}</h4>
        <button
          onClick={onToggleNote}
          className={`shrink-0 text-xs px-2 py-1 rounded-lg transition-colors ${
            note
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
          }`}
          title={note ? 'Tienes una nota' : 'Añadir nota'}
        >
          {note ? '📝 Nota' : '+ Nota'}
        </button>
      </div>

      {/* Meaning */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{item.meaning}</p>

      {/* Example */}
      <div className="bg-gray-900 text-gray-100 rounded-xl p-3 mb-2">
        <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {item.example}
        </pre>
      </div>

      {/* Example explanation */}
      <p className="text-xs text-gray-500 leading-relaxed italic">
        ↳ {item.exampleExplanation}
      </p>

      {/* Note */}
      {noteOpen && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Tu nota personal:
          </label>
          <textarea
            value={note}
            onChange={e => onUpdateNote(e.target.value)}
            placeholder="Escribe tu nota aqui..."
            rows={2}
            className="w-full text-sm p-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 placeholder:text-gray-300 focus:outline-none focus:border-amber-300 resize-none transition-colors"
          />
        </div>
      )}
    </div>
  )
}
