
import React from 'react';
import PageHeader from '@/components/PageHeader';
import SummaryCard from '@/components/SummaryCard';
import StatusBadge from '@/components/StatusBadge';
import { ClipboardList, CheckCircle, Clock, Users } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { orders, customers, getOrdersByStatus } = useOrders();
  const { t, language } = useLanguage();
  
  const pendingOrders = getOrdersByStatus('Pending');
  const inProgressOrders = getOrdersByStatus('In Progress');
  const completedOrders = getOrdersByStatus('Completed');
  
  // Get recent orders (last 5)
  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  ).slice(0, 5);

  // RTL specific classes
  const isRtl = language === 'ar';
  const rtlClass = isRtl ? 'rtl' : '';
  const iconMarginClass = isRtl ? 'ml-3' : 'mr-3';
  const spacingClass = isRtl ? 'space-x-reverse' : 'space-x-2';
  const cardFlexClass = isRtl ? 'flex-row-reverse' : '';
  const alignClass = isRtl ? 'text-right' : 'text-left';
  const marginClass = isRtl ? 'mr-auto' : 'ml-auto';

  return (
    <div className={rtlClass}>
      <PageHeader 
        title={t('dashboard')} 
        subtitle={t('overview')}
      />
      
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title={t('totalOrders')}
          value={orders.length}
          icon={<ClipboardList className="w-5 h-5" />}
          color="bg-manufacturing-100 text-manufacturing-800"
        />
        <SummaryCard 
          title={t('pendingOrders')}
          value={pendingOrders.length}
          icon={<Clock className="w-5 h-5" />}
          color="bg-yellow-100 text-yellow-800"
        />
        <SummaryCard 
          title={t('inProgress')}
          value={inProgressOrders.length}
          icon={<ClipboardList className="w-5 h-5" />}
          color="bg-blue-100 text-blue-800"
        />
        <SummaryCard 
          title={t('completedOrders')}
          value={completedOrders.length}
          icon={<CheckCircle className="w-5 h-5" />}
          color="bg-green-100 text-green-800"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className={alignClass}>
            <CardTitle className="text-lg font-medium">{t('recentOrders')}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className={`text-center py-4 text-gray-500 ${alignClass}`}>{t('noOrders')}</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const customer = customers.find(c => c.id === order.customerId);
                  return (
                    <div key={order.id} className={`flex items-center justify-between p-4 border rounded-lg ${cardFlexClass}`}>
                      <div className={alignClass}>
                        <h3 className="font-medium">{order.productName}</h3>
                        <p className="text-sm text-gray-500">
                          {customer?.name} • {formatDistanceToNow(new Date(order.dateCreated), { addSuffix: true })}
                        </p>
                      </div>
                      <div className={`flex items-center ${spacingClass}`}>
                        <StatusBadge status={order.status} />
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>{t('view')}</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/orders">{t('viewAllOrders')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className={`flex items-center justify-between ${cardFlexClass}`}>
              <CardTitle className="text-lg font-medium">{t('customers')}</CardTitle>
              <Button variant="ghost" size="sm" asChild className={marginClass}>
                <Link to="/customers">{t('viewAll')}</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).map((customer) => (
                <div key={customer.id} className={`flex items-center p-2 ${cardFlexClass}`}>
                  <div className={`flex items-center justify-center w-10 h-10 ${iconMarginClass} rounded-full bg-manufacturing-100 text-manufacturing-800`}>
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={alignClass}>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/customers/new">{t('addNewCustomer')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
