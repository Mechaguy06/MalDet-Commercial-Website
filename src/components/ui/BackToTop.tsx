import { useEffect, useState } from "react"
import { scrollToPageTop } from "@/lib/scroll"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      className={`back-to-top ${visible ? "back-to-top-visible" : ""}`}
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => scrollToPageTop()}
    >
      <span aria-hidden="true">↑</span>
    </button>
  )
}
