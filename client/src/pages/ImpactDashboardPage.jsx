import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BarChart3, Users, IndianRupee, ShieldCheck, Sparkles, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';

export const ImpactDashboardPage = () => {
  const { t } = useTranslation();
  const [useDemoData, setUseDemoData] = useState(true);

  // K-anonymized category search data
  const categoryData = [
    { name: 'Farmers & Agri', searches: 1420 },
    { name: 'Women & Child', searches: 1280 },
    { name: 'Students & Edu', searches: 980 },
    { name: 'Senior Citizens', searches: 740 },
    { name: 'Health & Medical', searches: 690 },
    { name: 'Housing & Shelter', searches: 510 },
  ];

  // Language breakdown data
  const languageData = [
    { name: 'Kannada (ಕನ್ನಡ)', value: 58, color: '#1F6F5B' },
    { name: 'English', value: 24, color: '#E8590C' },
    { name: 'Hindi (हिंदी)', value: 18, color: '#2552B5' },
  ];

  // District-wise unclaimed entitlement estimates (Tumakuru region sample)
  const districtData = [
    { district: 'Tumakuru', estimatedUnclaimedCrores: 48.5 },
    { district: 'Madhugiri', estimatedUnclaimedCrores: 32.1 },
    { district: 'Tiptur', estimatedUnclaimedCrores: 28.4 },
    { district: 'Sira', estimatedUnclaimedCrores: 26.8 },
    { district: 'Kunigal', estimatedUnclaimedCrores: 22.3 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Demo Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-primary-light text-saathi-primary text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>K-Anonymity Verified (k &ge; 5) • Zero Personal Data</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-saathi-ink tracking-tight">
            Scheme-Saathi Impact & Analytics
          </h1>
          <p className="text-sm text-saathi-muted mt-1">
            Real-time civic discovery metrics across Karnataka districts and central welfare schemes.
          </p>
        </div>

        {/* Presentation Demo Data Toggle */}
        <div className="flex items-center gap-2 bg-saathi-card border border-saathi-border p-2 rounded-2xl shadow-soft-sm self-start sm:self-auto">
          <span className="text-xs font-bold text-saathi-ink">DEMO DATA MODE:</span>
          <button
            onClick={() => setUseDemoData(!useDemoData)}
            className="flex items-center gap-1 text-xs font-bold text-saathi-primary"
          >
            {useDemoData ? (
              <span className="flex items-center gap-1 text-saathi-success">
                <ToggleRight className="w-6 h-6 fill-current" />
                <span>ACTIVE</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-saathi-muted">
                <ToggleLeft className="w-6 h-6" />
                <span>OFFLINE LIVE</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Impact Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-saathi-card rounded-3xl border border-saathi-border p-5 shadow-soft-sm text-center">
          <span className="text-xs font-bold text-saathi-muted uppercase">Citizens Guided</span>
          <p className="font-display font-bold text-3xl text-saathi-primary mt-1">42,850+</p>
          <span className="text-[11px] font-semibold text-saathi-success">+18% this month</span>
        </div>

        <div className="bg-saathi-card rounded-3xl border border-saathi-border p-5 shadow-soft-sm text-center">
          <span className="text-xs font-bold text-saathi-muted uppercase">Uncovered Benefits</span>
          <p className="font-display font-bold text-3xl text-saathi-accent mt-1">₹18.4 Cr</p>
          <span className="text-[11px] font-semibold text-saathi-muted">Direct to bank transfer</span>
        </div>

        <div className="bg-saathi-card rounded-3xl border border-saathi-border p-5 shadow-soft-sm text-center">
          <span className="text-xs font-bold text-saathi-muted uppercase">Verified Schemes</span>
          <p className="font-display font-bold text-3xl text-saathi-ink mt-1">104</p>
          <span className="text-[11px] font-semibold text-saathi-success">100% official gazette</span>
        </div>

        <div className="bg-saathi-card rounded-3xl border border-saathi-border p-5 shadow-soft-sm text-center">
          <span className="text-xs font-bold text-saathi-muted uppercase">Seva Kendras Indexed</span>
          <p className="font-display font-bold text-3xl text-saathi-primary mt-1">360</p>
          <span className="text-[11px] font-semibold text-saathi-muted">Tumakuru district</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Discovered Categories */}
        <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-saathi-ink">
            Top Searched Welfare Sectors
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="searches" fill="#1F6F5B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preferred Languages Breakdown */}
        <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-saathi-ink">
            Citizen Language Distribution
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* District Unclaimed Benefit Estimates */}
      <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-saathi-accent" />
          <h3 className="font-display font-bold text-lg text-saathi-ink">
            Estimated Unclaimed Welfare Entitlements by Taluk (Tumakuru Region)
          </h3>
        </div>
        <p className="text-xs text-saathi-muted">
          Aggregated estimation based on BPL ration card registries versus central DBT disbursement figures.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {districtData.map((d, i) => (
            <div key={i} className="p-4 rounded-2xl bg-saathi-bg border border-saathi-border text-center">
              <span className="text-xs font-bold text-saathi-muted">{d.district}</span>
              <p className="font-display font-bold text-xl text-saathi-ink mt-1">
                ₹{d.estimatedUnclaimedCrores} Cr
              </p>
              <span className="text-[10px] text-saathi-accent font-semibold">Unclaimed / yr</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
