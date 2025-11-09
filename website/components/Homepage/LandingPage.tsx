'use client';

import Hero3D from './Hero3D';

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div data-testid="landing-page">
      <Hero3D onInteraction={onLoginClick} />
    </div>
  );
}
