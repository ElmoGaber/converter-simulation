"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

function TimingDiagram({
  delays,
  steps,
}: {
  delays: { name: string; value: number; color: string }[]
  steps: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((s) => (s + 1) % Math.min(steps, 16))
    }, 200)
    return () => clearInterval(interval)
  }, [steps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, width, height)

    // Draw timing bars
    const totalDelay = delays.reduce((sum, d) => sum + d.value, 0)
    const barHeight = 25
    const startY = 30

    let currentX = 20
    delays.forEach((delay, i) => {
      const barWidth = (delay.value / totalDelay) * (width - 40)

      // Background bar
      ctx.fillStyle = delay.color + "40"
      ctx.fillRect(currentX, startY + i * 35, barWidth, barHeight)

      // Progress fill for current step
      const progress = Math.min(1, currentStep / (i + 1))
      ctx.fillStyle = delay.color
      ctx.fillRect(currentX, startY + i * 35, barWidth * progress, barHeight)

      // Border
      ctx.strokeStyle = delay.color
      ctx.lineWidth = 1
      ctx.strokeRect(currentX, startY + i * 35, barWidth, barHeight)

      // Label
      ctx.fillStyle = "#888"
      ctx.font = "10px monospace"
      ctx.fillText(delay.name, currentX, startY + i * 35 - 5)
      ctx.fillText(`${delay.value}ns`, currentX + barWidth - 35, startY + i * 35 + 16)

      currentX += barWidth
    })

    // Step counter
    ctx.fillStyle = "#d9a046"
    ctx.font = "bold 14px monospace"
    ctx.fillText(`Step: ${currentStep + 1}/${Math.min(steps, 16)}`, width - 100, height - 15)
  }, [delays, currentStep, steps])

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-[#0a0a0f]">
      <canvas ref={canvasRef} width={500} height={180} className="w-full" />
    </div>
  )
}

function ComparatorGrid({ resolution }: { resolution: number }) {
  const numComparators = Math.pow(2, resolution) - 1
  const maxDisplay = Math.min(numComparators, 63)

  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Comparator Array</span>
        <span className="font-mono text-xs text-primary">{numComparators.toLocaleString()} total</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: maxDisplay }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-sm bg-primary/20 hover:bg-primary/60 transition-colors cursor-pointer"
            title={`Comparator ${i + 1}`}
          />
        ))}
        {numComparators > maxDisplay && (
          <div className="flex items-center px-2 text-xs text-muted-foreground">
            +{(numComparators - maxDisplay).toLocaleString()} more
          </div>
        )}
      </div>
    </div>
  )
}

function FrequencyMeter({
  maxFreq,
  avgFreq,
}: {
  maxFreq: number
  avgFreq: number
}) {
  const formatFreq = (f: number) => {
    if (f >= 1e9) return { value: (f / 1e9).toFixed(2), unit: "GHz" }
    if (f >= 1e6) return { value: (f / 1e6).toFixed(2), unit: "MHz" }
    if (f >= 1e3) return { value: (f / 1e3).toFixed(2), unit: "kHz" }
    return { value: f.toFixed(2), unit: "Hz" }
  }

  const max = formatFreq(maxFreq)
  const avg = formatFreq(avgFreq)

  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Maximum Signal Frequency</span>
        <span className="text-xs text-muted-foreground">(Nyquist)</span>
      </div>

      {/* Max frequency display */}
      <div className="relative p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/30">
        <div className="text-xs text-muted-foreground mb-1">Worst Case</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold text-primary">{max.value}</span>
          <span className="text-lg text-muted-foreground">{max.unit}</span>
        </div>
        {/* Animated signal indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg viewBox="0 0 40 20" className="w-10 h-5">
            <path
              d="M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Avg frequency display */}
      <div className="p-4 rounded-lg bg-secondary/50">
        <div className="text-xs text-muted-foreground mb-1">Average Case</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl font-bold">{avg.value}</span>
          <span className="text-sm text-muted-foreground">{avg.unit}</span>
        </div>
      </div>
    </div>
  )
}

