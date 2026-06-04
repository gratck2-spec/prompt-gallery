"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, History, Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/history", icon: History, label: "History" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
]

const categories = [
  { href: "/category/gpt-image", label: "GPT Image" },
  { href: "/category/gemini", label: "Gemini" },
  { href: "/category/midjourney", label: "Midjourney" },
  { href: "/category/seedance", label: "Seedance" },
  { href: "/category/other", label: "Other" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 px-3">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((category) => {
              const isActive = pathname === category.href
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  {category.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
