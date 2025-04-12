import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoginModal from './LoginModal';

const UserProfile: React.FC = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (displayName.trim() !== '') {
      await updateUserProfile(displayName);
      setIsEditProfileOpen(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!currentUser?.displayName) return '?';
    return currentUser.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  if (!currentUser) {
    return (
      <>
        <Button 
          variant="outline" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
          onClick={() => setIsLoginModalOpen(true)}
        >
          Sign In
        </Button>
        <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-indigo-500">
              {currentUser.photoURL ? (
                <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
              ) : (
                <AvatarFallback className="bg-indigo-800 text-white">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-700 text-white" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{currentUser.displayName || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-neutral-700" />
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-neutral-800"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            Edit Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-neutral-800"
            onClick={logout}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-3 mb-4">
              <Avatar className="h-16 w-16 border-2 border-indigo-500">
                {currentUser.photoURL ? (
                  <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                ) : (
                  <AvatarFallback className="bg-indigo-800 text-white text-xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-sm text-gray-400">
                {currentUser.email}
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                className="bg-neutral-800 border-neutral-700 focus:border-indigo-500 text-white"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setIsEditProfileOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;