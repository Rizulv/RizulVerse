import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

// User data interface to store auth information
export interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

// Define the shape of our context
interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => {
    throw new Error('Not implemented');
  },
  logout: async () => {},
  updateUserProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Extract user data from Firebase User object
const extractUserData = (user: User | null): UserData | null => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Sign in with Google using popup
  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      console.log('Attempting to sign in with Google...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user.displayName);
      
      toast({
        title: "Sign in successful",
        description: `Welcome ${result.user.displayName || 'to Rizulverse'}!`,
      });
      
      return result;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName: string) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName });
        // Force refresh current user state
        setCurrentUser({ ...currentUser, displayName });
        // Update userData as well
        if (userData) {
          setUserData({
            ...userData,
            displayName
          });
        }
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      } else {
        throw new Error('No user is signed in');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Set up auth state observer
  useEffect(() => {
    console.log('Setting up auth state observer');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed, user:', user ? `${user.displayName} (${user.email})` : 'null');
      setCurrentUser(user);
      setUserData(extractUserData(user));
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Context value
  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when authentication is done initializing */}
      {!loading && children}
    </AuthContext.Provider>
  );
};