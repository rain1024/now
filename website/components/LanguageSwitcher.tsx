'use client';

import { Language } from '@/lib/types';

interface LanguageSwitcherProps {
  language: Language;
  onToggle: () => void;
}

export default function LanguageSwitcher({ language, onToggle }: LanguageSwitcherProps) {
  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        onClick={onToggle}
        className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
      >
        {language === 'vi' ? 'EN' : 'VI'}
      </button>
    </div>
  );
}
