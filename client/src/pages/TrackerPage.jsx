import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KanbanSquare,
  Send,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MoveRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useTrackerStore } from '../store/trackerStore';
import { useUIStore } from '../store/uiStore';

export const TrackerPage = () => {
  const { t } = useTranslation();
  const { sessionId, applications, updateApplicationStatus, telegramChatId, setTelegramChatId } = useTrackerStore();
  const { addToast } = useUIStore();

  const [telegramModal, setTelegramModal] = useState(false);

  // Kanban Columns
  const columns = [
    { id: 'not_started', label: t('tracker.not_started'), color: 'border-saathi-muted text-saathi-muted' },
    { id: 'documents_ready', label: t('tracker.documents_ready'), color: 'border-saathi-accent text-saathi-accent' },
    { id: 'applied', label: t('tracker.applied'), color: 'border-saathi-primary text-saathi-primary' },
    { id: 'approved', label: t('tracker.approved'), color: 'border-saathi-success text-saathi-success' },
  ];

  // Default seeded sample cards for demo if empty
  const activeApplications = applications.length > 0 ? applications : [
    {
      schemeId: 'pm-kisan-1',
      title: 'PM-KISAN Samman Nidhi',
      category: 'farmers',
      status: 'documents_ready',
      benefit: '₹6,000 / year',
      updatedAt: new Date().toISOString(),
      notes: 'Pahani & Aadhaar submitted at Grama One',
    },
    {
      schemeId: 'gruha-lakshmi-1',
      title: 'Karnataka Gruha Lakshmi',
      category: 'women',
      status: 'applied',
      benefit: '₹2,000 / month',
      updatedAt: new Date().toISOString(),
      notes: 'Application ID: GLK-2026-98124',
    },
    {
      schemeId: 'sandhya-suraksha-1',
      title: 'Sandhya Suraksha Pension',
      category: 'seniors',
      status: 'approved',
      benefit: '₹1,200 / month',
      updatedAt: new Date().toISOString(),
      notes: 'Sanction letter received from Tahsildar office',
    },
  ];

  const handleMove = (schemeId, nextStatus) => {
    updateApplicationStatus(schemeId, nextStatus);
    addToast({ title: `Moved to ${nextStatus.replace('_', ' ')}`, type: 'info' });
  };

  const telegramBotUsername = 'SchemeSaathiBot';
  const telegramDeepLink = `https://t.me/${telegramBotUsername}?start=${sessionId}`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-primary-light text-saathi-primary text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('tracker.live_sync')}</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-saathi-ink tracking-tight">
            {t('tracker.title')}
          </h1>
          <p className="text-xs text-saathi-muted mt-1">
            Session ID: <span className="font-mono">{sessionId.substring(0, 16)}...</span> (Saved automatically in your browser)
          </p>
        </div>

        {/* Telegram Reminders Setup Button */}
        <button
          onClick={() => setTelegramModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-[#229ED9] text-white text-xs font-bold shadow-soft-sm hover:opacity-90 transition-all self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>{t('tracker.remind_telegram')}</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colItems = activeApplications.filter((app) => app.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-saathi-card rounded-3xl border border-saathi-border p-4 shadow-soft-sm flex flex-col min-h-[420px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-saathi-border/60 mb-3">
                <span className="font-display font-bold text-sm text-saathi-ink">
                  {col.label}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-saathi-bg text-saathi-muted">
                  {colItems.length}
                </span>
              </div>

              {/* Application Cards */}
              <div className="space-y-3 flex-1">
                {colItems.map((item) => (
                  <div
                    key={item.schemeId}
                    className="p-4 rounded-2xl bg-saathi-bg border border-saathi-border shadow-soft-sm space-y-3 hover:border-saathi-primary/40 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-saathi-primary-light text-saathi-primary uppercase">
                        {item.benefit}
                      </span>
                      <h4 className="font-display font-bold text-sm text-saathi-ink mt-1.5">
                        {item.title}
                      </h4>
                      {item.notes && (
                        <p className="text-xs text-saathi-muted mt-1 leading-relaxed">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Move Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-saathi-border/60 text-xs font-semibold">
                      <span className="text-[10px] text-saathi-muted">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1">
                        {col.id === 'not_started' && (
                          <button
                            onClick={() => handleMove(item.schemeId, 'documents_ready')}
                            className="text-saathi-primary hover:underline flex items-center gap-0.5"
                          >
                            <span>Ready</span> &rarr;
                          </button>
                        )}
                        {col.id === 'documents_ready' && (
                          <button
                            onClick={() => handleMove(item.schemeId, 'applied')}
                            className="text-saathi-primary hover:underline flex items-center gap-0.5"
                          >
                            <span>Applied</span> &rarr;
                          </button>
                        )}
                        {col.id === 'applied' && (
                          <button
                            onClick={() => handleMove(item.schemeId, 'approved')}
                            className="text-saathi-success hover:underline flex items-center gap-0.5"
                          >
                            <span>Sanctioned</span> &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-saathi-border/60 rounded-2xl flex items-center justify-center text-xs text-saathi-muted text-center p-3">
                    Drag or move schemes here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Telegram Binding Modal */}
      {telegramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-saathi-ink/70 backdrop-blur-sm">
          <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 sm:p-8 max-w-md w-full shadow-soft-lg space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#229ED9]/15 text-[#229ED9] flex items-center justify-center mx-auto">
              <Send className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-saathi-ink">
                Connect Telegram Reminders
              </h3>
              <p className="text-xs text-saathi-muted">
                Receive deadline alerts, renewal notifications, and DBT installment messages directly on your phone.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-saathi-bg border border-saathi-border space-y-3">
              <p className="text-xs font-semibold text-saathi-ink">
                1. Click the button below to open Telegram.<br />
                2. Tap <strong>Start</strong> in the bot chat.
              </p>
              <a
                href={telegramDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTelegramChatId('connected_demo_chat');
                  addToast({ title: 'Telegram reminder hook registered!', type: 'success' });
                  setTelegramModal(false);
                }}
                className="w-full py-3 rounded-pill bg-[#229ED9] text-white font-bold text-xs shadow-soft-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>Open @{telegramBotUsername} in Telegram</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={() => setTelegramModal(false)}
              className="text-xs font-bold text-saathi-muted hover:text-saathi-ink"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
