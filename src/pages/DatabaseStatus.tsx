
import React from 'react';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Database, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testConnection } from '@/utils/db';

const DatabaseStatus = () => {
  const { isDbConnected, customers, products, orders } = useOrders();
  const [isTestingConnection, setIsTestingConnection] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{success: boolean, message: string} | null>(null);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testConnection();
      setTestResult({
        success: result,
        message: result ? 'Connection successful!' : 'Connection failed!'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Database Status"
        subtitle="Monitor and manage database connection"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`${isDbConnected ? 'border-green-200' : 'border-red-200'}`}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Connection Status
            </CardTitle>
            <CardDescription>
              Current database connection status and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2">
                  {isDbConnected ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <AlertCircle className="text-red-500 w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {isDbConnected ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isDbConnected 
                      ? 'Database is connected and operational' 
                      : 'Database connection is not established'}
                  </p>
                </div>
              </div>

              <div>
                <Button 
                  onClick={handleTestConnection} 
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
                
                {testResult && (
                  <div className={`mt-2 p-2 rounded text-sm ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {testResult.message}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
            <CardDescription>Overview of data in the database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-sm text-gray-500">Customers</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-gray-500">Orders</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseStatus;
