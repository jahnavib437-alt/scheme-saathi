import React from 'react';
import { Shield, Database, Users, Eye, FileText, Globe, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-saathi-ink flex items-center gap-3">
          <Shield className="text-saathi-primary w-9 h-9" />
          About Scheme-Saathi
        </h1>
        <p className="text-base text-saathi-muted mt-2">
          A citizen-first public utility designed to bridge the awareness gap for government welfare programs across India.
        </p>
      </div>

      {/* Mandatory Civic Disclaimer */}
      <div className="p-4 sm:p-5 rounded-3xl bg-saathi-warning-light border border-saathi-warning/30 flex gap-4">
        <AlertTriangle className="text-saathi-warning w-6 h-6 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-semibold text-sm text-saathi-warning">Statutory Civic Disclaimer</h2>
          <p className="text-xs text-saathi-ink/80 leading-relaxed">
            <strong>Guidance only. Final eligibility is decided exclusively by the issuing department or ministry.</strong>{' '}
            Scheme-Saathi is an independent informational and digital assistance service. We are not an issuing authority and do not collect government application fees.
          </p>
        </div>
      </div>

      {/* Non-Negotiable Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-saathi-card border border-saathi-border shadow-soft-sm space-y-2">
          <div className="flex items-center gap-2.5 text-saathi-primary font-bold text-sm">
            <Users size={18} />
            <span>Zero Citizen Accounts & Pure Privacy</span>
          </div>
          <p className="text-xs text-saathi-muted leading-relaxed">
            Your eligibility profile lives entirely in your browser's private local storage. No login required, no tracking cookies, and no personal data sold to data brokers.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-saathi-card border border-saathi-border shadow-soft-sm space-y-2">
          <div className="flex items-center gap-2.5 text-saathi-primary font-bold text-sm">
            <FileText size={18} />
            <span>Ephemerally Processed Documents</span>
          </div>
          <p className="text-xs text-saathi-muted leading-relaxed">
            Uploaded document images for OCR (Ration Card, Caste Certificate) are processed entirely in volatile server RAM and discarded immediately. No image is ever written to disk or logged.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-saathi-card border border-saathi-border shadow-soft-sm space-y-2">
          <div className="flex items-center gap-2.5 text-saathi-primary font-bold text-sm">
            <Eye size={18} />
            <span>Deterministic Rule Decisions</span>
          </div>
          <p className="text-xs text-saathi-muted leading-relaxed">
            Eligibility decisions are computed exclusively through strict logical rules (age, income, land holding), never AI hallucination. LLMs are restricted strictly to conversational parsing and document OCR extraction.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-saathi-card border border-saathi-border shadow-soft-sm space-y-2">
          <div className="flex items-center gap-2.5 text-saathi-primary font-bold text-sm">
            <Database size={18} />
            <span>100% Verified Official Sources</span>
          </div>
          <p className="text-xs text-saathi-muted leading-relaxed">
            Every verified scheme links directly to its official source portal (e.g. myScheme.gov.in, Seva Sindhu, National Scholarship Portal) along with an auditable last-verified timestamp.
          </p>
        </div>
      </div>

      {/* Official Data Sources List */}
      <div className="p-6 rounded-3xl bg-saathi-card border border-saathi-border shadow-soft-sm space-y-4">
        <h2 className="font-display text-lg font-bold text-saathi-ink flex items-center gap-2">
          <Globe className="text-saathi-accent w-5 h-5" />
          Monitored Government Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'myScheme National Portal', url: 'https://www.myscheme.gov.in' },
            { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
            { name: 'PM-KISAN Samman Nidhi', url: 'https://pmkisan.gov.in' },
            { name: 'Karnataka Seva Sindhu', url: 'https://sevasindhu.karnataka.gov.in' },
            { name: 'Karnataka GramaOne Portal', url: 'https://karnataka.gov.in' },
            { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in' },
            { name: 'Open Government Data (OGD)', url: 'https://data.gov.in' },
            { name: 'National Portal of India', url: 'https://india.gov.in' },
            { name: 'CSC e-Governance India', url: 'https://csc.gov.in' },
          ].map((src) => (
            <a
              key={src.name}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-saathi-bg/80 border border-saathi-border hover:border-saathi-primary/40 text-xs font-semibold text-saathi-ink transition-colors flex items-center justify-between group"
            >
              <span>{src.name}</span>
              <span className="text-saathi-muted group-hover:text-saathi-primary text-[10px]">↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-saathi-muted pt-4 border-t border-saathi-border">
        Scheme-Saathi &copy; 2026. Made with pride for Indian citizens. No copyright infringement intended; all government emblems and names belong to their respective authorities.
      </div>
    </div>
  );
};

export default AboutPage;
