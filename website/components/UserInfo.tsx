'use client';

import { Language, User } from '@/lib/types';

interface UserInfoProps {
  user: User | null;
  isOpen: boolean;
  onLogout: () => void;
  language: Language;
}

const translations = {
  vi: {
    logoutBtn: 'Đăng xuất'
  },
  en: {
    logoutBtn: 'Logout'
  }
};

export default function UserInfo({ user, isOpen, onLogout, language }: UserInfoProps) {
  const t = translations[language];

  if (!isOpen || !user) return null;

  return (
    <div className="fixed top-[70px] right-5 bg-white p-4 rounded-2xl shadow-lg z-40 animate-fadeIn">
      <div className="font-semibold text-indigo-600 mb-3">{user.name}</div>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        {t.logoutBtn}
      </button>
    </div>
  );
}
