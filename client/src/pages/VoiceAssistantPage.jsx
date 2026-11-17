import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Sparkles, Sliders, Trash2, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useUIStore } from '../store/uiStore';
import { SchemeCard } from '../components/SchemeCard';

export const VoiceAssistantPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { profile, setField, resetProfile, updateProfile } = useProfileStore();
  const { addToast, setActiveSchemeModal } = useUIStore();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [nextQuestions, setNextQuestions] = useState([]);

  // Web Speech API handler
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast({
        title: 'Speech Recognition not supported in this browser.',
        description: 'You can type your profile details or use the quick buttons below.',
        type: 'warning',
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        addToast({ title: 'Microphone stopped or permission denied.', type: 'warning' });
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          processTranscript(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const processTranscript = async (text) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.partialProfile) {
          updateProfile(data.partialProfile);
          addToast({ title: 'Profile updated from voice!', type: 'success' });
        }
        if (data.nextQuestions) {
          setNextQuestions(data.nextQuestions);
        }
        // Match schemes
        checkEligibility(data.partialProfile || profile);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // Mock fallback: simple heuristic matching
      const lower = text.toLowerCase();
      const mockExtracted = {};
      if (lower.includes('farmer') || lower.includes('ರೈತ') || lower.includes('किसान')) {
        mockExtracted.occupation = 'farmer';
      }
      if (lower.includes('student') || lower.includes('ವಿದ್ಯಾರ್ಥಿ') || lower.includes('छात्र')) {
        mockExtracted.isStudent = true;
        mockExtracted.occupation = 'student';
      }
      if (lower.includes('woman') || lower.includes('female') || lower.includes('ಮಹಿಳೆ') || lower.includes('महिला')) {
        mockExtracted.gender = 'female';
      }
      if (lower.includes('widow') || lower.includes('ವಿಧವೆ') || lower.includes('विधवा')) {
        mockExtracted.maritalStatus = 'widowed';
      }
      const ageMatch = text.match(/\b(\d{2})\b/);
      if (ageMatch) {
        mockExtracted.age = parseInt(ageMatch[1], 10);
      }
      updateProfile(mockExtracted);
      addToast({ title: 'Profile updated with voice extraction.', type: 'success' });
      checkEligibility({ ...profile, ...mockExtracted });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkEligibility = async (activeProf) => {
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProf }),
      });
      if (res.ok) {
        const data = await res.json();
        setMatchedSchemes(data.results || []);
      }
    } catch (e) {
      console.warn('Match offline');
    }
  };

  // Demo Voice Prompts for instant testing
  const demoPrompts = [
    { label: '👵 Elderly Widow in Tumakuru (Kannada)', text: 'ನಾನು ತುಮಕೂರಿನ 66 ವರ್ಷದ ವಿಧವೆ, ಬಿಪಿಎಲ್ ಕಾರ್ಡ್ ಇದೆ, ವೃದ್ಧಾಪ್ಯ ವೇತನ ಬೇಕು' },
    { label: '🌾 Small Farmer (Karnataka)', text: 'I am a 42 year old farmer with 2 acres of land in Tumakuru Karnataka with low income' },
    { label: '🎓 College Student (OBC)', text: 'I am a 19 year old degree student from OBC category looking for scholarships' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-saathi-ink tracking-tight">
          {t('voice.tap_to_speak')}
        </h1>
        <p className="text-sm text-saathi-muted max-w-xl mx-auto">
          Speak naturally in your mother tongue. Tell us your age, work, family, or situation. Scheme-Saathi extracts your eligibility pins and matches verified government schemes.
        </p>
      </div>

      {/* Voice Control Hub */}
      <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 sm:p-8 shadow-soft-md text-center space-y-6">
        {/* Animated Big Mic Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-soft-lg transition-all transform hover:scale-105 active:scale-95 ${
              isListening
                ? 'bg-saathi-danger text-white animate-pulse ring-8 ring-saathi-danger-light'
                : 'bg-saathi-primary text-white hover:bg-saathi-primary-hover ring-8 ring-saathi-primary-light'
            }`}
            aria-label="Microphone"
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
          <span className="mt-3 text-xs font-bold text-saathi-ink uppercase tracking-wider">
            {isListening ? t('voice.listening') : t('voice.tap_to_speak')}
          </span>
        </div>

        {/* Live Speech Transcript Box */}
        <div className="max-w-xl mx-auto">
          <div className="p-4 rounded-3xl bg-saathi-bg border border-saathi-border min-h-[72px] flex items-center justify-center text-center">
            {isAnalyzing ? (
              <span className="text-xs text-saathi-accent font-semibold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-4 h-4" />
                {t('voice.extracting')}
              </span>
            ) : transcript ? (
              <p className="text-sm font-medium text-saathi-ink">{transcript}</p>
            ) : (
              <span className="text-xs text-saathi-muted">
                "Speak or select one of the demo citizen stories below"
              </span>
            )}
          </div>
        </div>

        {/* Tap-chip Fallback Prompts */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-saathi-muted uppercase tracking-wider">
            Or tap a demo citizen voice story:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {demoPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(p.text);
                  processTranscript(p.text);
                }}
                className="px-3.5 py-2 rounded-pill bg-saathi-bg hover:bg-saathi-primary-light text-saathi-ink hover:text-saathi-primary border border-saathi-border text-xs font-semibold shadow-soft-sm transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Profile Pins (Editable) */}
      <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-saathi-primary" />
            <h2 className="font-display font-bold text-lg text-saathi-ink">
              {t('voice.my_profile_pins')}
            </h2>
          </div>
          <button
            onClick={resetProfile}
            className="flex items-center gap-1 text-xs font-semibold text-saathi-danger hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('voice.clear_profile')}</span>
          </button>
        </div>

        {/* Profile Pins Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">Age</label>
            <input
              type="number"
              value={profile.age || ''}
              onChange={(e) => setField('age', e.target.value ? parseInt(e.target.value, 10) : null)}
              placeholder="e.g. 65"
              className="mt-1 w-full bg-transparent text-sm font-bold text-saathi-ink focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">Gender</label>
            <select
              value={profile.gender || ''}
              onChange={(e) => setField('gender', e.target.value || null)}
              className="mt-1 w-full bg-transparent text-xs font-bold text-saathi-ink focus:outline-none"
            >
              <option value="">Unknown</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">Occupation</label>
            <select
              value={profile.occupation || ''}
              onChange={(e) => setField('occupation', e.target.value || null)}
              className="mt-1 w-full bg-transparent text-xs font-bold text-saathi-ink focus:outline-none"
            >
              <option value="">Unknown</option>
              <option value="farmer">Farmer</option>
              <option value="agricultural_worker">Agri Worker</option>
              <option value="student">Student</option>
              <option value="unorganized_worker">Unorganized Worker</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">BPL Ration Card?</label>
            <select
              value={profile.hasBplCard === null ? '' : profile.hasBplCard ? 'yes' : 'no'}
              onChange={(e) => setField('hasBplCard', e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null)}
              className="mt-1 w-full bg-transparent text-xs font-bold text-saathi-ink focus:outline-none"
            >
              <option value="">Unknown</option>
              <option value="yes">Yes (BPL/AAY)</option>
              <option value="no">No (APL)</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">Annual Income</label>
            <input
              type="number"
              value={profile.annualIncome || ''}
              onChange={(e) => setField('annualIncome', e.target.value ? parseInt(e.target.value, 10) : null)}
              placeholder="e.g. 50000"
              className="mt-1 w-full bg-transparent text-sm font-bold text-saathi-ink focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">District</label>
            <input
              type="text"
              value={profile.district || 'Tumakuru'}
              onChange={(e) => setField('district', e.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-bold text-saathi-ink focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">Social Category</label>
            <select
              value={profile.socialCategory || ''}
              onChange={(e) => setField('socialCategory', e.target.value || null)}
              className="mt-1 w-full bg-transparent text-xs font-bold text-saathi-ink focus:outline-none"
            >
              <option value="">Unknown</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border">
            <label className="text-[11px] font-bold text-saathi-muted uppercase">Land (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={profile.landHoldingAcres || ''}
              onChange={(e) => setField('landHoldingAcres', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g. 2.5"
              className="mt-1 w-full bg-transparent text-sm font-bold text-saathi-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Matched Schemes Area */}
      {matchedSchemes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-saathi-ink">
              Your Eligible & Recommended Schemes
            </h2>
            <span className="text-xs font-bold text-saathi-primary">
              {matchedSchemes.length} schemes evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedSchemes.map((res) => (
              <SchemeCard
                key={res.scheme._id || res.scheme.slug}
                scheme={res.scheme}
                evaluation={res.evaluation}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
