"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  setActiveSection: (section: string) => void
}

function WaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      ctx.fillStyle = "rgba(8, 8, 12, 0.1)"
      ctx.fillRect(0, 0, width, height)

      // Analog wave (smooth sine)
      ctx.beginPath()
      ctx.strokeStyle = "rgba(45, 212, 191, 0.6)"
      ctx.lineWidth = 2
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x + time) * 0.02) * 40 + Math.sin((x + time) * 0.05) * 20
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Digital stepped wave
      ctx.beginPath()
      ctx.strokeStyle = "rgba(217, 160, 70, 0.8)"
      ctx.lineWidth = 2
      const stepWidth = 30
      for (let x = 0; x < width; x++) {
        const sampleX = Math.floor((x + time * 0.5) / stepWidth) * stepWidth
        const y = height / 2 + Math.round((Math.sin(sampleX * 0.02) * 40 + Math.sin(sampleX * 0.05) * 20) / 10) * 10
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      time += 2
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
}

function BinaryRain() {
  const [columns, setColumns] = useState<{ x: number; chars: string[]; speed: number }[]>([])

  useEffect(() => {
    const cols = []
    for (let i = 0; i < 15; i++) {
      const chars = []
      for (let j = 0; j < 8; j++) {
        chars.push(Math.random() > 0.5 ? "1" : "0")
      }
      cols.push({
        x: 5 + i * 7,
        chars,
        speed: 0.5 + Math.random() * 1.5,
      })
    }
    setColumns(cols)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute font-mono text-xs text-primary animate-pulse"
          style={{
            left: `${col.x}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${2 / col.speed}s`,
          }}
        >
          {col.chars.map((char, j) => (
            <div key={j} className="leading-5 opacity-60">
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function HeroSection({ setActiveSection }: HeroSectionProps) {
  const features = [
    {
      id: "dac",
      title: "DAC Synthesis",
      subtitle: "Digital to Analog",
      description: "Weighted-Resistor & R-2R Ladder architectures with real-time circuit visualization",
      specs: ["4-16 bit resolution", "Live output voltage", "Component analysis"],
    },
    {
      id: "adc",
      title: "ADC Analysis",
      subtitle: "Analog to Digital",
      description: "Counter-Type timing calculator and Flash ADC comparator analysis",
      specs: ["Frequency limits", "Timing diagrams", "Architecture comparison"],
    },
    {
      id: "theory",
      title: "Documentation",
      subtitle: "Reference Library",
      description: "Complete theory covering four DAC and four ADC architectures",
      specs: ["LaTeX equations", "Trade-off analysis", "Design guidelines"],
    },
  ]

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <WaveformCanvas />
      <BinaryRain />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,160,70,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,160,70,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Simulation Environment v2.4
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">Data Converter</span>
              <br />
              <span className="text-gradient">Laboratory</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Professional simulation platform for signal conversion analysis. Explore DAC architectures, calculate ADC
              timing parameters, and master the fundamentals of mixed-signal design.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => setActiveSection("dac")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8"
              >
                Launch Simulator
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setActiveSection("theory")}
                className="border-border hover:bg-secondary"
              >
                View Documentation
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {[
                { value: "4", label: "DAC Types" },
                { value: "4", label: "ADC Types" },
                { value: "16", label: "Max Bits" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-primary font-mono">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveSection(feature.id)}
                className="w-full group relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 text-left transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                {/* Index number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-border/50 font-mono leading-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="relative">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{feature.subtitle}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">{feature.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {feature.specs.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-xs text-secondary-foreground"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
