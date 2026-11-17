import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, SlidersHorizontal, X } from 'lucide-react';

export const SearchPill = ({
  searchQuery,
  setSearchQuery,
  levelFilter,
  setLevelFilter,
  onOpenFilters,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
      {/* Main Pill Search Input */}
      <div className="relative flex-1 w-full flex items-center bg-saathi-card rounded-pill border border-saathi-border shadow-soft-md px-4 py-2 hover:border-saathi-primary/40 focus-within:border-saathi-primary focus-within:ring-2 focus-within:ring-saathi-primary/20 transition-all">
        <Search className="w-5 h-5 text-saathi-muted shrink-0 mr-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full bg-transparent text-sm font-medium text-saathi-ink placeholder:text-saathi-muted focus:outline-none"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-saathi-muted hover:text-saathi-ink mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search Shortcut Button */}
        <button
          onClick={() => navigate('/ask')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-pill bg-saathi-accent text-white text-xs font-bold shadow-soft-sm hover:bg-saathi-accent-hover transition-all shrink-0"
          title="Voice search in English, Kannada, or Hindi"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Voice</span>
        </button>
      </div>

      {/* Level Quick Toggle Buttons (Central / Karnataka / All) */}
      <div className="flex items-center bg-saathi-card rounded-pill border border-saathi-border p-1 shadow-soft-sm shrink-0">
        <button
          onClick={() => setLevelFilter('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-pill transition-all ${
            levelFilter === 'all'
              ? 'bg-saathi-primary text-white shadow-sm'
              : 'text-saathi-muted hover:text-saathi-ink'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setLevelFilter('central')}
          className={`px-3 py-1.5 text-xs font-bold rounded-pill transition-all ${
            levelFilter === 'central'
              ? 'bg-saathi-primary text-white shadow-sm'
              : 'text-saathi-muted hover:text-saathi-ink'
          }`}
        >
          Central
        </button>
        <button
          onClick={() => setLevelFilter('state')}
          className={`px-3 py-1.5 text-xs font-bold rounded-pill transition-all ${
            levelFilter === 'state'
              ? 'bg-saathi-primary text-white shadow-sm'
              : 'text-saathi-muted hover:text-saathi-ink'
          }`}
        >
          Karnataka
        </button>
      </div>
    </div>
  );
};
