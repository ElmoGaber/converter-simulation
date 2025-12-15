"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

function OscilloscopeDisplay({ voltage, maxVoltage }: { voltage: number; maxVoltage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const historyRef = useRef<number[]>([])

  useEffect(() => {
    historyRef.current.push(voltage)
    if (historyRef.current.length > 100) historyRef.current.shift()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = "rgba(217, 160, 70, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Signal trace
    ctx.strokeStyle = "#d9a046"
    ctx.lineWidth = 2
    ctx.beginPath()

    const history = historyRef.current
    history.forEach((v, i) => {
      const x = (i / 100) * width
      const normalizedV = Math.min(Math.abs(v) / maxVoltage, 1)
      const y = height - normalizedV * height * 0.9 - height * 0.05

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Current level indicator
    const currentY = height - Math.min(Math.abs(voltage) / maxVoltage, 1) * height * 0.9 - height * 0.05
    ctx.fillStyle = "#d9a046"
    ctx.beginPath()
    ctx.arc(width - 5, currentY, 4, 0, Math.PI * 2)
    ctx.fill()
  }, [voltage, maxVoltage])

  return (
    <div className="relative rounded-lg overflow-hidden border border-border bg-[#0a0a0f]">
      <canvas ref={canvasRef} width={400} height={150} className="w-full" />
      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-background/80 text-xs font-mono text-primary">
        OUTPUT
      </div>
    </div>
  )
}

function WeightedResistorSchematic({
  resolution,
  bits,
  resistorValues,
  rFeedback,
}: {
  resolution: number
  bits: string
  resistorValues: { value: number; active: boolean }[]
  rFeedback: number
}) {
  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-6 overflow-x-auto">
      <svg viewBox="0 0 500 200" className="w-full min-w-[400px]" style={{ maxHeight: "200px" }}>
        {/* Op-amp */}
        <path d="M350 100 L400 70 L400 130 Z" fill="none" stroke="#d9a046" strokeWidth="2" />
        <text x="390" y="105" fill="#d9a046" fontSize="12" fontFamily="monospace">
          -
        </text>
        <text x="390" y="85" fill="#d9a046" fontSize="12" fontFamily="monospace">
          +
        </text>

        {/* Feedback resistor */}
        <line x1="350" y1="100" x2="350" y2="50" stroke="#d9a046" strokeWidth="1.5" />
        <line x1="350" y1="50" x2="450" y2="50" stroke="#d9a046" strokeWidth="1.5" />
        <line x1="450" y1="50" x2="450" y2="100" stroke="#d9a046" strokeWidth="1.5" />
        <rect x="380" y="42" width="40" height="16" fill="#0a0a0f" stroke="#d9a046" strokeWidth="1.5" />
        <text x="400" y="53" fill="#666" fontSize="8" textAnchor="middle" fontFamily="monospace">
          {rFeedback >= 1000 ? `${rFeedback / 1000}kΩ` : `${rFeedback}Ω`}
        </text>

        {/* Output */}
        <line x1="400" y1="100" x2="480" y2="100" stroke="#d9a046" strokeWidth="1.5" />
        <text x="470" y="115" fill="#d9a046" fontSize="10" fontFamily="monospace">
          Vout
        </text>

        {/* Input resistors */}
        {resistorValues.slice(0, Math.min(resolution, 4)).map((r, i) => {
          const y = 60 + i * 35
          const isActive = bits[i] === "1"
          return (
            <g key={i}>
              {/* Switch */}
              <circle cx={60} cy={y} r={4} fill={isActive ? "#d9a046" : "#333"} />
              <text x={40} y={y + 4} fill={isActive ? "#d9a046" : "#666"} fontSize="10" fontFamily="monospace">
                B{resolution - 1 - i}
              </text>

              {/* Connection to summing node */}
              <line x1={64} y1={y} x2={120} y2={y} stroke={isActive ? "#d9a046" : "#333"} strokeWidth="1.5" />

              {/* Resistor */}
              <rect
                x={120}
                y={y - 8}
                width={60}
                height={16}
                fill="#0a0a0f"
                stroke={isActive ? "#d9a046" : "#333"}
                strokeWidth="1.5"
              />
              <text
                x={150}
                y={y + 3}
                fill={isActive ? "#888" : "#444"}
                fontSize="7"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {r.value >= 1000000
                  ? `${(r.value / 1000000).toFixed(0)}MΩ`
                  : r.value >= 1000
                    ? `${r.value / 1000}kΩ`
                    : `${r.value}Ω`}
              </text>

              {/* To summing junction */}
              <line x1={180} y1={y} x2={300} y2={y} stroke={isActive ? "#d9a046" : "#333"} strokeWidth="1.5" />
              <line x1={300} y1={y} x2={350} y2={100} stroke={isActive ? "#d9a046" : "#333"} strokeWidth="1.5" />
            </g>
          )
        })}

        {/* Vref label */}
        <text x={20} y={30} fill="#2dd4bf" fontSize="10" fontFamily="monospace">
          Vref
        </text>
        <line x1={20} y1={35} x2={20} y2={170} stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4,4" />

        {/* Ground */}
        <line x1={385} y1={130} x2={385} y2={150} stroke="#666" strokeWidth="1.5" />
        <line x1={375} y1={150} x2={395} y2={150} stroke="#666" strokeWidth="1.5" />
        <line x1={379} y1={155} x2={391} y2={155} stroke="#666" strokeWidth="1" />
        <line x1={383} y1={160} x2={387} y2="160" stroke="#666" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

function R2RLadderSchematic({ resolution, bits }: { resolution: number; bits: string }) {
  const displayBits = Math.min(resolution, 6)

  return (
    <div className="rounded-lg border border-border bg-[#0a0a0f] p-6 overflow-x-auto">
      <svg viewBox="0 0 500 180" className="w-full min-w-[400px]" style={{ maxHeight: "180px" }}>
        {/* Main ladder */}
        {Array.from({ length: displayBits }).map((_, i) => {
          const x = 60 + i * 65
          const isActive = bits[i] === "1"

          return (
            <g key={i}>
              {/* Vertical 2R resistor */}
              <line x1={x} y1={50} x2={x} y2={70} stroke={isActive ? "#d9a046" : "#333"} strokeWidth="1.5" />
              <rect
                x={x - 15}
                y={70}
                width={30}
                height={12}
                fill="#0a0a0f"
                stroke={isActive ? "#d9a046" : "#333"}
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={79}
                fill={isActive ? "#888" : "#444"}
                fontSize="7"
                textAnchor="middle"
                fontFamily="monospace"
              >
                2R
              </text>
              <line x1={x} y1={82} x2={x} y2={100} stroke={isActive ? "#d9a046" : "#333"} strokeWidth="1.5" />

              {/* Switch indicator */}
              <circle cx={x} cy={110} r={5} fill={isActive ? "#d9a046" : "#333"} />
              <text
                x={x}
                y={130}
                fill={isActive ? "#d9a046" : "#666"}
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                B{resolution - 1 - i}
              </text>

              {/* Horizontal R resistor (except last) */}
              {i < displayBits - 1 && (
                <>
                  <line x1={x} y1={50} x2={x + 20} y2={50} stroke="#d9a046" strokeWidth="1.5" />
                  <rect x={x + 20} y={44} width={25} height={12} fill="#0a0a0f" stroke="#d9a046" strokeWidth="1.5" />
                  <text x={x + 32} y={53} fill="#888" fontSize="7" textAnchor="middle" fontFamily="monospace">
                    R
                  </text>
                  <line x1={x + 45} y1={50} x2={x + 65} y2={50} stroke="#d9a046" strokeWidth="1.5" />
                </>
              )}
            </g>
          )
        })}

        {/* Output */}
        <line x1={60 + (displayBits - 1) * 65} y1={50} x2={480} y2={50} stroke="#d9a046" strokeWidth="1.5" />
        <text x={460} y={40} fill="#d9a046" fontSize="10" fontFamily="monospace">
          Vout
        </text>

        {/* Labels */}
        <text x={20} y={110} fill="#2dd4bf" fontSize="9" fontFamily="monospace">
          Vref
        </text>
        <text x={20} y={130} fill="#666" fontSize="9" fontFamily="monospace">
          GND
        </text>
      </svg>
    </div>
  )
}

function BinaryInputPanel({
  resolution,
  value,
  onChange,
}: {
  resolution: number
  value: string
  onChange: (value: string) => void
}) {
  const paddedValue = value.padStart(resolution, "0").slice(0, resolution)

  const toggleBit = (index: number) => {
    const bits = paddedValue.split("")
    bits[index] = bits[index] === "0" ? "1" : "0"
    onChange(bits.join(""))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Binary Input</Label>
        <span className="text-xs text-muted-foreground font-mono">DEC: {Number.parseInt(paddedValue, 2)}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {paddedValue.split("").map((bit, i) => (
          <button
            key={i}
            onClick={() => toggleBit(i)}
            className={`
              relative w-10 h-12 rounded-md font-mono text-lg font-bold
              transition-all duration-150 
              ${
                bit === "1"
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(217,160,70,0.3)]"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }
            `}
          >
            {bit}
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground">
              {i === 0 ? "MSB" : i === resolution - 1 ? "LSB" : `B${resolution - 1 - i}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function WeightedResistorDac() {
  const [resolution, setResolution] = useState(4)
  const [binaryInput, setBinaryInput] = useState("1010")
  const [vRef, setVRef] = useState(5)
  const [rBase, setRBase] = useState(1000)
  const [rFeedback, setRFeedback] = useState(1000)

  const maxValue = Math.pow(2, resolution) - 1
  const paddedBits = binaryInput.padStart(resolution, "0").slice(0, resolution)
  const decimalValue = Number.parseInt(paddedBits, 2) || 0

  const resistorValues = useMemo(() => {
    return Array.from({ length: resolution }, (_, i) => ({
      value: rBase * Math.pow(2, i),
      active: paddedBits[i] === "1",
    }))
  }, [resolution, rBase, paddedBits])

  const outputVoltage = useMemo(() => {
    let totalCurrent = 0
    paddedBits.split("").forEach((bit, index) => {
      if (bit === "1") {
        const resistorValue = rBase * Math.pow(2, index)
        totalCurrent += vRef / resistorValue
      }
    })
    return -rFeedback * totalCurrent
  }, [paddedBits, vRef, rBase, rFeedback])

  const resistorRange = rBase * Math.pow(2, resolution - 1)
  const rangeRatio = resistorRange / rBase

  return (
    <div className="space-y-6">
      {/* Circuit schematic */}
      <WeightedResistorSchematic
        resolution={resolution}
        bits={paddedBits}
        resistorValues={resistorValues}
        rFeedback={rFeedback}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
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
                onValueChange={([v]) => {
                  setResolution(v)
                  setBinaryInput("0".repeat(v))
                }}
                min={2}
                max={12}
                step={1}
                className="py-2"
              />
            </div>

            <div className="pt-4">
              <BinaryInputPanel resolution={resolution} value={binaryInput} onChange={setBinaryInput} />
            </div>
          </CardContent>
        </Card>

        {/* Parameters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vref" className="text-xs uppercase tracking-wider text-muted-foreground">
                  V_ref
                </Label>
                <div className="relative">
                  <Input
                    id="vref"
                    type="number"
                    value={vRef}
                    onChange={(e) => setVRef(Number(e.target.value))}
                    min={0.1}
                    step={0.1}
                    className="pr-8 font-mono bg-secondary/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">V</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rbase" className="text-xs uppercase tracking-wider text-muted-foreground">
                  R Base
                </Label>
                <div className="relative">
                  <Input
                    id="rbase"
                    type="number"
                    value={rBase}
                    onChange={(e) => setRBase(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="pr-8 font-mono bg-secondary/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Ω</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfeedback" className="text-xs uppercase tracking-wider text-muted-foreground">
                R Feedback
              </Label>
              <div className="relative">
                <Input
                  id="rfeedback"
                  type="number"
                  value={rFeedback}
                  onChange={(e) => setRFeedback(Number(e.target.value))}
                  min={100}
                  step={100}
                  className="pr-8 font-mono bg-secondary/50"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Ω</span>
              </div>
            </div>

            {/* Manufacturing warning */}
            <div
              className={`p-3 rounded-lg border ${rangeRatio > 1000 ? "border-destructive/50 bg-destructive/5" : "border-accent/30 bg-accent/5"}`}
            >
              <div className="text-xs uppercase tracking-wider mb-1 text-muted-foreground">Resistor Ratio</div>
              <div className="font-mono text-lg font-bold">{rangeRatio.toLocaleString()}:1</div>
              {rangeRatio > 1000 && (
                <p className="text-xs text-destructive mt-2">High ratio impacts manufacturing precision</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Output Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <OscilloscopeDisplay voltage={Math.abs(outputVoltage)} maxVoltage={vRef} />

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Voltage</div>
                <div className="font-mono text-2xl font-bold text-primary">{Math.abs(outputVoltage).toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">Volts</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Level</div>
                <div className="font-mono text-2xl font-bold">{decimalValue}</div>
                <div className="text-xs text-muted-foreground">of {maxValue}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xs text-muted-foreground font-mono">
                {"$$V_{out} = -R_f \\cdot \\sum_{i=0}^{N-1} \\frac{b_i \\cdot V_{ref}}{2^i \\cdot R}$$"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function R2RLadderDac() {
  const [resolution, setResolution] = useState(4)
  const [binaryInput, setBinaryInput] = useState("1010")
  const [vRef, setVRef] = useState(5)
  const [rValue, setRValue] = useState(10000)

  const paddedBits = binaryInput.padStart(resolution, "0").slice(0, resolution)
  const maxValue = Math.pow(2, resolution) - 1
  const decimalValue = Number.parseInt(paddedBits, 2) || 0
  const outputVoltage = (decimalValue / Math.pow(2, resolution)) * vRef

  return (
    <div className="space-y-6">
      <R2RLadderSchematic resolution={resolution} bits={paddedBits} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
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
                onValueChange={([v]) => {
                  setResolution(v)
                  setBinaryInput("0".repeat(v))
                }}
                min={2}
                max={16}
                step={1}
                className="py-2"
              />
            </div>

            <div className="pt-4">
              <BinaryInputPanel resolution={resolution} value={binaryInput} onChange={setBinaryInput} />
            </div>
          </CardContent>
        </Card>

        {/* Parameters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vref-r2r" className="text-xs uppercase tracking-wider text-muted-foreground">
                  V_ref
                </Label>
                <div className="relative">
                  <Input
                    id="vref-r2r"
                    type="number"
                    value={vRef}
                    onChange={(e) => setVRef(Number(e.target.value))}
                    min={0.1}
                    step={0.1}
                    className="pr-8 font-mono bg-secondary/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">V</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rvalue" className="text-xs uppercase tracking-wider text-muted-foreground">
                  R Value
                </Label>
                <div className="relative">
                  <Input
                    id="rvalue"
                    type="number"
                    value={rValue}
                    onChange={(e) => setRValue(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="pr-8 font-mono bg-secondary/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Ω</span>
                </div>
              </div>
            </div>

            {/* Component count */}
            <div className="space-y-2 pt-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Component Summary</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <div className="font-mono text-lg font-bold">{resolution}</div>
                  <div className="text-xs text-muted-foreground">R resistors</div>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <div className="font-mono text-lg font-bold">{resolution + 1}</div>
                  <div className="text-xs text-muted-foreground">2R resistors</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-accent/30 bg-accent/5">
              <div className="text-xs uppercase tracking-wider mb-1 text-muted-foreground">Advantage</div>
              <p className="text-xs text-muted-foreground">Only 2:1 ratio required regardless of resolution</p>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Output Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <OscilloscopeDisplay voltage={outputVoltage} maxVoltage={vRef} />

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Voltage</div>
                <div className="font-mono text-2xl font-bold text-primary">{outputVoltage.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">Volts</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Level</div>
                <div className="font-mono text-2xl font-bold">{decimalValue}</div>
                <div className="text-xs text-muted-foreground">of {maxValue}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-xs text-muted-foreground font-mono">
                {"$$V_{out} = V_{ref} \\cdot \\frac{D}{2^N}$$"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function DacSimulator() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h1 className="text-2xl font-bold tracking-tight">DAC Simulation Module</h1>
        </div>
        <p className="text-muted-foreground ml-4">
          Digital-to-Analog converter architectures with real-time circuit visualization
        </p>
      </div>

      <Tabs defaultValue="weighted" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger
            value="weighted"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Weighted-Resistor
          </TabsTrigger>
          <TabsTrigger
            value="r2r"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            R-2R Ladder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weighted">
          <WeightedResistorDac />
        </TabsContent>

        <TabsContent value="r2r">
          <R2RLadderDac />
        </TabsContent>
      </Tabs>
    </div>
  )
}
