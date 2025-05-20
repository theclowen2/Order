
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('loading')}...</h1>
      </div>
    </div>
  );
};

export default Index;
