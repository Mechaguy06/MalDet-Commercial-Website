import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/motion"

/**
 * A lightweight 2D-canvas particle field that morphs between shapes.
 * Shapes tell the MalDet story: a repository (sphere), its files, the scan,
 * ML triage splitting real findings from noise, and the final shield.
 */
export type Shape = "sphere" | "files" | "scan" | "split" | "shield"

type Props = {
  shape: Shape
  /** Pointer tilts the form and pushes particles aside. */
  interactive?: boolean
  /** Centre of the form as a fraction of the canvas, desktop and mobile. */
  center?: [number, number]
  centerMobile?: [number, number]
  /** Radius as a fraction of the canvas's shorter side. */
  scale?: number
  className?: string
}

// Colour groups: 0 = jade, 1 = muted (noise), 2 = bright highlight, 3 = mint.
const PALETTE = ["163,217,184", "112,140,124", "226,246,233", "108,194,138"]
const ALPHA_STEPS = 4

type Cloud = { pos: Float32Array; group: Uint8Array }

function rand(seed: number) {
  // Deterministic so every visit draws the same forms.
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function gaussian(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())
}

function sphere(n: number, r: () => number): Cloud {
  const pos = new Float32Array(n * 3)
  const group = new Uint8Array(n)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = golden * i
    const jitter = 0.97 + r() * 0.06
    pos[i * 3] = Math.cos(theta) * radius * jitter
    pos[i * 3 + 1] = y * jitter
    pos[i * 3 + 2] = Math.sin(theta) * radius * jitter
    group[i] = r() < 0.08 ? 2 : 0
  }
  return { pos, group }
}

function files(n: number, r: () => number): Cloud {
  // A fanned stack of documents, each with ragged "lines of code".
  const pos = new Float32Array(n * 3)
  const group = new Uint8Array(n)
  const sheets = 5
  for (let i = 0; i < n; i++) {
    const sheet = i % sheets
    const z = -0.7 + sheet * 0.35
    const offset = (sheet - 2) * 0.12
    const edge = r() < 0.3
    let x: number
    let y: number
    if (edge) {
      // Sheet outline
      const t = r() * 4
      const side = Math.floor(t)
      const f = t - side
      x = side === 0 ? -0.62 + f * 1.24 : side === 1 ? 0.62 : side === 2 ? 0.62 - f * 1.24 : -0.62
      y = side === 0 ? 0.82 : side === 1 ? 0.82 - f * 1.64 : side === 2 ? -0.82 : -0.82 + f * 1.64
    } else {
      const row = Math.floor(r() * 11)
      const lineLength = 0.35 + ((row * 37 + sheet * 13) % 7) / 7 * 0.75
      x = -0.5 + r() * lineLength
      y = 0.66 - row * 0.13
    }
    pos[i * 3] = x + offset
    pos[i * 3 + 1] = y - offset * 0.4
    pos[i * 3 + 2] = z
    group[i] = edge ? 0 : sheet === sheets - 1 ? 2 : 3
  }
  return { pos, group }
}

function scan(n: number, r: () => number): Cloud {
  // A core with a tilted scanning ring, like a galaxy disc.
  const pos = new Float32Array(n * 3)
  const group = new Uint8Array(n)
  const tilt = 0.42
  for (let i = 0; i < n; i++) {
    if (i < n * 0.42) {
      const u = r() * 2 - 1
      const a = r() * Math.PI * 2
      const rr = 0.48 * Math.cbrt(r())
      const s = Math.sqrt(1 - u * u)
      pos[i * 3] = Math.cos(a) * s * rr
      pos[i * 3 + 1] = u * rr
      pos[i * 3 + 2] = Math.sin(a) * s * rr
      group[i] = r() < 0.25 ? 2 : 0
    } else {
      const a = r() * Math.PI * 2
      const rr = 0.72 + Math.abs(gaussian(r)) * 0.22 + (r() < 0.5 ? 0 : 0.28)
      const x = Math.cos(a) * rr
      const z = Math.sin(a) * rr
      const y = gaussian(r) * 0.02
      pos[i * 3] = x
      pos[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt)
      pos[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt)
      group[i] = 3
    }
  }
  return { pos, group }
}

function split(n: number, r: () => number): Cloud {
  // Triage: a small dense cluster of likely-real findings, a loose cloud of noise.
  const pos = new Float32Array(n * 3)
  const group = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    const real = i < n * 0.22
    if (real) {
      const u = r() * 2 - 1
      const a = r() * Math.PI * 2
      const rr = 0.32 * Math.cbrt(r())
      const s = Math.sqrt(1 - u * u)
      pos[i * 3] = -0.62 + Math.cos(a) * s * rr
      pos[i * 3 + 1] = u * rr
      pos[i * 3 + 2] = Math.sin(a) * s * rr
      group[i] = r() < 0.4 ? 2 : 0
    } else {
      pos[i * 3] = 0.42 + gaussian(r) * 0.3
      pos[i * 3 + 1] = gaussian(r) * 0.36
      pos[i * 3 + 2] = gaussian(r) * 0.3
      group[i] = 1
    }
  }
  return { pos, group }
}

