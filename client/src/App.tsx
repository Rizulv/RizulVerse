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
          {/* Header with Rizulverse title */}
          <header className="bg-gradient-to-r from-indigo-800 to-purple-900 py-4 px-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <span className="mr-2">✨</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-100">
                  Rizulverse
                </span>
                <span className="ml-2 text-xs font-medium uppercase tracking-wider bg-indigo-900 px-2 py-1 rounded-full">
                  Beta
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                <a 
                  href="https://github.com/yourusername/rizulverse" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              </div>
            </div>
          </header>

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
