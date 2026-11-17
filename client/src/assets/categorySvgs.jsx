import React from 'react';

// Generates an organic, geometric, stylized procedural SVG cover art for each welfare category
export const CategoryArtwork = ({ category = 'farmers', className = "w-full h-36" }) => {
  const cat = (category || '').toLowerCase();

  switch (cat) {
    case 'farmers':
    case 'agriculture':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#EAF3EC" />
          <path d="M-20 120 C 60 70, 160 150, 260 100 C 310 75, 360 120, 390 110 L 390 170 L -20 170 Z" fill="#D3E5D7" />
          <path d="M20 160 C 100 110, 190 160, 290 120 C 330 105, 370 130, 400 130 L 400 170 L 20 170 Z" fill="#BED9C4" />
          <circle cx="280" cy="50" r="32" fill="#E8590C" fillOpacity="0.2" />
          {/* Stylized Sprouts */}
          <path d="M120 110 C 120 80, 140 70, 150 70 C 150 85, 140 110, 120 110 Z" fill="#346845" opacity="0.8" />
          <path d="M150 110 C 150 85, 165 78, 175 78 C 170 95, 155 110, 150 110 Z" fill="#346845" opacity="0.6" />
          <line x1="135" y1="90" x2="135" y2="130" stroke="#346845" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'women':
    case 'women_child':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#FBEAF0" />
          <circle cx="80" cy="80" r="60" fill="#F4CFDB" />
          <circle cx="280" cy="110" r="70" fill="#EBB9C9" opacity="0.7" />
          <path d="M160 50 C 190 30, 230 40, 240 70 C 250 100, 210 130, 180 130 C 150 130, 130 90, 160 50 Z" fill="#9A3855" opacity="0.25" />
          <circle cx="190" cy="80" r="14" fill="#9A3855" opacity="0.7" />
        </svg>
      );
    case 'students':
    case 'education':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#EAF0FC" />
          <path d="M0 60 L 180 120 L 360 60 L 180 0 Z" fill="#D3E1FA" opacity="0.7" />
          <circle cx="270" cy="90" r="45" fill="#2552B5" opacity="0.15" />
          {/* Stylized Book/Stepping stones */}
          <rect x="130" y="70" width="100" height="40" rx="8" fill="#2552B5" opacity="0.3" />
          <rect x="140" y="55" width="80" height="30" rx="6" fill="#2552B5" opacity="0.5" />
          <line x1="40" y1="130" x2="320" y2="130" stroke="#2552B5" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
        </svg>
      );
    case 'health':
    case 'medical':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#E6F6F5" />
          <circle cx="100" cy="80" r="50" fill="#BFECE9" />
          <path d="M220 30 C 270 30, 310 70, 310 120 C 260 120, 220 80, 220 30 Z" fill="#177672" opacity="0.25" />
          {/* Medical Plus Motif */}
          <rect x="170" y="60" width="20" height="50" rx="6" fill="#177672" opacity="0.7" />
          <rect x="155" y="75" width="50" height="20" rx="6" fill="#177672" opacity="0.7" />
        </svg>
      );
    case 'seniors':
    case 'pension':
    case 'social_welfare':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#FAF1E4" />
          <circle cx="180" cy="140" r="90" fill="#F4DEBC" opacity="0.7" />
          <circle cx="180" cy="50" r="30" fill="#9B5A10" opacity="0.2" />
          <path d="M80 130 C 120 90, 160 110, 200 80 C 240 50, 280 90, 320 80" stroke="#9B5A10" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case 'housing':
    case 'shelter':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#FCECE6" />
          <polygon points="180,30 270,95 90,95" fill="#EAA58C" opacity="0.7" />
          <rect x="110" y="95" width="140" height="50" rx="4" fill="#A04423" opacity="0.3" />
          <rect x="160" y="105" width="40" height="40" rx="4" fill="#FCECE6" />
        </svg>
      );
    case 'skills':
    case 'employment':
    case 'jobs':
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#ECEFF1" />
          <rect x="60" y="40" width="80" height="80" rx="20" fill="#CFD8DC" />
          <circle cx="240" cy="80" r="45" fill="#37474F" opacity="0.25" />
          <path d="M120 130 L 220 40 L 260 70 L 160 160 Z" fill="#37474F" opacity="0.15" />
        </svg>
      );
    case 'disability':
    case 'special_needs':
    default:
      return (
        <svg viewBox="0 0 360 160" className={className} fill="none" preserveAspectRatio="none">
          <rect width="360" height="160" fill="#F2ECF9" />
          <circle cx="120" cy="70" r="45" fill="#DCBEF0" opacity="0.6" />
          <circle cx="240" cy="90" r="55" fill="#66418C" opacity="0.2" />
          <circle cx="180" cy="80" r="25" fill="#66418C" opacity="0.5" />
        </svg>
      );
  }
};
