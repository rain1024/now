'use client';

import { useState } from 'react';
import { Language } from '@/lib/types';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  language: Language;
}

const translations = {
  vi: {
    title: 'Đăng ký',
    labelName: 'Tên',
    labelEmail: 'Email',
    labelPassword: 'Mật khẩu',
    submitBtn: 'Đăng ký',
    loginPrompt: 'Đã có tài khoản? ',
    loginLink: 'Đăng nhập',
    successText: 'Đăng ký thành công! Vui lòng đăng nhập.',
    errorGeneric: 'Lỗi khi đăng ký!',
    errorConnection: 'Không thể kết nối đến server!'
  },
  en: {
    title: 'Sign Up',
    labelName: 'Name',
    labelEmail: 'Email',
    labelPassword: 'Password',
    submitBtn: 'Sign Up',
    loginPrompt: 'Already have an account? ',
    loginLink: 'Login',
    successText: 'Sign up successful! Please login.',
    errorGeneric: 'Error signing up!',
    errorConnection: 'Cannot connect to server!'
  }
};

export default function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  language
}: SignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);

        setName('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          onSwitchToLogin();
        }, 2000);
      } else {
        alert(data.error || t.errorGeneric);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t.errorConnection);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl animate-slideIn mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-600">{t.title}</h2>
          <button
            onClick={onClose}
            className="text-4xl text-gray-400 hover:text-red-500 transition-colors leading-none"
          >
            &times;
          </button>
        </div>

        {showSuccess && (
          <div className="bg-green-500 text-white p-4 rounded-xl text-center mb-5 animate-fadeIn">
            {t.successText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold text-gray-800 mb-2">{t.labelName}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.labelName}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">{t.labelEmail}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">{t.labelPassword}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t.submitBtn}
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600">{t.loginPrompt}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              {t.loginLink}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
