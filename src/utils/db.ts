// This is a browser-compatible mock of the database functionality
// In a real application, you would make API calls to a backend service

// Define types for the database results
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

// Mock data for development
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    address: '123 Main St, City'
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+0987654321',
    email: 'jane@example.com',
    address: '456 Oak St, Town'
  }
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Custom Cabinet',
    description: 'Oak wood cabinet with glass doors',
    price: 1200,
    inStock: true,
    dateCreated: new Date().toISOString(),
    category: 'Furniture',
    frontPhotoUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    backPhotoUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1'
  },
  {
    id: '2',
    name: 'Metal Brackets',
    description: 'Set of 4 steel brackets for shelving',
    price: 45,
    inStock: true,
    dateCreated: new Date().toISOString(),
    category: 'Hardware',
    frontPhotoUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07'
  },
  {
    id: '3',
    name: 'Walnut Dining Table',
    description: 'Walnut dining table, 6 seats',
    price: 2500,
    inStock: false,
    dateCreated: new Date().toISOString(),
    category: 'Furniture'
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    productName: 'Custom Cabinet',
    description: 'Oak wood cabinet with glass doors',
    status: 'Pending',
    dateCreated: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Customer wants dark stain finish'
  },
  {
    id: '2',
    customerId: '2',
    productName: 'Metal Brackets',
    description: 'Set of 4 steel brackets for shelving',
    status: 'In Progress',
    dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    customerId: '1',
    productName: 'Custom Table',
    description: 'Walnut dining table, 6 seats',
    status: 'Completed',
    dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dateCompleted: new Date().toISOString()
  }
];

// Mock local storage keys
const STORAGE_KEYS = {
  CUSTOMERS: 'manufacturing_app_customers',
  PRODUCTS: 'manufacturing_app_products',
  ORDERS: 'manufacturing_app_orders'
};

// Load data from localStorage or initialize with mock data
const loadData = <T>(key: string, mockData: T[]): T[] => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : mockData;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return mockData;
  }
};

// Save data to localStorage
const saveData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

// Test connection
export const testConnection = async (): Promise<boolean> => {
  try {
    // In browser environment, just check if localStorage is available
    const testKey = 'test_connection';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    console.log('Storage connection successful');
    return true;
  } catch (error) {
    console.error('Storage connection failed:', error);
    return false;
  }
};

