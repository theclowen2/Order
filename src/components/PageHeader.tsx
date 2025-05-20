
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const rtlClass = isRtl ? 'text-right flex-row-reverse' : '';

  return (
    <div className={`flex items-center justify-between mb-6 ${rtlClass}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
