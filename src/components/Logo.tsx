import { useId } from 'react'

export function Logo({ size = 32, wordmark = true }: { size?: number; wordmark?: boolean }) {
  const id = useId()
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#38C8F5" />
            <stop offset="0.5" stopColor="#2457E6" />
            <stop offset="1" stopColor="#1B3FB8" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${id})`} />
        <path d="M11 7h10v18l-5-4-5 4z" fill="#FFFFFF" />
        <path d="M14 11h4M14 14.5h4" stroke="#2457E6" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {wordmark && <span className="font-display text-xl font-semibold tracking-tight">ED Diary</span>}
    </span>
  )
}