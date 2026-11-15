import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Camera, Check } from 'lucide-react'
import { Button, Card, Field, inputCls } from '../components/ui'
import { useDiary } from '../context/DiaryContext'

export default function Profile() {
  const { profile, setProfile, t } = useDiary()
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState<{ name?: string; email?: string; avatar?: string }>({})
  const [saved, setSaved] = useState(false)
  const file = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(profile)
    setSaved(false)
  }, [profile])

  const change = (k: 'name' | 'email' | 'bio') => (e: { target: { value: string } }) => (setSaved(false), setForm({ ...form, [k]: e.target.value }))

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) return setErrors({ avatar: t('profile.errImage') })
    if (f.size > 1_000_000) return setErrors({ avatar: t('profile.errSize') })
    const reader = new FileReader()
    // Stored locally as a data URL. Move to Firebase Storage once it is configured.
    reader.onload = () => (setErrors({}), setSaved(false), setForm((p) => ({ ...p, avatar: String(reader.result) })))
    reader.readAsDataURL(f)
  }

  function save(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = t('profile.errName')
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('profile.errEmail')
    setErrors(next)
    if (Object.keys(next).length) return
    setProfile({ ...form, name: form.name.trim() })
    setSaved(true)
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <form onSubmit={save} noValidate className="space-y-6">
        <div className="flex items-center gap-5">
          <button type="button" onClick={() => file.current?.click()} aria-label={t('profile.changePic')} className="group relative size-24 shrink-0 overflow-hidden rounded-full bg-sage/50">
            {form.avatar ? <img src={form.avatar} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center font-display text-4xl text-navy">{(form.name[0] ?? '?').toUpperCase()}</span>}
            <span className="absolute inset-0 grid place-items-center bg-navy/50 text-ivory opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"><Camera className="size-6" /></span>
          </button>
          <input ref={file} type="file" accept="image/*" onChange={pick} className="hidden" />
          <div>
            <p className="font-display text-2xl">{form.name || t('profile.yourName')}</p>
            <button type="button" onClick={() => file.current?.click()} className="text-sm font-medium underline underline-offset-4">{t('profile.upload')}</button>
            {form.avatar && <button type="button" onClick={() => setForm({ ...form, avatar: null })} className="ml-4 text-sm text-ink/70 underline underline-offset-4">{t('profile.remove')}</button>}
            {errors.avatar && <p role="alert" className="mt-1 text-sm text-red-700 dark:text-red-300">{errors.avatar}</p>}
          </div>
        </div>
        <Field label={t('profile.name')} error={errors.name}><input className={inputCls} value={form.name} onChange={change('name')} /></Field>
        <Field label={t('profile.email')} error={errors.email}><input className={inputCls} type="email" value={form.email} onChange={change('email')} /></Field>
        <Field label={t('profile.about')}><textarea className={`${inputCls} min-h-24`} value={form.bio} onChange={change('bio')} placeholder={t('profile.aboutPlaceholder')} /></Field>
        <div className="flex items-center gap-3">
          <Button type="submit">{t('profile.save')}</Button>
          {saved && <span role="status" className="flex items-center gap-1.5 text-sm text-ink/80"><Check className="size-4" aria-hidden="true" /> {t('profile.saved')}</span>}
        </div>
      </form>
    </Card>
  )
}