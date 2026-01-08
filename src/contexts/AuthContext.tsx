import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, users, rolePermissions } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (screen: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Mock authentication - in real app, this would validate against backend
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser || email) {
      const mockUser: User = foundUser || {
        id: 'U999',
        name: email.split('@')[0],
        email,
        role,
        branch: 'Downtown Central',
      };
      
      setUser({ ...mockUser, role });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const hasPermission = (screen: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(screen);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole,
      hasPermission,
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
