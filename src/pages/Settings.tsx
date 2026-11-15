import type { KeyboardEvent, ReactNode, SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Monitor, Moon, Sun, Volume2, VolumeX, type LucideIcon } from 'lucide-react'
import { Button, Card, Toggle, inputCls } from '../components/ui'
import { useDiary } from '../context/DiaryContext'
import { languages, type Key } from '../i18n'
import { playTick } from '../lib/utils'
import { getSession, signOut } from '../services/auth'
import type { Settings as SettingsType, Theme } from '../types'

const themes: { value: Theme; label: Key; icon: LucideIcon }[] = [
  { value: 'light', label: 'settings.light', icon: Sun },
  { value: 'dark', label: 'settings.dark', icon: Moon },
  { value: 'system', label: 'settings.system', icon: Monitor },
]

function Row({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div>
        <p className="font-medium">{title}</p>
        {text && <p className="text-sm text-ink/70">{text}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { settings, setSettings, resetData, t } = useDiary()
  const navigate = useNavigate()
  const set = <K extends keyof SettingsType>(k: K, v: SettingsType[K]) => setSettings((s) => ({ ...s, [k]: v }))

  const percent = Math.round(settings.volume * 100)
  // Play the tone at the level the slider is now on, so you can hear the change.
  const preview = (e: SyntheticEvent<HTMLInputElement>) => playTick(Number(e.currentTarget.value) / 100)
  const previewOnKey = (e: KeyboardEvent<HTMLInputElement>) => /^(Arrow|Home$|End$|Page)/.test(e.key) && preview(e)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <h2 className="mb-3 font-semibold">{t('settings.theme')}</h2>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t('settings.theme')}>
          {themes.map(({ value, label, icon: Icon }) => (
            <button key={value} role="radio" aria-checked={settings.theme === value} onClick={() => set('theme', value)} className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition ${settings.theme === value ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand/50'}`}>
              <Icon className="size-5" aria-hidden="true" /> {t(label)}
            </button>
          ))}
        </div>
        <div className="mt-5 border-t border-line pt-2">
          <Row title={t('settings.language')} text={t('settings.languageHelp')}>
            <select className={`${inputCls} max-w-56 shrink-0`} value={settings.language} onChange={(e) => set('language', e.target.value)} aria-label={t('settings.language')}>
              {languages.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </Row>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">{t('settings.sound')}</h2>
        <Row title={t('settings.soundEffects')} text={t('settings.soundEffectsHelp')}>
          <Toggle
            label={t('settings.soundEffects')}
            checked={settings.sound}
            onChange={(on) => {
              set('sound', on)
              if (on) playTick(settings.volume) // confirm it works when switched on
            }}
          />
        </Row>
        <Row title={t('settings.volume')} text={settings.sound ? undefined : t('settings.volumeOff')}>
          <div className="flex shrink-0 items-center gap-3">
            {percent === 0 ? <VolumeX className="size-5 text-ink/70" aria-hidden="true" /> : <Volume2 className="size-5 text-ink/70" aria-hidden="true" />}
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={percent}
              aria-label={t('settings.volume')}
              aria-valuetext={`${percent}%`}
              onChange={(e) => set('volume', Number(e.target.value) / 100)}
              onPointerUp={preview}
              onKeyUp={previewOnKey}
              className="w-32 accent-brand sm:w-40"
            />
            <span className="w-10 text-right text-sm tabular-nums text-ink/70" aria-hidden="true">{percent}%</span>
          </div>
        </Row>
      </Card>

      <Card>
        <h2 className="font-semibold">{t('settings.privacy')}</h2>
        <Row title={t('settings.lock')} text={t('settings.lockHelp')}><Toggle label={t('settings.lock')} checked={settings.lockOnStart} onChange={(v) => set('lockOnStart', v)} /></Row>
        <Row title={t('settings.usage')} text={t('settings.usageHelp')}><Toggle label={t('settings.usage')} checked={settings.shareUsage} onChange={(v) => set('shareUsage', v)} /></Row>
      </Card>

      <Card>
        <h2 className="font-semibold">{t('settings.account')}</h2>
        <Row title={t('settings.signedIn')} text={getSession()?.email ?? ''}>
          <Button variant="secondary" onClick={() => (signOut(), navigate('/'))}>{t('layout.logout')}</Button>
        </Row>
        <Row title={t('settings.deleteData')} text={t('settings.deleteHelp')}>
          <Button variant="danger" onClick={() => window.confirm(t('settings.deleteConfirm')) && resetData()}>{t('settings.deleteBtn')}</Button>
        </Row>
      </Card>
    </div>
  )
}