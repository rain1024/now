'use client';

import { useState, useEffect } from 'react';
import {
  Language,
  Mood,
  Location,
  TimeOfDay,
  Interest,
  ScoredAction,
  User
} from '@/lib/types';
import { actionsDatabase, categoryEmojis, categoryLabels } from '@/lib/actionsDatabase';
import FeedbackModal from '@/components/FeedbackModal';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import UserInfo from '@/components/UserInfo';
import LandingPage from '@/components/Homepage/LandingPage';

const translations = {
  vi: {
    mainTitle: 'NOW',
    mainSubtitle: 'Tìm hành động của bạn ngay bây giờ!',
    feedbackBtn: 'Góp ý',
    loginBtn: 'Đăng nhập',
    timeSection: 'Thời gian',
    timeQuestion: 'Bạn có bao nhiêu thời gian?',
    minutes: 'phút',
    energySection: 'Năng lượng',
    energyQuestion: 'Mức năng lượng của bạn hiện tại?',
    energyLow: 'Kiệt sức',
    energyHigh: 'Tràn đầy năng lượng',
    moodSection: 'Tâm trạng',
    moodQuestion: 'Tâm trạng của bạn như thế nào?',
    contextSection: 'Bối cảnh',
    locationQuestion: 'Bạn đang ở đâu?',
    timeOfDayQuestion: 'Thời gian trong ngày?',
    preferencesSection: 'Sở thích',
    interestsQuestion: 'Chọn những gì bạn quan tâm (có thể chọn nhiều):',
    submitBtn: 'Tìm hành động ngay bây giờ!',
    suggestionTitle: 'Gợi ý cho bạn',
    suggestionSubtitle: 'Dựa trên tình huống hiện tại của bạn',
    backBtn: 'Làm lại',
    moods: {
      happy: '😊 Vui vẻ',
      stressed: '😰 Căng thẳng',
      tired: '😴 Mệt mỏi',
      motivated: '😤 Hăng khởi',
      bored: '😑 Buồn chán',
      anxious: '😟 Lo lắng'
    },
    locations: {
      home: '🏠 Nhà',
      office: '🏢 Văn phòng',
      outdoors: '🌳 Ngoài trời',
      cafe: '☕ Quán cà phê',
      transit: '🚇 Di chuyển'
    },
    timesOfDay: {
      morning: '🌅 Sáng sớm (5-9h)',
      midday: '☀️ Giữa trưa (9-14h)',
      afternoon: '🌤️ Chiều (14-18h)',
      evening: '🌆 Tối (18-22h)',
      night: '🌙 Đêm muộn (22h+)'
    },
    interests: {
      work: '💼 Công việc',
      exercise: '🏃 Thể dục',
      learning: '📚 Học tập',
      relaxation: '🧘 Thư giãn',
      social: '👥 Giao lưu',
      creative: '🎨 Sáng tạo',
      entertainment: '🎮 Giải trí',
      health: '🍎 Sức khỏe',
      household: '🏠 Nhà cửa',
      mindfulness: '🧘 Tâm linh'
    }
  },
  en: {
    mainTitle: 'NOW',
    mainSubtitle: 'Find what to do right now!',
    feedbackBtn: 'Feedback',
    loginBtn: 'Login',
    timeSection: 'Time Available',
    timeQuestion: 'How much time do you have?',
    minutes: 'min',
    energySection: 'Energy Level',
    energyQuestion: 'Your current energy level?',
    energyLow: 'Exhausted',
    energyHigh: 'Full of energy',
    moodSection: 'Mood',
    moodQuestion: 'How are you feeling?',
    contextSection: 'Context',
    locationQuestion: 'Where are you?',
    timeOfDayQuestion: 'Time of day?',
    preferencesSection: 'Preferences',
    interestsQuestion: 'Select what interests you (multiple choice):',
    submitBtn: 'Find what to do now!',
    suggestionTitle: 'Your Personalized Suggestions',
    suggestionSubtitle: 'Based on your current situation',
    backBtn: 'Start Over',
    moods: {
      happy: '😊 Happy',
      stressed: '😰 Stressed',
      tired: '😴 Tired',
      motivated: '😤 Motivated',
      bored: '😑 Bored',
      anxious: '😟 Anxious'
    },
    locations: {
      home: '🏠 Home',
      office: '🏢 Office',
      outdoors: '🌳 Outdoors',
      cafe: '☕ Cafe',
      transit: '🚇 Transit'
    },
    timesOfDay: {
      morning: '🌅 Early Morning (5-9am)',
      midday: '☀️ Midday (9am-2pm)',
      afternoon: '🌤️ Afternoon (2-6pm)',
      evening: '🌆 Evening (6-10pm)',
      night: '🌙 Late Night (10pm+)'
    },
    interests: {
      work: '💼 Work',
      exercise: '🏃 Exercise',
      learning: '📚 Learning',
      relaxation: '🧘 Relaxation',
      social: '👥 Social',
      creative: '🎨 Creative',
      entertainment: '🎮 Entertainment',
      health: '🍎 Health',
      household: '🏠 Household',
      mindfulness: '🧘 Mindfulness'
    }
  }
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('vi');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  // Form state
  const [timeAvailable, setTimeAvailable] = useState(30);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [location, setLocation] = useState<Location>('home');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  // Results state
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<ScoredAction[]>([]);

  const t = translations[language];

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowUserInfo(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setShowUserInfo(false);
  };

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const calculateScore = (
    action: ScoredAction,
    time: number,
    energy: number,
    mood: Mood | null,
    loc: Location
  ): number => {
    let score = 100;

    // Time fit (prefer actions that use most available time)
    const timeUtilization = action.duration / time;
    score += timeUtilization * 30;

    // Energy match
    const energyDiff = Math.abs(action.energy - energy);
    score -= energyDiff * 5;

    // Mood bonuses
    if (mood === 'stressed' || mood === 'anxious') {
      if (action.category === 'relaxation' || action.category === 'mindfulness') score += 30;
    }
    if (mood === 'motivated') {
      if (action.category === 'work' || action.category === 'learning' || action.category === 'exercise') score += 25;
    }
    if (mood === 'tired') {
      if (action.energy <= 3) score += 20;
    }
    if (mood === 'bored') {
      if (action.category === 'creative' || action.category === 'entertainment' || action.category === 'social') score += 25;
    }

    // Location bonuses
    if (loc === 'home') {
      if (['household', 'relaxation', 'creative'].includes(action.category)) score += 15;
    }
    if (loc === 'office') {
      if (action.category === 'work') score += 20;
    }
    if (loc === 'outdoors') {
      if (action.category === 'exercise') score += 25;
    }

    return score;
  };

  const generateSuggestions = () => {
    const interests = selectedInterests.length > 0
      ? selectedInterests
      : ['work', 'exercise', 'learning', 'relaxation', 'social', 'creative', 'entertainment', 'health', 'household', 'mindfulness'] as Interest[];

    const allActions: ScoredAction[] = [];

    interests.forEach(interest => {
      const categoryActions = actionsDatabase[interest][language];
      categoryActions.forEach(action => {
        // Filter by time available
        if (action.duration <= timeAvailable) {
          // Filter by energy level (allow ±3 flexibility)
          if (Math.abs(action.energy - energyLevel) <= 3) {
            // Filter by time of day
            if (action.times.includes('any') || action.times.includes(timeOfDay)) {
              const scoredAction: ScoredAction = {
                ...action,
                category: interest,
                score: 0
              };
              scoredAction.score = calculateScore(scoredAction, timeAvailable, energyLevel, selectedMood, location);
              allActions.push(scoredAction);
            }
          }
        }
      });
    });

    // Sort by score and return top 5
    const topSuggestions = allActions.sort((a, b) => b.score - a.score).slice(0, 5);
    setSuggestions(topSuggestions);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateSuggestions();
  };

  const resetForm = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Only show UI elements when user is logged in */}
      {currentUser && (
        <>
          <LanguageSwitcher language={language} onToggle={toggleLanguage} />

          <button
            onClick={() => setShowFeedback(true)}
            className="fixed top-5 left-5 z-50 bg-white text-indigo-600 px-5 py-2.5 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>💬</span>
            <span>{t.feedbackBtn}</span>
          </button>

          <button
            onClick={() => setShowUserInfo(!showUserInfo)}
            className="fixed top-5 right-20 z-50 px-5 py-2.5 rounded-full font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center gap-2 bg-green-500 text-white"
          >
            <span>🔐</span>
            <span>👤 {currentUser.name}</span>
          </button>
        </>
      )}

      <UserInfo
        user={currentUser}
        isOpen={showUserInfo}
        onLogout={handleLogout}
        language={language}
      />

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        language={language}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
        onLoginSuccess={handleLoginSuccess}
        language={language}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
        language={language}
      />

      {/* Conditional rendering based on authentication */}
      {!currentUser ? (
        // Show Landing Page when not logged in
        <LandingPage onLoginClick={() => setShowLogin(true)} />
      ) : (
        // Show Main Form when logged in
        <div className="container max-w-4xl mx-auto px-5 py-5">
          <div className="text-center mb-10 animate-fadeInDown">
            <h1 className="text-6xl font-extrabold text-white mb-2.5 drop-shadow-lg">
              {t.mainTitle}
            </h1>
            <p className="text-xl text-white/90 font-light">{t.mainSubtitle}</p>
          </div>

          {!showResults ? (
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-fadeInUp">
            <form onSubmit={handleSubmit}>
              {/* Time Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-5 flex items-center gap-2">
                  <span className="text-3xl">⏰</span>
                  {t.timeSection}
                </h2>
                <label className="block mb-2 font-semibold text-gray-800">
                  {t.timeQuestion}{' '}
                  <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full ml-2">
                    {timeAvailable}
                  </span>{' '}
                  {t.minutes}
                </label>
                <input
                  type="range"
                  min="5"
                  max="240"
                  step="5"
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5 {t.minutes}</span>
                  <span>240 {t.minutes}</span>
                </div>
              </div>

              {/* Energy Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-5 flex items-center gap-2">
                  <span className="text-3xl">⚡</span>
                  {t.energySection}
                </h2>
                <label className="block mb-2 font-semibold text-gray-800">
                  {t.energyQuestion}{' '}
                  <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full ml-2">
                    {energyLevel}
                  </span>
                  /10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{t.energyLow}</span>
                  <span>{t.energyHigh}</span>
                </div>
              </div>

              {/* Mood Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-5 flex items-center gap-2">
                  <span className="text-3xl">😊</span>
                  {t.moodSection}
                </h2>
                <label className="block mb-3 font-semibold text-gray-800">{t.moodQuestion}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(['happy', 'stressed', 'tired', 'motivated', 'bored', 'anxious'] as Mood[]).map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className={`p-3 border-2 rounded-xl text-center font-medium transition-all ${
                        selectedMood === mood
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                      }`}
                    >
                      {t.moods[mood]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-5 flex items-center gap-2">
                  <span className="text-3xl">📍</span>
                  {t.contextSection}
                </h2>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-800">{t.locationQuestion}</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as Location)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {(['home', 'office', 'outdoors', 'cafe', 'transit'] as Location[]).map((loc) => (
                      <option key={loc} value={loc}>
                        {t.locations[loc]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">{t.timeOfDayQuestion}</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {(['morning', 'midday', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((tod) => (
                      <option key={tod} value={tod}>
                        {t.timesOfDay[tod]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-5 flex items-center gap-2">
                  <span className="text-3xl">❤️</span>
                  {t.preferencesSection}
                </h2>
                <label className="block mb-3 font-semibold text-gray-800">{t.interestsQuestion}</label>
                <div className="flex flex-wrap gap-2">
                  {(['work', 'exercise', 'learning', 'relaxation', 'social', 'creative', 'entertainment', 'health', 'household', 'mindfulness'] as Interest[]).map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 border-2 rounded-full text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      {t.interests[interest]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl text-xl font-bold uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                {t.submitBtn}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl mb-5 shadow-2xl">
              <h2 className="text-4xl font-bold mb-2">{t.suggestionTitle}</h2>
              <p className="text-xl opacity-90 mb-5">{t.suggestionSubtitle}</p>
              <div className="space-y-4">
                {suggestions.map((action, index) => (
                  <div
                    key={index}
                    className="bg-white text-gray-800 p-5 rounded-2xl shadow-lg hover:translate-x-1 transition-transform"
                  >
                    <h3 className="text-indigo-600 text-xl font-bold mb-2 flex items-center gap-2">
                      {index + 1}. {action.title}
                      <span className="inline-block bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full text-sm font-semibold ml-2">
                        {categoryEmojis[action.category]} {categoryLabels[language][action.category]}
                      </span>
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-2">{action.desc}</p>
                    <span className="inline-block bg-gray-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                      ⏱️ {action.duration} {t.minutes}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={resetForm}
                className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold border-2 border-white hover:bg-transparent hover:text-white transition-all"
              >
                {t.backBtn}
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
}
