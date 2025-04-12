import { useState } from 'react';
import UploadArea from './UploadArea';
import { useAppContext } from '../context/AppContext';

const DesignRoast = () => {
  const [isRoasting, setIsRoasting] = useState(false);
  const { designRoast, setDesignRoast, uploadedImage, setUploadedImage } = useAppContext();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage({
          file,
          preview: e.target.result as string
        });
        
        // Start the roasting process
        handleRoastImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRoastImage = (file: File) => {
    setIsRoasting(true);
    
    // Simulating API call with setTimeout
    setTimeout(() => {
      setDesignRoast({
        title: "Yikes, that's a lot of gradients!",
        score: 3,
        feedback: [
          {
            type: 'negative', 
            text: 'Try a more subtle color palette'
          },
          {
            type: 'warning', 
            text: 'The typography hierarchy needs work - too many competing font styles'
          },
          {
            type: 'positive', 
            text: 'Layout structure is good, but needs more whitespace between elements'
          }
        ],
        suggestedFix: 'Try using a monochromatic color scheme with a single accent color. Reduce the number of font styles to 2 at most, and increase padding between elements by 1.5x.'
      });
      
      setIsRoasting(false);
    }, 1500);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setDesignRoast(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Design Roast</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg">
          {!uploadedImage ? (
            <UploadArea onUpload={handleImageUpload} />
          ) : (
            <div className="mt-4">
              <div className="relative">
                <img 
                  src={uploadedImage.preview} 
                  alt="Uploaded design" 
                  className="w-full h-auto rounded-lg shadow-md" 
                />
                <button 
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  onClick={handleClearImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Roast Results */}
        <div className="bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
          {isRoasting ? (
            <div className="p-6 flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-lg font-medium">Roasting your design...</p>
                <p className="text-sm mt-1">Preparing the heat 🔥</p>
              </div>
            </div>
          ) : designRoast ? (
            <div className="p-6 space-y-4">
              {/* Roast Header */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-secondary-600 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <span>Roast Result</span>
                    <span className="text-xl">🔥</span>
                  </h3>
                  <p className="text-gray-300 mt-1 font-medium">
                    "{designRoast.title}"
                  </p>
                </div>
              </div>
              
              {/* Design Score */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Roast Score</span>
                  <span className="text-sm font-medium">{designRoast.score}/10</span>
                </div>
                <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${designRoast.score * 10}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Feedback */}
              <div className="mt-6 bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                <h4 className="text-sm font-medium">Feedback</h4>
                <ul className="mt-3 text-sm text-gray-300 space-y-3">
                  {designRoast.feedback.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className={`mt-0.5 ${
                        item.type === 'negative' ? 'text-red-500' : 
                        item.type === 'warning' ? 'text-amber-500' : 
                        'text-green-500'
                      }`}>•</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Suggested Fix */}
              <div className="mt-4 bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                <h4 className="text-sm font-medium">Suggested Fix</h4>
                <p className="mt-2 text-sm text-gray-300">
                  {designRoast.suggestedFix}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">Upload a design</p>
                <p className="text-sm mt-1">We'll roast it and provide feedback</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignRoast;
