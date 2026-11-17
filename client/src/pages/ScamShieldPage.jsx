import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, Check, Search, ExternalLink } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const ScamShieldPage = () => {
  const { t } = useTranslation();
  const { addToast } = useUIStore();

  const [inputMessage, setInputMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const sampleScamMessages = [
    {
      label: '🚩 Fake Gruha Lakshmi Agent Fee SMS',
      text: 'Dear citizen, your Gruha Lakshmi payment of ₹4000 is pending. Pay processing fee of ₹150 via UPI immediately to activate. Click bit.ly/gruha-claim or share OTP.',
    },
    {
      label: '🚩 PM-KISAN KYC Urgent Threat',
      text: 'URGENT: Your PM-KISAN 17th installment stopped. Update Aadhaar OTP now at http://pmkisan-gov.xyz/kyc within 24 hours or account suspended.',
    },
    {
      label: '✅ Official Genuine DBT SMS',
      text: 'Dear Customer, your A/C ending 4892 is credited with Rs 2000.00 on 15-Nov-2026 by DBT/PM-KISAN Samman Nidhi. - Canara Bank',
    },
  ];

  const handleAnalyze = async (textToTest = inputMessage) => {
    if (!textToTest.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/scam/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToTest }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // Deterministic client-side evaluation fallback
      const text = textToTest.toLowerCase();
      const reasons = [];
      let score = 0;

      if (/fee|processing\s*fee|charge|deposit|payment\s*of|₹\s*\d+\s*via\s*upi/i.test(text)) {
        score += 40;
        reasons.push('Asks for upfront fee / money deposit. Official government schemes are ALWAYS 100% free.');
      }
      if (/otp|pin|cvv|password/i.test(text)) {
        score += 35;
        reasons.push('Requests OTP or confidential credentials. Government officials never ask for OTP.');
      }
      if (/bit\.ly|tinyurl|t\.co|\.xyz|\.top|\.club|http:\/\//i.test(text)) {
        score += 25;
        reasons.push('Uses a shortened or non-government web link. Genuine portals always end in .gov.in or .nic.in.');
      }
      if (/urgent|immediately|within\s*\d+\s*hours|suspended|blocked/i.test(text)) {
        score += 20;
        reasons.push('Creates artificial panic and urgency to force hasty compliance.');
      }

      const riskLevel = score >= 50 ? 'danger' : score >= 20 ? 'suspicious' : 'safe';

      setAnalysisResult({
        riskScore: Math.min(score, 100),
        riskLevel,
        reasons: reasons.length > 0 ? reasons : ['No standard fraud indicators detected. Text matches official transaction notification structure.'],
        advice:
          riskLevel === 'danger'
            ? 'DO NOT CLICK ANY LINKS OR PAY MONEY. Report this number to 1930 (National Cyber Crime Helpline) or your local Grama One office.'
            : riskLevel === 'suspicious'
            ? 'Exercise caution. Verify directly at sevasindhu.karnataka.gov.in before sharing any details.'
            : 'Message appears normal. Still remember: never share your Aadhaar OTP with anyone calling on phone.',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-danger-light text-saathi-danger text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Deterministic Scam Shield</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-saathi-ink tracking-tight">
          {t('scam.title')}
        </h1>
        <p className="text-sm text-saathi-muted max-w-xl mx-auto">
          {t('scam.notice')}
        </p>
      </div>

      {/* Input Box Card */}
      <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
        <label className="block text-xs font-bold text-saathi-ink uppercase tracking-wider">
          Verify Suspicious SMS, WhatsApp Forward, or Website Link
        </label>
        <textarea
          rows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t('scam.input_placeholder')}
          className="w-full p-4 rounded-3xl border border-saathi-border bg-saathi-bg text-sm text-saathi-ink placeholder:text-saathi-muted focus:outline-none focus:ring-2 focus:ring-saathi-primary/20"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-saathi-muted">Try sample:</span>
            {sampleScamMessages.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(s.text);
                  handleAnalyze(s.text);
                }}
                className="px-2.5 py-1 rounded-pill bg-saathi-bg hover:bg-saathi-primary-light text-[11px] font-semibold text-saathi-ink border border-saathi-border"
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing || !inputMessage.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-pill bg-saathi-accent text-white font-bold text-xs shadow-soft-sm hover:bg-saathi-accent-hover transition-all disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : t('scam.analyze_btn')}
          </button>
        </div>
      </div>

      {/* Analysis Result Display */}
      {analysisResult && (
        <div className={`p-6 rounded-4xl border shadow-soft-md space-y-4 ${
          analysisResult.riskLevel === 'danger'
            ? 'bg-saathi-danger-light/50 border-saathi-danger/30'
            : analysisResult.riskLevel === 'suspicious'
            ? 'bg-saathi-warning-light/50 border-saathi-warning/30'
            : 'bg-saathi-success-light/50 border-saathi-success/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {analysisResult.riskLevel === 'danger' ? (
                <ShieldAlert className="w-7 h-7 text-saathi-danger" />
              ) : analysisResult.riskLevel === 'suspicious' ? (
                <AlertTriangle className="w-7 h-7 text-saathi-warning" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-saathi-success" />
              )}
              <div>
                <h3 className="font-display font-bold text-lg text-saathi-ink">
                  {analysisResult.riskLevel === 'danger'
                    ? t('scam.risk_danger')
                    : analysisResult.riskLevel === 'suspicious'
                    ? t('scam.risk_suspicious')
                    : t('scam.risk_safe')}
                </h3>
                <p className="text-xs text-saathi-muted">
                  Heuristic Risk Score: <strong>{analysisResult.riskScore}/100</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Reasons List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-saathi-ink uppercase">Detected Signals:</span>
            {analysisResult.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-saathi-ink">
                <span className="text-saathi-danger font-bold">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          {/* Advice */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-saathi-card/80 border border-saathi-border text-xs font-medium text-saathi-ink">
            <strong className="text-saathi-primary">Citizen Advisory: </strong>
            <span>{analysisResult.advice}</span>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-saathi-muted text-center italic">
            {t('scam.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
};
