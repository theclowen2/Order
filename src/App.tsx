
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import PermissionGuard from "./components/PermissionGuard";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import DatabaseStatus from "./pages/DatabaseStatus";

// Customer pages
import Customers from "./pages/customers/Customers";
import CustomerForm from "./pages/customers/CustomerForm";

// Order pages
import Orders from "./pages/orders/Orders";
import OrderForm from "./pages/orders/OrderForm";
import OrderDetails from "./pages/orders/OrderDetails";

// Product pages
import Products from "./pages/products/Products";
import ProductForm from "./pages/products/ProductForm";

// User pages
import Users from "./pages/users/Users";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }>
        <Route index element={<Dashboard />} />
        
        {/* Customer routes */}
        <Route path="customers" element={<Customers />} />
        <Route path="customers/new" element={<CustomerForm />} />
        <Route path="customers/:id/edit" element={<CustomerForm />} />
        
        {/* Order routes */}
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<OrderForm />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="orders/:id/edit" element={<OrderForm />} />
        
        {/* Product routes */}
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        
        {/* User routes */}
        <Route path="users" element={
          <PermissionGuard permission="admin">
            <Users />
          </PermissionGuard>
        } />
        
        {/* Reports route */}
        <Route path="reports" element={<Reports />} />
        
        {/* Database status route */}
        <Route path="database" element={<DatabaseStatus />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
