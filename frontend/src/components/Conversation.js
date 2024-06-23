import React, { useState } from 'react';

const Conversation = ({ conversation, onAddMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onAddMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-3/4 h-full p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">{conversation.title}</h2>
      <div className="bg-gray-100 p-4 rounded-lg flex-grow overflow-y-auto">
        {conversation.messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="font-bold">{message.sender}</div>
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          onKeyDown={handleKeyPress}
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSendMessage} 
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;