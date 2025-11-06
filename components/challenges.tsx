import { AlertCircle, TrendingUp, Zap } from "lucide-react"

const challenges = [
  {
    icon: AlertCircle,
    title: "Access Gap",
    problem:
      "Most suppliers lack a full market view — distributor, retail, and product launch data stay scattered or out of reach.",
    solution:
      "BevGenie starts with our mastered industry data so you can see the market even before your internal systems are ready.",
  },
  {
    icon: TrendingUp,
    title: "Attribution Fog",
    problem: "When performance slips, it's hard to know if it's the product, the distributor, pricing, or shelf.",
    solution:
      "Our proprietary AI connects market signals with your performance reality to pinpoint the likely causes and next best moves.",
  },
  {
    icon: Zap,
    title: "Trends That Move Fast",
    problem: "Micro-seasonality and competitive moves outpace monthly reporting.",
    solution:
      "BevGenie gives decision-ready answers in seconds, so you can shift spend, focus reps, and catch demand while it's building.",
  },
]

interface ChallengesProps {
  onCardClick?: (title: string, description: string) => void;
}

export function Challenges({ onCardClick }: ChallengesProps) {
  return (
    <section className="py-20 md:py-32 bg-[#EBEFF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-[#0A1930] text-3xl md:text-4xl lg:text-5xl mb-4">
            Why Traditional Analytics Fall Short
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon
            return (
              <div
                key={index}
                className="bg-[#FFFFFF] rounded-lg p-8 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => onCardClick?.(challenge.title, challenge.problem)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#DA1E28]/10 rounded-lg">
                    <Icon className="text-[#DA1E28]" size={24} />
                  </div>
                  <h3 className="font-display font-semibold text-[#0A1930] text-xl">{challenge.title}</h3>
                </div>

                <p className="text-[#333333] mb-4 leading-relaxed">{challenge.problem}</p>

                <div className="pt-4 border-t border-[#EBEFF2]">
                  <p className="text-[#0A1930] font-medium leading-relaxed">{challenge.solution}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
