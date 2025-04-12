import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TimePortalSetupProps {
  onComplete: (pastYear: number, futureYear: number) => void;
}

const TimePortalSetup: React.FC<TimePortalSetupProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [pastYear, setPastYear] = useState(currentYear - 5);
  const [futureYear, setFutureYear] = useState(currentYear + 5);

  useEffect(() => {
    // Check if the user has already set up the time portal
    const timeSettings = localStorage.getItem('time_portal_settings');
    
    if (!timeSettings) {
      // If not, show the setup dialog
      setIsOpen(true);
    } else {
      // If yes, parse the settings and pass them to the parent component
      const { pastYear, futureYear } = JSON.parse(timeSettings);
      onComplete(pastYear, futureYear);
    }
  }, [onComplete]);

  const handleComplete = () => {
    // Validate the year inputs
    if (pastYear >= currentYear) {
      alert("Past year must be before the current year.");
      return;
    }
    
    if (futureYear <= currentYear) {
      alert("Future year must be after the current year.");
      return;
    }
    
    // Save settings to localStorage
    const settings = { pastYear, futureYear };
    localStorage.setItem('time_portal_settings', JSON.stringify(settings));
    
    // Notify parent component
    onComplete(pastYear, futureYear);
    
    // Close dialog
    setIsOpen(false);
  };

  const handlePastYearChange = (value: number[]) => {
    setPastYear(value[0]);
  };

  const handleFutureYearChange = (value: number[]) => {
    setFutureYear(value[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-neutral-900 border-neutral-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <span className="mr-2">🔮</span> Time Portal Setup
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set the years for your past and future selves to enhance your conversations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="pastYear" className="text-sm font-medium">
                  Past Self (Year: {pastYear})
                </Label>
                <span className="text-xs text-indigo-300">
                  {currentYear - pastYear} years ago
                </span>
              </div>
              <Slider
                id="pastYear"
                min={currentYear - 20}
                max={currentYear - 1}
                step={1}
                value={[pastYear]}
                onValueChange={handlePastYearChange}
                className="my-4"
              />
              <div className="text-xs text-gray-400 italic">
                Who were you in {pastYear}? What were your hopes and fears?
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="futureYear" className="text-sm font-medium">
                  Future Self (Year: {futureYear})
                </Label>
                <span className="text-xs text-indigo-300">
                  {futureYear - currentYear} years ahead
                </span>
              </div>
              <Slider
                id="futureYear"
                min={currentYear + 1}
                max={currentYear + 20}
                step={1}
                value={[futureYear]}
                onValueChange={handleFutureYearChange}
                className="my-4"
              />
              <div className="text-xs text-gray-400 italic">
                Who will you be in {futureYear}? What will you have accomplished?
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900/30 rounded-md p-3 border border-indigo-800/50">
            <p className="text-sm text-indigo-200">
              These settings help personalize your Time Portal experience. You can change them later in your profile settings.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Begin Time Travel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimePortalSetup;