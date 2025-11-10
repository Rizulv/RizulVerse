import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginButton: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('Initiating Google sign in from LoginButton component');
      await signInWithGoogle();
      console.log('Google sign in successful from button');
      setIsLoginModalOpen(false);
    } catch (error: any) {
      console.error('Google sign in error in LoginButton:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      toast({
        title: "Sign in failed",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
        onClick={() => setIsLoginModalOpen(true)}
      >
        Sign In
      </Button>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-100">
              Welcome to Rizulverse
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Sign in to access all features and save your data
            </DialogDescription>
          </DialogHeader>
          {/* Additional modal contents */}
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  {/* SVG content for Google logo */}
                </svg>
              )}
              Sign in with Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginButton;
