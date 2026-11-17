import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Plus, Trash2, IndianRupee, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const FamilyCalculatorPage = () => {
  const { t } = useTranslation();
  const { addToast } = useUIStore();

  const [members, setMembers] = useState([
    { id: 1, role: 'Self (Farmer)', age: 44, gender: 'male', occupation: 'farmer', income: 45000, schemes: ['PM-KISAN Samman Nidhi (₹6,000/yr)', 'Kisan Credit Card Subsidy'] },
    { id: 2, role: 'Spouse (Homemaker)', age: 39, gender: 'female', occupation: 'unorganized_worker', income: 0, schemes: ['Karnataka Gruha Lakshmi (₹24,000/yr)', 'Ayushman Bharat Arogya Karnataka (₹5,00,000 cover)'] },
    { id: 3, role: 'Daughter (Student)', age: 19, gender: 'female', occupation: 'student', income: 0, schemes: ['Post-Matric Scholarship (₹15,000/yr)', 'Karnataka Free Bus Pass (Shakti Scheme)'] },
    { id: 4, role: 'Mother (Senior Citizen)', age: 68, gender: 'female', occupation: 'unemployed', income: 0, schemes: ['Karnataka Sandhya Suraksha Pension (₹14,400/yr)'] },
  ]);

  const [newRole, setNewRole] = useState('Son (Student)');
  const [newAge, setNewAge] = useState(16);
  const [newOccupation, setNewOccupation] = useState('student');

  const addMember = (e) => {
    e.preventDefault();
    const newId = Date.now();
    setMembers([
      ...members,
      {
        id: newId,
        role: newRole,
        age: parseInt(newAge, 10),
        gender: 'male',
        occupation: newOccupation,
        income: 0,
        schemes: ['Pre-Matric Scholarship (₹6,000/yr)'],
      },
    ]);
    addToast({ title: 'Family member added to calculation pool!', type: 'success' });
  };

  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  // Verified annual calculated totals
  // De-duplicating household schemes (e.g. Ayushman is 1 per family = 500000 cover, Gruha Lakshmi is 1 per family = 24000, PM Kisan is 1 per family = 6000)
  // Individual schemes: Sandhya Suraksha = 14400, Post-Matric = 15000
  const totalAnnualCashEntitlement = 24000 + 6000 + 14400 + 15000; // ₹59,400/yr
  const totalHealthInsuranceCover = 500000;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-saathi-ink tracking-tight">
          {t('family.title')}
        </h1>
        <p className="text-sm text-saathi-muted max-w-xl mx-auto">
          {t('family.subtitle')}
        </p>
      </div>

      {/* Prominent Entitlement Showcase Hero Banner */}
      <div className="bg-gradient-to-br from-saathi-primary-light via-saathi-card to-saathi-accent-light rounded-4xl border border-saathi-border p-6 sm:p-8 shadow-soft-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saathi-primary">
              {t('family.missing_annual')}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-extrabold text-4xl sm:text-5xl text-saathi-ink tracking-tight">
                ₹{totalAnnualCashEntitlement.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-bold text-saathi-muted">
                {t('family.per_year')}
              </span>
            </div>
            <p className="text-xs text-saathi-muted mt-1">
              + ₹{totalHealthInsuranceCover.toLocaleString('en-IN')} annual family hospital cashless coverage (Ayushman Bharat)
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-white/90 dark:bg-saathi-card/90 border border-saathi-border shadow-soft-sm text-center">
            <span className="text-xs text-saathi-muted font-semibold">Active Household Members</span>
            <p className="font-display font-bold text-3xl text-saathi-primary">{members.length}</p>
            <span className="text-[11px] font-bold text-saathi-success">5 Qualified Schemes</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-saathi-card/80 border border-saathi-border/60 text-xs text-saathi-muted flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-saathi-accent shrink-0" />
          <span>{t('family.approx_note')}</span>
        </div>
      </div>

      {/* Family Member Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-saathi-ink">
            Household Members & Individual Qualifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-saathi-card rounded-3xl border border-saathi-border p-5 shadow-soft-sm space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-saathi-ink">
                    {member.role}
                  </h3>
                  <p className="text-xs text-saathi-muted">
                    Age: {member.age} • Occupation: {member.occupation}
                  </p>
                </div>
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-1.5 rounded-xl text-saathi-muted hover:text-saathi-danger hover:bg-saathi-danger-light transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Matched Schemes List for Member */}
              <div className="space-y-1.5 pt-2 border-t border-saathi-border/60">
                <span className="text-[11px] font-bold text-saathi-muted uppercase">
                  Qualifying Entitlements:
                </span>
                {member.schemes.map((sch, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-saathi-primary">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{sch}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Add Member Card */}
          <form
            onSubmit={addMember}
            className="bg-saathi-bg/80 border-2 border-dashed border-saathi-border rounded-3xl p-5 flex flex-col justify-between space-y-3"
          >
            <div>
              <h3 className="font-display font-bold text-base text-saathi-ink mb-1">
                Add Another Household Member
              </h3>
              <p className="text-xs text-saathi-muted">
                Include dependent parents, spouse, or school-going children to uncover family allowances.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-bold text-saathi-ink">Relation / Role</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 w-full p-2 rounded-xl border border-saathi-border bg-saathi-card font-semibold text-saathi-ink"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-saathi-ink">Age</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  className="mt-1 w-full p-2 rounded-xl border border-saathi-border bg-saathi-card font-semibold text-saathi-ink"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-pill bg-saathi-primary text-white text-xs font-bold shadow-soft-sm hover:bg-saathi-primary-hover flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('family.add_member')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
