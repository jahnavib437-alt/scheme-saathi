import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, ShieldCheck, Sparkles } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useUIStore();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('scheme_saathi_lang', lang);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-saathi-bg/85 backdrop-blur-md border-b border-saathi-border px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-saathi-primary rounded-xl p-1">
          <div className="w-10 h-10 rounded-2xl bg-saathi-primary flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-saathi-accent-light" />
          </div>
          <div>
            <div className="font-display font-bold text-xl lg:text-2xl tracking-tight text-saathi-ink flex items-center gap-2">
              <span>{t('brand.name')}</span>
              <span className="text-[10px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-saathi-primary-light text-saathi-primary">
                Govt Verified
              </span>
            </div>
            <p className="hidden md:block text-xs text-saathi-muted truncate max-w-sm">
              {t('brand.tagline')}
            </p>
          </div>
        </Link>

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-saathi-card rounded-pill border border-saathi-border p-1 shadow-soft-sm">
            <Globe className="w-4 h-4 ml-2 mr-1 text-saathi-muted" />
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-pill transition-all ${
                i18n.language === 'en'
                  ? 'bg-saathi-primary text-white shadow-sm'
                  : 'text-saathi-muted hover:text-saathi-ink'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('kn')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-pill font-kannada transition-all ${
                i18n.language === 'kn'
                  ? 'bg-saathi-primary text-white shadow-sm'
                  : 'text-saathi-muted hover:text-saathi-ink'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-pill font-hindi transition-all ${
                i18n.language === 'hi'
                  ? 'bg-saathi-primary text-white shadow-sm'
                  : 'text-saathi-muted hover:text-saathi-ink'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-pill bg-saathi-card border border-saathi-border text-saathi-ink hover:bg-saathi-primary-light hover:text-saathi-primary transition-all shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-saathi-primary"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-saathi-accent" /> : <Moon className="w-4 h-4 text-saathi-muted" />}
          </button>
        </div>
      </div>
    </header>
  );
};
