import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, Mic, ScanLine, KanbanSquare, Users } from 'lucide-react';

export const MobileTabBar = () => {
  const { t } = useTranslation();

  const tabs = [
    { to: '/', icon: Compass, label: t('nav.explore') },
    { to: '/ask', icon: Mic, label: t('nav.ask'), highlight: true },
    { to: '/scan', icon: ScanLine, label: t('nav.scan') },
    { to: '/tracker', icon: KanbanSquare, label: t('nav.tracker') },
    { to: '/family', icon: Users, label: t('nav.family') },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-saathi-card/95 backdrop-blur-md border-t border-saathi-border px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[56px] min-h-[48px] text-[11px] font-semibold transition-all ${
                tab.highlight && !isActive
                  ? 'text-saathi-primary font-bold'
                  : ''
              } ${
                isActive
                  ? 'text-saathi-primary'
                  : 'text-saathi-muted hover:text-saathi-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-xl transition-all ${
                    tab.highlight
                      ? 'bg-saathi-accent text-white shadow-soft-sm scale-110'
                      : isActive
                      ? 'bg-saathi-primary-light text-saathi-primary'
                      : ''
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                </div>
                <span className="mt-0.5 truncate max-w-[64px]">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
