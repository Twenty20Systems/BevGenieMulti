'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { getFormConfig, SubmissionType } from '@/lib/forms/form-config';

interface DynamicFormProps {
  onClose: () => void;
  submissionType: SubmissionType;
  context?: string; // What led them to this form
  sourcePage?: string; // Which page/section
}

/**
 * Dynamic Form Component
 * Adapts fields based on submission type using form-config
 */
export function DynamicForm({
  onClose,
  submissionType,
  context,
  sourcePage
}: DynamicFormProps) {
  const formConfig = getFormConfig(submissionType);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Prepare submission data
      const submissionData = {
        submission_type: submissionType,
        context: context || null,
        source_page: sourcePage || null,
        ...formData,
        status: 'new',
        created_at: new Date().toISOString()
      };

      // Insert into Supabase
      const { error } = await supabase
        .from('cta_submissions')
        .insert([submissionData]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setSubmitStatus('success');

      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: typeof formConfig.fields[0]) => {
    const commonClasses = "w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00C8FF] transition-colors";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={4}
            className={`${commonClasses} resize-none`}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <select
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonClasses}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={field.type}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={commonClasses}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1930]/90 backdrop-blur-sm">
      <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">{formConfig.title}</h2>
            <p className="text-[#94A3B8] text-sm mt-1">
              {formConfig.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Dynamic Fields */}
          {formConfig.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-white font-medium mb-2">
                {field.label} {field.required && '*'}
              </label>
              {renderField(field)}
              {field.description && (
                <p className="text-[#94A3B8] text-xs mt-1">{field.description}</p>
              )}
            </div>
          ))}

          {/* Context Display (if provided) */}
          {context && (
            <div className="bg-[#00C8FF]/10 border border-[#00C8FF]/20 rounded-lg p-4">
              <p className="text-[#00C8FF] text-sm font-medium">Interest Context:</p>
              <p className="text-white/80 text-sm mt-1">{context}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full px-6 py-4 bg-[#00C8FF] hover:bg-[#0891B2] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : submitStatus === 'success' ? 'Sent!' : formConfig.submitButtonText}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                ✓ {formConfig.successMessage}
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                ✗ {errorMessage || 'Something went wrong. Please try again or email us at support@bevgenie.com'}
              </p>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
