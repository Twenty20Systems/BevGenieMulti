'use client';

import { TrendingUp, Users, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const solutions = [
  {
    icon: TrendingUp,
    title: "For Marketing & Innovation",
    subtitle: "Always know which trends to bet on. Ask:",
    questions: [
      "Which flavors and formats are accelerating across categories?",
      "Which competitors just filed new expanded distribution?",
      "How did our latest campaign shift velocity by market?",
    ],
    accentColor: "cyan", // Tailwind color name
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    borderClass: "border-l-cyan-500",
    iconBgClass: "bg-cyan-500/10",
    iconClass: "text-cyan-500",
    questionIconClass: "text-cyan-400",
  },
  {
    icon: Users,
    title: "For Sales & Growth",
    subtitle: "Always know where to focus your next move. Ask:",
    questions: [
      "Which territories are pacing ahead or behind target?",
      "Which distributors are maximizing execution and compliance?",
      "Which accounts are expanding assortment fastest?",
    ],
    accentColor: "amber", // Tailwind color name
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderClass: "border-l-amber-500",
    iconBgClass: "bg-amber-500/10",
    iconClass: "text-amber-500",
    questionIconClass: "text-amber-400",
  },
]

interface SolutionsProps {
  onCardClick?: (title: string) => void;
  onQuestionClick?: (question: string, category: string) => void;
}

/**
 * Production-ready Solutions Section
 * Built with Tailwind CSS + shadcn/ui Card components
 * No inline styles - all Tailwind utilities
 */
export function Solutions({ onCardClick, onQuestionClick }: SolutionsProps) {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-[5]" />

      {/* Grid pattern - Pure Tailwind */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgb(6 182 212) 0px, transparent 1px, transparent 80px),
                          repeating-linear-gradient(90deg, rgb(6 182 212) 0px, transparent 1px, transparent 80px)`
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/30 via-transparent to-transparent z-[3]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto space-y-4">
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-sm font-medium px-4 py-1">
            Industry-Specific Intelligence
          </Badge>

          <h2 className="font-display font-bold text-white text-4xl md:text-5xl lg:text-6xl">
            For teams who can't afford to guess
          </h2>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            AI that delivers instant, trusted answers - grounded in mastered, multi-source industry data.
            Tailored, timely, and trustworthy, delivered when decisions matter most.
          </p>
        </div>

        {/* Solution Cards */}
        <div className="space-y-6 lg:space-y-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <Card
                key={index}
                onClick={() => onCardClick?.(solution.title)}
                className={`group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 p-8 lg:p-10 cursor-pointer transition-all duration-300 hover:shadow-xl ${solution.borderClass} border-l-4`}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative grid md:grid-cols-12 gap-8">

                  {/* Left Column - Icon, Title, Subtitle */}
                  <div className="md:col-span-4 space-y-4">
                    <div className={`inline-flex p-4 rounded-xl ${solution.iconBgClass} ring-1 ring-white/5`}>
                      <Icon className={`w-8 h-8 ${solution.iconClass}`} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-semibold text-2xl lg:text-3xl text-white group-hover:text-cyan-100 transition-colors">
                        {solution.title}
                      </h3>
                      <p className="text-slate-400 text-base lg:text-lg font-medium">
                        {solution.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Questions */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="space-y-3">
                      {solution.questions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuestionClick?.(question, solution.title);
                          }}
                          className="group/question w-full flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
                        >
                          <Search className={`w-5 h-5 flex-shrink-0 ${solution.questionIconClass} group-hover/question:scale-110 transition-transform`} />
                          <span className="text-slate-300 group-hover/question:text-white text-left text-base lg:text-lg leading-relaxed font-medium transition-colors">
                            {question}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
