import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Mic,
  ScanLine,
  Users,
  CalendarHeart,
  KanbanSquare,
  Bookmark,
  ShieldAlert,
  BarChart3,
  MapPin,
  HelpCircle,
  LockKeyhole,
  Info
} from 'lucide-react';

export const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', icon: Compass, label: t('nav.explore') },
    { to: '/ask', icon: Mic, label: t('nav.ask') },
    { to: '/scan', icon: ScanLine, label: t('nav.scan') },
    { to: '/family', icon: Users, label: t('nav.family') },
    { to: '/events', icon: CalendarHeart, label: t('nav.events') },
    { to: '/boards', icon: Bookmark, label: t('nav.boards') },
    { to: '/tracker', icon: KanbanSquare, label: t('nav.tracker') },
    { to: '/scam', icon: ShieldAlert, label: t('nav.scam') },
    { to: '/impact', icon: BarChart3, label: t('nav.impact') },
    { to: '/centres', icon: MapPin, label: t('nav.centres') },
    { to: '/about', icon: HelpCircle, label: t('nav.about') },
    { to: '/admin', icon: LockKeyhole, label: t('nav.admin') },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-saathi-border bg-saathi-bg/50 min-h-[calc(100vh-65px)] p-4 sticky top-[65px]">
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-saathi-primary text-white shadow-soft-sm translate-x-1'
                  : 'text-saathi-muted hover:text-saathi-ink hover:bg-saathi-primary-light hover:translate-x-1'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mandatory Civic Disclaimer Card */}
      <div className="mt-6 p-3.5 rounded-2xl bg-saathi-card border border-saathi-border shadow-soft-sm text-xs text-saathi-muted space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-saathi-ink">
          <Info className="w-4 h-4 text-saathi-accent shrink-0" />
          <span>Civic Notice</span>
        </div>
        <p className="leading-relaxed">
          {t('brand.disclaimer')}
        </p>
      </div>
    </aside>
  );
};
