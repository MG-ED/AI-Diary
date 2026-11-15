export function Logo({ size = 32, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#202A3A" />
        <path d="M11 7h10v18l-5-4-5 4z" fill="#A9B9B7" />
        <path d="M14 11h4M14 14.5h4" stroke="#202A3A" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {wordmark && <span className="font-display text-xl font-semibold tracking-tight">ED Diary</span>}
    </span>
  )
}
