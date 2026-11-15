import { Link } from 'react-router-dom'
import { Check, ListChecks, MessageCircle, NotebookPen } from 'lucide-react'
import { Button, Card, EmptyState } from '../components/ui'
import { useDiary } from '../context/DiaryContext'
import { speechLocale } from '../i18n'
import { greeting, playTick, timeAgo } from '../lib/utils'
import type { Conversation, Note } from '../types'

function lastSevenDays(notes: Note[], conversations: Conversation[], locale: string) {
  const messages = conversations.flatMap((c) => c.messages)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toDateString()
    const count = notes.filter((n) => new Date(n.updatedAt).toDateString() === key).length + messages.filter((m) => new Date(m.at).toDateString() === key).length
    return { label: d.toLocaleDateString(locale, { weekday: 'short' }), count }
  })
}

export default function Dashboard() {
  const { profile, conversations, notes, tasks, setTasks, settings, lang, t, tn } = useDiary()
  const todays = tasks.filter((t) => t.when === 'today')
  const recentNotes = [...notes].sort((a, b) => +b.pinned - +a.pinned || b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)
  const recentChats = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)

  // Activity over the last 7 days, counted from entries stored on this device.
  const days = lastSevenDays(notes, conversations, speechLocale[lang])
  const max = Math.max(1, ...days.map((d) => d.count))

  const toggle = (id: string) => {
    const task = tasks.find((x) => x.id === id)
    if (task && !task.done && settings.sound) playTick(settings.volume)
    setTasks((all) => all.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium sm:text-4xl">{greeting(t)}, {profile.name || t('dash.fallbackName')}.</h2>
        <p className="mt-1 text-ink/70">{tn('dash.tasksLeft', todays.filter((x) => !x.done).length)} · {tn('dash.notes', notes.length)} · {tn('dash.chats', conversations.length)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold"><MessageCircle className="size-5" aria-hidden="true" /> {t('dash.recentChats')}</h3>
            <Link to="/app/chat" className="text-sm font-medium underline underline-offset-4">{t('dash.openChat')}</Link>
          </div>
          {recentChats.length === 0 ? (
            <EmptyState icon={MessageCircle} title={t('dash.noChats')} text={t('dash.noChatsText')} action={<Button to="/app/chat">{t('dash.startChat')}</Button>} />
          ) : (
            <ul className="divide-y divide-line">
              {recentChats.map((c) => (
                <li key={c.id}>
                  <Link to="/app/chat" state={{ id: c.id }} className="flex items-center justify-between gap-4 rounded-lg py-3 hover:bg-ink/5">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{c.title}</span>
                      <span className="block truncate text-sm text-ink/70">{c.messages.at(-1)?.text}</span>
                    </span>
                    <span className="shrink-0 text-xs text-ink/70">{timeAgo(c.updatedAt, t)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold"><ListChecks className="size-5" aria-hidden="true" /> {t('dash.todayTasks')}</h3>
          {todays.length === 0 ? (
            <p className="text-sm text-ink/70">{t('dash.noTodayTasks')} <Link to="/app/tasks" className="font-medium underline underline-offset-4">{t('dash.addTask')}</Link></p>
          ) : (
            <ul className="space-y-2">
              {todays.map((task) => (
                <li key={task.id}>
                  <button onClick={() => toggle(task.id)} className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left hover:bg-ink/5">
                    <span className={`grid size-5 shrink-0 place-items-center rounded-md border ${task.done ? 'border-ink bg-ink text-bg' : 'border-ink/40'}`}>{task.done && <Check className="size-3.5" />}</span>
                    <span className={task.done ? 'text-ink/50 line-through' : ''}>{task.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold"><NotebookPen className="size-5" aria-hidden="true" /> {t('dash.latestNotes')}</h3>
            <Link to="/app/notes" className="text-sm font-medium underline underline-offset-4">{t('dash.allNotes')}</Link>
          </div>
          {recentNotes.length === 0 ? (
            <EmptyState icon={NotebookPen} title={t('dash.noNotes')} text={t('dash.noNotesText')} action={<Button to="/app/notes">{t('dash.writeNote')}</Button>} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {recentNotes.map((n) => (
                <Link key={n.id} to="/app/notes" className="rounded-xl bg-bg p-4 hover:bg-sage/30">
                  <p className="line-clamp-1 font-medium">{n.title}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-ink/70">{n.body}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">{t('dash.activity')}</h3>
          <div className="flex h-28 items-end gap-2" role="img" aria-label={`${t('dash.entriesPerDay')}: ${days.map((d) => `${d.label} ${d.count}`).join(', ')}`}>
            {days.map((d, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full rounded-md bg-sage" style={{ height: `${Math.max(6, (d.count / max) * 100)}%` }} />
                </div>
                <span className="text-xs text-ink/70">{d.label.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}