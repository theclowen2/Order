
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Users, ClipboardList, BarChart, Package, Globe, Menu, Database } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import PermissionGuard from '@/components/PermissionGuard';

// Create a separate MenuToggleButton component to use the useSidebar hook properly
const MenuToggleButton = ({ isRtl }: { isRtl: boolean }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      className={`bg-manufacturing-100 text-manufacturing-800 hover:bg-manufacturing-200 ${isRtl ? 'mr-auto float-left' : 'ml-auto float-right'}`}
      onClick={toggleSidebar}
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
};

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isRtl = language === 'ar';
  
  if (!isAuthenticated) {
    return <Outlet />;
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`flex min-h-screen bg-gray-50 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <Sidebar className="border-r z-40" side={isRtl ? 'right' : 'left'}>
          <SidebarHeader className="px-4 py-3 border-b">
            <h1 className="text-xl font-bold text-manufacturing-800">{t('manufacturingOrders')}</h1>
            <p className="text-sm text-gray-500">{t('orderManagementSystem')}</p>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <nav className="space-y-1">
              <NavItem 
                to="/" 
                icon={<Home className="w-5 h-5" />} 
                label={t('dashboard')} 
                isActive={location.pathname === '/'} 
                isRtl={isRtl}
              />
              <PermissionGuard permission="user:read">
                <NavItem 
                  to="/users" 
                  icon={<Users className="w-5 h-5" />} 
                  label={t('users')} 
                  isActive={location.pathname.startsWith('/users')}
                  isRtl={isRtl}
                />
              </PermissionGuard>
              <NavItem 
                to="/customers" 
                icon={<Users className="w-5 h-5" />} 
                label={t('customers')} 
                isActive={location.pathname.startsWith('/customers')}
                isRtl={isRtl}
              />
              <NavItem 
                to="/products" 
                icon={<Package className="w-5 h-5" />} 
                label={t('products')} 
                isActive={location.pathname.startsWith('/products')}
                isRtl={isRtl}
              />
              <NavItem 
                to="/orders" 
                icon={<ClipboardList className="w-5 h-5" />} 
                label={t('orders')} 
                isActive={location.pathname.startsWith('/orders')}
                isRtl={isRtl}
              />
              <NavItem 
                to="/reports" 
                icon={<BarChart className="w-5 h-5" />} 
                label={t('reports')} 
                isActive={location.pathname.startsWith('/reports')}
                isRtl={isRtl}
              />
              <NavItem 
                to="/database" 
                icon={<Database className="w-5 h-5" />} 
                label={t('database')} 
                isActive={location.pathname.startsWith('/database')}
                isRtl={isRtl}
              />
            </nav>
          </SidebarContent>
          <SidebarFooter className="px-3 py-4 border-t">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className={`flex items-center ${isRtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2`}>
                <div className={`inline-flex items-center border rounded-md p-1 bg-white ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <ToggleGroup type="single" value={language} onValueChange={(value) => value && setLanguage(value as Language)}>
                    <ToggleGroupItem value="en" aria-label="Toggle English">
                      EN
                    </ToggleGroupItem>
                    <ToggleGroupItem value="ar" aria-label="Toggle Arabic">
                      العربية
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Globe className={`h-4 w-4 ${isRtl ? 'mr-2' : 'ml-2'} text-gray-500`} />
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className={isRtl ? 'flex-row-reverse' : ''}>
                  <LogOut className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                  {t('logout')}
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className={`flex-1 p-6 overflow-auto ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="mb-4">
            <MenuToggleButton isRtl={isRtl} />
            <div className="hidden">
              <SidebarTrigger />
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isRtl: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, isRtl }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-manufacturing-100 text-manufacturing-800'
          : 'text-gray-600 hover:bg-gray-100'
      } ${isRtl ? 'flex-row-reverse' : ''}`}
    >
      <span className={`${isRtl ? 'ml-3' : 'mr-3'}`}>{icon}</span>
      {label}
    </Link>
  );
};

export default Layout;
