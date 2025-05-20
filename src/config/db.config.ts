
// Browser-compatible configuration
export const dbConfig = {
  // These are placeholder values and don't affect the browser implementation
  // but are kept for consistency with the server implementation
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'manufacturing_app',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Storage keys for the browser implementation
export const storageConfig = {
  customers: 'manufacturing_app_customers',
  products: 'manufacturing_app_products',
  orders: 'manufacturing_app_orders'
};
