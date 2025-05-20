
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { smsService } from '@/services/smsService';
import { executeQuery } from '@/utils/db';
import { initializeDatabase, seedDatabaseIfEmpty, testConnection } from '@/utils/db';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  dateCreated: string;
  category?: string;
  imagePath?: string;
  frontPhotoUrl?: string;
  backPhotoUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  productId?: string;
  productName: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dateCreated: string;
  dateCompleted?: string;
  imagePath?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

interface OrderContextType {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  addProduct: (product: Omit<Product, 'id' | 'dateCreated'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  addOrder: (order: Omit<Order, 'id' | 'dateCreated'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  completeOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getCustomerOrders: (customerId: string) => Order[];
  getOrdersByStatus: (status: Order['status']) => Order[];
  isDbConnected: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDbConnected, setIsDbConnected] = useState(false);

  const initializeApp = async () => {
    try {
      // Test database connection
      const connected = await testConnection();
      setIsDbConnected(connected);

      if (connected) {
        // Initialize database tables if they don't exist
        await initializeDatabase();
        
        // Seed database with sample data if tables are empty
        await seedDatabaseIfEmpty();
        
        // Load data from database
        await loadAllData();
      } else {
        toast.error("Database connection failed. Using fallback data.");
        setCustomers([]);
        setProducts([]);
        setOrders([]);
      }
    } catch (error) {
      console.error("Database initialization error:", error);
      toast.error("Failed to initialize database. Using fallback data.");
      setCustomers([]);
      setProducts([]);
      setOrders([]);
    }
  };

  const loadAllData = async () => {
    try {
      // Load customers from database
      const customersData = await executeQuery<Customer[]>('SELECT * FROM customers');
      setCustomers(customersData);
      
      // Load products from database
      const productsData = await executeQuery<Product[]>('SELECT * FROM products');
      setProducts(productsData);
      
      // Load orders from database
      const ordersData = await executeQuery<Order[]>('SELECT * FROM orders');
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data from database");
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      const newCustomer = {
        ...customer,
        id
      };
      
      await executeQuery(
        'INSERT INTO customers (id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
        [id, customer.name, customer.phone, customer.email, customer.address]
      );
      
      setCustomers(prev => [...prev, newCustomer]);
      toast.success(`Customer ${customer.name} added successfully`);
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Failed to add customer");
    }
  };

  const updateCustomer = async (id: string, customer: Partial<Customer>) => {
    try {
      const currentCustomer = customers.find(c => c.id === id);
      if (!currentCustomer) {
        toast.error("Customer not found");
        return;
      }
      
      // Build query dynamically based on fields to update
      const updateFields = [];
      const params = [];
      
      if (customer.name !== undefined) {
        updateFields.push('name = ?');
        params.push(customer.name);
      }
      
      if (customer.phone !== undefined) {
        updateFields.push('phone = ?');
        params.push(customer.phone);
      }
      
      if (customer.email !== undefined) {
        updateFields.push('email = ?');
        params.push(customer.email);
      }
      
      if (customer.address !== undefined) {
        updateFields.push('address = ?');
        params.push(customer.address);
      }
      
      // Add id to params
      params.push(id);
      
      await executeQuery(
        `UPDATE customers SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );
      
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const customerOrders = orders.filter(order => order.customerId === id);
      if (customerOrders.length > 0) {
        toast.error("Cannot delete customer with existing orders");
        return;
      }
      
      await executeQuery('DELETE FROM customers WHERE id = ?', [id]);
      
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const addProduct = async (product: Omit<Product, 'id' | 'dateCreated'>) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      const dateCreated = new Date().toISOString();
      const newProduct = {
        ...product,
        id,
        dateCreated
      };
      
      await executeQuery(
        'INSERT INTO products (id, name, description, price, inStock, dateCreated, category, imagePath, frontPhotoUrl, backPhotoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          product.name, 
          product.description, 
          product.price,
          product.inStock,
          dateCreated,
          product.category || null,
          product.imagePath || null,
          product.frontPhotoUrl || null,
          product.backPhotoUrl || null
        ]
      );
      
      setProducts(prev => [...prev, newProduct]);
      toast.success(`Product ${product.name} added successfully`);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const currentProduct = products.find(p => p.id === id);
      if (!currentProduct) {
        toast.error("Product not found");
        return;
      }
      
      // Build query dynamically based on fields to update
      const updateFields = [];
      const params = [];
      
      if (product.name !== undefined) {
        updateFields.push('name = ?');
        params.push(product.name);
      }
      
      if (product.description !== undefined) {
        updateFields.push('description = ?');
        params.push(product.description);
      }
      
      if (product.price !== undefined) {
        updateFields.push('price = ?');
        params.push(product.price);
      }
      
      if (product.inStock !== undefined) {
        updateFields.push('inStock = ?');
        params.push(product.inStock);
      }
      
      if (product.category !== undefined) {
        updateFields.push('category = ?');
        params.push(product.category);
      }
      
      if (product.imagePath !== undefined) {
        updateFields.push('imagePath = ?');
        params.push(product.imagePath);
      }
      
      if (product.frontPhotoUrl !== undefined) {
        updateFields.push('frontPhotoUrl = ?');
        params.push(product.frontPhotoUrl);
      }
      
      if (product.backPhotoUrl !== undefined) {
        updateFields.push('backPhotoUrl = ?');
        params.push(product.backPhotoUrl);
      }
      
      // Add id to params
      params.push(id);
      
      await executeQuery(
        `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );
      
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productOrders = orders.filter(order => order.productId === id);
      if (productOrders.length > 0) {
        toast.error("Cannot delete product that is used in existing orders");
        return;
      }
      
      await executeQuery('DELETE FROM products WHERE id = ?', [id]);
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const addOrder = async (order: Omit<Order, 'id' | 'dateCreated'>) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      const dateCreated = new Date().toISOString();
      const newOrder = {
        ...order,
        id,
        dateCreated
      };
      
      await executeQuery(
        'INSERT INTO orders (id, customerId, productId, productName, description, status, dateCreated, imagePath, expectedDeliveryDate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          order.customerId,
          order.productId || null,
          order.productName,
          order.description,
          order.status,
          dateCreated,
          order.imagePath || null,
          order.expectedDeliveryDate || null,
          order.notes || null
        ]
      );
      
      setOrders(prev => [...prev, newOrder]);
      toast.success("New order created successfully");
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Failed to add order");
    }
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    try {
      const currentOrder = orders.find(o => o.id === id);
      if (!currentOrder) {
        toast.error("Order not found");
        return;
      }
      
      // Build query dynamically based on fields to update
      const updateFields = [];
      const params = [];
      
      if (order.customerId !== undefined) {
        updateFields.push('customerId = ?');
        params.push(order.customerId);
      }
      
      if (order.productId !== undefined) {
        updateFields.push('productId = ?');
        params.push(order.productId);
      }
      
      if (order.productName !== undefined) {
        updateFields.push('productName = ?');
        params.push(order.productName);
      }
      
      if (order.description !== undefined) {
        updateFields.push('description = ?');
        params.push(order.description);
      }
      
      if (order.status !== undefined) {
        updateFields.push('status = ?');
        params.push(order.status);
      }
      
      if (order.imagePath !== undefined) {
        updateFields.push('imagePath = ?');
        params.push(order.imagePath);
      }
      
      if (order.expectedDeliveryDate !== undefined) {
        updateFields.push('expectedDeliveryDate = ?');
        params.push(order.expectedDeliveryDate);
      }
      
      if (order.notes !== undefined) {
        updateFields.push('notes = ?');
        params.push(order.notes);
      }
      
      if (order.dateCompleted !== undefined) {
        updateFields.push('dateCompleted = ?');
        params.push(order.dateCompleted);
      }
      
      // Add id to params
      params.push(id);
      
      await executeQuery(
        `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );
      
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o));
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await executeQuery('DELETE FROM orders WHERE id = ?', [id]);
      
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const completeOrder = async (id: string) => {
    try {
      const dateCompleted = new Date().toISOString();
      
      await executeQuery(
        'UPDATE orders SET status = ?, dateCompleted = ? WHERE id = ?',
        ['Completed', dateCompleted, id]
      );
      
      setOrders(prev => prev.map(o => 
        o.id === id 
          ? { 
              ...o, 
              status: 'Completed', 
              dateCompleted 
            } 
          : o
      ));
      
      const order = orders.find(o => o.id === id);
      if (order) {
        const customer = customers.find(c => c.id === order.customerId);
        if (customer) {
          const smsBody = `Your order ${order.productName} (ID: ${order.id}) is now complete and ready for pickup.`;
          
          smsService.sendSms(customer.phone, smsBody)
            .then(result => {
              if (result.success) {
                toast.success(`SMS notification sent to ${customer.name}`);
              } else {
                console.error(`Failed to send SMS: ${result.error}`);
                toast.error(`Failed to send SMS notification: ${result.error}`);
              }
            })
            .catch(error => {
              console.error('SMS Service error:', error);
              toast.error('Failed to send SMS notification');
            });
        }
      }
      
      toast.success("Order marked as completed");
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Failed to complete order");
    }
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(o => o.status === status);
  };

  return (
    <OrderContext.Provider 
      value={{ 
        customers, 
        products,
        orders,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        addOrder,
        updateOrder,
        deleteOrder,
        completeOrder,
        getOrderById,
        getCustomerOrders,
        getOrdersByStatus,
        isDbConnected
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
