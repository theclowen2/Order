
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Globe, LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = await login(username, password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-end mb-2">
          <div className="inline-flex items-center border rounded-md p-1 bg-white shadow-sm">
            <ToggleGroup type="single" value={language} onValueChange={(value) => value && setLanguage(value as Language)}>
              <ToggleGroupItem value="en" aria-label="Toggle English" className="text-sm font-medium">
                EN
              </ToggleGroupItem>
              <ToggleGroupItem value="ar" aria-label="Toggle Arabic" className="text-sm font-medium">
                العربية
              </ToggleGroupItem>
            </ToggleGroup>
            <Globe className="h-4 w-4 ml-2 text-gray-500" />
          </div>
        </div>
        
        <Card className={`shadow-md ${isRtl ? 'rtl text-right' : ''}`}>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-manufacturing-100">
                <LogIn className="h-6 w-6 text-manufacturing-800" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
            <CardDescription className="text-center">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('usernameLabel')}
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder={t('usernamePlaceholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-3"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t('passwordLabel')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('rememberMe')}
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
                <LogIn className="h-4 w-4" />
                {isLoading ? t('signingInButton') : t('signInButton')}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className={`mt-6 p-4 bg-white shadow-sm rounded-lg border ${isRtl ? 'rtl' : ''}`}>
          <h3 className="font-medium text-sm text-manufacturing-800 mb-2">{t('demoCredentials')}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span className="font-medium">{t('adminCredentials')}</span> 
              <code className="bg-gray-100 px-2 py-1 rounded">admin / admin123</code>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">{t('operatorCredentials')}</span>
              <code className="bg-gray-100 px-2 py-1 rounded">operator / operator123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