function CounterTypeAdc() {
  const [resolution, setResolution] = useState(8)
  const [comparatorResponse, setComparatorResponse] = useState(50)
  const [comparatorPropagation, setComparatorPropagation] = useState(20)
  const [dacSettling, setDacSettling] = useState(100)
  const [andGatePropagation, setAndGatePropagation] = useState(10)

  const calculations = useMemo(() => {
    const totalDelayPerStep = comparatorResponse + comparatorPropagation + dacSettling + andGatePropagation
    const maxSteps = Math.pow(2, resolution)
    const maxConversionTime = totalDelayPerStep * maxSteps
    const avgConversionTime = totalDelayPerStep * (maxSteps / 2)
    const maxFrequency = 1 / (2 * maxConversionTime * 1e-9)
    const avgFrequency = 1 / (2 * avgConversionTime * 1e-9)

    return {
      totalDelayPerStep,
      maxSteps,
      maxConversionTime,
      avgConversionTime,
      maxFrequency,
      avgFrequency,
    }
  }, [resolution, comparatorResponse, comparatorPropagation, dacSettling, andGatePropagation])

  const delays = [
    { name: "Comparator Response", value: comparatorResponse, color: "#d9a046" },
    { name: "Propagation Delay", value: comparatorPropagation, color: "#2dd4bf" },
    { name: "DAC Settling", value: dacSettling, color: "#a855f7" },
    { name: "Gate Delay", value: andGatePropagation, color: "#f97316" },
  ]

  const formatTime = (ns: number) => {
    if (ns >= 1e6) return `${(ns / 1e6).toFixed(2)} ms`
    if (ns >= 1e3) return `${(ns / 1e3).toFixed(2)} μs`
    return `${ns} ns`
  }

  return (
    <div className="space-y-6">
      {/* Timing diagram */}
      <TimingDiagram delays={delays} steps={calculations.maxSteps} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Resolution</Label>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
                  {resolution}-bit
                </span>
              </div>
              <Slider
                value={[resolution]}
                onValueChange={([v]) => setResolution(v)}
                min={4}
                max={16}
                step={1}
                className="py-2"
              />
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Conversion Steps</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <div className="font-mono text-lg font-bold">{calculations.maxSteps.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Maximum</div>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <div className="font-mono text-lg font-bold">{(calculations.maxSteps / 2).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delay Parameters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Component Delays (ns)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "comp-response",
                label: "Comparator Response",
                value: comparatorResponse,
                setter: setComparatorResponse,
                color: "#d9a046",
              },
              {
                id: "comp-prop",
                label: "Propagation Delay",
                value: comparatorPropagation,
                setter: setComparatorPropagation,
                color: "#2dd4bf",
              },
              { id: "dac-settle", label: "DAC Settling", value: dacSettling, setter: setDacSettling, color: "#a855f7" },
              {
                id: "and-gate",
                label: "Gate Delay",
                value: andGatePropagation,
                setter: setAndGatePropagation,
                color: "#f97316",
              },
            ].map((param) => (
              <div key={param.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: param.color }} />
                  <Label htmlFor={param.id} className="text-xs text-muted-foreground">
                    {param.label}
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id={param.id}
                    type="number"
                    value={param.value}
                    onChange={(e) => param.setter(Number(e.target.value))}
                    min={1}
                    className="pr-10 font-mono bg-secondary/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ns</span>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between p-2 rounded bg-primary/10">
                <span className="text-xs text-muted-foreground">Total per step</span>
                <span className="font-mono font-bold text-primary">{calculations.totalDelayPerStep} ns</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Max T_conv</div>
                <div className="font-mono text-sm font-bold">{formatTime(calculations.maxConversionTime)}</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground mb-1">Avg T_conv</div>
                <div className="font-mono text-sm font-bold">{formatTime(calculations.avgConversionTime)}</div>
              </div>
            </div>

            <FrequencyMeter maxFreq={calculations.maxFrequency} avgFreq={calculations.avgFrequency} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FlashAdc() {
  const [resolution, setResolution] = useState(4)
  const [comparatorDelay, setComparatorDelay] = useState(5)

  const calculations = useMemo(() => {
    const numComparators = Math.pow(2, resolution) - 1
    const numResistors = Math.pow(2, resolution)
    const conversionTime = comparatorDelay
    const maxFrequency = 1 / (2 * conversionTime * 1e-9)

    return {
      numComparators,
      numResistors,
      conversionTime,
      maxFrequency,
    }
  }, [resolution, comparatorDelay])

  return (
    <div className="space-y-6">
      {/* Comparator grid visualization */}
      <ComparatorGrid resolution={resolution} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Resolution</Label>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
                  {resolution}-bit
                </span>
              </div>
              <Slider
                value={[resolution]}
                onValueChange={([v]) => setResolution(v)}
                min={2}
                max={10}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">
                Flash ADCs typically limited to 8-10 bits due to exponential comparator growth
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flash-delay" className="text-xs uppercase tracking-wider text-muted-foreground">
                Comparator Delay
              </Label>
              <div className="relative">
                <Input
                  id="flash-delay"
                  type="number"
                  value={comparatorDelay}
                  onChange={(e) => setComparatorDelay(Number(e.target.value))}
                  min={1}
                  className="pr-10 font-mono bg-secondary/50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ns</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Count */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Component Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Comparators", value: calculations.numComparators, formula: `2^${resolution} - 1` },
                { label: "Resistors", value: calculations.numResistors, formula: `2^${resolution}` },
                { label: "Encoder Outputs", value: resolution, formula: `${resolution} bits` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground font-mono">{item.formula}</div>
                  </div>
                  <div className="font-mono text-xl font-bold text-primary">{item.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Exponential growth warning */}
            {calculations.numComparators > 100 && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                <p className="text-xs text-destructive">
                  High component count significantly increases power consumption and silicon area
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-transparent border border-accent/30">
              <div className="text-xs text-muted-foreground mb-1">Conversion Time</div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-accent">{calculations.conversionTime}</span>
                <span className="text-muted-foreground">ns</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Single comparator delay (parallel operation)</p>
            </div>

            <FrequencyMeter maxFreq={calculations.maxFrequency} avgFreq={calculations.maxFrequency} />

            {/* Trade-offs */}
            <div className="space-y-2 pt-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Trade-offs</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Fastest conversion (single cycle)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Exponential complexity growth</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">High power and silicon area</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AdcAnalyzer() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-accent rounded-full" />
          <h1 className="text-2xl font-bold tracking-tight">ADC Analysis Module</h1>
        </div>
        <p className="text-muted-foreground ml-4">
          Analog-to-Digital converter timing analysis and architecture comparison
        </p>
      </div>

      <Tabs defaultValue="counter" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger
            value="counter"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Counter-Type ADC
          </TabsTrigger>
          <TabsTrigger
            value="flash"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Flash ADC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="counter">
          <CounterTypeAdc />
        </TabsContent>

        <TabsContent value="flash">
          <FlashAdc />
        </TabsContent>
      </Tabs>
    </div>
  )
}
