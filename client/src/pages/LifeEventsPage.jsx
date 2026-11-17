import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Baby, 
  Briefcase, 
  CalendarClock, 
  GraduationCap, 
  Heart, 
  Accessibility, 
  CloudRain, 
  Home, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';

export const LifeEventsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateProfile } = useProfileStore();

  const events = [
    {
      id: 'new_baby',
      title: 'New Baby / Maternity',
      titleKn: 'ಹೊಸ ಮಗುವಿನ ಜನನ / ಮಾತೃತ್ವ',
      titleHi: 'नया बच्चा / मातृत्व',
      icon: Baby,
      color: 'bg-category-women-bg text-category-women border-category-women/30',
      schemesCount: 4,
      desc: 'Pradhan Mantri Matru Vandana Yojana (PMMVY ₹5,000 cash), Janani Suraksha Yojana, free child immunisation & nutrition kit.',
      actionProfile: { isPregnant: true },
    },
    {
      id: 'turned_60',
      title: 'Turned 60 / Senior Citizen',
      titleKn: '60 ವರ್ಷ ಪೂರ್ಣ / ಹಿರಿಯ ನಾಗರಿಕ',
      titleHi: '60 वर्ष पूर्ण / वरिष्ठ नागरिक',
      icon: CalendarClock,
      color: 'bg-category-seniors-bg text-category-seniors border-category-seniors/30',
      schemesCount: 5,
      desc: 'Karnataka Sandhya Suraksha pension (₹1,200/mo), Indira Gandhi National Old Age Pension, free bus pass for seniors.',
      actionProfile: { age: 65 },
    },
    {
      id: 'college_admission',
      title: 'College Admission',
      titleKn: 'ಕಾಲೇಜು ಪ್ರವೇಶ / ಉನ್ನತ ಶಿಕ್ಷಣ',
      titleHi: 'कॉलेज प्रवेश / उच्च शिक्षा',
      icon: GraduationCap,
      color: 'bg-category-students-bg text-category-students border-category-students/30',
      schemesCount: 8,
      desc: 'Post-Matric scholarship for SC/ST/OBC/Minorities (up to ₹20,000 + fee reimbursement), Karnataka Vidyasiri, NSP loans.',
      actionProfile: { isStudent: true, occupation: 'student', age: 19 },
    },
    {
      id: 'job_loss',
      title: 'Job Loss / Skill Training',
      titleKn: 'ಕೆಲಸ ಕಳೆದುಕೊಂಡಿರುವುದು / ಕೌಶಲ್ಯ ತರಬೇತಿ',
      titleHi: 'रोज़गार की तलाश / कौशल प्रशिक्षण',
      icon: Briefcase,
      color: 'bg-category-skills-bg text-category-skills border-category-skills/30',
      schemesCount: 6,
      desc: 'PMKVY free certified skill training + ₹8,000 stipend, MGNREGA 100 days guaranteed rural wage employment.',
      actionProfile: { occupation: 'unemployed' },
    },
    {
      id: 'crop_loss',
      title: 'Crop Loss / Drought / Flood',
      titleKn: 'ಬೆಳೆ ಹಾನಿ / ಬರ / ಪ್ರವಾಹ',
      titleHi: 'फसल नुकसान / सूखा / बाढ़',
      icon: CloudRain,
      color: 'bg-category-farmers-bg text-category-farmers border-category-farmers/30',
      schemesCount: 5,
      desc: 'PM Fasal Bima Yojana (PMFBY insurance payout), Karnataka Parihara drought relief, Kisan Credit Card restructuring.',
      actionProfile: { occupation: 'farmer' },
    },
    {
      id: 'house_purchase',
      title: 'Building a Pucca House',
      titleKn: 'ಮನೆ ನಿರ್ಮಾಣ / ವಸತಿ',
      titleHi: 'पक्का मकान निर्माण / आवास',
      icon: Home,
      color: 'bg-category-housing-bg text-category-housing border-category-housing/30',
      schemesCount: 4,
      desc: 'PMAY-Gramin ₹1,20,000 direct construction grant, Dr. B.R. Ambedkar Rural Housing Scheme subsidy.',
      actionProfile: { hasBplCard: true },
    },
    {
      id: 'disability',
      title: 'Disability & Assistive Devices',
      titleKn: 'ವಿಶೇಷ ಚೇತನರು / ವೈದ್ಯಕೀಯ ನೆರವು',
      titleHi: 'दिव्यांगजन / सहायक उपकरण',
      icon: Accessibility,
      color: 'bg-category-disability-bg text-category-disability border-category-disability/30',
      schemesCount: 6,
      desc: 'ADIP Scheme (Free motorized tricycles, hearing aids), UDID disability pension (₹1,400/mo), fee waivers.',
      actionProfile: { hasDisability: true, disabilityPercent: 45 },
    },
    {
      id: 'marriage',
      title: 'Daughter\'s Marriage Support',
      titleKn: 'ಹೆಣ್ಣುಮಕ್ಕಳ ಮದುವೆ ಸಹಾಯಧನ',
      titleHi: 'विवाह सहायता योजना',
      icon: Heart,
      color: 'bg-category-women-bg text-category-women border-category-women/30',
      schemesCount: 3,
      desc: 'Karnataka Saptapadi Vivaha Scheme (₹55,000 incentive), Shadi Bhagya for minority communities, BPL assistance.',
      actionProfile: { gender: 'female' },
    },
  ];

  const handleSelectEvent = (event) => {
    updateProfile(event.actionProfile);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-accent-light text-saathi-accent text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Life Milestone Navigation</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-saathi-ink tracking-tight">
          Find Schemes Tailored to Life Events
        </h1>
        <p className="text-sm text-saathi-muted max-w-xl mx-auto">
          Major changes in life bring immediate entitlement to government safety nets. Select your current event to instantly filter corresponding verified schemes.
        </p>
      </div>

      {/* Grid of Life Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => {
          const Icon = ev.icon;
          return (
            <div
              key={ev.id}
              onClick={() => handleSelectEvent(ev)}
              className="bg-saathi-card rounded-3xl border border-saathi-border p-6 shadow-soft-sm hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${ev.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-pill bg-saathi-bg text-saathi-primary border border-saathi-border">
                    {ev.schemesCount} Schemes
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-saathi-ink group-hover:text-saathi-primary transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-saathi-muted mt-1 leading-relaxed">
                    {ev.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-saathi-border/60 flex items-center justify-between text-xs font-bold text-saathi-primary">
                <span>View Schemes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
