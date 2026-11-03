export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className="flex-none">
        <path
          d="M16 2.5 4.5 7v8.2c0 7.1 4.8 12.4 11.5 14.3 6.7-1.9 11.5-7.2 11.5-14.3V7L16 2.5Z"
          fill="var(--accent-soft)"
          stroke="var(--accent-text)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="14.6" cy="14.4" r="4.6" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" />
        <path d="m18 17.8 3.6 3.6" stroke="var(--accent-text)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">MalDet</span>
    </span>
  )
}
