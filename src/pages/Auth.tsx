import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button, Field, inputCls } from '../components/ui'
import { useDiary } from '../context/DiaryContext'
import { signIn } from '../services/auth'

type Errors = Partial<Record<'name' | 'email' | 'password', string>>

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const { setProfile } = useDiary()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (isSignup && !form.name.trim()) next.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address, like name@example.com.'
    if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    const session = await signIn(form.email, form.name.trim())
    setProfile((p) => ({ ...p, name: session.name, email: session.email }))
    navigate('/app')
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center" aria-label="Back to ED Diary home"><Logo /></Link>
        <div className="rounded-2xl border border-line bg-surface p-7 shadow-sm shadow-navy/5">
          <h1 className="font-display text-3xl font-medium">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-1 text-sm text-ink/70">{isSignup ? 'Start your diary in a minute.' : 'Log in to pick up where you left off.'}</p>
          <p className="mt-5 flex gap-2 rounded-xl bg-sage/35 p-3 text-sm text-navy dark:text-ivory">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Sign-in is not connected to a server yet. Your account and entries stay on this device.
          </p>
          <form onSubmit={submit} noValidate className="mt-5 space-y-4">
            {isSignup && (
              <Field label="Name" error={errors.name}>
                <input className={inputCls} autoComplete="name" value={form.name} onChange={set('name')} />
              </Field>
            )}
            <Field label="Email" error={errors.email}>
              <input className={inputCls} type="email" autoComplete="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input className={`${inputCls} pr-11`} type={show ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink/70 hover:bg-ink/10">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            <Button type="submit" disabled={busy} className="w-full">
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isSignup ? 'Create account' : 'Log in'}
            </Button>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-ink/75">
          {isSignup ? 'Already have an account? ' : 'New to ED Diary? '}
          <Link to={isSignup ? '/login' : '/signup'} className="font-medium text-ink underline underline-offset-4">{isSignup ? 'Log in' : 'Create an account'}</Link>
        </p>
      </div>
    </main>
  )
}
