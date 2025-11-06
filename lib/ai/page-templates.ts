/**
 * Pre-built Page Templates
 *
 * Templates provide structure, AI fills dynamic content
 * 4-5 variants per page type for different scenarios
 */

export interface TemplateVariant {
  id: string;
  name: string;
  description: string;
  bestFor: string[]; // Keywords that indicate this template
  structure: {
    sections: TemplateSection[];
  };
}

export interface TemplateSection {
  type: 'single_screen';
  // Placeholders marked with {{key}} will be filled by AI
  headline: string; // e.g., "{{value_proposition}}"
  subtitle: string;
  insights: string[]; // Array of insight strings with placeholders (will be converted to {text: string} format)
  stats: TemplateStat[];
  visualContent: TemplateVisual;
  howItWorks: string[];
  ctas: TemplateCTA[];
}

export interface TemplateStat {
  value: string; // e.g., "{{stat_value}}"
  label: string;
  description?: string;
}

export interface TemplateVisual {
  type: 'case_study' | 'highlight_box' | 'example';
  title: string;
  content: string; // Can have placeholders
  highlight: string;
}

export interface TemplateCTA {
  text: string;
  type: 'primary' | 'secondary';
  action: 'form' | 'new_section' | 'external';
  submissionType?: string;
  context?: any;
}

/**
 * SOLUTION BRIEF Templates (5 variants)
 */
