import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import LoginButton from './LoginButton';
import { LogOut, User as UserIcon } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // If no user is logged in, show the login button
  if (!currentUser) {
    return <LoginButton />;
  }

  // User is logged in, display profile dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity">
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
          <span className="text-sm font-medium text-white hidden md:inline">
            {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-gray-800 border-gray-700 text-gray-100">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.displayName || 'User'}</p>
            <p className="text-xs leading-none text-gray-400">{currentUser.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-700 flex items-center gap-2"
          onClick={() => {}} // Will implement profile view in future
        >
          <UserIcon size={16} />
          <span>View Profile</span>
        </DropdownMenuItem>
        
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