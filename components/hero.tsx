'use client';

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import { HeroBackgroundSlideshow } from "./hero-background-slideshow"

interface HeroProps {
  onCtaClick?: (text: string) => void;
}

/**
 * Production-ready Hero Section
 * Built with Tailwind CSS + shadcn/ui + TailGrids patterns
 * Professional B2B SaaS aesthetic with no custom CSS
 */
export function Hero({ onCtaClick }: HeroProps) {
  const ctaCards = [
    {
      title: "Uncover sales opportunities",
      description: "Find hidden revenue and growth potential",
      action: "uncover sales opportunities"
    },
    {
      title: "Sharpen go-to-market",
      description: "Optimize your market strategy with data",
      action: "sharpen go-to-market strategy"
    },
    {
      title: "Grow with confidence",
      description: "Make decisions backed by intelligence",
      action: "grow with confidence"
    }
  ];

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Slideshow */}
      <HeroBackgroundSlideshow />

      {/* Gradient Overlays - Pure Tailwind */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

      {/* Grid Pattern - Tailwind bg utilities */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgb(6 182 212) 0px, transparent 1px, transparent 80px),
                          repeating-linear-gradient(90deg, rgb(6 182 212) 0px, transparent 1px, transparent 80px)`
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-8">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">AI-Powered Intelligence</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="font-display font-bold text-white leading-tight">
                  <span className="block text-5xl sm:text-6xl lg:text-7xl mb-3">
                    Simplify intelligence
                  </span>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl text-slate-300">
                    Get answers, not dashboards
                  </span>
                </h1>

                <p className="text-slate-400 text-lg lg:text-xl max-w-2xl leading-relaxed">
                  Built specifically for beverage suppliers, BevGenie's AI uses mastered industry data
                  and your performance signals to answer complex questions in seconds.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => onCtaClick?.('talk to an expert')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-600/25 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-600/40 hover:-translate-y-0.5 group"
                >
                  Talk to an expert
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-700 hover:border-cyan-500/50 bg-slate-900/50 backdrop-blur-sm text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:bg-slate-800/50"
                  onClick={() => onCtaClick?.('view demo')}
                >
                  View demo
                </Button>
              </div>
            </div>

            {/* Right Column - Interactive CTA Cards */}
            <div className="lg:col-span-5 space-y-4">
              {ctaCards.map((card, index) => (
                <Card
                  key={index}
                  onClick={() => onCtaClick?.(card.action)}
                  className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-cyan-500/50 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  {/* Gradient accent */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <h3 className="text-cyan-400 font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">
                        {card.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements - Pure Tailwind */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full border border-cyan-500/10 pointer-events-none" />
      <div className="absolute top-40 right-32 w-64 h-64 rounded-full border border-cyan-500/5 pointer-events-none" />
    </section>
  )
}
