import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast({
        title: "Sign in successful",
        description: `Welcome ${result.user.displayName || 'to Rizulverse'}!`,
      });
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Context value
  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};