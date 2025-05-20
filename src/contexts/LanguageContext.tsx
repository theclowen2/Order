import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'ar';

// Define the context shape
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, Record<string, string>>;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for the entire application
const translations = {
  en: {
    // Login page
    "title": "Sign In",
    "description": "Enter your credentials to access your account",
    "usernameLabel": "Username",
    "usernamePlaceholder": "Enter your username",
    "passwordLabel": "Password",
    "passwordPlaceholder": "Enter your password",
    "rememberMe": "Remember me",
    "signInButton": "Sign In",
    "signingInButton": "Signing In...",
    "forgotPassword": "Forgot Password?",
    "demoCredentials": "Demo Credentials",
    "adminCredentials": "Admin:",
    "operatorCredentials": "Operator:",
    
    // Dashboard
    "dashboard": "Dashboard",
    "overview": "Overview of your order management system",
    "totalOrders": "Total Orders",
    "pendingOrders": "Pending Orders",
    "inProgress": "In Progress",
    "completedOrders": "Completed Orders",
    "recentOrders": "Recent Orders",
    "noOrders": "No orders yet",
    "viewAllOrders": "View All Orders",
    "customers": "Customers",
    "viewAll": "View All",
    "addNewCustomer": "Add New Customer",
    "users": "Users",
    
    // Navigation
    "manufacturingOrders": "Manufacturing Orders",
    "orderManagementSystem": "Order Management System",
    "products": "Products",
    "orders": "Orders",
    "reports": "Reports",
    "logout": "Logout",
    "database": "Database", // Added this translation key
    
    // Products
    "productName": "Product Name",
    "productDescription": "Product Description",
    "productPrice": "Price",
    "productCategory": "Category",
    "addProduct": "Add Product",
    "editProduct": "Edit Product",
    "deleteProduct": "Delete Product",
    "frontPhoto": "Front Photo",
    "backPhoto": "Back Photo",
    "uploadImage": "Upload Image",
    "noProductsFound": "No products found",
    "noProductsMessage": "You haven't added any products yet",
    "addYourFirstProduct": "Add Your First Product",
    "productsList": "Products List",
    "manageProducts": "Manage your product catalog",
    "saveProduct": "Save Product",
    "cancel": "Cancel",
    "productDetails": "Product Details",
    "createNewProduct": "Create New Product",
    
    // Customers
    "customerName": "Customer Name",
    "phone": "Phone",
    "email": "Email",
    "address": "Address",
    "addCustomer": "Add Customer",
    "editCustomer": "Edit Customer",
    "deleteCustomer": "Delete Customer",
    "customersList": "Customers List",
    "manageCustomers": "Manage your customers",
    "saveCustomer": "Save Customer",
    "noCustomersFound": "No customers found",
    "noCustomersMessage": "You haven't added any customers yet",
    "addYourFirstCustomer": "Add Your First Customer",
    "createNewCustomer": "Create New Customer",
    "customerDetails": "Customer Details",
    
    // Orders
    "orderId": "Order ID",
    "dateCreated": "Date Created",
    "status": "Status",
    "customer": "Customer",
    "product": "Product",
    "quantity": "Quantity",
    "addOrder": "Add Order",
    "editOrder": "Edit Order",
    "deleteOrder": "Delete Order",
    "ordersList": "Orders List",
    "manageOrders": "Manage your orders",
    "saveOrder": "Save Order",
    "noOrdersFound": "No orders found",
    "noOrdersMessage": "You haven't added any orders yet",
    "addYourFirstOrder": "Add Your First Order",
    "viewOrder": "View Order",
    "orderDetails": "Order Details",
    "createNewOrder": "Create New Order",
    "updateStatus": "Update Status",
    "notes": "Notes",
    "addNote": "Add Note",
    
    // Reports
    "analyzeOrderData": "Analyze order data and generate reports",
    "orderReport": "Order Report",
    "filterAndGenerate": "Filter and generate order reports",
    "dateFrom": "Date From",
    "dateTo": "Date To",
    "filterByStatus": "Filter by status",
    "allStatus": "All Status",
    "pending": "Pending",
    "inProgressStatus": "In Progress",
    "completed": "Completed",
    "filterByCustomer": "Filter by customer",
    "allCustomers": "All Customers",
    "printReport": "Print Report",
    "exportCSV": "Export CSV",
    "ordersReport": "Orders Report",
    "reportGenerated": "Report generated on",
    "dateRange": "Date Range",
    "completionRate": "Completion Rate",
    "dateCompleted": "Date Completed",
    
    // Generic
    "view": "View",
    "loading": "Loading",
    "noDataMatch": "No data matches the selected filters",
    "actions": "Actions",
  },
  ar: {
    // Login page
    "title": "تسجيل الدخول",
    "description": "أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك",
    "usernameLabel": "اسم المستخدم",
    "usernamePlaceholder": "أدخل اسم المستخدم",
    "passwordLabel": "كلمة المرور",
    "passwordPlaceholder": "أدخل كلمة المرور",
    "rememberMe": "تذكرني",
    "signInButton": "تسجيل الدخول",
    "signingInButton": "جاري تسجيل الدخول...",
    "forgotPassword": "نسيت كلمة المرور؟",
    "demoCredentials": "بيانات اعتماد تجريبية",
    "adminCredentials": "المسؤول:",
    "operatorCredentials": "المشغل:",
    
    // Dashboard
    "dashboard": "لوحة التحكم",
    "overview": "نظرة عامة على نظام إدارة الطلبات",
    "totalOrders": "إجمالي الطلبات",
    "pendingOrders": "الطلبات المعلقة",
    "inProgress": "قيد التنفيذ",
    "completedOrders": "الطلبات المكتملة",
    "recentOrders": "أحدث الطلبات",
    "noOrders": "لا توجد طلبات حتى الآن",
    "viewAllOrders": "عرض جميع الطلبات",
    "customers": "العملاء",
    "viewAll": "عرض الكل",
    "addNewCustomer": "إضافة عميل جديد",
    "users": "المستخدمون",
    
    // Navigation
    "manufacturingOrders": "طلبات التصنيع",
    "orderManagementSystem": "نظام إدارة الطلبات",
    "products": "المنتجات",
    "orders": "الطلبات",
    "reports": "التقارير",
    "logout": "تسجيل الخروج",
    "database": "قاعدة البيانات", // Added this translation key
    
    // Products
    "productName": "اسم المنتج",
    "productDescription": "وصف المنتج",
    "productPrice": "السعر",
    "productCategory": "الفئة",
    "addProduct": "إضافة منتج",
    "editProduct": "تعديل المنتج",
    "deleteProduct": "حذف المنتج",
    "frontPhoto": "الصورة الأمامية",
    "backPhoto": "الصورة الخلفية",
    "uploadImage": "رفع صورة",
    "noProductsFound": "لم يتم العثور على منتجات",
    "noProductsMessage": "لم تقم بإضافة أي منتجات حتى الآن",
    "addYourFirstProduct": "��ضف منتجك الأول",
    "productsList": "قائمة المنتجات",
    "manageProducts": "إدارة قائمة المنتجات",
    "saveProduct": "حفظ المنتج",
    "cancel": "إلغاء",
    "productDetails": "تفاصيل المنتج",
    "createNewProduct": "إنشاء منتج جديد",
    
    // Customers
    "customerName": "اسم العميل",
    "phone": "الهاتف",
    "email": "البريد الإلكتروني",
    "address": "العنوان",
    "addCustomer": "إضافة عميل",
    "editCustomer": "تعديل العميل",
    "deleteCustomer": "حذف العميل",
    "customersList": "قائمة العملاء",
    "manageCustomers": "إدارة العملاء",
    "saveCustomer": "حفظ العميل",
    "noCustomersFound": "لم يتم العثور على عملاء",
    "noCustomersMessage": "لم تقم بإضافة أي عملاء حتى الآن",
    "addYourFirstCustomer": "أضف عميلك الأول",
    "createNewCustomer": "إنشاء عميل جديد",
    "customerDetails": "تفاصيل العميل",
    
    // Orders
    "orderId": "رقم الطلب",
    "dateCreated": "تاريخ الإنشاء",
    "status": "الحالة",
    "customer": "العميل",
    "product": "المنتج",
    "quantity": "الكمية",
    "addOrder": "إضافة طلب",
    "editOrder": "تعديل الطلب",
    "deleteOrder": "حذف الطلب",
    "ordersList": "قائمة الطلبات",
    "manageOrders": "إدارة الطلبات",
    "saveOrder": "حفظ الطلب",
    "noOrdersFound": "لم يتم العثور على طلبات",
    "noOrdersMessage": "لم تقم بإضافة أي طلبات حتى الآن",
    "addYourFirstOrder": "أضف طلبك الأول",
    "viewOrder": "عرض الطلب",
    "orderDetails": "تفاصيل الطلب",
    "createNewOrder": "إنشاء طلب جديد",
    "updateStatus": "تحديث الحالة",
    "notes": "الملاحظات",
    "addNote": "إضافة ملاحظة",
    
    // Reports
    "analyzeOrderData": "تحليل بيانات الطلبات وإنشاء التقارير",
    "orderReport": "تقرير الطلبات",
    "filterAndGenerate": "تصفية وإنشاء تقارير الطلبات",
    "dateFrom": "من تاريخ",
    "dateTo": "إلى تاريخ",
    "filterByStatus": "تصفية حسب الحالة",
    "allStatus": "جميع الحالات",
    "pending": "معلق",
    "inProgressStatus": "قيد التنفيذ",
    "completed": "مكتمل",
    "filterByCustomer": "تصفية حسب العميل",
    "allCustomers": "جميع العملاء",
    "printReport": "طباعة التقرير",
    "exportCSV": "تصدير CSV",
    "ordersReport": "تقرير الطلبات",
    "reportGenerated": "تم إنشاء التقرير في",
    "dateRange": "نطاق التاريخ",
    "completionRate": "معدل الإكمال",
    "dateCompleted": "تاريخ الاكتمال",
    
    // Generic
    "view": "عرض",
    "loading": "جاري التحميل",
    "noDataMatch": "لا توجد بيانات تطابق المعايير المحددة",
    "actions": "الإجراءات",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Set document direction based on language
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Initialize direction on first render
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
