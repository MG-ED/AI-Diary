import { useState, type FormEvent } from 'react'
import { Check, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, Card, EmptyState, inputCls } from '../components/ui'
import { useDiary } from '../context/DiaryContext'
import type { Key } from '../i18n'
import { playTick, uid } from '../lib/utils'
import type { Task } from '../types'

const filters = ['all', 'today', 'upcoming', 'done'] as const
type Filter = (typeof filters)[number]
const filterLabel: Record<Filter, Key> = { all: 'tasks.fAll', today: 'tasks.fToday', upcoming: 'tasks.fUpcoming', done: 'tasks.fDone' }

export default function Tasks() {
  const { tasks, setTasks, settings, t } = useDiary()
  const [filter, setFilter] = useState<Filter>('all')
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState<Task['when']>('today')
  const [error, setError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const shown = tasks.filter((x) => (filter === 'all' ? true : filter === 'done' ? x.done : !x.done && x.when === filter))

  function add(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return setError(t('tasks.errName'))
    setError('')
    setTasks((all) => [{ id: uid(), title: title.trim(), done: false, when }, ...all])
    setTitle('')
  }

  const toggle = (task: Task) => {
    if (!task.done && settings.sound) playTick(settings.volume)
    setTasks((all) => all.map((x) => (x.id === task.id ? { ...x, done: !x.done } : x)))
  }

  function saveEdit(id: string) {
    if (editText.trim()) setTasks((all) => all.map((x) => (x.id === id ? { ...x, title: editText.trim() } : x)))
    setEditId(null)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <form onSubmit={add} noValidate>
        <div className="flex flex-wrap gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('tasks.placeholder')} aria-label={t('tasks.name')} className={`${inputCls} min-w-48 flex-1`} />
          <select value={when} onChange={(e) => setWhen(e.target.value as Task['when'])} aria-label={t('tasks.when')} className={`${inputCls} w-auto`}>
            <option value="today">{t('tasks.today')}</option>
            <option value="upcoming">{t('tasks.upcoming')}</option>
          </select>
          <Button type="submit"><Plus className="size-4" aria-hidden="true" /> {t('tasks.add')}</Button>
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>}
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t('tasks.filterLabel')}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f ? 'bg-navy text-ivory dark:bg-ivory dark:text-navy' : 'border border-line bg-surface hover:border-ink/40'}`}>
            {t(filterLabel[f])}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={ListChecks} title={tasks.length === 0 ? t('tasks.none') : t('tasks.noFiltered')} text={tasks.length === 0 ? t('tasks.noneText') : t('tasks.noFilteredText')} />
      ) : (
        <Card className="p-2">
          <ul className="divide-y divide-line">
            {shown.map((task) => (
              <li key={task.id} className="flex items-center gap-3 px-3 py-3">
                <button onClick={() => toggle(task)} role="checkbox" aria-checked={task.done} aria-label={t(task.done ? 'tasks.markUndone' : 'tasks.markDone', { title: task.title })} className={`grid size-5 shrink-0 place-items-center rounded-md border ${task.done ? 'border-ink bg-ink text-bg' : 'border-ink/40 hover:border-ink'}`}>
                  {task.done && <Check className="size-3.5" />}
                </button>
                {editId === task.id ? (
                  <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={() => saveEdit(task.id)} onKeyDown={(e) => (e.key === 'Enter' ? saveEdit(task.id) : e.key === 'Escape' && setEditId(null))} aria-label={t('tasks.edit')} className={`${inputCls} py-1.5`} />
                ) : (
                  <>
                    <span className={`flex-1 ${task.done ? 'text-ink/50 line-through' : ''}`}>{task.title}</span>
                    <span className="text-xs text-ink/70">{task.when === 'today' ? t('tasks.today') : t('tasks.upcoming')}</span>
                    <button onClick={() => (setEditId(task.id), setEditText(task.title))} aria-label={t('tasks.edit')} className="rounded-full p-1.5 hover:bg-ink/10"><Pencil className="size-4" /></button>
                    <button onClick={() => setTasks((all) => all.filter((x) => x.id !== task.id))} aria-label={t('tasks.delete')} className="rounded-full p-1.5 hover:bg-ink/10"><Trash2 className="size-4" /></button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}