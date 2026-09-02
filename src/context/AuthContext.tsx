import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/syntheticFhirData';

interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  switchUserRole: (role: UserRole) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; initialUser?: UserProfile | null }> = ({ 
  children, 
  initialUser = DEMO_USERS[0] 
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser);

  const switchUserRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(targetUser);
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        switchUserRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
