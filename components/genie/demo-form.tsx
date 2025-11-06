'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface DemoFormProps {
  onClose: () => void;
  context?: string; // What led them to request demo
}

/**
 * Demo Request Form
 * Collects user information and stores in Supabase
 */
export function DemoForm({ onClose, context }: DemoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Insert into Supabase
      const { error } = await supabase
        .from('demo_requests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            role: formData.role,
            phone: formData.phone,
            message: formData.message,
            context: context || 'General inquiry',
            status: 'new',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');

      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting demo request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1930]/90 backdrop-blur-sm">
      <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Schedule Your Demo</h2>
            <p className="text-[#94A3B8] text-sm mt-1">
              See how BevGenie can transform your business
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

          {/* Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00C8FF] transition-colors"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00C8FF] transition-colors"
              placeholder="john@company.com"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-white font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00C8FF] transition-colors"
              placeholder="Acme Beverages"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Role *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00C8FF] transition-colors"
            >
              <option value="">Select your role</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
              <option value="executive">Executive</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-white font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00C8FF] transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-white font-medium mb-2">
              What would you like to learn about?
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#152238] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00C8FF] transition-colors resize-none"
              placeholder="Tell us about your goals and challenges..."
            />
          </div>

          {/* Context (if provided) */}
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
              {isSubmitting ? 'Submitting...' : submitStatus === 'success' ? 'Request Sent!' : 'Schedule Demo'}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                ✓ Thank you! We'll be in touch within 24 hours.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                ✗ Something went wrong. Please try again or email us at demo@bevgenie.com
              </p>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
