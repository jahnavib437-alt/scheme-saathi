import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Tractor, 
  HeartHandshake, 
  GraduationCap, 
  Activity, 
  Users2, 
  Home, 
  Briefcase, 
  Accessibility,
  LayoutGrid
} from 'lucide-react';

export const CategoryChips = ({ selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation();

  const categories = [
    { id: 'all', label: t('search.all_categories'), icon: LayoutGrid, colorClass: 'border-saathi-primary text-saathi-primary' },
    { id: 'farmers', label: t('categories.farmers'), icon: Tractor, colorClass: 'border-category-farmers text-category-farmers' },
    { id: 'women', label: t('categories.women'), icon: HeartHandshake, colorClass: 'border-category-women text-category-women' },
    { id: 'students', label: t('categories.students'), icon: GraduationCap, colorClass: 'border-category-students text-category-students' },
    { id: 'health', label: t('categories.health'), icon: Activity, colorClass: 'border-category-health text-category-health' },
    { id: 'seniors', label: t('categories.seniors'), icon: Users2, colorClass: 'border-category-seniors text-category-seniors' },
    { id: 'housing', label: t('categories.housing'), icon: Home, colorClass: 'border-category-housing text-category-housing' },
    { id: 'skills', label: t('categories.skills'), icon: Briefcase, colorClass: 'border-category-skills text-category-skills' },
    { id: 'disability', label: t('categories.disability'), icon: Accessibility, colorClass: 'border-category-disability text-category-disability' },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-3 -my-2 flex items-center gap-2.5 px-1">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = cat.icon;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-pill text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
              isSelected
                ? 'bg-saathi-ink text-saathi-bg border-saathi-ink shadow-soft-sm scale-105'
                : 'bg-saathi-card border-saathi-border text-saathi-ink hover:border-saathi-primary/40 hover:bg-saathi-primary-light/50'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
