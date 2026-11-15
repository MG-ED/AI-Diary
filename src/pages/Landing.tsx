import { motion } from 'framer-motion'
import { Cloud, KeyRound, ListChecks, Mic, MessageCircle, Moon, NotebookPen, ShieldCheck, Download, Check } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui'

const features = [
  { icon: MessageCircle, title: 'Talk it through', text: 'Write down your day and get a reply from a diary that keeps track of what you said.' },
  { icon: Mic, title: 'Speak instead of typing', text: 'Dictate an entry with the microphone when your hands are busy or the words come faster out loud.' },
  { icon: NotebookPen, title: 'Notes you can find again', text: 'Pin what matters, tag the rest and search across everything in one place.' },
  { icon: ListChecks, title: 'Tasks from real life', text: 'Keep a short list for today and tick things off as you go.' },
  { icon: Moon, title: 'Light and dark', text: 'Pick the theme that is easiest on your eyes at the time you usually write.' },
  { icon: Cloud, title: 'Sync across devices', text: 'Planned with account sign-in, so your diary follows you from phone to laptop.' },
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

const rise = (i: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.12, duration: 0.5 } })

export default function Landing() {
  return (
    <div id="top">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <a href="#top" aria-label="ED Diary home"><Logo /></a>
          <nav className="ml-6 hidden gap-6 text-sm font-medium text-ink/75 md:flex" aria-label="Page sections">
            <a href="#top" className="hover:text-ink">Home</a>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#about" className="hover:text-ink">About</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button to="/login" variant="ghost">Login</Button>
            <Button to="/signup">Get Started</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <div>
          <h2 className="font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            <motion.span className="block" {...rise(0)}>Your thoughts.</motion.span>
            <motion.span className="block" {...rise(1)}>Your memories.</motion.span>
            <motion.span className="block" {...rise(2)}>Your ED Diary.</motion.span>
          </h2>
          <motion.p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75" {...rise(3)}>
            ED Diary helps you record what happened today, sort your thoughts into notes and tasks, and talk it over with an AI diary companion that remembers the conversation.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" {...rise(4)}>
            <Button to="/signup" className="px-7 py-3 text-base">Get Started</Button>
            <Button to="/login" variant="secondary" className="px-7 py-3 text-base">Login</Button>
          </motion.div>
        </div>

        <motion.div {...rise(3)} className="rounded-3xl bg-navy p-5 text-ivory shadow-2xl shadow-navy/30" aria-label="Preview of the chat screen">
          <div className="mb-4 flex items-center gap-2 text-sm text-ivory/70">
            <MessageCircle className="size-4" aria-hidden="true" /> Tuesday evening
          </div>
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ivory px-4 py-2.5 text-navy">The deadline moved up and I felt behind all afternoon.</p>
            <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5">That sounds draining. Do you want to list what is left so it feels smaller?</p>
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ivory px-4 py-2.5 text-navy">Yes. Add “finish slides” and “email Ana” for tomorrow.</p>
          </div>
          <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm">
            <p className="mb-2 flex items-center gap-2 font-medium"><ListChecks className="size-4 text-sage" aria-hidden="true" /> Added to tomorrow</p>
            <ul className="space-y-1.5 text-ivory/85">
              <li className="flex items-center gap-2"><Check className="size-4 text-sage" aria-hidden="true" /> Finish slides</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-sage" aria-hidden="true" /> Email Ana</li>
            </ul>
          </div>
        </motion.div>
      </section>

      <section id="about" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-2">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight">A diary that answers back.</h2>
          <div className="space-y-4 text-lg leading-relaxed text-ink/75">
            <p>Most days are too full to write a neat journal entry. ED Diary lets you say it the way it comes: a rushed sentence, a voice note, a worry at midnight.</p>
            <p>It keeps your entries, notes and tasks together, so what you said on Monday is easy to find on Friday.</p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-xl font-display text-4xl font-medium leading-tight tracking-tight">Everything you need to keep a diary you will actually use.</h2>
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t border-line pt-5">
              <Icon className="mb-3 size-6" aria-hidden="true" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink/75">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sage/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-4xl font-medium tracking-tight">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy font-semibold text-ivory">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-navy/80">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-navy text-ivory">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="max-w-lg font-display text-4xl font-medium leading-tight tracking-tight">Privacy and security come first.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {privacy.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="mb-3 size-6 text-sage" aria-hidden="true" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 leading-relaxed text-ivory/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Start your first entry today.</h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink/75">Create an account and write down the first thing on your mind.</p>
        <Button to="/signup" className="mt-8 px-8 py-3 text-base">Get Started</Button>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-ink/70">
          <Logo size={24} />
          <span>© {year} ED Diary</span>
        </div>
      </footer>
    </div>
  )
}
