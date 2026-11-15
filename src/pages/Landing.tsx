import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Check,
  Cloud,
  Download,
  KeyRound,
  ListChecks,
  MessageCircle,
  Menu,
  Mic,
  Moon,
  NotebookPen,
  PenLine,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import bot from '../assets/ai-bot.png'

/* ---------- content ---------- */

const navLinks = [
  { href: '#top', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'Meet your AI' },
  { href: '#how', label: 'How it works' },
  { href: '#privacy', label: 'Privacy' },
]

const modes = [
  { label: 'Talk it through', icon: MessageCircle, kind: 'Conversation', prompt: 'What is on your mind tonight?' },
  { label: 'Quick note', icon: NotebookPen, kind: 'Note', prompt: 'What do you want to remember?' },
  { label: 'Task', icon: ListChecks, kind: 'Task list', prompt: 'What needs doing tomorrow?' },
  { label: 'Voice', icon: Mic, kind: 'Voice entry', prompt: 'Say it out loud. It gets written down.' },
]

const mainFeatures = [
  { icon: NotebookPen, title: 'Notes you can find again', text: 'Pin what matters, tag the rest and search across everything in one place.', hot: false },
  { icon: MessageCircle, title: 'Talk it through', text: 'Write down your day and get a reply from a diary that keeps track of what you said.', hot: true },
  { icon: ListChecks, title: 'Tasks from real life', text: 'Keep a short list for today and tick things off as you go.', hot: false },
]

const moreFeatures = [
  { icon: Mic, title: 'Speak instead of typing', text: 'Dictate an entry when your hands are busy or the words come faster out loud.' },
  { icon: Moon, title: 'Light and dark', text: 'Pick the theme that is easiest on your eyes when you usually write.' },
  { icon: Cloud, title: 'Sync across devices', text: 'Planned with account sign-in, so your diary follows you from phone to laptop.' },
]

const checks = [
  'Keeps your entries, notes and tasks together',
  'Turns “email Ana tomorrow” into a task',
  'Answers when you ask what you said last week',
  'Takes dictation when typing is too slow',
]

const stats = [
  { value: '3', label: 'ways to write: type, speak or jot a note' },
  { value: '2', label: 'themes, light and dark' },
  { value: '0', label: 'secret keys stored on your device' },
]

const steps = [
  { title: 'Write or speak', text: 'Start a conversation about your day, or add a quick note.' },
  { title: 'Let it organize', text: 'Pull out tasks and keep notes together with the conversation that led to them.' },
  { title: 'Look back', text: 'Search your diary and ask it what you said last week.' },
]

const privacy = [
  { icon: KeyRound, title: 'No keys in the browser', text: 'AI requests are designed to go through a secure backend, so secret keys never ship to your device.' },
  { icon: ShieldCheck, title: 'Your entries stay yours', text: 'Each account will only be able to read its own diary, enforced by database rules.' },
  { icon: Download, title: 'Take it with you', text: 'Your notes and conversations are plain text. Export is on the roadmap.' },
]

const year = new Date().getFullYear()

/* ---------- small pieces ---------- */

const btn =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
const btnPrimary = `${btn} bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-deep`
const btnOutline = `${btn} border border-brand/40 text-ink hover:border-brand hover:bg-brand-soft`

const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.1 + i * 0.12, duration: 0.5 },
})

const pop = (delay: number) => ({
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, type: 'spring' as const, stiffness: 220, damping: 18 },
})

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-land/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <a href="#top" aria-label="ED Diary home" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          <Logo />
        </a>
        <nav className="mx-auto hidden gap-7 text-sm font-medium text-ink/75 md:flex" aria-label="Page sections">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="rounded transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand sm:inline-flex">
            Login
          </Link>
          <Link to="/signup" className={`${btnPrimary} !px-5 !py-2.5`}>
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-land px-5 py-3 md:hidden" aria-label="Page sections">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="block rounded-lg px-2 py-3 text-base font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link to="/login" className="block rounded-lg px-2 py-3 text-base font-medium" onClick={() => setOpen(false)}>
            Login
          </Link>
        </nav>
      )}
    </header>
  )
}

function Bubble({ me, children }: { me?: boolean; children: ReactNode }) {
  return (
    <p
      className={`w-fit max-w-[90%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
        me ? 'ml-auto rounded-br-sm bg-brand text-white' : 'rounded-bl-sm bg-brand-soft text-ink'
      }`}
    >
      {children}
    </p>
  )
}

