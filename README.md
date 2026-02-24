# Data Converter Simulation

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

**Interactive web-based simulator** for understanding and visualizing different types of data converters used in digital electronics and signal processing — including Analog-to-Digital (ADC), Digital-to-Analog (DAC), and various encoding schemes.

Live Demo:  
https://v0-data-converter-simulation.vercel.app

---

## ✨ Features

- Real-time simulation of Analog-to-Digital Conversion (ADC)  
- Visualization of Digital-to-Analog Conversion (DAC) with reconstruction  
- Support for multiple ADC types: Flash, SAR, Sigma-Delta, Pipeline  
- Interactive waveform generation and sampling demonstration  
- Quantization error visualization and SNR calculation  
- Different binary coding schemes: Binary, Gray, Two's Complement  
- Step-by-step parameter adjustment (resolution, sampling rate, reference voltage, etc.)  
- Clean, responsive modern UI built with Next.js & Tailwind CSS  
- Educational tooltips and explanations for each conversion stage  
- No installation required — runs directly in the browser  

---

## 🚀 Quick Start

### View the live demo

Just open:  
https://v0-data-converter-simulation.vercel.app

### Run locally

```bash
# Clone the repository
git clone https://github.com/ElmoGaber/converter-simulation.git
cd converter-simulation
```

# Install dependencies
```
pnpm install
# or npm install
# or yarn install
```
# Start development server
```
pnpm dev
# or npm run dev
# or yarn dev
```
Open http://localhost:3000 in your browser.

🛠 Tech Stack

Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS + custom styles
UI Components: shadcn/ui + Radix UI primitives
State Management: React hooks + Zustand (lightweight)
Charts & Visualization: Recharts / Chart.js (or custom canvas)
Build & Deploy: Vercel
Package Manager: pnpm

```
📁 Project Structure
textconverter-simulation/
├── app/                # Next.js app router pages & layouts
├── components/         # Reusable UI components
├── lib/                # Utility functions, converters logic, helpers
├── public/             # Static assets (images, icons, fonts)
├── styles/             # Global CSS if needed
├── .github/
├── components.json     # shadcn/ui config
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
├── LICENSE.txt
└── README.md
```
🎯 Key Simulations Included

ADC Process
Sampling theorem visualization
Quantization levels & error plotting
Different ADC architectures comparison

DAC Process
Binary-weighted, R-2R ladder, PWM-based reconstruction
Zero-order hold & sinc reconstruction filters

Data Encoding
Natural binary vs. Gray code transitions
Offset binary, two's complement representation

Performance Metrics
Signal-to-Quantization-Noise Ratio (SQNR)
Effective Number of Bits (ENOB) calculator
Total Harmonic Distortion (THD) demo
