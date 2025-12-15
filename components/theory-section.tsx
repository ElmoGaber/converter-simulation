"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TheoryCardProps {
  title: string
  subtitle: string
  description: string
  formula?: string
  advantages: string[]
  disadvantages: string[]
  highlight?: string
  highlightType?: "info" | "warning"
}

function TheoryCard({
  title,
  subtitle,
  description,
  formula,
  advantages,
  disadvantages,
  highlight,
  highlightType = "info",
}: TheoryCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{subtitle}</div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          <svg
            className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
          {formula && (
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Key Formula</div>
              <div className="font-mono text-sm text-primary">{formula}</div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-accent">Advantages</div>
              <ul className="space-y-1.5">
                {advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-destructive">Disadvantages</div>
              <ul className="space-y-1.5">
                {disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {highlight && (
            <div
              className={`p-4 rounded-lg border ${
                highlightType === "warning"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <p className="text-sm text-muted-foreground">{highlight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DacTheory() {
  const dacTypes: TheoryCardProps[] = [
    {
      title: "Weighted-Resistor DAC",
      subtitle: "Binary Weighted Architecture",
      description:
        "Uses an inverting summing amplifier where each digital bit controls a switch connected to a binary-weighted resistor (R, 2R, 4R, 8R...). The MSB has the smallest resistance.",
      formula: "V_out = -R_f × V_ref × Σ(b_i / 2^i × R)",
      advantages: ["Simple principle and construction", "Fast conversion speed", "Easy to understand operation"],
      disadvantages: [
        "Wide resistor value range required",
        "Difficult to maintain accuracy",
        "Expensive for high resolution",
        "Temperature sensitivity issues",
      ],
      highlight:
        "Manufacturing Challenge: A 12-bit DAC with R = 1kΩ requires resistor values from 1kΩ to 2MΩ - a 2048:1 ratio. Maintaining accurate ratios over this range is extremely difficult.",
      highlightType: "warning",
    },
    {
      title: "R-2R Ladder DAC",
      subtitle: "Two-Value Resistor Network",
      description:
        "Overcomes weighted-resistor limitations by using only two resistor values: R and 2R. The ladder network provides binary weighting through a topology that maintains a constant 2:1 ratio at each node.",
      formula: "V_out = V_ref × (D / 2^N)",
      advantages: [
        "Only two resistor values needed",
        "Easier to match 2:1 ratio",
        "Better linearity",
        "Lower manufacturing cost",
        "Scales well to high resolution",
      ],
      disadvantages: [
        "More complex topology",
        "Requires more total resistors",
        "Switch resistance can affect accuracy",
      ],
      highlight:
        "The R-2R topology is the most popular choice for integrated DACs because it's much easier to fabricate resistors with a precise 2:1 ratio.",
      highlightType: "info",
    },
    {
      title: "Switched Current-Source DAC",
      subtitle: "Current Steering Architecture",
      description:
        "Uses binary-weighted current sources that are switched on or off based on the digital input. Currents are summed at a node and converted to voltage through a resistor or transimpedance amplifier.",
      formula: "I_out = Σ(b_i × I_i), V_out = I_out × R_load",
      advantages: [
        "Very fast switching speed",
        "High output drive capability",
        "Good for high-frequency applications",
        "Constant output impedance",
      ],
      disadvantages: [
        "Current source matching challenges",
        "Higher power consumption",
        "Glitches during transitions",
        "Requires good matching",
      ],
    },
    {
      title: "Switched-Capacitor DAC",
      subtitle: "Charge Redistribution",
      description:
        "Uses binary-weighted capacitors that are charged or discharged based on the digital input. Charge redistribution between capacitors produces the analog output voltage.",
      formula: "V_out = V_ref × Σ(b_i × C_i) / C_total",
      advantages: [
        "Excellent ratio matching in CMOS",
        "Low power consumption",
        "Integrates well with digital circuits",
        "Inherent sample-and-hold function",
      ],
      disadvantages: [
        "Slower than current-source designs",
        "Requires periodic refreshing",
        "Sensitive to clock feedthrough",
        "Parasitic capacitance effects",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Digital-to-Analog Conversion Fundamentals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            A DAC converts a digital binary input to a corresponding analog output voltage. The output is typically a
            fraction of a reference voltage, determined by the binary weighting of the input bits.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border text-center">
              <div className="text-xs text-muted-foreground mb-1">General Formula</div>
              <div className="font-mono text-primary">{"V_out = V_ref × (D / 2^N)"}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border text-center">
              <div className="text-xs text-muted-foreground mb-1">Resolution</div>
              <div className="font-mono text-primary">{"2^N levels"}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border text-center">
              <div className="text-xs text-muted-foreground mb-1">LSB Size</div>
              <div className="font-mono text-primary">{"V_ref / 2^N"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {dacTypes.map((dac, i) => (
          <TheoryCard key={i} {...dac} />
        ))}
      </div>
    </div>
  )
}

function AdcTheory() {
  const adcTypes: TheoryCardProps[] = [
    {
      title: "Flash (Parallel) ADC",
      subtitle: "Fastest Architecture",
      description:
        "Uses 2^N - 1 comparators operating in parallel, each comparing the input voltage against a different reference level generated by a resistor ladder. Conversion completes in one clock cycle.",
      formula: "T_conv = t_comparator (single delay)",
      advantages: [
        "Fastest conversion (single cycle)",
        "No track-and-hold required for DC",
        "Simple timing requirements",
        "Ideal for video and RF applications",
      ],
      disadvantages: [
        "Component count grows as 2^N",
        "High power consumption",
        "Large silicon area required",
        "Practically limited to 8-10 bits",
      ],
      highlight:
        "The conversion time depends only on the response time and propagation delay of a single comparator because all comparators work in parallel.",
      highlightType: "info",
    },
    {
      title: "Counter-Type (Ramp) ADC",
      subtitle: "Sequential Comparison",
      description:
        "Uses a counter that increments from zero, with the count value fed to a DAC. A comparator determines when the DAC output exceeds the input signal, stopping the counter.",
      formula: "T_conv_max = (t_comp + t_DAC + t_gate) × 2^N",
      advantages: [
        "Simple and low cost",
        "Low component count",
        "Good accuracy possible",
        "Resolution easily increased",
      ],
      disadvantages: [
        "Slow conversion (2^N clock cycles)",
        "Conversion time depends on input",
        "Requires stable input during conversion",
      ],
      highlight:
        "Maximum signal frequency is limited by the worst-case conversion time: f_max = 1 / (2 × T_conv_max) based on Nyquist criterion.",
      highlightType: "warning",
    },
    {
      title: "Successive Approximation (SAR) ADC",
      subtitle: "Binary Search Algorithm",
      description:
        "Uses binary search to find the digital value. Starting from MSB, each bit is tested by comparing the DAC output to the input. Conversion takes N clock cycles for N-bit resolution.",
      formula: "T_conv = N × (t_comp + t_DAC)",
      advantages: [
        "Good balance of speed and accuracy",
        "Moderate power consumption",
        "Popular for medium-speed applications",
        "Fixed conversion time",
      ],
      disadvantages: [
        "Requires stable input during conversion",
        "More complex control logic",
        "Speed limited by DAC settling",
      ],
    },
    {
      title: "Sigma-Delta (ΔΣ) ADC",
      subtitle: "Oversampling Architecture",
      description:
        "Uses oversampling and noise shaping to achieve high resolution. A 1-bit ADC samples at many times the Nyquist rate, with digital filtering to produce the final output.",
      formula: "SNR improves by 9dB per doubling of oversampling ratio",
      advantages: [
        "Very high resolution (16-24 bits)",
        "Excellent linearity",
        "Inherent anti-aliasing",
        "Low component matching requirements",
      ],
      disadvantages: [
        "Slower conversion rate",
        "Requires digital decimation filter",
        "Latency in conversion",
        "Not suitable for multiplexed inputs",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Analog-to-Digital Conversion Fundamentals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            An ADC samples an analog input signal and produces a digital output code representing the input voltage. The
            conversion process involves sampling, quantization, and encoding.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border text-center">
              <div className="text-xs text-muted-foreground mb-1">Quantization Levels</div>
              <div className="font-mono text-accent">{"2^N"}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border text-center">
              <div className="text-xs text-muted-foreground mb-1">LSB Size</div>
              <div className="font-mono text-accent">{"V_FS / 2^N"}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-border text-center">
              <div className="text-xs text-muted-foreground mb-1">Quantization Error</div>
              <div className="font-mono text-accent">{"± 0.5 LSB"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {adcTypes.map((adc, i) => (
          <TheoryCard key={i} {...adc} />
        ))}
      </div>
    </div>
  )
}

function ComparisonTable() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Architecture Selection Guide</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-medium text-muted-foreground">Architecture</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Speed</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Resolution</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Power</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Cost</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-secondary/20">
                <td className="p-4 font-medium">Flash ADC</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-accent/20 text-accent text-xs">Fastest</span>
                </td>
                <td className="p-4 text-center">4-10 bits</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-destructive/20 text-destructive text-xs">High</span>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-destructive/20 text-destructive text-xs">High</span>
                </td>
                <td className="p-4 text-muted-foreground">Video, RF, Oscilloscopes</td>
              </tr>
              <tr className="hover:bg-secondary/20">
                <td className="p-4 font-medium">SAR ADC</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">Medium</span>
                </td>
                <td className="p-4 text-center">8-18 bits</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">Low</span>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">Low</span>
                </td>
                <td className="p-4 text-muted-foreground">Data acquisition, MCU peripherals</td>
              </tr>
              <tr className="hover:bg-secondary/20">
                <td className="p-4 font-medium">Sigma-Delta</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">Slow</span>
                </td>
                <td className="p-4 text-center">16-24 bits</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">Low</span>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">Low</span>
                </td>
                <td className="p-4 text-muted-foreground">Audio, Precision measurement</td>
              </tr>
              <tr className="hover:bg-secondary/20">
                <td className="p-4 font-medium">Counter-Type</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">Slowest</span>
                </td>
                <td className="p-4 text-center">8-16 bits</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-accent/20 text-accent text-xs">Lowest</span>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-accent/20 text-accent text-xs">Lowest</span>
                </td>
                <td className="p-4 text-muted-foreground">Simple applications, education</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function TheorySection() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
          <h1 className="text-2xl font-bold tracking-tight">Technical Documentation</h1>
        </div>
        <p className="text-muted-foreground ml-4">
          Comprehensive reference for data converter principles and architectures
        </p>
      </div>

      <Tabs defaultValue="dac" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger
            value="dac"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            DAC Architectures
          </TabsTrigger>
          <TabsTrigger value="adc" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            ADC Architectures
          </TabsTrigger>
          <TabsTrigger
            value="compare"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dac">
          <DacTheory />
        </TabsContent>

        <TabsContent value="adc">
          <AdcTheory />
        </TabsContent>

        <TabsContent value="compare">
          <ComparisonTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