// Generic query executor (simulated for browser)
export const executeQuery = async <T>(query: string, params: any[] = []): Promise<T> => {
  console.log('Simulating database query:', query, params);
  
  // Match the query with mock operations
  if (query.toLowerCase().includes('select * from customers')) {
    return loadData(STORAGE_KEYS.CUSTOMERS, mockCustomers) as unknown as T;
  }
  
  if (query.toLowerCase().includes('select * from products')) {
    return loadData(STORAGE_KEYS.PRODUCTS, mockProducts) as unknown as T;
  }
  
  if (query.toLowerCase().includes('select * from orders')) {
    return loadData(STORAGE_KEYS.ORDERS, mockOrders) as unknown as T;
  }
  
  if (query.toLowerCase().includes('insert into customers')) {
    const customers = loadData(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    // Simulate insert
    if (params.length >= 5) {
      const newCustomer = {
        id: params[0],
        name: params[1],
        phone: params[2],
        email: params[3],
        address: params[4]
      };
      customers.push(newCustomer as Customer);
      saveData(STORAGE_KEYS.CUSTOMERS, customers);
    }
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('insert into products')) {
    const products = loadData(STORAGE_KEYS.PRODUCTS, mockProducts);
    // Simulate insert
    if (params.length >= 10) {
      const newProduct = {
        id: params[0],
        name: params[1],
        description: params[2],
        price: params[3],
        inStock: params[4],
        dateCreated: params[5],
        category: params[6],
        imagePath: params[7],
        frontPhotoUrl: params[8],
        backPhotoUrl: params[9]
      };
      products.push(newProduct as Product);
      saveData(STORAGE_KEYS.PRODUCTS, products);
    }
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('insert into orders')) {
    const orders = loadData(STORAGE_KEYS.ORDERS, mockOrders);
    // Simulate insert
    if (params.length >= 9) {
      const newOrder = {
        id: params[0],
        customerId: params[1],
        productId: params[2],
        productName: params[3],
        description: params[4],
        status: params[5],
        dateCreated: params[6],
        imagePath: params[7],
        expectedDeliveryDate: params[8],
        notes: params[9],
        dateCompleted: params[10]
      };
      orders.push(newOrder as Order);
      saveData(STORAGE_KEYS.ORDERS, orders);
    }
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('update customers')) {
    const customers = loadData(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    const id = params[params.length - 1];
    // Simulate update
    const updatedCustomers = customers.map(c => {
      if (c.id === id) {
        // Extract field updates from query and params
        const updates: any = {};
        if (query.includes('name =')) updates.name = params[0];
        if (query.includes('phone =')) updates.phone = params[query.includes('name =') ? 1 : 0];
        if (query.includes('email =')) {
          const index = (query.includes('name =') ? 1 : 0) + (query.includes('phone =') ? 1 : 0);
          updates.email = params[index];
        }
        if (query.includes('address =')) {
          const index = (query.includes('name =') ? 1 : 0) + 
                       (query.includes('phone =') ? 1 : 0) + 
                       (query.includes('email =') ? 1 : 0);
          updates.address = params[index];
        }
        return { ...c, ...updates };
      }
      return c;
    });
    saveData(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('update products')) {
    const products = loadData(STORAGE_KEYS.PRODUCTS, mockProducts);
    const id = params[params.length - 1];
    // Simulate update (simplified)
    const updatedProducts = products.map(p => {
      if (p.id === id) {
        const updates: any = {};
        // Similar logic as above to extract updates from query and params
        // Simplified for brevity
        return { ...p, ...updates };
      }
      return p;
    });
    saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('update orders')) {
    const orders = loadData(STORAGE_KEYS.ORDERS, mockOrders);
    const id = params[params.length - 1];
    // Simulate update (simplified)
    const updatedOrders = orders.map(o => {
      if (o.id === id) {
        const updates: any = {};
        // Similar logic as above to extract updates from query and params
        // Simplified for brevity
        if (query.includes('status =')) updates.status = params[0];
        if (query.includes('dateCompleted =')) updates.dateCompleted = params[query.includes('status =') ? 1 : 0];
        return { ...o, ...updates };
      }
      return o;
    });
    saveData(STORAGE_KEYS.ORDERS, updatedOrders);
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('delete from customers')) {
    const customers = loadData(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    const id = params[0];
    const updatedCustomers = customers.filter(c => c.id !== id);
    saveData(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('delete from products')) {
    const products = loadData(STORAGE_KEYS.PRODUCTS, mockProducts);
    const id = params[0];
    const updatedProducts = products.filter(p => p.id !== id);
    saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
    return [] as unknown as T;
  }
  
  if (query.toLowerCase().includes('delete from orders')) {
    const orders = loadData(STORAGE_KEYS.ORDERS, mockOrders);
    const id = params[0];
    const updatedOrders = orders.filter(o => o.id !== id);
    saveData(STORAGE_KEYS.ORDERS, updatedOrders);
    return [] as unknown as T;
  }

  // If query doesn't match any known patterns, return empty result
  console.warn('Unrecognized query:', query);
  return [] as unknown as T;
};

// Initialize database
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // In browser, just ensure localStorage has initial data
    const customers = loadData(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    const products = loadData(STORAGE_KEYS.PRODUCTS, mockProducts);
    const orders = loadData(STORAGE_KEYS.ORDERS, mockOrders);
    
    saveData(STORAGE_KEYS.CUSTOMERS, customers);
    saveData(STORAGE_KEYS.PRODUCTS, products);
    saveData(STORAGE_KEYS.ORDERS, orders);
    
    console.log('Browser storage initialized');
    return true;
  } catch (error) {
    console.error('Error initializing browser storage:', error);
    return false;
  }
};

// Seed database (no-op in browser since we initialize with mock data)
export const seedDatabaseIfEmpty = async (): Promise<boolean> => {
  // Already handled by initializeDatabase in browser environment
  return true;
};
