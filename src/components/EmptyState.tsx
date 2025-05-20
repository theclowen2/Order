
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionLink,
  icon,
}) => {
  const { language } = useLanguage();
  const rtlClass = language === 'ar' ? 'rtl text-right' : '';
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed border-gray-300 bg-gray-50 ${rtlClass}`}>
      {icon && <div className="p-3 mb-4 rounded-full bg-gray-100">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionLabel && actionLink && (
        <div className="mt-6">
          <Button asChild>
            <Link to={actionLink}>{actionLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
