/**
 * Generate Presentation API Endpoint
 *
 * POST /api/generate-presentation
 *
 * Creates a personalized management presentation based on the user's actual session,
 * using their real questions and the problems they solved.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { PresentationData } from '@/lib/session/session-tracker';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SlideContent {
  type: 'bullets' | 'comparison' | 'quote' | 'stats' | 'timeline' | 'grid';
  data: any[];
}

export interface Slide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  content: SlideContent;
  visualDescription: string;
  speakerNotes: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const presentationData: PresentationData = body.presentationData;

    if (!presentationData || !presentationData.actualQuestions || presentationData.actualQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No session data available. Please interact with BevGenie first.' },
        { status: 400 }
      );
    }

    console.log('[Presentation] Generating presentation for session:', {
      queries: presentationData.actualQuestions.length,
      duration: presentationData.session.duration,
    });

    const slides = await generatePresentationContent(presentationData);

    return NextResponse.json({
      success: true,
      slides,
      metadata: {
        queriesCount: presentationData.actualQuestions.length,
        duration: presentationData.session.duration,
        roiSavings: presentationData.roi.costSaved,
      },
    });
  } catch (error) {
    console.error('[Presentation] Error generating:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generatePresentationContent(data: PresentationData): Promise<Slide[]> {
  const functionalRole = determineRole(data.persona);
  const orgType = determineOrgType(data.persona);
  const orgSize = determineOrgSize(data.persona);
  const topCategory = getTopCategory(data.categoryBreakdown);

  const prompt = `
Generate a concise 4-slide presentation based on this user's actual session with BevGenie AI.

PERSONA:
- Role: ${functionalRole}
- Organization: ${orgType} (${orgSize})
- Product Focus: ${data.persona.product_focus_detected || 'Beverage Industry'}

SESSION SUMMARY:
- Duration: ${data.session.duration}
- Questions Asked: ${data.session.queriesAsked}
- Problems Solved: ${data.session.problemsSolved}

ACTUAL QUESTIONS ASKED (use these verbatim):
${data.actualQuestions.map((q, i) => `${i + 1}. "${q}"`).join('\n')}

PROBLEMS & SOLUTIONS (map to their questions):
${data.problemSolutions.map((ps, i) => `
Problem ${i + 1}: ${ps.problemStatement}
User Asked: "${ps.userQuestion}"
Solution: ${ps.bevGenieSolution}
Feature: ${ps.featureUsed}
Before: ${ps.beforeState}
After: ${ps.afterState}
Time Saved: ${ps.timeSaved} minutes
`).join('\n')}

CATEGORY BREAKDOWN:
${Object.entries(data.categoryBreakdown).map(([cat, count]) => `- ${cat}: ${count} queries`).join('\n')}

ROI CALCULATION:
- Total Time Saved: ${data.roi.totalMinutesSaved} minutes (${data.roi.hoursSaved} hours)
- Cost Savings: $${data.roi.costSaved}
- Efficiency Gain: ${data.roi.efficiencyGain}%

CREATE EXACTLY 4 SLIDES:

SLIDE 1: PERSONA DETAILS
Title: "About You"
Subtitle: "Your BevGenie Session Overview"
Content type: bullets
Content: Create 5-7 concise bullet points about the person based on their session:
- 👤 Role: ${functionalRole} at ${orgType} (${orgSize})
- 🍺 Product Focus: ${data.persona.product_focus_detected || 'Beverage Industry'}
- 📌 Primary Interests: ${topCategory} (based on ${data.session.queriesAsked} questions explored)
- ⏱️ Session Duration: ${data.session.duration}
- 🎯 Key Focus Areas: [Summarize the 2-3 main topics from their questions with specific examples]
- 💡 Problems Solved: ${data.session.problemsSolved} actionable solutions delivered
- 📈 Value Generated: $${data.roi.costSaved} in time savings

Visual: Clean navy gradient background with cyan accents, professional icons for each bullet, subtle blur effect
Speaker Notes: "This slide captures your unique profile and what you explored during your BevGenie session today. Every insight was tailored to your role and industry focus."

SLIDE 2: WHAT IS BEVGENIE
Title: "What is BevGenie?"
Subtitle: "AI-Powered Intelligence for the Beverage Industry"
Content type: bullets
Content: Create 5-7 clear, concise bullet points explaining BevGenie:
- 🎯 AI-powered business intelligence platform specifically for beverage industry professionals
- ⚡ Instant answers to complex business questions across sales, marketing, and operations
- 📊 Real-time data analysis that replaces hours of manual research and reporting
- 🎨 Personalized insights tailored to your role, organization type, and product focus
- 🚀 Key capabilities: [List 3-4 most relevant features for ${functionalRole} at ${orgType}]
- 💰 Proven ROI: Saves ${data.roi.hoursSaved}+ hours per session with immediate actionable insights
- 🏆 Trusted by beverage companies from craft producers to enterprise distributors

Visual: Navy-to-cyan gradient background with BevGenie logo, floating blur elements, modern iconography
Speaker Notes: "BevGenie transforms how beverage professionals make data-driven decisions by combining industry expertise with AI-powered intelligence."

SLIDE 3: HOW BEVGENIE HELPS YOU - PART 1
Title: "Your Specific Challenges Solved"
Subtitle: "Real Questions, Real Solutions"
Content type: bullets
Content: Based on their ACTUAL questions, create 4-6 specific bullet points showing how BevGenie helps:
- Start each bullet with "✓" emoji to show it's a solution
- Reference their actual questions (use quotes) and be very specific
- Format: ✓ Question: "${data.actualQuestions[0]}"
  → Solution: [Specific answer/insight BevGenie provided]
  → Impact: Saved ${data.problemSolutions[0]?.timeSaved || 15} minutes + gained [specific business value]
- Show the transformation: "Before: [manual process]. After: [instant, actionable insight]"
- Include business value, not just time saved
- Make each point personal and specific to their session, NOT generic marketing copy
- Maximum 2 questions per slide (this is Part 1)

Visual: Navy background with cyan accent lines, professional checkmarks, modern card-style layout with subtle shadows
Speaker Notes: "These are the exact problems you solved today with BevGenie. Each answer was instant, data-driven, and tailored to your specific business context."

SLIDE 4: YOUR RESULTS & ROI
Title: "Measurable Impact From Today's Session"
Subtitle: "Time Saved, Decisions Made, Value Created"
Content type: stats
Content: Create a compelling stats showcase with 4-6 large numbers and context:
- 📊 ${data.session.queriesAsked} Business Questions Answered
  → Each answered in seconds vs. hours of manual research
- ⏰ ${data.roi.hoursSaved} Hours Saved Today
  → Equivalent to $${data.roi.costSaved} in productivity value
- 🎯 ${data.roi.efficiencyGain}% Efficiency Improvement
  → Compared to traditional research methods
- 🚀 ${data.problemSolutions.length} Actionable Solutions Delivered
  → Features used: [List 2-3 actual features from session]
- 📅 Projected Monthly Savings: $${Math.round(data.roi.costSaved * 4)}
  → If you use BevGenie weekly (based on today's value)
- 💼 Annual Value: $${Math.round(data.roi.costSaved * 52)}
  → Potential yearly time savings at current usage rate

Bottom section with next steps:
"✨ Next Steps for ${functionalRole}s:"
- [Suggest 2-3 specific features tailored to ${functionalRole} at ${orgType}]
- Schedule regular BevGenie sessions for ongoing competitive advantage
- Share insights with your team to multiply the impact

Visual: Large cyan gradient numbers on navy background, modern stat cards with icons, professional data visualization style
Speaker Notes: "This is the measurable, real-world impact of your BevGenie session today. These aren't projections—this is actual time and money saved from answering your specific business questions."

IMPORTANT RULES:
1. Keep ALL content as concise bullet points - NO long paragraphs
2. Use their ACTUAL questions word-for-word (in quotes) on slides 3-4
3. All benefits must reference their specific session data
4. Make it personal - use "you" and "your" throughout
5. Keep it simple and scannable - maximum 7 bullets per slide
6. Focus on THEIR experience, not generic marketing

Return a JSON array of slides with this exact structure:
[
  {
    "slideNumber": 1,
    "title": "...",
    "subtitle": "..." (optional),
    "content": {
      "type": "bullets" | "comparison" | "quote" | "stats" | "timeline" | "grid",
      "data": [...]
    },
    "visualDescription": "...",
    "speakerNotes": "..."
  }
]

Return ONLY the JSON array, no markdown formatting, no code blocks.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  // Try to extract JSON from the response
  const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  const slides: Slide[] = JSON.parse(jsonMatch[0]);
  return slides;
}

function determineRole(persona: any): string {
  const detection = persona.detection_vectors;
  if (!detection) return 'Business Leader';

  const roleHistory = detection.functional_role_history || [];
  if (roleHistory.length === 0) return 'Business Leader';

  // Get most recent or highest confidence role
  const latestRole = roleHistory[roleHistory.length - 1];
  const roleMap: Record<string, string> = {
    sales: 'Sales Director',
    marketing: 'Marketing Leader',
    executive: 'Executive',
    operations: 'Operations Manager',
    finance: 'Finance Director',
  };

  return roleMap[latestRole.value] || 'Business Leader';
}

function determineOrgType(persona: any): string {
  const detection = persona.detection_vectors;
  if (!detection) return 'Organization';

  const orgHistory = detection.org_type_history || [];
  if (orgHistory.length === 0) return 'Organization';

  const latestOrg = orgHistory[orgHistory.length - 1];
  const orgMap: Record<string, string> = {
    supplier: 'Supplier',
    distributor: 'Distributor',
    retailer: 'Retailer',
    manufacturer: 'Manufacturer',
  };

  return orgMap[latestOrg.value] || 'Organization';
}

function determineOrgSize(persona: any): string {
  const detection = persona.detection_vectors;
  if (!detection) return 'Mid-sized';

  const sizeHistory = detection.org_size_history || [];
  if (sizeHistory.length === 0) return 'Mid-sized';

  const latestSize = sizeHistory[sizeHistory.length - 1];
  const sizeMap: Record<string, string> = {
    craft: 'Craft/Small',
    mid_sized: 'Mid-sized',
    large: 'Large Enterprise',
  };

  return sizeMap[latestSize.value] || 'Mid-sized';
}

function getTopCategory(breakdown: Record<string, number>): string {
  let topCategory = 'Business Intelligence';
  let maxCount = 0;

  for (const [category, count] of Object.entries(breakdown)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = category;
    }
  }

  return topCategory;
}
