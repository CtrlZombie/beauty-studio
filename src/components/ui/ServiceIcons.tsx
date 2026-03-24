import React from 'react';

interface ServiceIconProps {
  category: string;
  className?: string;
}

export const ServiceIcon = ({ category, className = "w-8 h-8" }: ServiceIconProps) => {
  const icons: Record<string, React.ReactElement> = {
    ears: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9v2c0 3.87 3.13 7 7 7s7-3.13 7-7V9c0-3.87-3.13-7-7-7z" />
        <path d="M12 18v4" />
        <path d="M9 22h6" />
        <path d="M12 9a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    eyebrows: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 8c0-2 1-4 4-4s4 2 4 4" />
        <path d="M16 8c0-2 1-4 4-4s4 2 4 4" />
        <path d="M8 16c0 2 2 4 4 4s4-2 4-4" />
        <path d="M12 12v4" />
      </svg>
    ),
    lashes: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4v2" />
        <path d="M8 6l2 2" />
        <path d="M16 6l-2 2" />
        <path d="M6 12h2" />
        <path d="M18 12h-2" />
        <path d="M12 16v2" />
        <path d="M10 18l2-2 2 2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    sugaring: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4 12H2" />
        <path d="M22 12h-2" />
        <path d="M6.5 6.5L5 5" />
        <path d="M19 19l-1.5-1.5" />
        <path d="M19 5l-1.5 1.5" />
        <path d="M6.5 17.5L5 19" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 8v4l2 2" />
      </svg>
    ),
  };

  return icons[category] || (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l3 3" />
    </svg>
  );
};