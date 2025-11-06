'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Genie Page - Now Redirects to Home
 *
 * All genie functionality has been moved to the landing page (/).
 * This page now redirects to maintain backwards compatibility.
 */
export default function GeniePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1930] via-[#0D2342] to-[#0A1930] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C8FF]/10 border border-[#00C8FF]/30 rounded-full mb-6">
          <div className="w-2 h-2 bg-[#00C8FF] rounded-full animate-pulse" />
          <span className="text-[#00C8FF] text-sm font-medium">Redirecting to BevGenie...</span>
        </div>
      </div>
    </div>
  );
}
