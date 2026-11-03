import Header from "@/components/Header"
import Preloader from "@/components/Preloader"
import { useRevealOnScroll } from "@/lib/motion"
import Engines from "@/sections/Engines"
import Extension from "@/sections/Extension"
import Faq from "@/sections/Faq"
import Footer from "@/sections/Footer"
import Hero from "@/sections/Hero"
import HowItWorks from "@/sections/HowItWorks"
import Pricing from "@/sections/Pricing"
import Problem from "@/sections/Problem"
import ReportPreview from "@/sections/ReportPreview"
import UseCases from "@/sections/UseCases"

export default function App() {
  useRevealOnScroll()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Preloader />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Problem />
        <HowItWorks />
        <Engines />
        <ReportPreview />
        <Extension />
        <Pricing />
        <UseCases />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
