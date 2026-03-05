"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { skillsData } from '@/lib/skills-data';
import { useTheme } from 'next-themes';

const nodeWidth = 220;
const nodeHeight = 80;

// function to layout nodes using dagre
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 200 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
    return newNode;
  });

  return { nodes: newNodes, edges };
};

export function TechTree() {
  const { resolvedTheme } = useTheme();
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];

    // Root node
    nodes.push({
      id: 'root',
      data: { label: 'My Skills & Expertise' },
      position: { x: 0, y: 0 },
      className: 'bg-primary text-primary-foreground border-primary font-bold shadow-2xl rounded-xl flex items-center justify-center p-4 text-lg w-[220px]',
    });

    skillsData.forEach((category) => {
      const catId = `cat-${category.name}`;
      
      nodes.push({
        id: catId,
        data: { label: category.name },
        position: { x: 0, y: 0 },
        className: 'glass border-white/20 text-foreground font-semibold rounded-xl flex items-center justify-center p-3 shadow-lg w-[200px] text-center',
      });

      edges.push({
        id: `e-root-${catId}`,
        source: 'root',
        target: catId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      });

      category.skills.forEach((skill) => {
        const skillId = `skill-${category.name}-${skill.name}`;
        
        // Custom styled node label for skills to show level
        const levelColor = 
          skill.level === "Advanced" ? "text-green-500" :
          skill.level === "Intermediate" ? "text-yellow-500" : "text-blue-500";
          
        const label = (
          <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
            <span className="font-medium text-sm">{skill.name}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${levelColor}`}>{skill.level}</span>
          </div>
        );

        nodes.push({
          id: skillId,
          data: { label },
          position: { x: 0, y: 0 },
          className: 'glass border-white/10 hover:border-primary/50 text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors cursor-pointer w-[160px] h-[60px]',
        });

        edges.push({
          id: `e-${catId}-${skillId}`,
          source: catId,
          target: skillId,
          type: 'default',
          style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, opacity: 0.4 },
        });
      });
    });

    return getLayoutedElements(nodes, edges, 'LR');
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Force dark theme or light theme base colors on the ReactFlow wrapper
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="w-full h-[600px] lg:h-[800px] glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode={colorMode}
        minZoom={0.2}
        maxZoom={1.5}
        attributionPosition="bottom-right"
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} className="glass rounded-xl shadow-lg border-white/10" />
      </ReactFlow>
    </div>
  );
}
