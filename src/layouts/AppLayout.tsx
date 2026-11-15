import { useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CloudOff, LayoutDashboard, ListChecks, LogOut, Menu, MessageCircle, NotebookPen, Settings, UserRound, X, type LucideIcon } from 'lucide-react'
import { Logo } from '../components/Logo'
import { useDiary } from '../context/DiaryContext'
import type { Key } from '../i18n'
import { getSession, isUnlocked, signOut } from '../services/auth'

const nav: { to: string; label: Key; icon: LucideIcon; end?: boolean }[] = [
  { to: '/app', label: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/chat', label: 'nav.chat', icon: MessageCircle },
  { to: '/app/notes', label: 'nav.notes', icon: NotebookPen },
  { to: '/app/tasks', label: 'nav.tasks', icon: ListChecks },
  { to: '/app/profile', label: 'nav.profile', icon: UserRound },
  { to: '/app/settings', label: 'nav.settings', icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useDiary()
  return (
    <>
      <div className="px-6 py-6">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1 px-3" aria-label={t('layout.mainNav')}>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand text-white shadow-md shadow-brand/25' : 'text-ink/75 hover:bg-brand-soft hover:text-brand'}`
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            {t(label)}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { settings, t } = useDiary()
  if (!getSession() || (settings.lockOnStart && !isUnlocked())) return <Navigate to="/login" replace />

  const current = nav.find((n) => n.to === pathname.replace(/\/$/, ''))
  const title = current ? t(current.label) : 'ED Diary'
  const logout = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-navy/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-72 bg-surface lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.2 }}>
              <button onClick={() => setOpen(false)} aria-label={t('layout.closeMenu')} className="absolute right-3 top-5 rounded-full p-1.5 hover:bg-brand-soft">
                <X className="size-5" />
              </button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur sm:px-8">
        <button onClick={() => setOpen(true)} aria-label={t('layout.openMenu')} className="rounded-full p-2 hover:bg-brand-soft lg:hidden">
          <Menu className="size-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-1">
          <span title={t('layout.syncTitle')} className="rounded-full p-2 text-ink/70">
            <CloudOff className="size-5" aria-label={t('layout.syncLabel')} />
          </span>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-brand-soft hover:text-brand">
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('layout.logout')}</span>
            <span className="sr-only sm:hidden">{t('layout.logout')}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}