
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
  createUser: (username: string, role: 'admin' | 'operator', permissions: string[], password: string) => boolean;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock users
const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    permissions: ['user:create', 'user:read', 'user:update', 'user:delete', 'order:create', 'order:read', 'order:update', 'order:delete', 'product:create', 'product:read', 'product:update', 'product:delete', 'customer:create', 'customer:read', 'customer:update', 'customer:delete', 'report:read']
  },
  {
    id: '2',
    username: 'operator',
    role: 'operator',
    permissions: ['order:read', 'order:update', 'product:read', 'customer:read']
  }
];

// Store passwords separately for security (in a real app, these would be hashed)
const userPasswords: Record<string, string> = {
  'admin': 'admin123',
  'operator': 'operator123'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Load users from localStorage or use initial mock users
    const loadUsers = () => {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch (error) {
          console.error('Failed to parse stored users:', error);
          setUsers(initialUsers);
          localStorage.setItem('users', JSON.stringify(initialUsers));
        }
      } else {
        setUsers(initialUsers);
        localStorage.setItem('users', JSON.stringify(initialUsers));
      }
    };
    
    // Load passwords from localStorage or use initial passwords
    const loadPasswords = () => {
      const storedPasswords = localStorage.getItem('userPasswords');
      if (storedPasswords) {
        try {
          setPasswords(JSON.parse(storedPasswords));
        } catch (error) {
          console.error('Failed to parse stored passwords:', error);
          setPasswords(userPasswords);
          localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
        }
      } else {
        setPasswords(userPasswords);
        localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
      }
    };

    // Check for existing login in localStorage
    const loadAuthState = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
        }
      }
      setInitialized(true);
    };

    loadUsers();
    loadPasswords();
    loadAuthState();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Find user in our users array
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser && passwords[username] === password) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast.success("Login successful!");
      return true;
    } else {
      toast.error("Invalid username or password!");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.info("Logged out successfully");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const updateUserPermissions = (userId: string, permissions: string[]) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, permissions };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // If the current user is being updated, update their session too
    if (user && user.id === userId) {
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    toast.success("User permissions updated successfully");
  };
  
  const createUser = (username: string, role: 'admin' | 'operator', permissions: string[], password: string): boolean => {
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      toast.error("Username already exists!");
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      username,
      role,
      permissions
    };
    
    // Update users array
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update passwords
    const updatedPasswords = { ...passwords, [username]: password };
    setPasswords(updatedPasswords);
    localStorage.setItem('userPasswords', JSON.stringify(updatedPasswords));
    
    toast.success("User created successfully!");
    return true;
  };

  // Don't render anything until we've finished initializing
  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasPermission, 
      updateUserPermissions,
      createUser,
      allUsers: users 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
