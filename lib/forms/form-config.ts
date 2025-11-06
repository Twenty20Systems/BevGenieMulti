/**
 * Form Configuration System
 * Defines which fields are required/optional for each submission type
 */

export type SubmissionType = 'demo' | 'consultation' | 'case_study' | 'contact' | 'newsletter' | 'download';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  description?: string;
}

export interface FormConfig {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitButtonText: string;
  successMessage: string;
}

/**
 * Form configurations for each submission type
 */
export const FORM_CONFIGS: Record<SubmissionType, FormConfig> = {
  demo: {
    title: 'Schedule Your Demo',
    subtitle: 'See how BevGenie can transform your business',
    submitButtonText: 'Schedule Demo',
    successMessage: 'Thank you! We\'ll be in touch within 24 hours to schedule your demo.',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'John Doe'
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'john@company.com'
      },
      {
        name: 'company',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Acme Beverages'
      },
      {
        name: 'role',
        label: 'Your Role',
        type: 'select',
        required: true,
        options: [
          { value: '', label: 'Select your role' },
          { value: 'sales', label: 'Sales' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'operations', label: 'Operations' },
          { value: 'executive', label: 'Executive' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: false,
        placeholder: '+1 (555) 123-4567'
      },
      {
        name: 'message',
        label: 'What would you like to learn about?',
        type: 'textarea',
        required: false,
        placeholder: 'Tell us about your goals and challenges...'
      }
    ]
  },

  consultation: {
    title: 'Book a Consultation',
    subtitle: 'Get expert advice on your beverage business challenges',
    submitButtonText: 'Request Consultation',
    successMessage: 'Your consultation request has been received. We\'ll contact you within 1 business day.',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'John Doe'
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'john@company.com'
      },
      {
        name: 'company',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Your Company'
      },
      {
        name: 'company_size',
        label: 'Company Size',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Select company size' },
          { value: '1-10', label: '1-10 employees' },
          { value: '11-50', label: '11-50 employees' },
          { value: '51-200', label: '51-200 employees' },
          { value: '201-500', label: '201-500 employees' },
          { value: '500+', label: '500+ employees' }
        ]
      },
      {
        name: 'message',
        label: 'What challenges are you facing?',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your main business challenges...'
      }
    ]
  },

  case_study: {
    title: 'Get the Case Study',
    subtitle: 'See how other beverage companies achieved success',
    submitButtonText: 'Download Case Study',
    successMessage: 'Check your email! We\'ve sent you the case study.',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'John Doe'
      },
      {
        name: 'email',
        label: 'Work Email',
        type: 'email',
        required: true,
        placeholder: 'john@company.com'
      },
      {
        name: 'company',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Your Company'
      },
      {
        name: 'role',
        label: 'Your Role',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'Select your role' },
          { value: 'sales', label: 'Sales' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'operations', label: 'Operations' },
          { value: 'executive', label: 'Executive' },
          { value: 'other', label: 'Other' }
        ]
      }
    ]
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'Have questions? We\'re here to help',
    submitButtonText: 'Send Message',
    successMessage: 'Message sent! We\'ll get back to you soon.',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Your Name'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'you@example.com'
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'How can we help you?'
      }
    ]
  },

  newsletter: {
    title: 'Subscribe to Newsletter',
    subtitle: 'Get the latest insights on beverage industry trends',
    submitButtonText: 'Subscribe',
    successMessage: 'You\'re subscribed! Check your email for confirmation.',
    fields: [
      {
        name: 'name',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'John'
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'john@company.com'
      },
      {
        name: 'company',
        label: 'Company',
        type: 'text',
        required: false,
        placeholder: 'Your Company (optional)'
      }
    ]
  },

  download: {
    title: 'Download Resource',
    subtitle: 'Enter your details to get instant access',
    submitButtonText: 'Get Instant Access',
    successMessage: 'Check your email for the download link!',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Your Name'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'you@company.com'
      },
      {
        name: 'company',
        label: 'Company',
        type: 'text',
        required: false,
        placeholder: 'Your Company'
      }
    ]
  }
};

/**
 * Get form configuration for a submission type
 */
export function getFormConfig(type: SubmissionType): FormConfig {
  return FORM_CONFIGS[type] || FORM_CONFIGS.contact;
}
