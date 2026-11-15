import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, Mic, Plus, Send, Square, Trash2 } from 'lucide-react'
import { useDiary } from '../context/DiaryContext'
import { speechLocale } from '../i18n'
import { timeAgo, uid } from '../lib/utils'
import { getReply } from '../services/ai'
import type { Conversation, Message } from '../types'

interface Recognition {
  lang: string
  interimResults: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error?: string }) => void) | null
  start(): void
  stop(): void
}
type RecognitionCtor = new () => Recognition
const Speech = (window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor })
const RecognitionImpl = Speech.SpeechRecognition ?? Speech.webkitSpeechRecognition

const stamp = () => new Date().toISOString()

export default function Chat() {
  const { conversations, setConversations, lang, t } = useDiary()
  const location = useLocation()
  const [activeId, setActiveId] = useState<string | null>((location.state as { id?: string } | null)?.id ?? conversations[0]?.id ?? null)
  const [text, setText] = useState('')
  const [replying, setReplying] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const rec = useRef<Recognition | null>(null)
  const end = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLTextAreaElement>(null)
  const active = conversations.find((c) => c.id === activeId)

  // FIX: this effect used to `return end.current?.scrollIntoView(...)`. Browsers now return a
  // Promise from scrollIntoView, and React treats anything an effect returns as its cleanup
  // function, so it crashed with "destroy is not a function" and the whole page went blank.
  // The braces below make sure the effect returns nothing.
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [active?.messages.length, replying])

  useEffect(() => () => rec.current?.stop(), [])

  // Let the message box grow with what you type (up to its max height).
  useEffect(() => {
    const el = box.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  const patch = (id: string, fn: (c: Conversation) => Conversation) => setConversations((all) => all.map((c) => (c.id === id ? fn(c) : c)))

  async function send(e: FormEvent) {
    e.preventDefault()
    const value = text.trim()
    if (!value || replying) return
    rec.current?.stop()

    const now = stamp()
    const msg: Message = { id: uid(), role: 'user', text: value, at: now }
    const id = active ? active.id : uid()
    const history = [...(active?.messages ?? []), msg]
    if (active) {
      patch(id, (c) => ({ ...c, messages: [...c.messages, msg], updatedAt: now }))
    } else {
      setConversations((all) => [{ id, title: value.slice(0, 40), messages: [msg], updatedAt: now }, ...all])
      setActiveId(id)
    }
    setText('')
    setReplying(true)

    const answer = await getReply(history, lang)
    const at = stamp()
    patch(id, (c) => ({ ...c, updatedAt: at, messages: [...c.messages, { id: uid(), role: 'assistant', at, text: answer }] }))
    setReplying(false)
  }

  function toggleMic() {
    setVoiceError('')
    if (listening) return rec.current?.stop()
    if (!RecognitionImpl) return setVoiceError(t('chat.voiceUnsupported'))
    const r = new RecognitionImpl()
    r.lang = speechLocale[lang]
    r.interimResults = false
    r.onresult = (ev) => setText((prev) => `${prev} ${ev.results[0][0].transcript}`.trim())
    r.onerror = (ev) => {
      const code = ev.error
      setVoiceError(t(code === 'not-allowed' || code === 'service-not-allowed' ? 'chat.voiceDenied' : code === 'no-speech' ? 'chat.voiceNoSpeech' : 'chat.voiceFailed'))
    }
    r.onend = () => setListening(false)
    rec.current = r
    r.start()
    setListening(true)
  }

  const remove = (id: string) => {
    setConversations((all) => all.filter((c) => c.id !== id))
    if (id === activeId) setActiveId(null)
  }

  return (
    <div className="grid h-[calc(100dvh-8.5rem)] min-h-96 gap-4 lg:grid-cols-[18rem_1fr]">
      <aside className="flex min-h-0 flex-col rounded-2xl border border-line bg-surface max-lg:max-h-40">
        <button onClick={() => setActiveId(null)} className="m-3 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:opacity-90">
          <Plus className="size-4" aria-hidden="true" /> {t('chat.new')}
        </button>
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {conversations.length === 0 && <li className="px-3 py-4 text-sm text-ink/70">{t('chat.emptyList')}</li>}
          {conversations.map((c) => (
            <li key={c.id} className={`group flex items-center rounded-xl ${c.id === activeId ? 'bg-sage/40' : 'hover:bg-ink/5'}`}>
              <button onClick={() => setActiveId(c.id)} className="min-w-0 flex-1 px-3 py-2.5 text-left">
                <span className="block truncate text-sm font-medium">{c.title}</span>
                <span className="text-xs text-ink/70">{timeAgo(c.updatedAt, t)}</span>
              </button>
              <button onClick={() => remove(c.id)} aria-label={t('chat.delete', { title: c.title })} className="mr-2 rounded-full p-1.5 text-ink/60 opacity-0 hover:bg-ink/10 focus-visible:opacity-100 group-hover:opacity-100">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-h-0 flex-col rounded-2xl border border-line bg-surface">
        <p className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-xs text-ink/70">
          <Info className="size-4 shrink-0" aria-hidden="true" /> {t('chat.banner')}
        </p>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {!active || active.messages.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="font-display text-2xl">{t('chat.prompt')}</p>
                <p className="mt-1 text-sm text-ink/70">{t('chat.promptSub')}</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {active.messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
                  <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${m.role === 'user' ? 'rounded-br-md bg-navy text-ivory dark:bg-ivory dark:text-navy' : 'rounded-bl-md bg-bg'}`}>{m.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {replying && <p className="w-fit rounded-2xl rounded-bl-md bg-bg px-4 py-2.5 text-sm text-ink/70">{t('chat.writing')}</p>}
          <div ref={end} />
        </div>
        <form onSubmit={send} className="border-t border-line p-3">
          {voiceError && <p role="alert" className="mb-2 px-2 text-sm text-red-700 dark:text-red-300">{voiceError}</p>}
          <div className="flex items-end gap-2">
            <textarea
              ref={box}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && (e.preventDefault(), e.currentTarget.form?.requestSubmit())}
              rows={1}
              placeholder={listening ? t('chat.listening') : t('chat.placeholder')}
              aria-label={t('chat.message')}
              className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-bg px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-ink"
            />
            <button type="button" onClick={toggleMic} aria-label={listening ? t('chat.micStop') : t('chat.micStart')} aria-pressed={listening} className={`grid size-11 place-items-center rounded-full border border-line transition ${listening ? 'bg-ink text-bg' : 'hover:bg-ink/10'}`}>
              {listening ? <Square className="size-4" /> : <Mic className="size-5" />}
            </button>
            <button type="submit" disabled={!text.trim() || replying} aria-label={t('chat.send')} className="grid size-11 place-items-center rounded-full bg-ink text-bg transition hover:opacity-90 disabled:opacity-40">
              <Send className="size-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}