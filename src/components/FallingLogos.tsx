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
    let running = false
    let isVisibleOnScreen = false

    const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches

    const img = new Image()
    img.src = "/assets/maldet-logo.png"

    let particles: Particle[] = []

    // Pre-rendered offscreen sprite cache to avoid expensive real-time shadowBlur on mobile
    const spriteSize = 64
    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = spriteSize
    offscreenCanvas.height = spriteSize
    const offCtx = offscreenCanvas.getContext("2d")
    let spriteReady = false

    const prepareSprite = () => {
      if (!offCtx || !img.complete || img.naturalWidth === 0) return
      offCtx.clearRect(0, 0, spriteSize, spriteSize)
      const center = spriteSize / 2
      const radius = center - 4

      // Clean neon outline ring
      offCtx.strokeStyle = "#22c55e"
      offCtx.lineWidth = 2.5
      offCtx.beginPath()
      offCtx.arc(center, center, radius, 0, Math.PI * 2)
      offCtx.stroke()

      // Mascot logo centered inside
      const logoInset = radius * 1.35
      offCtx.drawImage(
        img,
        center - logoInset / 2,
        center - logoInset / 2,
        logoInset,
        logoInset
      )
      spriteReady = true
    }

    img.onload = () => {
      prepareSprite()
    }
    if (img.complete) {
      prepareSprite()
    }

    const initParticles = (w: number, h: number) => {
      // Much lighter count on mobile to keep frame rates buttery smooth
      const count = isMobile ? Math.min(10, Math.max(6, Math.floor(w / 70))) : Math.min(24, Math.max(14, Math.floor(w / 45)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: isMobile ? 26 + Math.random() * 18 : 30 + Math.random() * 24,
        speed: 0.6 + Math.random() * 1.1,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmp: 0.5 + Math.random() * 0.9,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        opacity: 0.35 + Math.random() * 0.4,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      // Mobile screens run at DPR 1 for maximum GPU performance and zero battery drain
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length === 0) {
        initParticles(width, height)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    let lastTime = 0
    const frameInterval = isMobile ? 1000 / 30 : 1000 / 60

    const render = (time: number) => {
      if (!running) return

      if (time - lastTime >= frameInterval) {
        lastTime = time
        ctx.clearRect(0, 0, width, height)

        if (spriteReady) {
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

            // Draw the pre-rendered sprite directly (ultra-fast hardware blit, zero shadowBlur recalculation)
            ctx.drawImage(offscreenCanvas, -p.size / 2, -p.size / 2, p.size, p.size)

            ctx.restore()
          }
        }
      }

      raf = requestAnimationFrame(render)
    }

    const startAnimation = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(render)
      }
    }

    const stopAnimation = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Only animate when the section is actually visible in the viewport!
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleOnScreen = entry.isIntersecting
        if (isVisibleOnScreen && !document.hidden) {
          startAnimation()
        } else {
          stopAnimation()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation()
      } else if (isVisibleOnScreen) {
        startAnimation()
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      stopAnimation()
      observer.disconnect()
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
