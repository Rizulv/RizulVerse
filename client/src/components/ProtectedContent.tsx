import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import LoginButton from './LoginButton';

interface ProtectedContentProps {
  children: ReactNode;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-10">
        <Card className="w-full max-w-xl bg-neutral-900 border-neutral-700 text-white shadow-lg">
          <CardHeader className="space-y-1 text-center">
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
                <div className="flex justify-center py-4">
                  <LoginButton />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedContent;