import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bookmark, Share2, Volume2, ExternalLink, CheckCircle2, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';
import { CategoryArtwork } from '../assets/categorySvgs';
import { useTrackerStore } from '../store/trackerStore';
import { useUIStore } from '../store/uiStore';

export const SchemeCard = ({ scheme, evaluation = null }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const { savedSchemeIds, toggleSaveScheme } = useTrackerStore();
  const { setActiveSchemeModal, addToast } = useUIStore();

  const isSaved = savedSchemeIds.includes(scheme._id || scheme.slug);

  // Localization fallback
  const schemeName = scheme.name?.[lang] || scheme.name?.en || scheme.slug;
  const schemeSummary = scheme.summary?.[lang] || scheme.summary?.en || '';
  const benefitText = scheme.benefitText?.[lang] || scheme.benefitText?.en || '';

  // Determine Benefit Pill Text
  let benefitPill = benefitText;
  if (scheme.benefitAmount?.max) {
    const formattedMax = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(scheme.benefitAmount.max);

    benefitPill = `${formattedMax} / ${scheme.benefitAmount.frequency || 'year'}`;
  }

  // Handle TTS Read Aloud
  const handleReadAloud = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      addToast({ title: 'Speech not supported', type: 'warning' });
      return;
    }
    window.speechSynthesis.cancel();
    const textToRead = `${schemeName}. ${schemeSummary}. Benefit: ${benefitPill}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Choose voice based on language
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'kn') {
      const knVoice = voices.find((v) => v.lang.includes('kn') || v.lang.includes('IN'));
      if (knVoice) utterance.voice = knVoice;
      utterance.lang = 'kn-IN';
    } else if (lang === 'hi') {
      const hiVoice = voices.find((v) => v.lang.includes('hi'));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    window.speechSynthesis.speak(utterance);
    addToast({ title: t('voice.listening'), description: schemeName, type: 'info' });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: schemeName,
        text: schemeSummary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${schemeName} - ${window.location.href}`);
      addToast({ title: 'Link copied to clipboard!', type: 'success' });
    }
  };

  const handleToggleSave = (e) => {
    e.stopPropagation();
    toggleSaveScheme(scheme._id || scheme.slug);
    addToast({
      title: isSaved ? 'Removed from saved schemes' : 'Saved to My Applications',
      type: 'success',
    });
  };

  // Status Badge
  const status = evaluation?.status || null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={() => setActiveSchemeModal(scheme)}
      className="group relative bg-saathi-card rounded-3xl border border-saathi-border overflow-hidden shadow-soft-sm hover:shadow-soft-hover transition-all duration-300 cursor-pointer flex flex-col mb-4"
    >
      {/* Cover Artwork */}
      <div className="relative overflow-hidden">
        <CategoryArtwork category={scheme.category} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Verification Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white/90 dark:bg-saathi-card/90 backdrop-blur-sm shadow-soft-sm text-xs font-semibold">
          {scheme.verificationStatus === 'verified' ? (
            <span className="flex items-center gap-1 text-saathi-primary">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('eligibility.verify_status')}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-saathi-warning">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t('eligibility.unverified_status')}</span>
            </span>
          )}
        </div>

        {/* Level / State Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-pill bg-saathi-ink/75 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide uppercase">
          {scheme.level === 'central' ? 'Central' : scheme.state || 'State'}
        </div>

        {/* Floating Eligibility Status */}
        {status && (
          <div className="absolute bottom-3 left-3">
            {status === 'eligible' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-success text-white text-xs font-bold shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('eligibility.eligible')}
              </span>
            )}
            {status === 'maybe' && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-warning text-white text-xs font-bold shadow-md">
                <HelpCircle className="w-3.5 h-3.5" />
                {t('eligibility.maybe')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Benefit Amount Pill */}
          {benefitPill && (
            <div className="inline-flex items-center px-3 py-1 rounded-pill bg-saathi-accent-light text-saathi-accent text-xs font-bold mb-2">
              <span>{benefitPill}</span>
            </div>
          )}

          <h3 className="font-display font-bold text-lg text-saathi-ink tracking-tight line-clamp-2 group-hover:text-saathi-primary transition-colors">
            {schemeName}
          </h3>

          <p className="mt-1 text-xs text-saathi-muted line-clamp-3 leading-relaxed">
            {schemeSummary}
          </p>
        </div>

        {/* Near Miss Banner if fixable */}
        {evaluation?.nearMiss && evaluation.nearMiss.length > 0 && (
          <div className="p-2.5 rounded-2xl bg-saathi-warning-light border border-saathi-warning/30 text-xs text-saathi-warning">
            <span className="font-bold">Opportunity: </span>
            <span>{evaluation.nearMiss[0].hint || 'You could qualify soon'}</span>
          </div>
        )}

        {/* Verification info & Source Link */}
        <div className="pt-2 border-t border-saathi-border/60 flex items-center justify-between text-[11px] text-saathi-muted">
          <span>{scheme.lastVerified ? `${t('eligibility.last_verified')} ${scheme.lastVerified.substring(0, 10)}` : 'Official Record'}</span>
          {scheme.sourceUrl && (
            <a
              href={scheme.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 text-saathi-primary hover:underline font-semibold"
            >
              <span>Source</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Quick Action Hover Bar */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleSave}
              className={`p-2 rounded-2xl border transition-all ${
                isSaved
                  ? 'bg-saathi-primary text-white border-saathi-primary'
                  : 'bg-saathi-bg hover:bg-saathi-primary-light text-saathi-muted hover:text-saathi-primary border-saathi-border'
              }`}
              title={isSaved ? 'Saved' : 'Save to Board'}
              aria-label="Save Scheme"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleReadAloud}
              className="p-2 rounded-2xl bg-saathi-bg hover:bg-saathi-primary-light text-saathi-muted hover:text-saathi-primary border border-saathi-border transition-all"
              title="Read Aloud"
              aria-label="Read Aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-2xl bg-saathi-bg hover:bg-saathi-primary-light text-saathi-muted hover:text-saathi-primary border border-saathi-border transition-all"
              title="Share Scheme"
              aria-label="Share Scheme"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-bold text-saathi-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Details &rarr;
          </span>
        </div>
      </div>
    </motion.article>
  );
};
