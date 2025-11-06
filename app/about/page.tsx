import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, Eye, Users, Globe, RefreshCw, Database, TrendingUp, Package } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navigation />

      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-[#0A1930] to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[#FFFFFF] text-balance mb-6">
            Transforming how beverage suppliers use data to compete and grow
          </h1>
          <p className="text-lg md:text-xl text-[#FFFFFF]/90 leading-relaxed max-w-3xl mx-auto">
            BevGenie was founded to help beverage suppliers make faster, smarter, and more strategic decisions in a
            rapidly evolving market. We deliver mastered, AI-driven commercial intelligence that transforms complex
            industry data into clear, actionable insight.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#EBEFF2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#0A1930] mb-6">Our Mission</h2>
          <p className="text-lg md:text-xl text-[#333333] leading-relaxed">
            Give every supplier the visibility and confidence to act decisively — driving stronger partnerships, faster
            innovation, and sustainable growth across the beverage ecosystem.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#FFFFFF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#0A1930] mb-6">
              Built by experts in data, automation, and beverage intelligence
            </h2>
            <p className="text-lg text-[#333333] max-w-3xl mx-auto leading-relaxed">
              Behind BevGenie is a team that's spent decades designing data systems, analytics workflows, and
              intelligence tools for complex, regulated industries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#EBEFF2] p-8 rounded-xl">
              <div className="w-14 h-14 bg-[#00C8FF] rounded-lg flex items-center justify-center mb-6">
                <Database className="w-7 h-7 text-[#FFFFFF]" />
              </div>
              <h3 className="font-display font-semibold text-xl text-[#0A1930] mb-4">Integration & Automation</h3>
              <p className="text-[#333333] leading-relaxed">
                Deep experience architecting enterprise-grade data ecosystems that connect dozens of business systems,
                automate data movement, and maintain reliability at scale.
              </p>
            </div>

            <div className="bg-[#EBEFF2] p-8 rounded-xl">
              <div className="w-14 h-14 bg-[#00C8FF] rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#FFFFFF]" />
              </div>
              <h3 className="font-display font-semibold text-xl text-[#0A1930] mb-4">Analytics & AI</h3>
              <p className="text-[#333333] leading-relaxed">
                Proven track record building analytics platforms and decision frameworks that turn mastered data into
                business intelligence trusted by global enterprises.
              </p>
            </div>

            <div className="bg-[#EBEFF2] p-8 rounded-xl">
              <div className="w-14 h-14 bg-[#00C8FF] rounded-lg flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#FFFFFF]" />
              </div>
              <h3 className="font-display font-semibold text-xl text-[#0A1930] mb-4">Beverage Operations</h3>
              <p className="text-[#333333] leading-relaxed">
                Hands-on experience leading analytics and commercial operations inside beverage companies, where data
                complexity meets real-world execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#EBEFF2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#0A1930] mb-6">
              Meet the Team
            </h2>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Industry veterans with deep expertise in data architecture, AI, and beverage operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
              <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#0A1930] to-[#0A1930]/60 flex items-center justify-center border-b-4 border-[#00C8FF]">
                <Users className="w-24 h-24 text-[#00C8FF]/20" />
              </div>
              <div className="p-8">
                <h3 className="font-display font-semibold text-2xl text-[#0A1930] mb-1">Shyam Jayakumar</h3>
                <p className="text-[#00C8FF] font-semibold mb-4">Chief Executive Officer</p>
                <p className="text-[#333333] leading-relaxed">
                  20+ years architecting enterprise data ecosystems at MicroStrategy, MuleSoft, and Axway. Founded
                  Twenty20 Systems, building global consulting practices specializing in connecting complex business
                  systems and automating data at scale.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
              <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#0A1930] to-[#0A1930]/60 flex items-center justify-center border-b-4 border-[#00C8FF]">
                <Users className="w-24 h-24 text-[#00C8FF]/20" />
              </div>
              <div className="p-8">
                <h3 className="font-display font-semibold text-2xl text-[#0A1930] mb-1">Srinivas Jagannathan</h3>
                <p className="text-[#00C8FF] font-semibold mb-4">Chief Product Officer</p>
                <p className="text-[#333333] leading-relaxed">
                  30+ years building analytics platforms at Walmart, Innoviti, and VMware. Expert in AI/ML, product
                  development, and turning complex data into trusted business intelligence. Designs AI that answers the
                  specific commercial questions beverage suppliers ask daily.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
              <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#0A1930] to-[#0A1930]/60 flex items-center justify-center border-b-4 border-[#00C8FF]">
                <Users className="w-24 h-24 text-[#00C8FF]/20" />
              </div>
              <div className="p-8">
                <h3 className="font-display font-semibold text-2xl text-[#0A1930] mb-1">Saravana Kumar</h3>
                <p className="text-[#00C8FF] font-semibold mb-4">Chief Technology Officer</p>
                <p className="text-[#333333] leading-relaxed">
                  20+ years building mission-critical systems and operations platforms. Founded and led Kovai.co,
                  architecting enterprise-grade infrastructure trusted by global organizations. Expertise ensures
                  BevGenie handles the scale and complexity of beverage industry data.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm">
              <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#0A1930] to-[#0A1930]/60 flex items-center justify-center border-b-4 border-[#00C8FF]">
                <Users className="w-24 h-24 text-[#00C8FF]/20" />
              </div>
              <div className="p-8">
                <h3 className="font-display font-semibold text-2xl text-[#0A1930] mb-1">Gauri Sharma</h3>
                <p className="text-[#00C8FF] font-semibold mb-4">Data Analyst Lead</p>
                <p className="text-[#333333] leading-relaxed">
                  Specializes in beverage market analytics, data governance, and process improvement. Deep expertise in
                  distributor networks, retail execution, and category performance ensures BevGenie's data models
                  accurately reflect how the beverage market actually operates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-[#0A1930]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#FFFFFF] mb-6">
              Our Commitment to Responsible AI
            </h2>
            <p className="text-lg text-[#FFFFFF]/90 max-w-3xl mx-auto leading-relaxed">
              At BevGenie, we believe intelligence must be responsible, especially when it shapes decisions that move
              the beverage industry forward. Our framework protects data integrity, ensures fairness, and gives
              suppliers confidence in every insight they act on.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="security"
              className="bg-[#FFFFFF]/5 border border-[#00C8FF]/20 rounded-lg px-6 hover:bg-[#FFFFFF]/10 transition-colors"
            >
              <AccordionTrigger className="text-[#00C8FF] font-display font-semibold text-lg hover:text-[#FFFFFF] hover:no-underline py-5 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span>Data Security & Privacy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#FFFFFF]/90 leading-relaxed pb-5">
                Enterprise-grade encryption and access controls protect your competitive data. Your information is never
                shared, sold, or used beyond delivering your intelligence.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="fairness"
              className="bg-[#FFFFFF]/5 border border-[#00C8FF]/20 rounded-lg px-6 hover:bg-[#FFFFFF]/10 transition-colors"
            >
              <AccordionTrigger className="text-[#00C8FF] font-display font-semibold text-lg hover:text-[#FFFFFF] hover:no-underline py-5 transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 flex-shrink-0" />
                  <span>Fairness & Transparency</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#FFFFFF]/90 leading-relaxed pb-5">
                We monitor data logic to prevent bias across brands, regions, and channels. Insights are designed to
                represent the full market reality, helping teams make unbiased, data-driven decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="explainability"
              className="bg-[#FFFFFF]/5 border border-[#00C8FF]/20 rounded-lg px-6 hover:bg-[#FFFFFF]/10 transition-colors"
            >
              <AccordionTrigger className="text-[#00C8FF] font-display font-semibold text-lg hover:text-[#FFFFFF] hover:no-underline py-5 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span>Explainability & Human Oversight</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#FFFFFF]/90 leading-relaxed pb-5">
                Every answer traces back to its data sources and analytical logic. You understand not just what the data
                says, but why. Our AI augments your expertise—it doesn't replace judgment.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="responsibility"
              className="bg-[#FFFFFF]/5 border border-[#00C8FF]/20 rounded-lg px-6 hover:bg-[#FFFFFF]/10 transition-colors"
            >
              <AccordionTrigger className="text-[#00C8FF] font-display font-semibold text-lg hover:text-[#FFFFFF] hover:no-underline py-5 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <span>Industry Responsibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#FFFFFF]/90 leading-relaxed pb-5">
                BevGenie drives competitive advantage through better decision-making, not practices that harm the
                industry or fair competition.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="governance"
              className="bg-[#FFFFFF]/5 border border-[#00C8FF]/20 rounded-lg px-6 hover:bg-[#FFFFFF]/10 transition-colors"
            >
              <AccordionTrigger className="text-[#00C8FF] font-display font-semibold text-lg hover:text-[#FFFFFF] hover:no-underline py-5 transition-colors">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 flex-shrink-0" />
                  <span>Continuous Governance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#FFFFFF]/90 leading-relaxed pb-5">
                Ongoing audits and improvement protocols ensure BevGenie evolves with emerging best practices and
                regulatory requirements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#00C8FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#0A1930] mb-6 text-balance">
            Ready to see how BevGenie transforms commercial intelligence?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#FFFFFF] text-[#0A1930] px-8 py-3 rounded-lg font-semibold hover:bg-[#0A1930] hover:text-[#FFFFFF] transition-colors">
              Book a Demo
            </button>
            <button className="bg-[#0A1930] text-[#FFFFFF] px-8 py-3 rounded-lg font-semibold hover:bg-[#0A1930]/90 transition-colors border-2 border-[#0A1930]">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