function shieldHalfWidth(y: number) {
  if (y > 0.2) return 0.78 - (y - 0.2) * 0.12
  const t = (0.2 - y) / 1.25
  return 0.78 * Math.sqrt(Math.max(0, 1 - t * t * 1.02))
}

function shield(n: number, r: () => number): Cloud {
  const pos = new Float32Array(n * 3)
  const group = new Uint8Array(n)
  const check: [number, number][] = [
    [-0.34, -0.02],
    [-0.1, -0.28],
    [0.38, 0.3],
  ]
  for (let i = 0; i < n; i++) {
    let x = 0
    let y = 0
    let z = 0
    if (i < n * 0.16) {
      // Check mark floating in front
      const t = r() * 2
      const [a, b] = t < 1 ? [check[0], check[1]] : [check[1], check[2]]
      const f = t < 1 ? t : t - 1
      x = a[0] + (b[0] - a[0]) * f + gaussian(r) * 0.018
      y = a[1] + (b[1] - a[1]) * f + gaussian(r) * 0.018
      z = 0.34
      group[i] = 2
    } else if (i < n * 0.5) {
      // Outline
      y = 0.86 - r() * 1.91
      const side = r() < 0.5 ? -1 : 1
      x = y > 0.82 ? (r() * 2 - 1) * shieldHalfWidth(0.86) : side * shieldHalfWidth(y)
      z = 0.2 * (1 - x * x)
      group[i] = 0
    } else {
      // Surface fill
      do {
        x = r() * 1.6 - 0.8
        y = 0.86 - r() * 1.91
      } while (Math.abs(x) > shieldHalfWidth(y))
      z = 0.2 * (1 - x * x) - 0.02
      group[i] = 3
    }
    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
  }
  return { pos, group }
}

const BUILDERS: Record<Shape, (n: number, r: () => number) => Cloud> = {
  sphere,
  files,
  scan,
  split,
  shield,
}

/** Shapes that breathe with a soft radial wobble. */
const WOBBLE: Record<Shape, number> = { sphere: 1, files: 0, scan: 0.25, split: 0.35, shield: 0 }
const SPIN: Record<Shape, boolean> = { sphere: true, files: false, scan: true, split: false, shield: false }

