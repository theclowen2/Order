
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, Image, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById } = useOrders();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    inStock: true,
    category: '',
    imagePath: '',
    frontPhotoUrl: '',
    backPhotoUrl: '',
  });

  const [frontPhotoFile, setFrontPhotoFile] = useState<File | null>(null);
  const [backPhotoFile, setBackPhotoFile] = useState<File | null>(null);
  const [frontPhotoPreview, setFrontPhotoPreview] = useState<string>('');
  const [backPhotoPreview, setBackPhotoPreview] = useState<string>('');
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
  });
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (isEditing) {
      const product = getProductById(id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          inStock: product.inStock,
          category: product.category || '',
          imagePath: product.imagePath || '',
          frontPhotoUrl: product.frontPhotoUrl || '',
          backPhotoUrl: product.backPhotoUrl || '',
        });

        // Set preview images from URLs if available
        if (product.frontPhotoUrl) {
          setFrontPhotoPreview(product.frontPhotoUrl);
        }
        if (product.backPhotoUrl) {
          setBackPhotoPreview(product.backPhotoUrl);
        }
      } else {
        // Handle case where product doesn't exist
        navigate('/products');
      }
    }
  }, [id, getProductById, isEditing, navigate]);
  
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
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, inStock: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, photoType: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    if (photoType === 'front') {
      setFrontPhotoFile(file);
      setFrontPhotoPreview(previewUrl);
      setFormData(prev => ({ ...prev, frontPhotoUrl: previewUrl }));
    } else {
      setBackPhotoFile(file);
      setBackPhotoPreview(previewUrl);
      setFormData(prev => ({ ...prev, backPhotoUrl: previewUrl }));
    }
  };

  const handleRemovePhoto = (photoType: 'front' | 'back') => {
    if (photoType === 'front') {
      setFrontPhotoFile(null);
      setFrontPhotoPreview('');
      setFormData(prev => ({ ...prev, frontPhotoUrl: '' }));
    } else {
      setBackPhotoFile(null);
      setBackPhotoPreview('');
      setFormData(prev => ({ ...prev, backPhotoUrl: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {
      name: '',
      description: '',
      price: '',
    };
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Function to convert uploaded file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Process front photo if exists
    if (frontPhotoFile) {
      try {
        const base64String = await fileToBase64(frontPhotoFile);
        setFormData(prev => ({ ...prev, frontPhotoUrl: base64String }));
      } catch (error) {
        toast.error('Error processing front photo');
        console.error(error);
        return;
      }
    }

    // Process back photo if exists
    if (backPhotoFile) {
      try {
        const base64String = await fileToBase64(backPhotoFile);
        setFormData(prev => ({ ...prev, backPhotoUrl: base64String }));
      } catch (error) {
        toast.error('Error processing back photo');
        console.error(error);
        return;
      }
    }
    
    // Update or create the product with the final form data
    if (isEditing) {
      updateProduct(id, {
        ...formData,
        frontPhotoUrl: frontPhotoFile ? await fileToBase64(frontPhotoFile) : formData.frontPhotoUrl,
        backPhotoUrl: backPhotoFile ? await fileToBase64(backPhotoFile) : formData.backPhotoUrl,
      });
    } else {
      addProduct({
        ...formData,
        frontPhotoUrl: frontPhotoFile ? await fileToBase64(frontPhotoFile) : formData.frontPhotoUrl,
        backPhotoUrl: backPhotoFile ? await fileToBase64(backPhotoFile) : formData.backPhotoUrl,
      });
    }
    
    navigate('/products');
  };
  
  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Product' : 'Create New Product'}
        subtitle={isEditing ? 'Update product details' : 'Add a new manufacturing product'}
        action={
          <Button variant="outline" onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        }
      />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleNumberChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
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
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Furniture, Hardware, etc."
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inStock">In Stock</Label>
                  <Switch 
                    id="inStock" 
                    checked={formData.inStock} 
                    onCheckedChange={handleSwitchChange} 
                  />
                </div>
              </div>
              
              {/* Front photo upload */}
              <div className="space-y-2">
                <Label htmlFor="frontPhoto">Front Photo</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label htmlFor="frontPhoto" className="cursor-pointer">
                      <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        <span>Upload front photo</span>
                      </div>
                      <input
                        id="frontPhoto"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'front')}
                      />
                    </label>
                  </div>
                  
                  {frontPhotoPreview && (
                    <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md bg-gray-100">
                      <img 
                        src={frontPhotoPreview} 
                        alt="Front view preview" 
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto('front')}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Back photo upload */}
              <div className="space-y-2">
                <Label htmlFor="backPhoto">Back Photo</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label htmlFor="backPhoto" className="cursor-pointer">
                      <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        <span>Upload back photo</span>
                      </div>
                      <input
                        id="backPhoto"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'back')}
                      />
                    </label>
                  </div>
                  
                  {backPhotoPreview && (
                    <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md bg-gray-100">
                      <img 
                        src={backPhotoPreview} 
                        alt="Back view preview" 
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto('back')}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
