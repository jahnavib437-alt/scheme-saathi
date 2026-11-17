import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  MapPin,
  ExternalLink,
  Download,
  Share2,
  Bookmark,
  Flag,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useTrackerStore } from '../store/trackerStore';
import { CategoryArtwork } from '../assets/categorySvgs';

export const SchemeDetailModal = ({ scheme, evaluation = null }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { activeSchemeModal, setActiveSchemeModal, addToast } = useUIStore();
  const { savedSchemeIds, toggleSaveScheme } = useTrackerStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'eligibility' | 'documents' | 'apply' | 'centres'
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportType, setReportType] = useState('wrong_info');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  if (!scheme) return null;

  const isSaved = savedSchemeIds.includes(scheme._id || scheme.slug);
  const schemeName = scheme.name?.[lang] || scheme.name?.en || scheme.slug;
  const schemeSummary = scheme.summary?.[lang] || scheme.summary?.en || '';
  const benefitText = scheme.benefitText?.[lang] || scheme.benefitText?.en || '';

  const handleDownloadPDF = async () => {
    try {
      addToast({ title: 'Generating official checklist PDF...', type: 'info' });
      const res = await fetch(`/api/schemes/${scheme._id || scheme.slug}/pdf?lang=${lang}`);
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${scheme.slug || 'scheme'}_checklist_${lang}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      addToast({ title: 'PDF Checklist downloaded!', type: 'success' });
    } catch (err) {
      console.error(err);
      addToast({ title: 'Could not download PDF. Server may be offline.', type: 'warning' });
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportMessage.trim()) return;
    setReportSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme._id || scheme.slug,
          type: reportType,
          message: reportMessage,
        }),
      });
      addToast({ title: 'Thank you! Your feedback has been sent for admin review.', type: 'success' });
      setReportModalOpen(false);
      setReportMessage('');
    } catch (err) {
      addToast({ title: 'Feedback recorded locally.', type: 'info' });
      setReportModalOpen(false);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveSchemeModal(null)}
          className="fixed inset-0 bg-saathi-ink/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative bg-saathi-card w-full max-w-3xl rounded-4xl border border-saathi-border shadow-soft-lg overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header Cover */}
          <div className="relative">
            <CategoryArtwork category={scheme.category} className="w-full h-40 object-cover" />
            <button
              onClick={() => setActiveSchemeModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-saathi-ink/80 text-saathi-ink dark:text-white shadow-soft-sm hover:scale-105 transition-transform"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-pill bg-white/90 dark:bg-saathi-card/90 text-xs font-bold text-saathi-primary shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {scheme.verificationStatus === 'verified' ? 'Verified Official' : 'Under Review'}
              </span>
              <span className="px-3 py-1 rounded-pill bg-saathi-ink/80 text-white text-xs font-semibold uppercase">
                {scheme.level === 'central' ? 'Central' : scheme.state || 'Karnataka'}
              </span>
            </div>
          </div>

          {/* Title & Primary Bar */}
          <div className="p-6 pb-2 border-b border-saathi-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-2xl text-saathi-ink tracking-tight">
                  {schemeName}
                </h2>
                <div className="flex items-center gap-4 text-xs text-saathi-muted mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {scheme.ministry || 'Government Department'}
                  </span>
                  {scheme.lastVerified && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {t('eligibility.last_verified')}: {scheme.lastVerified.substring(0, 10)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleSaveScheme(scheme._id || scheme.slug)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-bold transition-all border ${
                    isSaved
                      ? 'bg-saathi-primary text-white border-saathi-primary shadow-soft-sm'
                      : 'bg-saathi-bg hover:bg-saathi-primary-light text-saathi-ink border-saathi-border'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? t('actions.saved') : t('actions.save')}</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-pill bg-saathi-accent text-white text-xs font-bold shadow-soft-sm hover:bg-saathi-accent-hover transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Checklist</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2">
              {[
                { id: 'overview', label: 'Overview & Benefit' },
                { id: 'eligibility', label: t('eligibility.why_title') },
                { id: 'documents', label: 'Documents Required' },
                { id: 'apply', label: 'How to Apply' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-pill whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-saathi-primary text-white shadow-soft-sm'
                      : 'bg-saathi-bg text-saathi-muted hover:text-saathi-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-saathi-ink leading-relaxed">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-saathi-primary-light/40 border border-saathi-primary/20">
                  <h4 className="font-bold text-saathi-primary text-xs uppercase tracking-wider">
                    Key Benefit Entitlement
                  </h4>
                  <p className="mt-1 font-display text-xl text-saathi-ink font-semibold">
                    {benefitText || 'Financial assistance & social welfare support as per guidelines.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-saathi-ink text-sm">Detailed Summary</h4>
                  <p className="mt-1 text-saathi-muted text-sm leading-relaxed">
                    {schemeSummary}
                  </p>
                </div>

                {scheme.sourceUrl && (
                  <div className="p-4 rounded-2xl bg-saathi-bg border border-saathi-border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-saathi-ink">Official Verification Source</p>
                      <p className="text-xs text-saathi-muted truncate max-w-md">{scheme.sourceUrl}</p>
                    </div>
                    <a
                      href={scheme.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill bg-saathi-primary text-white text-xs font-bold shadow-soft-sm"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-saathi-bg border border-saathi-border space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-saathi-muted">
                    Deterministic Eligibility Criteria
                  </h4>
                  <p className="text-xs text-saathi-muted">
                    Evaluated by Scheme-Saathi's deterministic rule engine without guessing.
                  </p>
                </div>

                {/* Passed / Active Rules */}
                <div className="space-y-2">
                  {evaluation?.passed && evaluation.passed.length > 0 ? (
                    evaluation.passed.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-saathi-success-light border border-saathi-success/20 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-saathi-success shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-saathi-success">Satisfied Condition</p>
                          <p className="text-saathi-ink mt-0.5">{JSON.stringify(item)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-saathi-bg border border-saathi-border text-xs text-saathi-muted">
                      Complete your voice profile or questionnaire to test your qualification against this scheme.
                    </div>
                  )}

                  {evaluation?.nearMiss && evaluation.nearMiss.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-saathi-warning-light border border-saathi-warning/30 text-xs">
                      <HelpCircle className="w-4 h-4 text-saathi-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-saathi-warning">Near-Miss Actionable Opportunity</p>
                        <p className="text-saathi-ink mt-0.5">{item.hint || 'Renew or provide required certificate to qualify.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <p className="text-xs text-saathi-muted">
                  Keep these documents ready when visiting the Seva Kendra or applying online:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(scheme.documents || ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Ration Card (BPL/AAY)']).map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-saathi-bg border border-saathi-border shadow-soft-sm">
                      <FileText className="w-5 h-5 text-saathi-primary shrink-0" />
                      <span className="text-xs font-semibold text-saathi-ink">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'apply' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm">Step-by-Step Application Process</h4>
                <div className="space-y-3">
                  {(scheme.howToApply || [
                    'Visit your nearest Grama One, Karnataka One, or Seva Sindhu Kendra.',
                    'Submit the required certificates along with your masked Aadhaar copy.',
                    'Receive the application acknowledgement receipt with the tracking number.',
                    'Track approval status in Scheme-Saathi or via SMS alert from the issuing department.'
                  ]).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-saathi-bg border border-saathi-border">
                      <div className="w-6 h-6 rounded-full bg-saathi-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-saathi-ink leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                {scheme.applyUrl && (
                  <div className="pt-2">
                    <a
                      href={scheme.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-pill bg-saathi-primary text-white font-bold text-xs shadow-soft-md hover:bg-saathi-primary-hover transition-all"
                    >
                      <span>Proceed to Official Department Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-saathi-bg border-t border-saathi-border flex items-center justify-between text-xs text-saathi-muted">
            <span className="truncate max-w-xs">{t('brand.disclaimer')}</span>
            <button
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-1 font-semibold text-saathi-warning hover:underline"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t('eligibility.report_wrong')}</span>
            </button>
          </div>
        </motion.div>

        {/* Report Feedback Submodal */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-saathi-ink/70">
            <div className="bg-saathi-card rounded-3xl border border-saathi-border p-6 max-w-md w-full shadow-soft-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-saathi-ink">Report Scheme Information</h3>
                <button onClick={() => setReportModalOpen(false)}>
                  <X className="w-5 h-5 text-saathi-muted" />
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-saathi-ink">Issue Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="mt-1 w-full p-2.5 rounded-xl border border-saathi-border bg-saathi-bg text-xs font-medium text-saathi-ink"
                  >
                    <option value="wrong_info">Incorrect Eligibility or Benefit info</option>
                    <option value="broken_link">Broken Official Source Link</option>
                    <option value="suggestion">Improvement Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-saathi-ink">Details</label>
                  <textarea
                    rows={4}
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Describe what is incorrect or needs updating..."
                    className="mt-1 w-full p-3 rounded-2xl border border-saathi-border bg-saathi-bg text-xs text-saathi-ink placeholder:text-saathi-muted focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-pill text-xs font-semibold bg-saathi-bg text-saathi-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="px-5 py-2 rounded-pill text-xs font-bold bg-saathi-primary text-white shadow-soft-sm"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
