"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  FileText,
  Database,
  TrendingUp,
  Newspaper,
  Shield,
  BarChart3,
  Lightbulb,
  Target,
  TrendingDown,
  Users,
  Check,
} from "lucide-react"

interface DataItem {
  id: string
  title: string
  desc: string
  icon: React.ReactNode
}

interface OutcomeItem {
  id: string
  title: string
  bullets: string[]
  icon: React.ReactNode
}

const leftData: DataItem[] = [
  {
    id: "ttb_cola",
    title: "TTB COLA Registry",
    desc: "Regulatory filings, label approvals, product innovation tracking",
    icon: <FileText size={18} />,
  },
  {
    id: "nabca",
    title: "NABCA Depletions Data",
    desc: "Spirits movement, price sensitivity, geographic consumption patterns",
    icon: <Database size={18} />,
  },
  {
    id: "menu_social",
    title: "Menu, Social, and Job Data",
    desc: "On-premise visibility, consumer sentiment, hiring intent",
    icon: <TrendingUp size={18} />,
  },
  {
    id: "trade_pubs",
    title: "Trade Publications & Industry Newsletters",
    desc: "Competitive launches, innovation tracking",
    icon: <Newspaper size={18} />,
  },
  {
    id: "regulatory",
    title: "Regulatory & Licensing Feeds",
    desc: "Approval timelines, compliance risk indicators",
    icon: <Shield size={18} />,
  },
  {
    id: "supplier",
    title: "Supplier Data (Customer Signals)",
    desc: "POS, shipment, promotional and field signals",
    icon: <BarChart3 size={18} />,
  },
]

const rightData: OutcomeItem[] = [
  {
    id: "market",
    title: "Market & Innovation Intelligence",
    bullets: [
      "Detect emerging trends and whitespace early",
      "Track competitor launches and flavor movements",
      "Accelerate COLA approval cycles and innovation timelines",
    ],
    icon: <Lightbulb size={18} />,
  },
  {
    id: "commercial",
    title: "Commercial & Sales Optimization",
    bullets: [
      "Identify distributor gaps and territory underperformance",
      "Pinpoint high-value accounts and opportunities in real time",
    ],
    icon: <Target size={18} />,
  },
  {
    id: "marketing",
    title: "Marketing & Brand Performance",
    bullets: [
      "Measure campaign effectiveness and ROI by SKU or region",
      "Monitor social sentiment and brand perception shifts",
    ],
    icon: <TrendingDown size={18} />,
  },
  {
    id: "executive",
    title: "Executive & Strategic Insights",
    bullets: ["Provide unified, mastered view across regulatory, commercial, and execution data"],
    icon: <Users size={18} />,
  },
]

