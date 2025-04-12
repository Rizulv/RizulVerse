import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

interface ProtectedContentProps {
  children: ReactNode;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check if user is logged in, if not, show login modal
  useEffect(() => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoginModalOpen(false);
    }
  }, [currentUser]);

  // If user is logged in, render the children
  return (
    <>
      {currentUser ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-[300px] bg-neutral-800 rounded-xl p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-900/30 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-indigo-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Sign in Required</h3>
            <p className="text-gray-400">Please sign in to access this feature</p>
            <button
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Sign In
            </button>
          </div>
        </div>
      )}
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        setIsOpen={setIsLoginModalOpen} 
      />
    </>
  );
};

export default ProtectedContent;