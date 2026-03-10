import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'citizen' | 'authority';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  upiId?: string;
  points: number;
  streaks: number;
  totalComplaints: number;
  avatar: number; // Avatar ID (1-12)
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  type: 'accident' | 'violation' | 'damaged_road';
  violationType?: string;
  description: string;
  location: string;
  photoUrl?: string;
  numberPlate?: string;
  voiceNote?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>) => void;
  complaints: Complaint[];
  approveComplaint: (id: string) => void;
  rejectComplaint: (id: string) => void;
  claimReward: (points: number, amount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('namma_suraksha_user');
    const savedComplaints = localStorage.getItem('namma_suraksha_complaints');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedComplaints) {
      setComplaints(JSON.parse(savedComplaints));
    } else {
      // Initialize with some demo complaints for authority view
      const demoComplaints: Complaint[] = [
        {
          id: 'demo1',
          userId: 'demo',
          userName: 'Demo Citizen',
          type: 'violation',
          violationType: 'noHelmet',
          description: 'Motorcyclist without helmet on MG Road',
          location: 'MG Road, Bangalore',
          numberPlate: 'KA-01-AB-1234',
          status: 'pending',
          createdAt: new Date().toISOString(),
          points: 5,
        },
      ];
      setComplaints(demoComplaints);
      localStorage.setItem('namma_suraksha_complaints', JSON.stringify(demoComplaints));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('namma_suraksha_user', JSON.stringify(user));
    }
  }, [user]);

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('namma_suraksha_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate login - in real app this would call backend
    const savedUsers = localStorage.getItem('namma_suraksha_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password && u.role === role);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    const savedUsers = localStorage.getItem('namma_suraksha_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
      role,
      points: 0,
      streaks: 0,
      totalComplaints: 0,
      avatar: Math.floor(Math.random() * 12) + 1, // Random avatar 1-12
    };
    
    users.push(newUser);
    localStorage.setItem('namma_suraksha_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('namma_suraksha_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update in users list
      const savedUsers = localStorage.getItem('namma_suraksha_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('namma_suraksha_users', JSON.stringify(users));
      }
    }
  };

  const submitComplaint = (complaint: Omit<Complaint, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>) => {
    if (!user) return;
    
    const newComplaint: Complaint = {
      ...complaint,
      id: `complaint_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
    
    // Update user stats
    const updatedUser = {
      ...user,
      totalComplaints: user.totalComplaints + 1,
    };
    setUser(updatedUser);
  };

  const approveComplaint = (id: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: 'approved' as const } : c
      )
    );
    
    // Award points to the user who filed the complaint
    const savedUsers = localStorage.getItem('namma_suraksha_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const userIndex = users.findIndex((u: any) => u.id === complaint.userId);
    
    if (userIndex !== -1) {
      users[userIndex].points += complaint.points;
      
      // Check for streak milestone
      const newPoints = users[userIndex].points;
      const oldStreaks = users[userIndex].streaks;
      const newStreaks = Math.floor(newPoints / 10);
      
      if (newStreaks > oldStreaks) {
        users[userIndex].streaks = newStreaks;
      }
      
      localStorage.setItem('namma_suraksha_users', JSON.stringify(users));
      
      // Update current user if it's them
      if (user && user.id === complaint.userId) {
        setUser(users[userIndex]);
      }
    }
  };

  const rejectComplaint = (id: string) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: 'rejected' as const } : c
      )
    );
  };

  const claimReward = (points: number, amount: number): boolean => {
    if (!user || user.points < points) return false;
    
    updateProfile({ points: user.points - points });
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      submitComplaint,
      complaints,
      approveComplaint,
      rejectComplaint,
      claimReward,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
