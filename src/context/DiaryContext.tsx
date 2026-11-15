import { createContext, useContext, useEffect, useMemo, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sampleConversations, sampleNotes, sampleProfile, sampleSettings, sampleTasks } from '../data/sample'
import { isLang, translate, translatePlural, type Lang, type TFn, type TnFn } from '../i18n'
import type { Conversation, Note, Profile, Settings, Task } from '../types'

type Setter<T> = Dispatch<SetStateAction<T>>
interface Diary {
  notes: Note[]
  setNotes: Setter<Note[]>
  tasks: Task[]
  setTasks: Setter<Task[]>
  conversations: Conversation[]
  setConversations: Setter<Conversation[]>
  profile: Profile
  setProfile: Setter<Profile>
  settings: Settings
  setSettings: Setter<Settings>
  resetData: () => void
  /** Current UI language, always one of the supported languages. */
  lang: Lang
  /** Translate a key into the current language. */
  t: TFn
  /** Translate a singular/plural pair, e.g. tn('dash.notes', 3). */
  tn: TnFn
}

const DiaryContext = createContext<Diary | null>(null)

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useLocalStorage('ed-diary:notes', sampleNotes)
  const [tasks, setTasks] = useLocalStorage('ed-diary:tasks', sampleTasks)
  const [conversations, setConversations] = useLocalStorage('ed-diary:chats', sampleConversations)
  const [profile, setProfile] = useLocalStorage('ed-diary:profile', sampleProfile)
  const [settings, setSettings] = useLocalStorage('ed-diary:settings', sampleSettings)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () =>
      document.documentElement.classList.toggle('dark', settings.theme === 'dark' || (settings.theme === 'system' && mq.matches))
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [settings.theme])

  const lang: Lang = isLang(settings.language) ? settings.language : 'en'
  const { t, tn } = useMemo(
    () => ({
      t: ((key, vars) => translate(lang, key, vars)) as TFn,
      tn: ((base, n) => translatePlural(lang, base, n)) as TnFn,
    }),
    [lang],
  )

  // Keep the page's language attribute in sync (helps screen readers and browser translation prompts).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const resetData = () => {
    setNotes([])
    setTasks([])
    setConversations([])
    setProfile(sampleProfile)
    setSettings(sampleSettings)
  }

  return (
    <DiaryContext.Provider value={{ notes, setNotes, tasks, setTasks, conversations, setConversations, profile, setProfile, settings, setSettings, resetData, lang, t, tn }}>
      {children}
    </DiaryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDiary() {
  const ctx = useContext(DiaryContext)
  if (!ctx) throw new Error('useDiary must be used inside DiaryProvider')
  return ctx
}