
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { BarChart3, Download, Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Reports = () => {
  const { orders, customers } = useOrders();
  const { t, language } = useLanguage();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.dateCreated);
    
    // Apply date range filter if set
    if (dateFrom && new Date(dateFrom) > orderDate) {
      return false;
    }
    if (dateTo && new Date(dateTo) < orderDate) {
      return false;
    }
    
    // Apply status filter if not 'all'
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply customer filter if not 'all'
    if (customerFilter !== 'all' && order.customerId !== customerFilter) {
      return false;
    }
    
    return true;
  });

  // Sort by date (newest first by default)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );

  // Calculate summary stats
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(o => o.status === 'Completed').length;
  const pendingOrders = filteredOrders.filter(o => o.status === 'Pending').length;
  const inProgressOrders = filteredOrders.filter(o => o.status === 'In Progress').length;
  const completionRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const rtlClass = language === 'ar' ? 'rtl text-right' : '';

  return (
    <div className={rtlClass}>
      <PageHeader
        title={t('reports')}
        subtitle={t('analyzeOrderData')}
      />
      
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('totalOrders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('pending')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('completionRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('orderReport')}</CardTitle>
          <CardDescription>{t('filterAndGenerate')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('dateFrom')}</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('dateTo')}</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('status')}</label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allStatus')}</SelectItem>
                    <SelectItem value="Pending">{t('pending')}</SelectItem>
                    <SelectItem value="In Progress">{t('inProgressStatus')}</SelectItem>
                    <SelectItem value="Completed">{t('completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('customer')}</label>
                <Select
                  value={customerFilter}
                  onValueChange={setCustomerFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('filterByCustomer')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allCustomers')}</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="print:hidden flex justify-end space-x-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                {t('printReport')}
              </Button>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
                {t('exportCSV')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>{t('ordersReport')}</CardTitle>
            <div className="print:hidden">
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="print:block hidden text-sm text-gray-500 mt-2">
            <p>
              {t('reportGenerated')} {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </p>
            {dateFrom && dateTo && (
              <p>
                {t('dateRange')}: {new Date(dateFrom).toLocaleDateString()} - {new Date(dateTo).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('orderId')}</TableHead>
                <TableHead>{t('product')}</TableHead>
                <TableHead>{t('customer')}</TableHead>
                <TableHead>{t('dateCreated')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                {statusFilter === "Completed" && <TableHead>{t('dateCompleted')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={statusFilter === "Completed" ? 6 : 5}
                    className="text-center text-gray-500 py-6"
                  >
                    {t('noDataMatch')}
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrders.map((order) => {
                  const customer = customers.find(c => c.id === order.customerId);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{customer?.name || 'Unknown'}</TableCell>
                      <TableCell>{new Date(order.dateCreated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      {statusFilter === "Completed" && (
                        <TableCell>
                          {order.dateCompleted
                            ? new Date(order.dateCompleted).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
