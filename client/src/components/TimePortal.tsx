import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { useAppContext } from '../context/AppContext';

type TimePersona = 'past' | 'present' | 'future';

const TimePortal = () => {
  const [message, setMessage] = useState('');
  const [activePersona, setActivePersona] = useState<TimePersona>('present');
  const [isTyping, setIsTyping] = useState(false);
  const { chatMessages, addChatMessage } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const getResponseFromPersona = (persona: TimePersona, userMessage: string): string => {
    switch(persona) {
      case 'past':
        return "Remember when you were just starting out and full of hope? Those days were filled with excitement but also uncertainty. Don't worry, your path gets clearer.";
      case 'present':
        return "I understand your concerns. The key is to break down your goals into smaller, manageable tasks. Focus on one thing at a time and celebrate small victories.";
      case 'future':
        return "Looking back, the times when you pushed through difficulty were the most important growth moments. Keep going - it all contributes to your success journey!";
      default:
        return "I'm here to help you navigate your journey.";
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    addChatMessage({
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date()
    });
    
    // Clear input
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Add AI response
      addChatMessage({
        id: (Date.now() + 1).toString(),
        sender: activePersona,
        text: getResponseFromPersona(activePersona, message),
        timestamp: new Date()
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Time Portal</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar - Chat History */}
        <div className="lg:col-span-3 bg-neutral-800 rounded-xl p-4 shadow-lg hidden lg:block">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Chat History</h3>
          
          <div className="space-y-3">
            <div className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-700 cursor-pointer transition duration-150">
              <p className="text-sm font-medium truncate">Past Me Conversation</p>
              <p className="text-xs text-gray-500 truncate">What was I thinking back then?</p>
            </div>
            
            <div className="p-2 rounded-lg bg-primary-600/20 border border-primary-600/30 cursor-pointer transition duration-150">
              <p className="text-sm font-medium truncate">Present Me Check-in</p>
              <p className="text-xs text-gray-500 truncate">How's the progress going?</p>
            </div>
            
            <div className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-700 cursor-pointer transition duration-150">
              <p className="text-sm font-medium truncate">Future Me Wisdom</p>
              <p className="text-xs text-gray-500 truncate">Looking back at the journey</p>
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="lg:col-span-9 bg-neutral-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
          {/* Chat Messages */}
          <div className="flex-grow p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {isTyping && (
              <div className="flex flex-col max-w-[85%]">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                    activePersona === 'past' ? 'bg-blue-600' : 
                    activePersona === 'present' ? 'bg-green-600' : 'bg-purple-600'
                  }`}>
                    {activePersona === 'past' ? 'P' : activePersona === 'present' ? 'P' : 'F'}
                  </span>
                  <span className={`text-sm font-medium ${
                    activePersona === 'past' ? 'text-blue-400' : 
                    activePersona === 'present' ? 'text-green-400' : 'text-purple-400'
                  }`}>
                    {activePersona === 'past' ? 'Past Me' : activePersona === 'present' ? 'Present Me' : 'Future Me'}
                  </span>
                </div>
                <div className={`p-3 ${
                  activePersona === 'past' ? 'chat-bubble-past' : 
                  activePersona === 'present' ? 'chat-bubble-present' : 'chat-bubble-future'
                }`}>
                  <p className="text-sm typing-animation">Thinking</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-neutral-700">
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Ask something to your past, present, or future self..." 
                className="flex-grow px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                onClick={handleSendMessage}
                disabled={message.trim() === '' || isTyping}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Time selector */}
            <div className="mt-3 flex space-x-2">
              <button 
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  activePersona === 'past' 
                    ? 'bg-blue-600/30 text-blue-400 border-blue-600/30 hover:bg-blue-600/40' 
                    : 'bg-neutral-700/30 text-gray-400 border-neutral-700/30 hover:bg-neutral-700/40'
                }`}
                onClick={() => setActivePersona('past')}
              >
                Past Me
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  activePersona === 'present' 
                    ? 'bg-green-600/30 text-green-400 border-green-600/30 hover:bg-green-600/40' 
                    : 'bg-neutral-700/30 text-gray-400 border-neutral-700/30 hover:bg-neutral-700/40'
                }`}
                onClick={() => setActivePersona('present')}
              >
                Present Me
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  activePersona === 'future' 
                    ? 'bg-purple-600/30 text-purple-400 border-purple-600/30 hover:bg-purple-600/40' 
                    : 'bg-neutral-700/30 text-gray-400 border-neutral-700/30 hover:bg-neutral-700/40'
                }`}
                onClick={() => setActivePersona('future')}
              >
                Future Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePortal;
