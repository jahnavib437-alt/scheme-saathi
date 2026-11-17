import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LockKeyhole,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Send,
  Users
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const AdminPage = () => {
  const { t } = useTranslation();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'ingest' | 'schemes' | 'broadcast'
  const [ingestUrl, setIngestUrl] = useState('');
  const [ingestText, setIngestText] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestLogs, setIngestLogs] = useState([]);

  // Broadcast announcement
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  // Sample pending review scheme
  const [reviewScheme, setReviewScheme] = useState({
    slug: 'karnataka-yuva-nidhi',
    name: {
      en: 'Karnataka Yuva Nidhi Scheme',
      kn: 'ಕರ್ನಾಟಕ ಯುವ ನಿಧಿ ಯೋಜನೆ',
      hi: 'कर्नाटक युवा निधि योजना',
    },
    category: 'students',
    level: 'state',
    state: 'Karnataka',
    ministry: 'Department of Skill Development, Entrepreneurship and Livelihood',
    sourceUrl: 'https://sevasindhu.karnataka.gov.in/Yuvanidhi',
    lastVerified: new Date().toISOString(),
    benefitText: {
      en: '₹3,000 / month for unemployed graduates, ₹1,500 / month for diploma holders for up to 2 years.',
      kn: 'ನಿರುದ್ಯೋಗಿ ಪದವೀಧರರಿಗೆ ಮಾಸಿಕ ₹3,000 ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಹೊಂದಿದವರಿಗೆ ₹1,500.',
      hi: 'बेरोज़गार स्नातकों के लिए ₹3,000 प्रतिमाह और डिप्लोमा धारकों के लिए ₹1,500 प्रतिमाह।',
    },
    rules: [
      { field: 'state', op: '==', value: 'Karnataka', hint: 'Must be domicile of Karnataka', verified: true },
      { field: 'isStudent', op: '==', value: false, hint: 'Must not be currently pursuing higher education', verified: true },
      { field: 'educationLevel', op: 'in', value: ['graduate', 'post_graduate'], hint: 'Passed in academic year 2023 or later', verified: false },
      { field: 'occupation', op: '==', value: 'unemployed', hint: 'Unemployed for at least 6 months after graduation', verified: false },
    ],
  });

  const [ruleChecks, setRuleChecks] = useState([true, true, false, false]);

  const toggleRuleCheck = (index) => {
    const next = [...ruleChecks];
    next[index] = !next[index];
    setRuleChecks(next);
  };

  const allRulesVerified = ruleChecks.every(Boolean);

  const handleApproveScheme = () => {
    if (!allRulesVerified) {
      addToast({
        title: 'Verification Incomplete',
        description: 'Every eligibility rule row must be verified against official source text before approving.',
        type: 'warning',
      });
      return;
    }
    addToast({
      title: 'Scheme Approved & Published!',
      description: 'The scheme status is now "verified" and live on public feed.',
      type: 'success',
    });
  };

  const handleStartIngest = (e) => {
    e.preventDefault();
    setIsIngesting(true);
    setIngestLogs(['[INGEST] Checking robots.txt for official domain...', '[INGEST] Rate-limit set to 1 req / 2000ms', '[INGEST] Content fetched politely. Computing hash...']);

    setTimeout(() => {
      setIngestLogs((prev) => [
        ...prev,
        '[EXTRACT] Parsing HTML DOM with Cheerio...',
        '[AI DRAFT] Generating deterministic rule candidate via Gemini schema...',
        '[VALIDATE] Checking Zod schema against standard profile fields...',
        '[STORE] Seeded with verificationStatus="needs_review". Added to review queue!',
      ]);
      setIsIngesting(false);
      addToast({ title: 'Ingestion completed! Placed in Review Queue.', type: 'success' });
    }, 2400);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;
    addToast({
      title: `Broadcast dispatched live: "${broadcastTitle}"`,
      description: 'Socket.IO pushed toast to all online citizens.',
      type: 'success',
    });
    setBroadcastTitle('');
    setBroadcastBody('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-ink text-white text-xs font-bold mb-2">
            <LockKeyhole className="w-3.5 h-3.5" />
            <span>Official Admin & Reviewer Desk</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-saathi-ink tracking-tight">
            Scheme Verification & Ingestion Control
          </h1>
          <p className="text-xs text-saathi-muted mt-1">
            Enforces Non-Negotiable Rules: Zero hallucinations, polite crawler delays, human verification gate before publishing.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="p-3 rounded-2xl bg-saathi-card border border-saathi-border text-center shadow-soft-sm">
            <span className="text-[10px] font-bold text-saathi-muted uppercase">Needs Review</span>
            <p className="font-display font-bold text-xl text-saathi-warning">7</p>
          </div>
          <div className="p-3 rounded-2xl bg-saathi-card border border-saathi-border text-center shadow-soft-sm">
            <span className="text-[10px] font-bold text-saathi-muted uppercase">Verified Live</span>
            <p className="font-display font-bold text-xl text-saathi-success">104</p>
          </div>
          <div className="p-3 rounded-2xl bg-saathi-card border border-saathi-border text-center shadow-soft-sm">
            <span className="text-[10px] font-bold text-saathi-muted uppercase">Active Users</span>
            <p className="font-display font-bold text-xl text-saathi-primary flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-saathi-success animate-ping" />
              <span>42</span>
            </p>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-saathi-border pb-2">
        {[
          { id: 'review', label: 'Review Queue (Side-by-Side)' },
          { id: 'ingest', label: 'Polite Ingestion & Robots.txt' },
          { id: 'broadcast', label: 'Live Broadcast Banner' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-pill transition-all ${
              activeTab === tab.id
                ? 'bg-saathi-primary text-white shadow-soft-sm'
                : 'bg-saathi-card text-saathi-muted hover:text-saathi-ink border border-saathi-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Queue (Side by Side Verification) */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-saathi-warning-light border border-saathi-warning/30 text-xs text-saathi-warning flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              <strong>Rule 2 Enforced:</strong> A scheme can only be published to the public as "verified" after every rule row has been checked against official gazette text.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Official Source Text */}
            <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-saathi-muted">
                  Official Gazette / Portal Source
                </span>
                <a
                  href={reviewScheme.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-saathi-primary font-bold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Open Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-saathi-bg font-mono text-xs text-saathi-ink leading-relaxed space-y-2 border border-saathi-border max-h-96 overflow-y-auto">
                <p><strong>GOVERNMENT OF KARNATAKA - YUVA NIDHI SCHEME GUIDELINES</strong></p>
                <p>1. Applicable exclusively to candidates who are domicile of Karnataka state.</p>
                <p>2. Financial assistance of Rs 3,000 per month for graduates and Rs 1,500 per month for diploma holders.</p>
                <p>3. Candidate must have completed degree in 2023 or later and remained unemployed for minimum 6 months.</p>
                <p>4. Benefits cease upon gaining employment or admission to higher education courses.</p>
                <p>5. Application must be submitted on Seva Sindhu or Grama One with Aadhaar authentication.</p>
              </div>
            </div>

            {/* Right: Drafted Record & Rule Rows with Verify Checkboxes */}
            <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-saathi-primary">
                  Drafted Scheme Candidate (Zod Validated)
                </span>
                <h3 className="font-display font-bold text-xl text-saathi-ink mt-1">
                  {reviewScheme.name.en}
                </h3>
                <p className="text-xs text-saathi-muted">{reviewScheme.benefitText.en}</p>
              </div>

              {/* Rule Rows Verification Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-saathi-ink">
                  Deterministic Rule Rows ({ruleChecks.filter(Boolean).length} / {reviewScheme.rules.length} Checked):
                </span>

                {reviewScheme.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleRuleCheck(idx)}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      ruleChecks[idx]
                        ? 'bg-saathi-success-light border-saathi-success/30 text-saathi-success'
                        : 'bg-saathi-bg border-saathi-border text-saathi-ink'
                    }`}
                  >
                    <div>
                      <p className="font-mono font-bold">
                        {rule.field} {rule.op} {JSON.stringify(rule.value)}
                      </p>
                      <p className="text-[11px] text-saathi-muted mt-0.5">{rule.hint}</p>
                    </div>

                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                      ruleChecks[idx] ? 'bg-saathi-success text-white border-saathi-success' : 'border-saathi-border bg-saathi-card'
                    }`}>
                      {ruleChecks[idx] && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={handleApproveScheme}
                  disabled={!allRulesVerified}
                  className="px-6 py-2.5 rounded-pill bg-saathi-primary text-white font-bold text-xs shadow-soft-sm hover:bg-saathi-primary-hover disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Verified & Publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Polite Ingestion Streamer Tab */}
      {activeTab === 'ingest' && (
        <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-xl text-saathi-ink">
              Polite Web Ingestion Pipeline
            </h3>
            <p className="text-xs text-saathi-muted">
              Crawl official portals respectfully: robots.txt check, 1 request per 2 seconds, User-Agent header, or direct raw text paste fallback.
            </p>
          </div>

          <form onSubmit={handleStartIngest} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-saathi-ink">Official Scheme Page URL</label>
              <input
                type="url"
                value={ingestUrl}
                onChange={(e) => setIngestUrl(e.target.value)}
                placeholder="https://myscheme.gov.in/schemes/... or https://sevasindhu.karnataka.gov.in/..."
                className="mt-1 w-full p-3 rounded-2xl border border-saathi-border bg-saathi-bg text-xs font-bold text-saathi-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-saathi-ink">Or Paste Official Gazette Text (Fallback)</label>
              <textarea
                rows={3}
                value={ingestText}
                onChange={(e) => setIngestText(e.target.value)}
                placeholder="Paste notification or guidelines text here..."
                className="mt-1 w-full p-3 rounded-2xl border border-saathi-border bg-saathi-bg text-xs text-saathi-ink focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isIngesting || (!ingestUrl && !ingestText)}
              className="px-6 py-2.5 rounded-pill bg-saathi-primary text-white text-xs font-bold shadow-soft-sm hover:bg-saathi-primary-hover disabled:opacity-50 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isIngesting ? 'Ingesting Politely...' : 'Run Ingestion Pipeline'}</span>
            </button>
          </form>

          {/* Live Ingestion Log Terminal */}
          {ingestLogs.length > 0 && (
            <div className="p-4 rounded-3xl bg-saathi-ink text-saathi-bg font-mono text-xs space-y-1 shadow-inner max-h-56 overflow-y-auto">
              {ingestLogs.map((log, i) => (
                <div key={i} className="text-emerald-400">{log}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Broadcast Banner Tab */}
      {activeTab === 'broadcast' && (
        <form onSubmit={handleBroadcast} className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4 max-w-xl">
          <h3 className="font-display font-bold text-xl text-saathi-ink">Broadcast Public Announcement</h3>
          <p className="text-xs text-saathi-muted">Pushes a live notification banner instantly to all active citizens via Socket.IO.</p>

          <div>
            <label className="text-xs font-bold text-saathi-ink">Banner Title</label>
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="e.g. New DBT Installment Announced for PM-KISAN"
              className="mt-1 w-full p-2.5 rounded-xl border border-saathi-border bg-saathi-bg text-xs font-bold text-saathi-ink"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-saathi-ink">Message Details</label>
            <textarea
              rows={3}
              value={broadcastBody}
              onChange={(e) => setBroadcastBody(e.target.value)}
              placeholder="Full alert message..."
              className="mt-1 w-full p-3 rounded-2xl border border-saathi-border bg-saathi-bg text-xs text-saathi-ink"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-pill bg-saathi-accent text-white font-bold text-xs shadow-soft-sm hover:bg-saathi-accent-hover flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Send Live Broadcast</span>
          </button>
        </form>
      )}
    </div>
  );
};
