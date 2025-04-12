import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import LoginButton from './LoginButton';
import { LockIcon, ShieldIcon } from 'lucide-react';

interface ProtectedContentProps {
  children: ReactNode;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ children }) => {
  const { currentUser, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Direct sign-in handler
  const handleDirectSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('Attempting direct sign-in from protected content');
      await signInWithGoogle();
    } catch (error) {
      console.error('Direct sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not logged in, show login prompt
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-10">
        <Card className="w-full max-w-xl bg-neutral-900 border-neutral-700 text-white shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <ShieldIcon className="h-10 w-10 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-100">
              Sign In Required
            </CardTitle>
            <CardDescription className="text-gray-400">
              You need to sign in to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-6xl">🔐</div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-sm md:text-base text-gray-300">
                  This feature helps you analyze and save your data, requiring authentication for a personalized experience.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button
              onClick={handleDirectSignIn}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LockIcon size={16} className="mr-2" />
                  Sign in with Google
                </span>
              )}
            </Button>
            <LoginButton />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedContent;