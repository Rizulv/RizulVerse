import { FC } from 'react';
import { ChatMessageType } from '../context/AppContext';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  if (message.sender === 'user') {
    return (
      <div className="flex flex-col max-w-[85%] ml-auto">
        <div className="chat-bubble-user p-3">
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  }
  
  // For AI personas (past, present, future)
  const avatarLabel = message.sender === 'past' ? 'P' : message.sender === 'present' ? 'P' : 'F';
  const personaName = message.sender === 'past' ? 'Past Me' : message.sender === 'present' ? 'Present Me' : 'Future Me';
  
  let bubbleClass = '';
  let textColorClass = '';
  let bgColorClass = '';
  
  switch (message.sender) {
    case 'past':
      bubbleClass = 'chat-bubble-past';
      textColorClass = 'text-blue-400';
      bgColorClass = 'bg-blue-600';
      break;
    case 'present':
      bubbleClass = 'chat-bubble-present';
      textColorClass = 'text-green-400';
      bgColorClass = 'bg-green-600';
      break;
    case 'future':
      bubbleClass = 'chat-bubble-future';
      textColorClass = 'text-purple-400';
      bgColorClass = 'bg-purple-600';
      break;
  }
  
  return (
    <div className="flex flex-col max-w-[85%]">
      <div className="flex items-center space-x-2 mb-1">
        <span className={`w-6 h-6 rounded-full ${bgColorClass} flex items-center justify-center text-white text-xs`}>
          {avatarLabel}
        </span>
        <span className={`text-sm font-medium ${textColorClass}`}>{personaName}</span>
      </div>
      <div className={`${bubbleClass} p-3`}>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
