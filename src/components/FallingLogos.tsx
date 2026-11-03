import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

interface Particle {
  x: number
  y: number
  size: number
  speed: number
  swaySpeed: number
  swayAmp: number
  swayPhase: number
  rotation: number
  rotSpeed: number
  opacity: number
}

export default function FallingLogos() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let raf = 0
    let running = true

    const img = new Image()
    img.src = "/assets/maldet-logo.png"

    let particles: Particle[] = []

    const initParticles = (w: number, h: number) => {
      const count = Math.min(32, Math.max(16, Math.floor(w / 45)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 28 + Math.random() * 26,
        speed: 0.65 + Math.random() * 1.35,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmp: 0.5 + Math.random() * 1.0,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        opacity: 0.3 + Math.random() * 0.45,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length === 0) {
        initParticles(width, height)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    const render = () => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)

      if (img.complete && img.naturalWidth > 0) {
        for (const p of particles) {
          p.y += p.speed
          p.swayPhase += p.swaySpeed
          p.x += Math.sin(p.swayPhase) * p.swayAmp
          p.rotation += p.rotSpeed

          if (p.y > height + p.size) {
            p.y = -p.size - 10
            p.x = Math.random() * width
          }

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = p.opacity

          // Neon green outline glow
          ctx.shadowColor = "#22c55e"
          ctx.shadowBlur = 12

          // Green outline circle ring around logo
          ctx.strokeStyle = "#a3d9b8"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.stroke()

          // Draw the MalDet mascot logo
          ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size)

          ctx.restore()
        }
      }

      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else {
        running = true
        raf = requestAnimationFrame(render)
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return (
    <div className="falling-logos-shell" aria-hidden="true">
      <canvas ref={canvasRef} className="falling-logos-canvas" />
    </div>
  )
}
