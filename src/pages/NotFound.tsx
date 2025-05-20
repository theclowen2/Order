
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">{language === 'ar' ? 'عفواً! الصفحة غير موجودة' : 'Oops! Page not found'}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {language === 'ar' ? 'العودة إلى الرئيسية' : 'Return to Home'}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