export function DataPowered() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [connections, setConnections] = useState<
    Array<{ x1: number; y1: number; x2: number; y2: number; id: string; path: string }>
  >([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.4,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const updateConnections = () => {
      if (!containerRef.current) return

      const container = containerRef.current.getBoundingClientRect()
      const centerBox = containerRef.current.querySelector('[data-center="true"]')
      if (!centerBox) return

      const centerRect = centerBox.getBoundingClientRect()
      const centerLeftX = centerRect.left - container.left
      const centerRightX = centerRect.right - container.left
      const centerY = centerRect.top + centerRect.height / 2 - container.top

      const newConnections: typeof connections = []

      leftData.forEach((item) => {
        const element = containerRef.current?.querySelector(`[data-item="${item.id}"]`)
        if (element) {
          const rect = element.getBoundingClientRect()
          const x1 = rect.right - container.left
          const y1 = rect.top + rect.height / 2 - container.top
          const x2 = centerLeftX
          const y2 = centerY
          const controlOffset = Math.abs(x2 - x1) * 0.4
          const path = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`

          newConnections.push({ id: item.id, x1, y1, x2, y2, path })
        }
      })

      rightData.forEach((item) => {
        const element = containerRef.current?.querySelector(`[data-item="${item.id}"]`)
        if (element) {
          const rect = element.getBoundingClientRect()
          const x1 = centerRightX
          const y1 = centerY
          const x2 = rect.left - container.left
          const y2 = rect.top + rect.height / 2 - container.top
          const controlOffset = Math.abs(x2 - x1) * 0.4
          const path = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`

          newConnections.push({ id: item.id, x1, y1, x2, y2, path })
        }
      })

      setConnections(newConnections)
    }

    updateConnections()
    window.addEventListener("resize", updateConnections)
    return () => window.removeEventListener("resize", updateConnections)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-[#0A1930] to-[#000000] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#0A1930] to-transparent z-[5]" />

      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, #00C8FF 1px, transparent 1px),
            linear-gradient(to bottom, #00C8FF 1px, transparent 1px)
          `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1930]/30 to-transparent z-[3]" />

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#000000] to-transparent z-[5]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-[#FFFFFF] text-3xl md:text-4xl lg:text-5xl mb-6">
            Powered by Data. Designed for Decisions.
          </h2>
          <p className="text-[#FFFFFF]/90 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            At the heart of BevGenie is a unified data foundation and AI core built to deliver answers from day one and
            align every team around one truth. It brings together three layers of value: market visibility, operational
            activation, and predictive intelligence within one continuous system.
          </p>
        </div>

        <div ref={containerRef} className="relative max-w-[1200px] mx-auto">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block overflow-visible"
            style={{ zIndex: 15 }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#00C8FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="dotGlow">
                <stop offset="0%" stopColor="#00C8FF" stopOpacity="1" />
                <stop offset="50%" stopColor="#00C8FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.3" />
              </radialGradient>
            </defs>
            {connections.map((conn) => {
              const isLeftSide = leftData.some((item) => item.id === conn.id)
              return (
                <g key={conn.id}>
                  <path
                    d={conn.path}
                    stroke="url(#wireGrad)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                    filter="url(#glow)"
                  />
                  {isVisible && (
                    <circle r="5" fill="url(#dotGlow)" filter="url(#glow)">
                      <animateMotion dur="2.5s" repeatCount="indefinite" begin={isLeftSide ? "0s" : "2.5s"}>
                        <mpath href={`#path-${conn.id}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values={isLeftSide ? "1;1;0;0" : "0;0;1;1"}
                        keyTimes={isLeftSide ? "0;0.48;0.5;1" : "0;0.5;0.5;1"}
                        dur="5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <path id={`path-${conn.id}`} d={conn.path} fill="none" stroke="none" />
                </g>
              )
            })}
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center relative" style={{ zIndex: 16 }}>
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 backdrop-blur-sm p-6 min-h-[520px] flex flex-col">
                <h3 className="font-display text-xl font-semibold text-[#FFFFFF] mb-2">Unified Data Foundation</h3>
                <p className="text-sm text-[#FFFFFF]/70 mb-6">Mastered Industry Data + Supplier Signal</p>
                <div className="space-y-3 flex-1">
                  {leftData.map((item) => (
                    <div
                      key={item.id}
                      data-item={item.id}
                      className="bg-[#FFFFFF]/5 rounded-lg p-4 border border-[#FFFFFF]/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-[#00C8FF] mt-0.5">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-medium text-[#FFFFFF] text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-[#FFFFFF]/60 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div
                data-center="true"
                className="rounded-xl p-6 w-full bg-gradient-to-br from-[#00C8FF]/20 to-[#00C8FF]/10 border-2 border-[#00C8FF] backdrop-blur-sm flex flex-row items-center justify-center gap-4 min-h-[120px]"
              >
                <div className="bg-[#00C8FF] rounded-full p-3 shrink-0">
                  <BarChart3 className="text-[#0A1930]" size={28} />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-[#FFFFFF] mb-1">BevGenie</h3>
                  <p className="text-xs lg:text-sm text-[#FFFFFF]/80 leading-relaxed">
                    Answers complex commercial questions in seconds
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-xl border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 backdrop-blur-sm p-6 min-h-[520px] flex flex-col">
                <h3 className="font-display text-xl font-semibold text-[#FFFFFF] mb-6">Intelligence Outcomes</h3>
                <div className="space-y-3 flex-1">
                  {rightData.map((item) => (
                    <div
                      key={item.id}
                      data-item={item.id}
                      className="bg-[#FFFFFF]/5 rounded-lg p-4 border border-[#FFFFFF]/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-[#00C8FF] mt-0.5">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-medium text-[#FFFFFF] text-sm mb-2">{item.title}</h4>
                          <ul className="space-y-1.5">
                            {item.bullets.map((bullet, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-[#FFFFFF]/60 leading-relaxed flex items-start gap-2"
                              >
                                <Check size={14} className="text-[#00C8FF] mt-0.5 shrink-0" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
