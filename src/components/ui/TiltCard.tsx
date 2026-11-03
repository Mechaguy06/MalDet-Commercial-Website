import { useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

export default function TiltCard({
  children,
  className = "",
  delay = 0,
  glare = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: React.MouseEvent) => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rotateX = (py - 0.5) * -7
    const rotateY = (px - 0.5) * 7
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
    el.style.setProperty("--glare-x", `${px * 100}%`)
    el.style.setProperty("--glare-y", `${py * 100}%`)
    el.classList.add("tilt-active")
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ""
    el.classList.remove("tilt-active")
  }

  return (
    <div
      ref={ref}
      className={`reveal tilt-card ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  )
}
