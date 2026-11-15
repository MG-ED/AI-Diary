import { useMemo, useState, type FormEvent } from 'react'
import { NotebookPen, Pencil, Pin, PinOff, Plus, Search, Trash2 } from 'lucide-react'
import { Button, Card, EmptyState, Field, Modal, inputCls } from '../components/ui'
import { useDiary } from '../context/DiaryContext'
import type { Key } from '../i18n'
import { timeAgo, uid } from '../lib/utils'
import type { Note } from '../types'

const tags = ['Personal', 'Work', 'Ideas']
// Tags are saved in English; only the label shown on screen is translated.
const tagLabel: Record<string, Key> = { All: 'tag.all', Personal: 'tag.personal', Work: 'tag.work', Ideas: 'tag.ideas' }
const blank = { title: '', body: '', tag: 'Personal' }

export default function Notes() {
  const { notes, setNotes, t } = useDiary()
  const tag = (name: string) => (tagLabel[name] ? t(tagLabel[name]) : name)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState<Note | 'new' | null>(null)
  const [draft, setDraft] = useState(blank)
  const [error, setError] = useState('')

  const shown = useMemo(() => {
    const q = query.toLowerCase()
    return notes
      .filter((n) => (filter === 'All' || n.tag === filter) && (n.title + n.body).toLowerCase().includes(q))
      .sort((a, b) => +b.pinned - +a.pinned || b.updatedAt.localeCompare(a.updatedAt))
  }, [notes, query, filter])

  const open = (n: Note | 'new') => {
    setDraft(n === 'new' ? blank : { title: n.title, body: n.body, tag: n.tag })
    setError('')
    setEditing(n)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    if (!draft.title.trim() && !draft.body.trim()) return setError(t('notes.errEmpty'))
    const updatedAt = new Date().toISOString()
    const title = draft.title.trim() || t('notes.untitled')
    setNotes((all) =>
      editing === 'new'
        ? [{ id: uid(), ...draft, title, pinned: false, updatedAt }, ...all]
        : all.map((n) => (n.id === (editing as Note).id ? { ...n, ...draft, title, updatedAt } : n)),
    )
    setEditing(null)
  }

  const pin = (id: string) => setNotes((all) => all.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
  const del = (n: Note) => window.confirm(t('notes.confirmDelete', { title: n.title })) && setNotes((all) => all.filter((x) => x.id !== n.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/60" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('notes.search')} aria-label={t('notes.search')} className={`${inputCls} pl-10`} />
        </div>
        <Button onClick={() => open('new')}><Plus className="size-4" aria-hidden="true" /> {t('notes.new')}</Button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t('notes.filterTag')}>
        {['All', ...tags].map((name) => (
          <button key={name} onClick={() => setFilter(name)} aria-pressed={filter === name} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === name ? 'bg-navy text-ivory dark:bg-ivory dark:text-navy' : 'border border-line bg-surface hover:border-ink/40'}`}>
            {tag(name)}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={notes.length === 0 ? t('notes.none') : t('notes.noMatch')}
          text={notes.length === 0 ? t('notes.noneText') : t('notes.noMatchText')}
          action={notes.length === 0 && <Button onClick={() => open('new')}>{t('notes.write')}</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((n) => (
            <Card key={n.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug">{n.title}</h3>
                {n.pinned && <Pin className="mt-0.5 size-4 shrink-0 text-ink/70" aria-label={t('notes.pinned')} />}
              </div>
              <p className="mt-2 line-clamp-5 flex-1 whitespace-pre-line text-sm leading-relaxed text-ink/75">{n.body}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-ink/70"><span className="rounded-full bg-sage/40 px-2 py-0.5 text-navy dark:text-ivory">{tag(n.tag)}</span> {timeAgo(n.updatedAt, t)}</span>
                <span className="flex shrink-0">
                  <button onClick={() => pin(n.id)} aria-label={n.pinned ? t('notes.unpin') : t('notes.pin')} className="rounded-full p-1.5 hover:bg-ink/10">{n.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}</button>
                  <button onClick={() => open(n)} aria-label={t('notes.edit')} className="rounded-full p-1.5 hover:bg-ink/10"><Pencil className="size-4" /></button>
                  <button onClick={() => del(n)} aria-label={t('notes.delete')} className="rounded-full p-1.5 hover:bg-ink/10"><Trash2 className="size-4" /></button>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={editing !== null} title={editing === 'new' ? t('notes.modalNew') : t('notes.modalEdit')} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="space-y-4">
          <Field label={t('notes.fieldTitle')}><input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label={t('notes.fieldNote')}><textarea className={`${inputCls} min-h-36`} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></Field>
          <Field label={t('notes.fieldTag')}>
            <select className={inputCls} value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })}>{tags.map((name) => <option key={name} value={name}>{tag(name)}</option>)}</select>
          </Field>
          {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>{t('notes.cancel')}</Button>
            <Button type="submit">{t('notes.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}