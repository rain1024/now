'use client';

import { useState } from 'react';
import { Language, FeedbackRatings } from '@/lib/types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const translations = {
  vi: {
    title: 'Góp ý của bạn',
    labelName: 'Tên (tùy chọn)',
    labelDesign: 'Đánh giá thiết kế (1-5) *',
    labelIdea: 'Đánh giá ý tưởng (1-5) *',
    labelUsefulness: 'Đánh giá độ hữu ích (1-5) *',
    labelComments: 'Nhận xét chi tiết (tùy chọn)',
    submitBtn: 'Gửi góp ý',
    successText: 'Cảm ơn bạn đã góp ý! Chúng tôi sẽ xem xét và cải thiện.',
    namePlaceholder: 'Tên của bạn',
    commentsPlaceholder: 'Chia sẻ suy nghĩ của bạn...',
    ratingRequired: 'Vui lòng đánh giá đầy đủ!',
    errorSubmit: 'Lỗi khi gửi góp ý. Vui lòng thử lại!'
  },
  en: {
    title: 'Your Feedback',
    labelName: 'Name (optional)',
    labelDesign: 'Rate Design (1-5) *',
    labelIdea: 'Rate Idea (1-5) *',
    labelUsefulness: 'Rate Usefulness (1-5) *',
    labelComments: 'Detailed Comments (optional)',
    submitBtn: 'Submit Feedback',
    successText: 'Thank you for your feedback! We will review and improve.',
    namePlaceholder: 'Your name',
    commentsPlaceholder: 'Share your thoughts...',
    ratingRequired: 'Please complete all ratings!',
    errorSubmit: 'Error submitting feedback. Please try again!'
  }
};

export default function FeedbackModal({ isOpen, onClose, language }: FeedbackModalProps) {
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [ratings, setRatings] = useState<FeedbackRatings>({
    design: 0,
    idea: 0,
    usefulness: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const t = translations[language];

  const handleRatingClick = (category: keyof FeedbackRatings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ratings.design === 0 || ratings.idea === 0 || ratings.usefulness === 0) {
      alert(t.ratingRequired);
      return;
    }

    const feedbackData = {
      name: name || 'Anonymous',
      ratings,
      comments,
      timestamp: new Date().toISOString(),
      language
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setName('');
        setComments('');
        setRatings({ design: 0, idea: 0, usefulness: 0 });

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        alert(t.errorSubmit);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t.errorSubmit);
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
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-slideIn mx-4">
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
              placeholder={t.namePlaceholder}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {(['design', 'idea', 'usefulness'] as const).map((category) => (
            <div key={category}>
              <label className="block font-semibold text-gray-800 mb-2">
                {category === 'design' && t.labelDesign}
                {category === 'idea' && t.labelIdea}
                {category === 'usefulness' && t.labelUsefulness}
              </label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingClick(category, value)}
                    className={`flex-1 min-w-[60px] p-3 border-2 rounded-xl font-semibold transition-all ${
                      ratings[category] >= value
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block font-semibold text-gray-800 mb-2">{t.labelComments}</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={t.commentsPlaceholder}
              className="w-full p-3 border-2 border-gray-200 rounded-xl min-h-[120px] resize-y focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
