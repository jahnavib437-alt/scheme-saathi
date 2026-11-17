import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { useTranslation } from 'react-i18next';
import { SearchPill } from '../components/SearchPill';
import { CategoryChips } from '../components/CategoryChips';
import { SchemeCard } from '../components/SchemeCard';
import { SchemeDetailModal } from '../components/SchemeDetailModal';
import { useUIStore } from '../store/uiStore';
import { useProfileStore } from '../store/profileStore';
import { ShieldCheck, Sparkles, Filter, RefreshCw } from 'lucide-react';

export const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { activeSchemeModal, setActiveSchemeModal, addToast } = useUIStore();
  const { profile } = useProfileStore();

  const [schemes, setSchemes] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'central' | 'state'

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schemes');
      if (res.ok) {
        const data = await res.json();
        setSchemes(data.schemes || []);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      console.warn('API error, using initial cached schemes fallback');
      // Fallback mock schemes if backend is not yet started
      setSchemes([
        {
          _id: 'pm-kisan-1',
          slug: 'pm-kisan',
          name: {
            en: 'PM-KISAN Samman Nidhi',
            kn: 'ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
            hi: 'पीएम-किसान सम्मान निधि',
          },
          category: 'farmers',
          level: 'central',
          ministry: 'Ministry of Agriculture & Farmers Welfare',
          summary: {
            en: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
            kn: 'ಎಲ್ಲಾ ಜಮೀನು ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆರ್ಥಿಕ ನೆರವು.',
            hi: 'सभी भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष तीन किस्तों में प्रत्यक्ष आय सहायता।',
          },
          benefitText: {
            en: '₹6,000 per year directly to bank account',
            kn: 'ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ',
            hi: '₹6,000 प्रति वर्ष सीधे बैंक खाते में',
          },
          benefitAmount: { min: 6000, max: 6000, frequency: 'yearly' },
          perHousehold: true,
          verificationStatus: 'verified',
          lastVerified: '2026-11-15T00:00:00.000Z',
          sourceUrl: 'https://pmkisan.gov.in',
          documents: ['Aadhaar Card', 'Land Ownership Records (RTC/Pahani)', 'Bank Account Passbook'],
        },
        {
          _id: 'gruha-lakshmi-1',
          slug: 'karnataka-gruha-lakshmi',
          name: {
            en: 'Karnataka Gruha Lakshmi Scheme',
            kn: 'ಕರ್ನಾಟಕ ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ',
            hi: 'कर्नाटक गृह लक्ष्मी योजना',
          },
          category: 'women',
          level: 'state',
          state: 'Karnataka',
          ministry: 'Department of Women & Child Development, Karnataka',
          summary: {
            en: 'Monthly financial assistance of ₹2,000 directly deposited to the bank accounts of women heads of households.',
            kn: 'ಮನೆಯ ಯಜಮಾನಿ ಮಹಿಳೆಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ನೇರ ನಗದು ವರ್ಗಾವಣೆ.',
            hi: 'परिवार की महिला मुखिया के बैंक खाते में ₹2,000 की मासिक वित्तीय सहायता।',
          },
          benefitText: {
            en: '₹2,000 / month (₹24,000 / year)',
            kn: 'ತಿಂಗಳಿಗೆ ₹2,000 (ವರ್ಷಕ್ಕೆ ₹24,000)',
            hi: '₹2,000 प्रतिमाह (₹24,000 प्रति वर्ष)',
          },
          benefitAmount: { min: 24000, max: 24000, frequency: 'yearly' },
          perHousehold: true,
          verificationStatus: 'verified',
          lastVerified: '2026-11-14T00:00:00.000Z',
          sourceUrl: 'https://sevasindhu.karnataka.gov.in',
          documents: ['Aadhaar of Woman Head', 'Aadhaar of Husband', 'Ration Card (BPL/APL/AAY)', 'Bank Passbook'],
        },
        {
          _id: 'nsp-post-matric-1',
          slug: 'post-matric-scholarship-minorities',
          name: {
            en: 'Post-Matric Scholarship for Minorities / SC / ST',
            kn: 'ಮೆಟ್ರಿಕ್ ನಂತರದ ವಿದ್ಯಾರ್ಥಿವೇತನ',
            hi: 'मैट्रिकोत्तर छात्रवृत्ति',
          },
          category: 'students',
          level: 'central',
          ministry: 'Ministry of Minority Affairs / Social Justice',
          summary: {
            en: 'Financial assistance for tuition fees and maintenance allowance to pursue higher education from class 11 to Ph.D.',
            kn: '11 ನೇ ತರಗತಿಯಿಂದ ಪಿಎಚ್‌ಡಿ ವರೆಗಿನ ಉನ್ನತ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಶೈಕ್ಷಣಿಕ ಶುಲ್ಕ ಮತ್ತು ನಿರ್ವಹಣಾ ಭತ್ಯೆ.',
            hi: 'कक्षा 11 से पीएचडी तक उच्च शिक्षा के लिए शिक्षण शुल्क और निर्वाह भत्ता सहायता।',
          },
          benefitText: {
            en: 'Up to ₹20,000 / year + Tuition waiver',
            kn: 'ವರ್ಷಕ್ಕೆ ₹20,000 ವರೆಗೆ ಮತ್ತು ಶುಲ್ಕ ವಿನಾಯಿತಿ',
            hi: '₹20,000 प्रति वर्ष तक + शुल्क छूट',
          },
          benefitAmount: { min: 10000, max: 20000, frequency: 'yearly' },
          perHousehold: false,
          verificationStatus: 'verified',
          lastVerified: '2026-11-12T00:00:00.000Z',
          sourceUrl: 'https://scholarships.gov.in',
          documents: ['Previous Year Marksheet', 'Income Certificate', 'Community Certificate', 'Aadhaar Card'],
        },
        {
          _id: 'ayushman-bharat-1',
          slug: 'ayushman-bharat-pmjay',
          name: {
            en: 'Ayushman Bharat PM-JAY & Arogya Karnataka',
            kn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ - ಆರೋಗ್ಯ ಕರ್ನಾಟಕ',
            hi: 'आयुष्मान भारत पीएम-जय एवं आरोग्य कर्नाटक',
          },
          category: 'health',
          level: 'central',
          ministry: 'National Health Authority',
          summary: {
            en: 'Cashless secondary and tertiary healthcare coverage of up to ₹5,00,000 per family per year across empaneled hospitals.',
            kn: 'ನೋಂದಾಯಿತ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹5,00,000 ವರೆಗೆ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸಾ ಸೌಲಭ್ಯ.',
            hi: 'सूचीबद्ध अस्पतालों में प्रति परिवार प्रति वर्ष ₹5,00,000 तक का कैशलेस द्वितीयक और तृतीयक स्वास्थ्य कवर।',
          },
          benefitText: {
            en: 'Up to ₹5,00,000 cashless health cover',
            kn: '₹5,00,000 ವರೆಗೆ ನಗದು ರಹಿತ ಆರೋಗ್ಯ ಚಿಕಿತ್ಸೆ',
            hi: '₹5,00,000 तक कैशलेस स्वास्थ्य कवर',
          },
          benefitAmount: { min: 500000, max: 500000, frequency: 'yearly' },
          perHousehold: true,
          verificationStatus: 'verified',
          lastVerified: '2026-11-16T00:00:00.000Z',
          sourceUrl: 'https://pmjay.gov.in',
          documents: ['Aadhaar Card', 'Ration Card (BPL/AAY)'],
        },
        {
          _id: 'sandhya-suraksha-1',
          slug: 'karnataka-sandhya-suraksha',
          name: {
            en: 'Karnataka Sandhya Suraksha Pension Scheme',
            kn: 'ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಪಿಂಚಣಿ ಯೋಜನೆ',
            hi: 'संध्या सुरक्षा पेंशन योजना',
          },
          category: 'seniors',
          level: 'state',
          state: 'Karnataka',
          ministry: 'Revenue Department, Government of Karnataka',
          summary: {
            en: 'Monthly pension of ₹1,200 for senior citizens aged 65 years and above in Karnataka with low income.',
            kn: 'ಕರ್ನಾಟಕದ 65 ವರ್ಷ ಮತ್ತು ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ವಯಸ್ಸಿನ ಕಡಿಮೆ ಆದಾಯದ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹1,200 ಪಿಂಚಣಿ.',
            hi: 'कर्नाटक में 65 वर्ष और उससे अधिक आयु के कम आय वाले वरिष्ठ नागरिकों के लिए ₹1,200 की मासिक पेंशन।',
          },
          benefitText: {
            en: '₹1,200 / month (₹14,400 / year)',
            kn: 'ತಿಂಗಳಿಗೆ ₹1,200 (ವರ್ಷಕ್ಕೆ ₹14,400)',
            hi: '₹1,200 प्रतिमाह (₹14,400 प्रति वर्ष)',
          },
          benefitAmount: { min: 14400, max: 14400, frequency: 'yearly' },
          perHousehold: false,
          verificationStatus: 'verified',
          lastVerified: '2026-11-10T00:00:00.000Z',
          sourceUrl: 'https://sevasindhu.karnataka.gov.in',
          documents: ['Age Proof / Aadhaar', 'Income Certificate', 'Bank Passbook', 'Domicile Certificate'],
        },
        {
          _id: 'pm-awas-gramin-1',
          slug: 'pm-awas-yojana-gramin',
          name: {
            en: 'Pradhan Mantri Awas Yojana (Gramin)',
            kn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ (ಗ್ರಾಮೀಣ)',
            hi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
          },
          category: 'housing',
          level: 'central',
          ministry: 'Ministry of Rural Development',
          summary: {
            en: 'Financial assistance of ₹1,20,000 for construction of pucca house for homeless or kutcha house dwellers in rural areas.',
            kn: 'ಗ್ರಾಮೀಣ ಭಾಗದ ವಸತಿ ರಹಿತರಿಗೆ ಪಕ್ಕಾ ಮನೆ ನಿರ್ಮಾಣಕ್ಕಾಗಿ ₹1,20,000 ಆರ್ಥಿಕ ಅನುದಾನ.',
            hi: 'ग्रामीण क्षेत्रों में बेघर या कच्चे घरों में रहने वालों के लिए पक्का मकान निर्माण हेतु ₹1,20,000 की सहायता।',
          },
          benefitText: {
            en: '₹1,20,000 one-time grant + 90 days MGNREGA wages',
            kn: '₹1,20,000 ಒಂದು ಬಾರಿಯ ಅನುದಾನ',
            hi: '₹1,20,000 एकमुश्त अनुदान',
          },
          benefitAmount: { min: 120000, max: 120000, frequency: 'one_time' },
          perHousehold: true,
          verificationStatus: 'verified',
          lastVerified: '2026-11-13T00:00:00.000Z',
          sourceUrl: 'https://pmayg.nic.in',
          documents: ['Aadhaar Card', 'MGNREGA Job Card', 'Bank Passbook', 'Land / Site documents'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    // Category match
    if (selectedCategory !== 'all' && s.category !== selectedCategory) {
      return false;
    }
    // Level match
    if (levelFilter === 'central' && s.level !== 'central') return false;
    if (levelFilter === 'state' && s.level !== 'state') return false;

    // Search query match (search name, summary, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameEn = (s.name?.en || '').toLowerCase();
      const nameKn = (s.name?.kn || '').toLowerCase();
      const nameHi = (s.name?.hi || '').toLowerCase();
      const summaryEn = (s.summary?.en || '').toLowerCase();
      const cat = (s.category || '').toLowerCase();
      return (
        nameEn.includes(q) ||
        nameKn.includes(q) ||
        nameHi.includes(q) ||
        summaryEn.includes(q) ||
        cat.includes(q)
      );
    }
    return true;
  });

  // Masonry Responsive Breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    900: 2,
    640: 1,
  };

  return (
    <div className="space-y-6">
      {/* Editorial Hero Header */}
      <div className="pt-2 pb-4 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-saathi-primary-light text-saathi-primary text-xs font-bold shadow-soft-sm">
          <Sparkles className="w-4 h-4 text-saathi-accent" />
          <span>Real-time Government Welfare Discovery Engine</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-saathi-ink tracking-tight leading-tight">
          Unlock the benefits you've{' '}
          <span className="italic text-saathi-primary">already earned</span>.
        </h1>

        <p className="text-sm sm:text-base text-saathi-muted leading-relaxed">
          Zero middlemen. Zero guesswork. Deterministic eligibility verified against official government gazettes and ministry portals.
        </p>

        {/* Sticky Search Pill Bar */}
        <div className="pt-2">
          <SearchPill
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
          />
        </div>
      </div>

      {/* Category Chips Scroller */}
      <div className="border-y border-saathi-border/60 py-1">
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Results Header / Live count */}
      <div className="flex items-center justify-between text-xs font-semibold text-saathi-muted px-1">
        <span>
          Showing <strong className="text-saathi-ink">{filteredSchemes.length}</strong> official welfare schemes
        </span>
        <button
          onClick={fetchSchemes}
          className="flex items-center gap-1 hover:text-saathi-primary transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Masonry Scheme Feed */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-saathi-card rounded-3xl border border-saathi-border p-4 h-72 animate-pulse space-y-3"
            >
              <div className="bg-saathi-border/40 rounded-2xl h-32 w-full" />
              <div className="bg-saathi-border/40 h-4 rounded w-3/4" />
              <div className="bg-saathi-border/40 h-3 rounded w-full" />
              <div className="bg-saathi-border/40 h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center py-16 bg-saathi-card rounded-4xl border border-saathi-border p-8 space-y-3">
          <p className="font-display font-bold text-xl text-saathi-ink">No schemes matched your search</p>
          <p className="text-xs text-saathi-muted">Try clearing filters or search by category name.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setLevelFilter('all');
            }}
            className="px-5 py-2 rounded-pill bg-saathi-primary text-white text-xs font-bold shadow-soft-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme._id || scheme.slug}
              scheme={scheme}
              evaluation={evaluations[scheme.slug]}
            />
          ))}
        </Masonry>
      )}

      {/* Scheme Detail Modal */}
      <SchemeDetailModal
        scheme={activeSchemeModal}
        evaluation={activeSchemeModal ? evaluations[activeSchemeModal.slug] : null}
      />
    </div>
  );
};
