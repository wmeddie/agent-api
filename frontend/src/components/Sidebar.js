import React from 'react';

const Sidebar = ({ conversations, onSelectConversation, onNewConversation }) => {
    return (
      <div className="w-1/4 h-full bg-gray-800 text-white p-4 flex flex-col">
        <button 
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4"
          onClick={onNewConversation}
        >
          New Conversation
        </button>
        <ul className="flex-grow overflow-y-auto">
          {conversations.map((conversation, index) => (
            <li 
              key={index} 
              className="cursor-pointer p-2 hover:bg-gray-700"
              onClick={() => onSelectConversation(index)}
            >
              {conversation.title}
            </li>
          ))}
        </ul>
      </div>
    );
};

export default Sidebar;