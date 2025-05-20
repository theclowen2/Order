
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  ClipboardEdit, 
  Clock, 
  Trash, 
  User, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from "sonner";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, getCustomerById, completeOrder, deleteOrder } = useOrders();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!id) {
    navigate('/orders');
    return null;
  }
  
  const order = getOrderById(id);
  if (!order) {
    navigate('/orders');
    return null;
  }
  
  const customer = getCustomerById(order.customerId);
  if (!customer) {
    navigate('/orders');
    return null;
  }
  
  const handleCompleteOrder = () => {
    completeOrder(id);
    toast.success(`SMS notification sent to ${customer.name}`);
  };
  
  const handleDeleteOrder = () => {
    deleteOrder(id);
    navigate('/orders');
  };
  
  return (
    <div>
      <PageHeader
        title="Order Details"
        subtitle={`Order #${id}`}
        action={
          <Button variant="outline" asChild>
            <Link to="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{order.productName}</CardTitle>
                  <CardDescription className="mt-1">
                    Created on {new Date(order.dateCreated).toLocaleDateString()}
                  </CardDescription>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{order.description}</p>
                </div>
                
                {order.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <MessageSquare className="mr-1 h-4 w-4" /> 
                      Notes
                    </h3>
                    <p className="mt-1 text-gray-700">{order.notes}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" /> 
                    Timeline
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <Clock className="h-3 w-3 text-blue-700" />
                      </div>
                      <span>Created on {new Date(order.dateCreated).toLocaleDateString()}</span>
                    </div>
                    
                    {order.expectedDeliveryDate && (
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                          <Calendar className="h-3 w-3 text-yellow-700" />
                        </div>
                        <span>Expected delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {order.dateCompleted && (
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <CheckCircle className="h-3 w-3 text-green-700" />
                        </div>
                        <span>Completed on {new Date(order.dateCompleted).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-6">
              <Button variant="outline" asChild>
                <Link to={`/orders/${id}/edit`}>
                  <ClipboardEdit className="mr-2 h-4 w-4" />
                  Edit Order
                </Link>
              </Button>
              <div className="space-x-2">
                {order.status !== 'Completed' && (
                  <Button onClick={handleCompleteOrder}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Future Image Gallery (for design references) */}
          {/* 
          <Card>
            <CardHeader>
              <CardTitle>Design References</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 text-gray-500">
                <p>No design images uploaded</p>
              </div>
            </CardContent>
          </Card>
          */}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-manufacturing-100 text-manufacturing-800 flex items-center justify-center mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <PhoneCall className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <span>{customer.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline" asChild className="w-full">
                <Link to={`/customers/${customer.id}`}>
                  View Customer Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderDetails;
