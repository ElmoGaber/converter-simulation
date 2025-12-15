"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "home", label: "Laboratory" },
    { id: "dac", label: "DAC Module" },
    { id: "adc", label: "ADC Module" },
    { id: "theory", label: "Documentation" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button onClick={() => setActiveSection("home")} className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 12h4l3-9 3 18 3-9h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">SignalForge</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Data Converter Lab</span>
          </div>
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-200",
                activeSection === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative z-10">{item.label}</span>
              {activeSection === item.id && <span className="absolute inset-0 rounded-lg bg-primary/10" />}
              {/* Connection dots between nav items */}
              {index < navItems.length - 1 && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-1 w-1 rounded-full bg-border hidden lg:block" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>System Active</span>
        </div>
      </div>
    </header>
  )
}