function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <div className="absolute inset-[3%] rounded-[46%_54%_52%_48%/52%_46%_54%_48%] bg-brand-soft" aria-hidden="true" />
      <motion.div
        {...pop(0.25)}
        className="absolute inset-x-[11%] bottom-[5%] aspect-square rounded-full bg-linear-to-br from-cyan via-brand to-brand-deep shadow-2xl shadow-brand/30"
        aria-hidden="true"
      >
        <div className="absolute inset-[9%] rounded-full border border-white/25" />
        <div className="absolute inset-[20%] rounded-full border border-white/15" />
      </motion.div>
      <div className="absolute bottom-[3%] left-1/2 h-5 w-44 -translate-x-1/2 rounded-full bg-navy/25 blur-md" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-[3%] flex h-[94%] justify-center">
        <motion.img
          src={bot}
          alt="ED Diary AI companion, a friendly blue and white robot waving hello"
          width={600}
          height={900}
          draggable={false}
          className="h-full w-auto select-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { delay: 0.3, duration: 0.5 }, y: { delay: 0.8, duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        />
      </div>

      <motion.div {...pop(0.7)} className="absolute left-0 top-0 w-32 rounded-2xl rounded-bl-sm bg-surface p-3 text-xs leading-snug shadow-xl shadow-brand/15 sm:w-40 sm:p-3.5 sm:text-sm">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-brand">
          <Sparkles className="size-3.5" aria-hidden="true" /> ED Diary AI
        </p>
        Hi! Tell me about your day.
      </motion.div>

      <motion.div {...pop(0.85)} className="absolute right-[3%] top-[8%] grid size-12 place-items-center rounded-full bg-surface text-brand shadow-xl shadow-brand/15" aria-hidden="true">
        <NotebookPen className="size-5" />
      </motion.div>
      <motion.div {...pop(1)} className="absolute right-0 top-[40%] grid size-14 place-items-center rounded-full bg-surface text-brand shadow-xl shadow-brand/15" aria-hidden="true">
        <Mic className="size-6" />
      </motion.div>

      <motion.div {...pop(1.15)} className="absolute bottom-[12%] left-0 hidden w-48 rounded-2xl bg-surface p-3.5 text-sm shadow-xl shadow-brand/15 sm:block">
        <p className="mb-2 flex items-center gap-2 font-semibold">
          <ListChecks className="size-4 text-brand" aria-hidden="true" /> Added to tomorrow
        </p>
        <ul className="space-y-1 text-ink/80">
          <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" aria-hidden="true" /> Finish slides</li>
          <li className="flex items-center gap-2"><Check className="size-3.5 text-brand" aria-hidden="true" /> Email Ana</li>
        </ul>
      </motion.div>
    </div>
  )
}

