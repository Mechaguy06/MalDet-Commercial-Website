export type Page = "about" | "documentation" | "contact"

export type NavigationItem = {
  id: Page
  label: string
  path: string
}

export const navigation: NavigationItem[] = [
  { id: "about", label: "Overview", path: "/" },
  { id: "documentation", label: "How It Works & Tools", path: "/documentation" },
  { id: "contact", label: "About Us & Team", path: "/contact" },
]

export const pagePath: Record<Page, string> = {
  about: "/",
  documentation: "/documentation",
  contact: "/contact",
}

export const MALDET_URL = "https://maldet-fyp.my/"
