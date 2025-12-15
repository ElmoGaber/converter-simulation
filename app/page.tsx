"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { DacSimulator } from "@/components/dac-simulator"
import { AdcAnalyzer } from "@/components/adc-analyzer"
import { TheorySection } from "@/components/theory-section"

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("home")

  return (
    <div className="min-h-screen bg-background circuit-grid">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main>
        {activeSection === "home" && <HeroSection setActiveSection={setActiveSection} />}
        {activeSection === "dac" && <DacSimulator />}
        {activeSection === "adc" && <AdcAnalyzer />}
        {activeSection === "theory" && <TheorySection />}
      </main>
      <footer className="border-t border-border py-8 mt-20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">SignalForge Laboratory v2.4.1</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>IEEE 754 Compliant</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>Research Grade Precision</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
