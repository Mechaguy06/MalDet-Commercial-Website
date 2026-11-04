import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

const GLYPHS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF<>/{}[]$#".split("")

type Props = {
  /** Glyph colour. */
  color?: string
  /** Colour of the occasional bright "spark" glyph. */
  spark?: string
  /** Whole-canvas opacity (0.10 - 0.15 keeps it a texture, not a distraction). */
  opacity?: number
  className?: string
}

export default function MatrixRain({
  color = "#00ff66",
  spark = "#d1fae5",
  opacity = 0.15,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let fontSize = 16
    let rows = 0
    let heads: number[] = []
    let speeds: number[] = []
    let raf = 0
    let last = 0
    let onScreen = true

    const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches
    const FRAME_MS = isMobile ? 1000 / 24 : 1000 / 30
    const FADE = isMobile ? 0.06 : 0.045

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      // Keep DPR at 1 on mobile to prevent GPU fill-rate throttling on high-res phone screens
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      fontSize = isMobile ? 18 : 16
      rows = Math.ceil(height / fontSize)
      const columns = Math.ceil(width / fontSize)
      heads = Array.from({ length: columns }, () => Math.random() * rows)
      speeds = Array.from({ length: columns }, () => 0.3 + Math.random() * 0.55)
      ctx.clearRect(0, 0, width, height)
    }

    const step = () => {
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE})`
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"
      ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`
      ctx.textBaseline = "top"

      for (let i = 0; i < heads.length; i++) {
        const previousRow = Math.floor(heads[i])
        heads[i] += speeds[i]
        const row = Math.floor(heads[i])
        if (row !== previousRow) {
          ctx.fillStyle = Math.random() < 0.1 ? spark : color
          ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * fontSize, row * fontSize)
        }
        if (row > rows && Math.random() > 0.975) heads[i] = 0
      }
    }

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop)
      if (time - last < FRAME_MS) return
      last = time
      step()
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const sync = () => (onScreen && !document.hidden ? start() : stop())

    resize()

    if (prefersReducedMotion()) {
      for (let i = 0; i < 70; i++) step()
      const observer = new ResizeObserver(() => {
        resize()
        for (let i = 0; i < 70; i++) step()
      })
      observer.observe(canvas)
      return () => observer.disconnect()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    visibilityObserver.observe(canvas)
    document.addEventListener("visibilitychange", sync)
    sync()

    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener("visibilitychange", sync)
    }
  }, [color, spark])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        opacity,
        WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
      }}
    />
  )
}
