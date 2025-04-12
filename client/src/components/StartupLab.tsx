import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { apiRequest } from '../lib/queryClient';
import type { StartupAnalysisType } from '../context/AppContext';

const StartupLab = () => {
  const [startupIdea, setStartupIdea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startupAnalysis, setStartupAnalysis } = useAppContext();

  const handleAnalyzeIdea = async () => {
    if (startupIdea.trim() === '') return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Make actual API call to backend
      const response = await apiRequest({
        url: '/api/startup/analyze',
        method: 'POST',
        data: { idea: startupIdea }
      });
      
      // Type assertion to ensure the response matches our expected type
      setStartupAnalysis(response as StartupAnalysisType);
    } catch (err) {
      console.error('Failed to analyze startup idea:', err);
      setError('Failed to analyze your startup idea. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Startup Lab</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg">
          <label htmlFor="startup-idea" className="block text-sm font-medium text-gray-300 mb-2">
            Enter your startup idea
          </label>
          
          <textarea 
            id="startup-idea" 
            rows={6} 
            placeholder="Describe your startup idea in detail..." 
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150"
            value={startupIdea}
            onChange={(e) => setStartupIdea(e.target.value)}
          ></textarea>
          
          {error && (
            <div className="mt-3 text-red-500 text-sm">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-150 flex items-center space-x-2"
              onClick={handleAnalyzeIdea}
              disabled={isAnalyzing || startupIdea.trim() === ''}
            >
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Idea'}</span>
              {!isAnalyzing && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Response Area */}
        <div className="bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
          {startupAnalysis ? (
            <div className="p-6 space-y-4">
              {/* AI Avatar + Response */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <span>Analysis</span>
                    <span className="text-xl">{startupAnalysis.emoji}</span>
                  </h3>
                  <p className="text-gray-300 mt-1">
                    {startupAnalysis.analysis}
                  </p>
                </div>
              </div>
              
              {/* Market Score */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Market Fit</span>
                  <span className="text-sm font-medium">{startupAnalysis.marketFit}/100</span>
                </div>
                <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-600 to-primary-500 rounded-full" 
                    style={{ width: `${startupAnalysis.marketFit}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* MVP Suggestion */}
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                  <h4 className="text-sm font-medium flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Tech Stack</span>
                  </h4>
                  <ul className="mt-2 text-sm text-gray-400 space-y-1">
                    {startupAnalysis.techStack.map((tech, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>•</span>
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Competitor Analysis */}
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                  <h4 className="text-sm font-medium flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Competitors</span>
                  </h4>
                  <ul className="mt-2 text-sm text-gray-400 space-y-1">
                    {startupAnalysis.competitors.map((competitor, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>•</span>
                        <span>{competitor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-lg font-medium">Enter your startup idea</p>
                <p className="text-sm mt-1">We'll analyze it and provide feedback</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupLab;
