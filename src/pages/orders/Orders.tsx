import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
import { PlusCircle, ClipboardList, Eye, Search, Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';

const Orders = () => {
  const { orders, customers } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    const customer = customers.find((c) => c.id === order.customerId);
    return (
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Manage manufacturing orders"
        action={
          <Button asChild>
            <Link to="/orders/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Link>
          </Button>
        }
      />

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Create your first manufacturing order"
          actionLabel="Create Order"
          actionLink="/orders/new"
          icon={<ClipboardList className="h-10 w-10 text-gray-400" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No orders match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const customer = customers.find((c) => c.id === order.customerId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="w-20">
                          {order.imagePath ? (
                            <div className="w-16 h-16 rounded-md border overflow-hidden">
                              <AspectRatio ratio={1/1}>
                                <img 
                                  src={order.imagePath} 
                                  alt={order.productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg';
                                  }}
                                />
                              </AspectRatio>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-md border flex items-center justify-center">
                              <ClipboardList className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{order.productName}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {order.description}
                          </div>
                        </TableCell>
                        <TableCell>{customer?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDistance(new Date(order.dateCreated), new Date(), {
                              addSuffix: true,
                            })}
                          </div>
                          {order.expectedDeliveryDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Due: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
