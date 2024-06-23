import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useSpring, animated } from 'react-spring';

const AgentList = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:3001/agents');
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const graphData = {
    nodes: agents.map(agent => ({ id: agent.id, name: agent.name })),
    links: agents.map(agent => ({
      source: agent.id,
      target: agents[Math.floor(Math.random() * agents.length)].id,
    })),
  };

  const AnimatedForceGraph = animated(ForceGraph2D);

  const animationProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <div className="w-1/2 h-full bg-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Agents</h2>
      <AnimatedForceGraph
        graphData={graphData}
        nodeLabel="name"
        width={500}
        height={500}
        style={animationProps}
        nodeAutoColorBy="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={d => d.value * 0.001}
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Draw node
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.stroke();

          // Draw label
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, node.x, node.y - 10);
        }}
      />
    </div>
  );
};

export default AgentList;