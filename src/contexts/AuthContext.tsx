import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'podcaster' | 'listener' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => boolean;
  register: (username: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: Array<User & { password: string }> = [
  { id: '1', username: 'Alex Podcaster', email: 'podcaster@demo.com', password: 'demo123', role: 'podcaster' },
  { id: '2', username: 'Sam Listener', email: 'listener@demo.com', password: 'demo123', role: 'listener' },
  { id: '3', username: 'Admin User', email: 'admin@demo.com', password: 'demo123', role: 'admin' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState(MOCK_USERS);

  useEffect(() => {
    const storedUser = localStorage.getItem('podcast_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role?: UserRole): boolean => {
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password && (!role || u.role === role)
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('podcast_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string, role: UserRole): boolean => {
    if (registeredUsers.some(u => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      role,
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('podcast_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('podcast_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const DEMO_CREDENTIALS = MOCK_USERS.map(({ password, ...user }) => ({
  ...user,
  password,
}));
