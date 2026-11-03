import { useEffect } from "react"
import type { Page } from "@/data/navigation"
import { useTheme } from "@/hooks/useTheme"
import { useLenis } from "@/hooks/useLenis"
import Preloader from "@/components/Preloader"
import ScrollProgress from "@/components/ui/ScrollProgress"
import BackToTop from "@/components/ui/BackToTop"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import AboutPage from "@/views/AboutPage"
import DocumentationPage from "@/views/DocumentationPage"
import ContactPage from "@/views/ContactPage"

/** Adds `.is-visible` to every `.reveal` element as it scrolls into view. */
function useRevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal")
    if (
      typeof window.IntersectionObserver !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    targets.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

export default function SiteShell({ page }: { page: Page }) {
  const { theme, toggleTheme } = useTheme()

  useLenis()
  useRevealOnScroll()

  return (
    <div className="app-shell">
      <Preloader />
      <div className="aurora" aria-hidden="true">
        <i className="aurora-blob aurora-blob-one" />
        <i className="aurora-blob aurora-blob-two" />
        <i className="aurora-blob aurora-blob-three" />
      </div>
      <ScrollProgress />
      <Header page={page} theme={theme} onToggleTheme={toggleTheme} />
      <div className="page-transition">
        {page === "about" && <AboutPage />}
        {page === "documentation" && <DocumentationPage />}
        {page === "contact" && <ContactPage />}
      </div>
      <BackToTop />
      <Footer />
    </div>
  )
}