export default function ParticleField({
  shape,
  interactive = false,
  center = [0.5, 0.5],
  centerMobile,
  scale = 0.36,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shapeRef = useRef<Shape>(shape)
  const redrawRef = useRef<() => void>(() => {})

  useEffect(() => {
    shapeRef.current = shape
    redrawRef.current()
  }, [shape])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = prefersReducedMotion()
    const small = window.innerWidth < 640
    const n = small ? 1100 : 2300
    const clouds = Object.fromEntries(
      (Object.keys(BUILDERS) as Shape[]).map((key, i) => [key, BUILDERS[key](n, rand(17 + i * 101))]),
    ) as Record<Shape, Cloud>

    const pos = new Float32Array(clouds[shapeRef.current].pos)
    const speed = new Float32Array(n)
    const seedR = rand(7)
    for (let i = 0; i < n; i++) speed[i] = 0.03 + seedR() * 0.035
    let group = clouds[shapeRef.current].group
    let wobble = WOBBLE[shapeRef.current]
    let activeShape = shapeRef.current
    let angle = SPIN[activeShape] ? 0 : 0.25
    let lastTime = 0

    const sx = new Float32Array(n)
    const sy = new Float32Array(n)
    const size = new Float32Array(n)
    const bucket = new Uint8Array(n)

    let width = 0
    let height = 0
    let dpr = 1
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999, active: false }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time: number, settle: boolean) => {
      const target = shapeRef.current
      if (target !== activeShape) {
        activeShape = target
        group = clouds[target].group
      }
      const goal = clouds[target].pos
      const goalWobble = WOBBLE[target]
      wobble += (goalWobble - wobble) * (settle ? 1 : 0.04)

      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      const t = time * 0.001
      const mobile = width < 768
      const [cxf, cyf] = mobile && centerMobile ? centerMobile : center
      const cx = width * cxf
      const cy = height * cyf
      const radius = Math.min(width, height) * scale * (mobile ? 1.05 : 1)

      // Round forms spin; flat forms (files, split, shield) settle face-on and sway.
      const frames = lastTime ? Math.min(4, (time - lastTime) / 16.7) : 1
      lastTime = time
      if (reduced || settle) {
        angle = SPIN[target] ? 0.6 : 0.25
      } else if (SPIN[target]) {
        angle += 0.0024 * frames
      } else {
        const faceOn = Math.round(angle / (Math.PI * 2)) * Math.PI * 2 + Math.sin(t * 0.35) * 0.42
        angle += (faceOn - angle) * (1 - Math.pow(0.97, frames))
      }
      const rotY = angle + pointer.x * 0.5
      const rotX = -0.18 + pointer.y * 0.28
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const focal = 2.6

      for (let i = 0; i < n; i++) {
        const k = i * 3
        if (settle) {
          pos[k] = goal[k]
          pos[k + 1] = goal[k + 1]
          pos[k + 2] = goal[k + 2]
        } else {
          pos[k] += (goal[k] - pos[k]) * speed[i]
          pos[k + 1] += (goal[k + 1] - pos[k + 1]) * speed[i]
          pos[k + 2] += (goal[k + 2] - pos[k + 2]) * speed[i]
        }
        let x = pos[k]
        let y = pos[k + 1]
        let z = pos[k + 2]

        if (wobble > 0.01) {
          const w = 1 + wobble * 0.075 * Math.sin(x * 3.1 + t * 0.9) * Math.sin(y * 2.7 + t * 0.7) * Math.cos(z * 2.3 - t * 0.5)
          x *= w
          y *= w
          z *= w
        }

        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        const y1 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX
        const persp = focal / (focal + z2)
        let px = cx + x1 * radius * persp
        let py = cy - y1 * radius * persp

        if (pointer.active) {
          const dx = px - pointer.px
          const dy = py - pointer.py
          const d2 = dx * dx + dy * dy
          const reach = 110
          if (d2 < reach * reach) {
            const d = Math.sqrt(d2) || 1
            const push = ((reach - d) / reach) ** 2 * 26
            px += (dx / d) * push
            py += (dy / d) * push
          }
        }

        sx[i] = px
        sy[i] = py
        const depth = Math.min(1, Math.max(0, (1 - z2) / 2))
        size[i] = (0.7 + depth * 1.25) * (group[i] === 2 ? 1.25 : 1)
        const alphaLevel = Math.min(ALPHA_STEPS - 1, Math.floor(depth * ALPHA_STEPS))
        bucket[i] = group[i] * ALPHA_STEPS + alphaLevel
      }

      ctx.clearRect(0, 0, width, height)
      // One path per colour/alpha bucket keeps fillStyle switches to a handful.
      for (let g = 0; g < PALETTE.length; g++) {
        for (let a = 0; a < ALPHA_STEPS; a++) {
          const b = g * ALPHA_STEPS + a
          const alpha = (g === 1 ? 0.18 : 0.22) + (a / (ALPHA_STEPS - 1)) * (g === 1 ? 0.32 : 0.68)
          ctx.fillStyle = `rgba(${PALETTE[g]},${alpha.toFixed(2)})`
          ctx.beginPath()
          for (let i = 0; i < n; i++) {
            if (bucket[i] !== b) continue
            const s = size[i]
            ctx.rect(sx[i] - s / 2, sy[i] - s / 2, s, s)
          }
          ctx.fill()
        }
      }
    }

    resize()

    if (reduced) {
      // Static frame; redraw only when the shape or size changes.
      redrawRef.current = () => draw(0, true)
      draw(0, true)
      const ro = new ResizeObserver(() => {
        resize()
        draw(0, true)
      })
      ro.observe(canvas)
      return () => ro.disconnect()
    }

    let frame = 0
    let visible = false
    const loop = (time: number) => {
      draw(time, false)
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    redrawRef.current = () => {}

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !document.hidden) start()
      else stop()
    })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : visible && start())
    document.addEventListener("visibilitychange", onVisibility)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const host = canvas.parentElement
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.px = e.clientX - rect.left
      pointer.py = e.clientY - rect.top
      pointer.tx = (pointer.px / rect.width - 0.5) * 2
      pointer.ty = (pointer.py / rect.height - 0.5) * 2
      pointer.active = e.pointerType === "mouse"
    }
    const onLeave = () => {
      pointer.active = false
      pointer.tx = 0
      pointer.ty = 0
    }
    if (interactive && host) {
      host.addEventListener("pointermove", onMove)
      host.addEventListener("pointerleave", onLeave)
    }

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      if (interactive && host) {
        host.removeEventListener("pointermove", onMove)
        host.removeEventListener("pointerleave", onLeave)
      }
    }
    // Layout props are read on each frame through the closure; mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />
}
