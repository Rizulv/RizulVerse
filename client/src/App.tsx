import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import StartupLab from "./components/StartupLab";
import DesignRoast from "./components/DesignRoast";
import TimePortal from "./components/TimePortal";
import AIAssistant from "./components/AIAssistant";

function App() {
  const [activeTab, setActiveTab] = useState<'startup' | 'design' | 'time'>('startup');

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="flex flex-col min-h-screen bg-dark-900 text-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
            
            <main className="flex-grow py-6">
              {activeTab === 'startup' && <StartupLab />}
              {activeTab === 'design' && <DesignRoast />}
              {activeTab === 'time' && <TimePortal />}
            </main>
          </div>
          
          <AIAssistant />
          <Toaster />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