function QuickStart() {
  const [mode, setMode] = useState(0)
  const active = modes[mode]
  const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())
  const cells = [
    { icon: CalendarDays, label: 'Today', value: today },
    { icon: PenLine, label: 'Entry type', value: active.kind },
    { icon: Sparkles, label: 'Starting prompt', value: active.prompt },
  ]
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-5">
      <div className="rounded-3xl border border-line bg-surface p-3 shadow-2xl shadow-brand/15 sm:p-4">
        <div role="group" aria-label="Choose how to start" className="flex flex-wrap gap-1.5 px-1 pb-3">
          {modes.map((m, i) => (
            <button
              key={m.label}
              type="button"
              aria-pressed={i === mode}
              onClick={() => setMode(i)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                i === mode ? 'bg-brand text-white' : 'text-ink/70 hover:bg-brand-soft'
              }`}
            >
              <m.icon className="size-4" aria-hidden="true" /> {m.label}
            </button>
          ))}
        </div>
        <div className="grid items-center gap-1 rounded-2xl border border-line p-2 md:grid-cols-[1fr_1fr_1.5fr_auto]" aria-live="polite">
          {cells.map((c) => (
            <div key={c.label} className="flex items-center gap-3 px-3 py-2.5 md:border-r md:border-line">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-ink/60">{c.label}</span>
                <span className="block text-sm font-medium leading-snug">{c.value}</span>
              </span>
            </div>
          ))}
          <Link to="/signup" className={`${btnPrimary} m-1 md:px-8`}>
            Start entry
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function Landing() {
  return (
    <div id="top" className="bg-land text-ink">
      <Header />

      {/* hero */}
      <section className="bg-linear-to-b from-brand-soft to-land">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-28 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pt-14">
          <div>
            <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              <motion.span className="block" {...rise(0)}>Your thoughts.</motion.span>
              <motion.span className="block" {...rise(1)}>Your memories.</motion.span>
              <motion.span className="block" {...rise(2)}>Your ED Diary.</motion.span>
            </h1>
            <motion.p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75" {...rise(3)}>
              ED Diary helps you record what happened today, sort your thoughts into notes and tasks, and talk it over with an AI diary companion that remembers the conversation.
            </motion.p>
            <motion.div className="mt-8 flex flex-wrap gap-3" {...rise(4)}>
              <Link to="/signup" className={`${btnPrimary} px-8`}>Get Started</Link>
              <Link to="/login" className={`${btnOutline} px-8`}>Login</Link>
            </motion.div>
          </div>
          <HeroArt />
        </div>
      </section>

      <QuickStart />

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl px-5 pb-20 pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight">Everything you need to keep a diary you will actually use.</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">One place to say what happened, keep what matters and find it again later.</p>
        </div>

        <div className="mt-20 grid gap-x-6 gap-y-16 md:grid-cols-3">
          {mainFeatures.map(({ icon: Icon, title, text, hot }) => (
            <article
              key={title}
              className={`relative rounded-3xl px-7 pb-9 pt-14 text-center ${
                hot ? 'bg-linear-to-b from-brand to-brand-deep text-white shadow-2xl shadow-brand/30 md:-translate-y-5' : 'bg-surface shadow-xl shadow-brand/10'
              }`}
            >
              <span
                className={`absolute -top-9 left-1/2 grid size-[4.5rem] -translate-x-1/2 place-items-center rounded-full ring-8 ring-land ${
                  hot ? 'bg-white text-brand' : 'bg-brand text-white'
                }`}
              >
                <Icon className="size-8" aria-hidden="true" />
              </span>
              <h3 className="font-display text-2xl font-medium">{title}</h3>
              <p className={`mt-3 leading-relaxed ${hot ? 'text-white/90' : 'text-ink/75'}`}>{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-2 rounded-3xl bg-brand-soft p-3 md:grid-cols-3">
          {moreFeatures.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-brand shadow-sm">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/75">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* meet the AI */}
      <section id="about" className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 lg:grid-cols-2">
          <div className="relative mx-auto h-[27rem] w-full max-w-lg">
            <div className="absolute inset-x-4 bottom-0 aspect-square rounded-full bg-brand-soft" aria-hidden="true" />
            <div className="absolute inset-x-10 bottom-6 aspect-square rounded-full border border-brand/25" aria-hidden="true" />
            <img src={bot} alt="" aria-hidden="true" width={600} height={900} draggable={false} className="absolute bottom-0 right-0 h-[92%] w-auto select-none" />
            <div className="absolute bottom-6 left-0 w-60 space-y-2 rounded-2xl border border-line bg-surface p-3 shadow-xl shadow-brand/15">
              <Bubble me>What did I say about the deadline?</Bubble>
              <Bubble>On Tuesday you said it moved up, then added “finish slides” and “email Ana”.</Bubble>
            </div>
          </div>

          <div>
            <h2 className="font-display text-4xl font-medium leading-tight tracking-tight">A diary that answers back.</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/75">
              <p>Most days are too full to write a neat journal entry. ED Diary lets you say it the way it comes: a rushed sentence, a voice note, a worry at midnight.</p>
              <p>It keeps your entries, notes and tasks together, so what you said on Monday is easy to find on Friday.</p>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {checks.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm font-medium leading-snug">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-4xl font-medium text-brand">{s.value}</dt>
                  <dd className="mt-1 text-sm leading-snug text-ink/70">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight">How it works</h2>
          <p className="mt-4 text-lg text-ink/75">Three steps from a messy day to something you can look back on.</p>
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-3xl bg-surface p-8 text-center shadow-xl shadow-brand/10">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft font-display text-2xl font-medium text-brand">{i + 1}</span>
              <h3 className="mt-5 font-display text-2xl font-medium">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* privacy */}
      <section id="privacy" className="bg-navy bg-[radial-gradient(55rem_28rem_at_90%_0%,rgb(36_87_230/0.4),transparent)] text-ivory">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="max-w-lg font-display text-4xl font-medium leading-tight tracking-tight">Privacy and security come first.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {privacy.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="mb-4 grid size-11 place-items-center rounded-full bg-white/10 text-cyan">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 leading-relaxed text-ivory/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* closing call to action */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-brand to-brand-deep px-8 py-14 text-white sm:px-14 md:pr-[22rem]">
          <div className="absolute -right-16 -top-24 size-80 rounded-full bg-white/10" aria-hidden="true" />
          <div className="absolute -bottom-32 right-24 size-72 rounded-full bg-cyan/20" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">Start your first entry today.</h2>
            <p className="mt-4 max-w-md text-lg text-white/85">Create an account and write down the first thing on your mind.</p>
            <Link to="/signup" className={`${btn} mt-8 bg-white px-8 text-brand-deep shadow-lg hover:bg-brand-soft focus-visible:outline-white`}>
              Get Started
            </Link>
          </div>
          <img src={bot} alt="" aria-hidden="true" width={600} height={900} draggable={false} className="absolute -bottom-10 right-10 hidden h-[24rem] w-auto select-none md:block" />
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-ink/70">
          <Logo size={24} />
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {navLinks.slice(1).map((l) => (
              <a key={l.href} href={l.href} className="hover:text-brand">{l.label}</a>
            ))}
            <Link to="/login" className="hover:text-brand">Login</Link>
          </nav>
          <span>© {year} ED Diary</span>
        </div>
      </footer>
    </div>
  )
}