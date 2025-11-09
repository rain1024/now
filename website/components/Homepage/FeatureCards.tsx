'use client';

import { motion } from 'framer-motion';
import { Language } from '@/lib/types';

interface Feature {
  icon: string;
  title: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
}

const features: Feature[] = [
  {
    icon: '🤖',
    title: {
      vi: 'Gợi ý thông minh',
      en: 'Smart Suggestions'
    },
    description: {
      vi: 'AI phân tích tâm trạng, năng lượng và ngữ cảnh của bạn để đưa ra gợi ý phù hợp nhất',
      en: 'AI analyzes your mood, energy, and context to provide the most suitable suggestions'
    }
  },
  {
    icon: '🎯',
    title: {
      vi: '60+ Hoạt động',
      en: '60+ Activities'
    },
    description: {
      vi: 'Đa dạng hoạt động từ công việc, học tập đến thư giãn và giải trí',
      en: 'Diverse activities from work and learning to relaxation and entertainment'
    }
  },
  {
    icon: '⚡',
    title: {
      vi: 'Cá nhân hóa',
      en: 'Personalized'
    },
    description: {
      vi: 'Tùy chỉnh theo sở thích, thời gian và mức năng lượng của bạn',
      en: 'Customized to your preferences, time, and energy level'
    }
  }
];

interface FeatureCardsProps {
  language: Language;
}

export default function FeatureCards({ language }: FeatureCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            delay: index * 0.2,
            duration: 0.6
          }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 h-full shadow-lg hover:shadow-2xl transition-shadow"
        >
          <div className="text-5xl mb-4">{feature.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {feature.title[language]}
          </h3>
          <p className="text-white/80 leading-relaxed">
            {feature.description[language]}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
