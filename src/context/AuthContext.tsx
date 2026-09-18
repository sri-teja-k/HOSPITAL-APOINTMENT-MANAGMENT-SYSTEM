import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, UserRole } from '../types';
import { storageService, initializeStorage } from '../services/storage';

interface AuthContextType {
  currentUser: Profile;
  role: UserRole;
  allProfiles: Profile[];
  switchUser: (profileId: string) => void;
  switchRole: (newRole: UserRole) => void;
  loginByEmail: (email: string) => boolean;
  registerUser: (data: Omit<Profile, 'id' | 'created_at'>) => Profile;
  updateCurrentUserProfile: (updates: Partial<Profile>) => void;
  unreadCount: number;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize storage once on mount
  useEffect(() => {
    initializeStorage();
  }, []);

  const [currentUser, setCurrentUser] = useState<Profile>(() => {
    initializeStorage();
    return storageService.getCurrentUser();
  });

  const [allProfiles, setAllProfiles] = useState<Profile[]>(() => {
    return storageService.getProfiles();
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshUserData = () => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    setAllProfiles(storageService.getProfiles());
    const notifs = storageService.getUserNotifications(user.id);
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  useEffect(() => {
    refreshUserData();

    const handleStorageChange = () => {
      refreshUserData();
    };

    window.addEventListener('hams_storage_updated', handleStorageChange);
    window.addEventListener('hams_auth_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('hams_storage_updated', handleStorageChange);
      window.removeEventListener('hams_auth_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const switchUser = (profileId: string) => {
    storageService.setCurrentUserId(profileId);
    const user = storageService.getProfileById(profileId);
    if (user) {
      setCurrentUser(user);
      const notifs = storageService.getUserNotifications(user.id);
      setUnreadCount(notifs.filter(n => !n.read).length);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const profiles = storageService.getProfiles();
    const candidate = profiles.find(p => p.role === newRole);
    if (candidate) {
      switchUser(candidate.id);
    }
  };

  const loginByEmail = (email: string): boolean => {
    const profiles = storageService.getProfiles();
    const user = profiles.find(p => p.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (user) {
      switchUser(user.id);
      return true;
    }
    return false;
  };

  const registerUser = (data: Omit<Profile, 'id' | 'created_at'>): Profile => {
    const newProfile = storageService.createProfile(data);
    switchUser(newProfile.id);
    return newProfile;
  };

  const updateCurrentUserProfile = (updates: Partial<Profile>) => {
    const updated = storageService.updateProfile(currentUser.id, updates);
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        allProfiles,
        switchUser,
        switchRole,
        loginByEmail,
        registerUser,
        updateCurrentUserProfile,
        unreadCount,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
