
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  PlusCircle, 
  Package, 
  Search, 
  Eye, 
  Edit, 
  Check, 
  X,
  Image
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const Products = () => {
  const { products } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage manufacturing products"
        action={
          <Button asChild>
            <Link to="/products/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Product
            </Link>
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product"
          actionLabel="Create Product"
          actionLink="/products/new"
          icon={<Package className="h-10 w-10 text-gray-400" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No products match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.frontPhotoUrl ? (
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                            <img 
                              src={product.frontPhotoUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-md flex items-center justify-center bg-gray-100">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.category ? (
                          <Badge variant="outline">{product.category}</Badge>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.inStock ? (
                          <div className="flex items-center">
                            <Check className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-600">In Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <X className="mr-1 h-4 w-4 text-red-500" />
                            <span className="text-red-600">Out of Stock</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(product.dateCreated), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="mr-1">
                          <Link to={`/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/products/${product.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
