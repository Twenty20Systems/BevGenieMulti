'use client';

import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { getFormConfig, SubmissionType } from '@/lib/forms/form-config';

interface DynamicFormProps {
  onClose: () => void;
  submissionType: SubmissionType;
  context?: string;
  sourcePage?: string;
}

/**
 * Production-ready Dynamic Form Component
 * Built with shadcn/ui Dialog, Form, Input, Select, Textarea components
 * Professional B2B SaaS form with validation and proper UX
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
      const submissionData = {
        submission_type: submissionType,
        context: context || null,
        source_page: sourcePage || null,
        ...formData,
        status: 'new',
        created_at: new Date().toISOString()
      };

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
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
          />
        );

      case 'select':
        return (
          <Select
            required={field.required}
            value={formData[field.name] || ''}
            onValueChange={(value) => handleChange(field.name, value)}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              {field.options?.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-white focus:bg-slate-800 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            type={field.type}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
          />
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-white max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl font-display font-bold text-white">
                {formConfig.title}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-base">
                {formConfig.subtitle}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800/50 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">

          {/* Dynamic Fields */}
          {formConfig.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-white font-medium flex items-center gap-2">
                {field.label}
                {field.required && (
                  <span className="text-red-400 text-sm">*</span>
                )}
              </Label>
              {renderField(field)}
              {field.description && (
                <p className="text-slate-500 text-sm">{field.description}</p>
              )}
            </div>
          ))}

          {/* Context Display */}
          {context && (
            <Badge
              variant="outline"
              className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 px-4 py-2 text-sm"
            >
              <span className="font-medium">Interest Context:</span> {context}
            </Badge>
          )}

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <Check className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {formConfig.successMessage}
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {errorMessage || 'Something went wrong. Please try again or email us at support@bevgenie.com'}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700 hover:bg-slate-800/50 text-white"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-lg shadow-cyan-600/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Submitting...</span>
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Sent!
                </>
              ) : (
                formConfig.submitButtonText
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
