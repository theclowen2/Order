import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Image } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const OrderForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, products, addOrder, updateOrder, getOrderById, getProductById } = useOrders();
  
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    productName: '',
    description: '',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Completed',
    expectedDeliveryDate: '',
    notes: '',
    imagePath: '',
  });
  
  const [errors, setErrors] = useState({
    customerId: '',
    productName: '',
    description: '',
    status: '',
  });
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (isEditing) {
      const order = getOrderById(id);
      if (order) {
        // Format date for input field (YYYY-MM-DD)
        const formatDate = (dateStr?: string) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0];
        };
        
        setFormData({
          customerId: order.customerId,
          productId: order.productId || '',
          productName: order.productName,
          description: order.description,
          status: order.status,
          expectedDeliveryDate: formatDate(order.expectedDeliveryDate),
          notes: order.notes || '',
          imagePath: order.imagePath || '',
        });
        
        // Load product data if productId exists
        if (order.productId) {
          setSelectedProduct(getProductById(order.productId));
        }
      } else {
        // Handle case where order doesn't exist
        navigate('/orders');
      }
    }
  }, [id, getOrderById, isEditing, navigate, getProductById]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If product is selected, update the product name and description
    if (name === 'productId' && value && value !== 'custom-order') {
      const product = getProductById(value);
      if (product) {
        setFormData((prev) => ({
          ...prev,
          productName: product.name,
          description: product.description,
          imagePath: product.frontPhotoUrl || product.imagePath || '',
        }));
        
        setSelectedProduct(product);
        
        // Clear errors
        setErrors((prev) => ({
          ...prev,
          productName: '',
          description: '',
        }));
      }
    } else if (name === 'productId' && value === 'custom-order') {
      // Clear selected product for custom orders
      setSelectedProduct(null);
    }
    
    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {
      customerId: '',
      productName: '',
      description: '',
      status: '',
    };
    let isValid = true;
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
      isValid = false;
    }
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    if (isEditing) {
      updateOrder(id, formData);
    } else {
      addOrder(formData);
    }
    
    navigate('/orders');
  };
  
  // Check if the selected product has both front and back images
  const hasMultipleImages = selectedProduct && selectedProduct.frontPhotoUrl && selectedProduct.backPhotoUrl;
  
  // Check if the product has at least one image
  const hasSingleImage = selectedProduct && (selectedProduct.frontPhotoUrl || selectedProduct.imagePath) && !selectedProduct.backPhotoUrl;
  
  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Order' : 'Create New Order'}
        subtitle={isEditing ? 'Update order details' : 'Add a new manufacturing order'}
        action={
          <Button variant="outline" onClick={() => navigate('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        }
      />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => handleSelectChange('customerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && (
                  <p className="text-sm text-red-500">{errors.customerId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productId">Product Template (Optional)</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => handleSelectChange('productId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="custom-order" value="custom-order">Custom Order (No Template)</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select a product to auto-fill details or leave empty for custom order
                </p>
              </div>
              
              {hasMultipleImages && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Product Images</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-md overflow-hidden">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={selectedProduct.frontPhotoUrl} 
                          alt={`${selectedProduct.name} - Front View`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </AspectRatio>
                      <div className="bg-gray-100 p-2 text-center text-sm font-medium">
                        Front View
                      </div>
                    </div>
                    <div className="border rounded-md overflow-hidden">
                      <AspectRatio ratio={4/3}>
                        <img 
                          src={selectedProduct.backPhotoUrl} 
                          alt={`${selectedProduct.name} - Back View`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </AspectRatio>
                      <div className="bg-gray-100 p-2 text-center text-sm font-medium">
                        Back View
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasSingleImage && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Product Image</Label>
                  <div className="w-full max-w-sm mx-auto border rounded-md overflow-hidden">
                    <AspectRatio ratio={4/3}>
                      <img 
                        src={selectedProduct.frontPhotoUrl || selectedProduct.imagePath} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </AspectRatio>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p className="text-sm text-red-500">{errors.productName}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>
              
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => 
                      handleSelectChange('status', value as 'Pending' | 'In Progress' | 'Completed')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
                <Input
                  id="expectedDeliveryDate"
                  name="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any special instructions or notes"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Order' : 'Create Order'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
