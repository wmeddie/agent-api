import React from 'react';

const AgentSelection = ({ agents, onSelectAgent }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
      <h2 className="text-2xl font-bold mb-4">Select an Agent</h2>
      <ul className="w-1/2">
        {agents.map((agent) => (
          <li 
            key={agent.id} 
            className="cursor-pointer p-4 bg-white mb-2 rounded shadow hover:bg-gray-100"
            onClick={() => onSelectAgent(agent)}
          >
            {agent.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentSelection;