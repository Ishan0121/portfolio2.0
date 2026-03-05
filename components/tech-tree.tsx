"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Panel,
  useReactFlow,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { skillsData } from '@/lib/skills-data';
import { useTheme } from 'next-themes';

// ── Sizes & gaps ──────────────────────────────────────────────────────────────
const ROOT_W      = 240;
const ROOT_H      = 56;
const CAT_W       = 180;
const SKILL_W     = 155;
const SKILL_H     = 56;

const COL_W       = 190;   // column slot width (≥ CAT_W ≥ SKILL_W)
const COL_GAP     = 45;    // horizontal gap between columns
const ROOT_CAT_V  = 80;    // root → category vertical gap
const CAT_SKILL_V = 55;    // category → first skill vertical gap
const SKILL_ROW_V = 12;    // gap between skill rows in the same column

// ── Custom nodes ──────────────────────────────────────────────────────────────
function RootNode({ data }: NodeProps) {
  return (
    <div
      style={{ width: ROOT_W }}
      className="rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-2xl flex items-center justify-center px-4 py-3 text-center border border-primary/40"
    >
      {data.label as string}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function CategoryNode({ data }: NodeProps) {
  return (
    <div
      style={{ width: CAT_W }}
      className="rounded-xl glass border border-white/25 text-foreground font-semibold text-xs shadow-lg flex items-center justify-center px-3 py-2.5 text-center leading-snug"
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      {data.label as string}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function SkillNode({ data }: NodeProps) {
  const levelColor =
    (data.level as string) === 'Advanced'     ? '#22c55e' :
    (data.level as string) === 'Intermediate' ? '#eab308' : '#60a5fa';

  return (
    <div
      style={{ width: SKILL_W, height: SKILL_H }}
      className="rounded-lg glass border border-white/10 hover:border-primary/40 flex flex-col items-center justify-center px-2 text-center cursor-pointer transition-colors"
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <span className="font-medium text-[11px] text-foreground leading-tight">{data.label as string}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: levelColor }}>
        {data.level as string}
      </span>
    </div>
  );
}

const nodeTypes = { root: RootNode, category: CategoryNode, skill: SkillNode };

// ── Layout: each category is its own VERTICAL COLUMN ─────────────────────────
// This fills the canvas height rather than just its width.
function buildGraph() {
  const nodes: any[] = [];
  const edges: any[] = [];

  const numCats    = skillsData.length;
  const totalWidth = numCats * COL_W + (numCats - 1) * COL_GAP;

  // ── Root ──────────────────────────────────────────────────────────────────
  const rootX = totalWidth / 2 - ROOT_W / 2;
  nodes.push({
    id: 'root', type: 'root',
    position: { x: rootX, y: 0 },
    data: { label: 'My Skills & Expertise' },
  });

  // ── Categories & their skill columns ─────────────────────────────────────
  skillsData.forEach((cat, ci) => {
    const catId  = `cat-${cat.name}`;
    const colX   = ci * (COL_W + COL_GAP);           // left edge of this column

    // Category — centred in the column slot
    const catX   = colX + (COL_W - CAT_W) / 2;
    const catY   = ROOT_H + ROOT_CAT_V;

    nodes.push({
      id: catId, type: 'category',
      position: { x: catX, y: catY },
      data: { label: cat.name },
    });

    edges.push({
      id: `e-root-${catId}`,
      source: 'root', target: catId,
      type: 'smoothstep', animated: true,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
    });

    // Skills stacked vertically in the same column
    cat.skills.forEach((skill, si) => {
      const skillId = `skill-${cat.name}-${skill.name}`;
      const skillX  = colX + (COL_W - SKILL_W) / 2;
      // catY + estimated cat height + gap + row offset
      const catEstH = 44; // approximate rendered height for the category card
      const skillY  = catY + catEstH + CAT_SKILL_V + si * (SKILL_H + SKILL_ROW_V);

      nodes.push({
        id: skillId, type: 'skill',
        position: { x: skillX, y: skillY },
        data: { label: skill.name, level: skill.level },
      });

      edges.push({
        id: `e-${catId}-${skillId}`,
        source: catId, target: skillId,
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, opacity: 0.35 },
      });
    });
  });

  return { nodes, edges };
}

// ── Scatter / Reset controls (must be inside <ReactFlow> to use useReactFlow) ─
function ScatterControls({ originalNodes }: { originalNodes: any[] }) {
  const { setNodes, fitView } = useReactFlow();

  const scatter = () => {
    const W = 2400;
    const H = 1400;
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        position: {
          x: Math.random() * W,
          y: Math.random() * H,
        },
      }))
    );
  };

  const reset = () => {
    setNodes(originalNodes);
    setTimeout(() => fitView({ padding: 0.08 }), 50);
  };

  return (
    <Panel position="top-right">
      <div className="flex flex-col gap-2 p-2">
        <button
          onClick={scatter}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-lg"
        >
          <span className="text-base">🌪️</span> Scatter
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-xs font-semibold text-muted-foreground hover:border-white/40 hover:text-foreground transition-all shadow-lg"
        >
          <span className="text-base">🔁</span> Reset
        </button>
      </div>
    </Panel>
  );
}


export function TechTree() {
  const { resolvedTheme } = useTheme();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(buildGraph, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
         style={{ height: 'calc(100vh - 220px)', minHeight: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
        <ScatterControls originalNodes={initialNodes} />
      </ReactFlow>
    </div>
  );
}
