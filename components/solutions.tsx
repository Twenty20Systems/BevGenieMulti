import { TrendingUp, Users, Search } from "lucide-react"

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
    accentColor: "#00C8FF",
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
    accentColor: "#AA6C39",
  },
]

interface SolutionsProps {
  onCardClick?: (title: string) => void;
  onQuestionClick?: (question: string, category: string) => void;
}

export function Solutions({ onCardClick, onQuestionClick }: SolutionsProps) {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-[#0A1930] to-[#000000] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#0A1930] to-transparent z-[5]" />

      <div className="absolute inset-0 opacity-8">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-[#FFFFFF] text-3xl md:text-4xl lg:text-5xl mb-4">
            For teams who can't afford to guess
          </h2>
          <p className="text-[#FFFFFF]/90 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            AI that delivers instant, trusted answers - grounded in mastered, multi-source industry data. Tailored,
            timely, and trustworthy, delivered when decisions matter most.
          </p>
        </div>

        <div className="space-y-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <div
                key={index}
                className="bg-[#FFFFFF]/5 backdrop-blur-sm rounded-xl p-8 border-l-4 hover:bg-[#FFFFFF]/10 transition-all duration-300 cursor-pointer"
                style={{ borderLeftColor: solution.accentColor }}
                onClick={() => onCardClick?.(solution.title)}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left side - Icon and title */}
                  <div className="md:w-1/3 flex flex-col items-start">
                    <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: `${solution.accentColor}20` }}>
                      <Icon style={{ color: solution.accentColor }} size={32} />
                    </div>
                    <h3 className="font-display font-semibold text-2xl text-[#FFFFFF] mb-2">{solution.title}</h3>
                    <p className="text-[#FFFFFF]/80 font-medium">{solution.subtitle}</p>
                  </div>

                  <div className="md:w-2/3">
                    <p className="font-display font-bold text-[#FFFFFF] text-lg mb-4">Ask:</p>
                    <div className="space-y-3">
                      {solution.questions.map((question, qIndex) => (
                        <div
                          key={qIndex}
                          className="flex items-center gap-3 bg-[#FFFFFF]/10 rounded-full px-6 py-4 border border-[#FFFFFF]/20 hover:border-[#FFFFFF]/40 transition-all duration-300 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuestionClick?.(question, solution.title);
                          }}
                        >
                          <Search style={{ color: solution.accentColor }} size={20} className="flex-shrink-0" />
                          <span className="text-[#FFFFFF]/90 leading-relaxed flex-1">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