export const SOLUTION_BRIEF_TEMPLATES: TemplateVariant[] = [
  {
    id: 'solution_brief_roi_tracking',
    name: 'ROI & Measurement Focus',
    description: 'Emphasizes measurement, tracking, and proving value',
    bestFor: ['roi', 'track', 'measure', 'prove', 'effectiveness', 'results', 'impact'],
    structure: {
      sections: [{
        type: 'single_screen',
        headline: 'Prove {{solution_area}} ROI with Data-Driven Insights',
        subtitle: '{{specific_capability}}',
        insights: [
          'Velocity Shift Detection: {{insight_mechanism}} identifies {{percentage}}% more opportunities by analyzing {{data_source}} that traditional analytics miss.',
          'Real-Time Visibility: {{tracking_capability}} provides instant insights into {{tracked_metric}}, allowing you to {{action_benefit}} {{timeframe}} faster.',
          'Automated ROI Calculation: AI converts {{input_data}} into specific {{output_metric}}, increasing {{result_metric}} by {{multiplier}}x on average.',
        ],
        stats: [
          { value: '{{stat1_value}}', label: '{{stat1_label}}', description: '{{stat1_desc}}' },
          { value: '{{stat2_value}}', label: '{{stat2_label}}', description: '{{stat2_desc}}' },
          { value: '{{stat3_value}}', label: '{{stat3_label}}', description: '{{stat3_desc}}' },
        ],
        visualContent: {
          type: 'case_study',
          title: 'Real-World Impact',
          content: '{{case_study_story}}',
          highlight: '{{case_study_result}}',
        },
        howItWorks: [
          'Connect your {{data_source_1}} and {{data_source_2}} seamlessly',
          'AI analyzes {{analysis_subject}} across all {{analysis_scope}}',
          'Receive {{delivery_format}} {{delivery_frequency}}',
          'Get specific {{recommendation_type}} with reasoning',
          'Track ROI on every {{tracked_item}}',
        ],
        ctas: [
          { text: 'Schedule ROI Analysis', type: 'primary', action: 'form', submissionType: 'demo' },
          { text: 'View Case Studies', type: 'secondary', action: 'new_section', context: { topic: 'success_stories' } },
          { text: 'Explore Implementation', type: 'secondary', action: 'new_section', context: { topic: 'implementation' } },
        ],
      }],
    },
  },
  {
    id: 'solution_brief_market_intelligence',
    name: 'Market Intelligence Focus',
    description: 'Emphasizes market data, competitive insights, trends',
    bestFor: ['market', 'competitive', 'insights', 'trends', 'intelligence', 'analysis', 'landscape'],
    structure: {
      sections: [{
        type: 'single_screen',
        headline: 'Unlock {{market_scope}} Market Intelligence',
        subtitle: '{{intelligence_capability}}',
        insights: [
          'Market Pattern Recognition: {{ai_capability}} identifies emerging {{pattern_type}} in real-time, allowing you to capitalize on opportunities {{timing_advantage}} before competitors.',
          'Competitive Landscape Mapping: Comprehensive analysis of {{competitive_scope}} reveals {{insight_type}}, helping you {{strategic_benefit}}.',
          'Predictive Trend Analysis: {{prediction_mechanism}} forecasts {{predicted_metric}} with {{accuracy_level}} accuracy, enabling {{planning_benefit}}.',
        ],
        stats: [
          { value: '{{market_stat_value}}', label: '{{market_stat_label}}' },
          { value: '{{competitive_stat_value}}', label: '{{competitive_stat_label}}' },
          { value: '{{prediction_stat_value}}', label: '{{prediction_stat_label}}' },
        ],
        visualContent: {
          type: 'highlight_box',
          title: 'How This Helps You',
          content: '{{market_benefit_explanation}}',
          highlight: '{{market_key_result}}',
        },
        howItWorks: [
          'Aggregate data from {{market_data_sources}}',
          'AI analyzes {{market_dimensions}}',
          'Identify {{opportunity_types}}',
          'Receive actionable {{recommendation_format}}',
          'Monitor {{tracking_metrics}} continuously',
        ],
        ctas: [
          { text: 'Get Market Analysis', type: 'primary', action: 'form', submissionType: 'demo' },
          { text: 'View Sample Insights', type: 'secondary', action: 'new_section', context: { topic: 'samples' } },
          { text: 'Learn About Data Sources', type: 'secondary', action: 'new_section', context: { topic: 'data' } },
        ],
      }],
    },
  },
  {
    id: 'solution_brief_sales_enablement',
    name: 'Sales Team Enablement',
    description: 'Focuses on empowering sales teams, field execution',
    bestFor: ['sales', 'field', 'team', 'enablement', 'territory', 'reps', 'execution'],
    structure: {
      sections: [{
        type: 'single_screen',
        headline: 'Empower Your {{team_type}} for {{performance_goal}}',
        subtitle: '{{enablement_capability}}',
        insights: [
          'Smart Territory Optimization: {{optimization_method}} ensures {{resource_type}} are allocated to {{opportunity_type}}, increasing {{efficiency_metric}} by {{percentage}}%.',
          'Real-Time Coaching: {{coaching_feature}} provides {{team_members}} with {{guidance_type}} at the exact moment they need it, improving {{outcome_metric}}.',
          'Performance Visibility: {{tracking_system}} gives {{stakeholders}} instant visibility into {{tracked_activities}}, enabling {{management_benefit}}.',
        ],
        stats: [
          { value: '{{sales_stat1_value}}', label: '{{sales_stat1_label}}' },
          { value: '{{sales_stat2_value}}', label: '{{sales_stat2_label}}' },
          { value: '{{sales_stat3_value}}', label: '{{sales_stat3_label}}' },
        ],
        visualContent: {
          type: 'example',
          title: 'Sales Team Success',
          content: '{{sales_example_scenario}}',
          highlight: '{{sales_example_result}}',
        },
        howItWorks: [
          'Integrate with {{sales_systems}}',
          'AI analyzes {{sales_data_points}}',
          'Generate {{recommendation_types}}',
          'Deliver insights via {{delivery_channels}}',
          'Track {{performance_metrics}} in real-time',
        ],
        ctas: [
          { text: 'Transform Your Sales Team', type: 'primary', action: 'form', submissionType: 'demo' },
          { text: 'See Success Stories', type: 'secondary', action: 'new_section', context: { topic: 'testimonials' } },
          { text: 'Explore Features', type: 'secondary', action: 'new_section', context: { topic: 'features' } },
        ],
      }],
    },
  },
  {
    id: 'solution_brief_operational_efficiency',
    name: 'Operations & Efficiency',
    description: 'Focuses on streamlining operations, automation, efficiency',
    bestFor: ['operations', 'efficiency', 'streamline', 'automate', 'process', 'workflow', 'productivity'],
    structure: {
      sections: [{
        type: 'single_screen',
        headline: 'Streamline {{operational_area}} with {{automation_type}}',
        subtitle: '{{efficiency_capability}}',
        insights: [
          'Process Automation: {{automation_description}} eliminates {{manual_task}}, saving {{time_saved}} per {{time_period}} while reducing {{error_reduction}}.',
          'Workflow Optimization: {{optimization_feature}} identifies {{bottleneck_type}} and suggests {{improvement_type}}, increasing {{throughput_metric}} by {{percentage}}%.',
          'Resource Management: {{resource_feature}} ensures {{resource_type}} are used optimally, reducing {{cost_metric}} by {{savings_amount}} annually.',
        ],
        stats: [
          { value: '{{ops_stat1_value}}', label: '{{ops_stat1_label}}' },
          { value: '{{ops_stat2_value}}', label: '{{ops_stat2_label}}' },
          { value: '{{ops_stat3_value}}', label: '{{ops_stat3_label}}' },
        ],
        visualContent: {
          type: 'highlight_box',
          title: 'Efficiency Gains',
          content: '{{efficiency_explanation}}',
          highlight: '{{efficiency_result}}',
        },
        howItWorks: [
          'Map your current {{process_type}}',
          'AI identifies {{optimization_opportunities}}',
          'Implement {{automation_steps}}',
          'Monitor {{efficiency_metrics}}',
          'Continuously optimize {{optimization_areas}}',
        ],
        ctas: [
          { text: 'Start Optimization', type: 'primary', action: 'form', submissionType: 'demo' },
          { text: 'See ROI Calculator', type: 'secondary', action: 'new_section', context: { topic: 'roi' } },
          { text: 'View Process Examples', type: 'secondary', action: 'new_section', context: { topic: 'examples' } },
        ],
      }],
    },
  },
  {
    id: 'solution_brief_compliance_risk',
    name: 'Compliance & Risk Management',
    description: 'Focuses on regulatory compliance, risk mitigation',
    bestFor: ['compliance', 'regulatory', 'risk', 'audit', 'regulation', 'documentation', 'governance'],
    structure: {
      sections: [{
        type: 'single_screen',
        headline: 'Ensure {{compliance_area}} Compliance with {{assurance_type}}',
        subtitle: '{{compliance_capability}}',
        insights: [
          'Automated Compliance Monitoring: {{monitoring_system}} continuously tracks {{compliance_areas}} across {{regulatory_scope}}, alerting you to {{risk_types}} before they become issues.',
          'Audit Trail Management: {{documentation_system}} maintains complete {{documentation_type}} for {{audit_scope}}, reducing {{audit_time}} by {{percentage}}%.',
          'Risk Assessment: {{risk_feature}} evaluates {{risk_dimensions}} in real-time, providing {{risk_insights}} and {{mitigation_recommendations}}.',
        ],
        stats: [
          { value: '{{compliance_stat1_value}}', label: '{{compliance_stat1_label}}' },
          { value: '{{compliance_stat2_value}}', label: '{{compliance_stat2_label}}' },
          { value: '{{compliance_stat3_value}}', label: '{{compliance_stat3_label}}' },
        ],
        visualContent: {
          type: 'case_study',
          title: 'Compliance Success',
          content: '{{compliance_story}}',
          highlight: '{{compliance_result}}',
        },
        howItWorks: [
          'Configure {{compliance_requirements}}',
          'System monitors {{monitoring_scope}}',
          'Receive alerts for {{alert_conditions}}',
          'Access {{documentation_types}}',
          'Generate {{reporting_outputs}}',
        ],
        ctas: [
          { text: 'Ensure Compliance', type: 'primary', action: 'form', submissionType: 'demo' },
          { text: 'View Compliance Features', type: 'secondary', action: 'new_section', context: { topic: 'compliance' } },
          { text: 'Download Compliance Guide', type: 'secondary', action: 'external', context: { url: '/resources/compliance' } },
        ],
      }],
    },
  },
];

/**
 * Get all templates for a page type
 */
export function getTemplatesForType(pageType: string): TemplateVariant[] {
  switch (pageType) {
    case 'solution_brief':
      return SOLUTION_BRIEF_TEMPLATES;
    // Add more page types as needed
    default:
      return SOLUTION_BRIEF_TEMPLATES;
  }
}

/**
 * Extract all placeholders from a template
 */
export function extractPlaceholders(template: TemplateVariant): string[] {
  const placeholders = new Set<string>();
  const json = JSON.stringify(template);
  const matches = json.match(/\{\{([^}]+)\}\}/g) || [];

  matches.forEach(match => {
    const key = match.replace(/\{\{|\}\}/g, '');
    placeholders.add(key);
  });

  return Array.from(placeholders);
}
