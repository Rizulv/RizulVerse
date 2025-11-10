// src/components/UserProfile.tsx
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import LoginButton from './LoginButton';
import { LogOut, User as UserIcon } from 'lucide-react';
// If you have routing for Profile, e.g., React Router:
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate(); // If using React Router

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Logging out user...');
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // If no user is logged in, show the LoginButton
  if (!currentUser) {
    return <LoginButton />;
  }

  // If user is logged in, display the avatar & dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
          title="Open profile options"
        >
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border-2 border-indigo-400"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
              {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700 text-gray-100">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.displayName || 'User'}</p>
            <p className="text-xs leading-none text-gray-400">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        
        {/* Add your "View Profile" option here */}
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-700 flex items-center gap-2"
          onClick={() => {
            // If you have a profile page route:
            // navigate('/profile');
            
            // Or show a modal:
            console.log('Open Profile / Account Management...');
          }}
        >
          <UserIcon size={16} />
          <span>View Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-700 text-red-400 flex items-center gap-2"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-red-400 rounded-full border-t-transparent mr-2"></span>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span>Sign Out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
