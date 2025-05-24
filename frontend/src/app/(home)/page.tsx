'use client';

// import { useEffect, useState } from 'react';
// import { CTASection } from '@/components/home/sections/cta-section';
// import { FAQSection } from "@/components/sections/faq-section";
// import { FooterSection } from '@/components/home/sections/footer-section';
import { HeroSection } from '@/components/home/sections/hero-section';
// import SwitchSection from '@/components/home/sections/switch-section';
// import { OpenSourceSection } from '@/components/home/sections/open-source-section';
// import { PricingSection } from '@/components/home/sections/pricing-section';
// import { UseCasesSection } from '@/components/home/sections/use-cases-section';
import { useAuth } from '@/components/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/edith');
    }
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    !user ?
      <main className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="w-full divide-y divide-border">
          <HeroSection />
        </div>
      </main>
    : <div className="flex flex-col items-center justify-center min-h-screen w-full">Loading...</div>
  );
}
