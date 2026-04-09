import { useMemo } from 'react';
import { usePDA } from '../../context/PDAContext';
import { transitionLabel } from '../../utils/pdaEngine';

const NODE_R = 30;
const H_GAP = 140;
const CY = 160;
const MARGIN_X = 80;

interface NodePos { id: string; x: number; y: number; }
interface EdgeDef { id: string; source: string; target: string; labels: string[]; transitionIds: string[]; isSelf: boolean; }

function buildLayout(states: string[]): NodePos[] {
  if (states.length <= 4) {
    return states.map((id, i) => ({ id, x: MARGIN_X + i * H_GAP, y: CY }));
  }
  const radius = Math.max(120, states.length * 40);
  return states.map((id, i) => {
    const angle = (2 * Math.PI * i) / states.length - Math.PI / 2;
    return { id, x: radius + MARGIN_X + Math.cos(angle) * radius, y: radius + 40 + Math.sin(angle) * radius };
  });
}

function selfLoopPath(cx: number, cy: number, r: number): string {
  return `M ${cx - 10} ${cy - r} C ${cx - 38} ${cy - r - 60} ${cx + 38} ${cy - r - 60} ${cx + 10} ${cy - r}`;
}

function quadPath(x1: number, y1: number, x2: number, y2: number, curvature: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - curvature;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export default function StateDiagram() {
  const { state } = usePDA();
  const { definition, transitions, currentHighlightedState, currentHighlightedTransition } = state;

  const nodes = useMemo(() => buildLayout(definition.states), [definition.states]);

  const edges: EdgeDef[] = useMemo(() => {
    const map = new Map<string, EdgeDef>();
    for (const t of transitions) {
      const key = t.fromState === t.toState ? `self-${t.fromState}` : `${t.fromState}->${t.toState}`;
      if (!map.has(key)) map.set(key, { id: key, source: t.fromState, target: t.toState, labels: [], transitionIds: [], isSelf: t.fromState === t.toState });
      const edge = map.get(key)!;
      edge.labels.push(transitionLabel(t));
      edge.transitionIds.push(t.id);
    }
    return Array.from(map.values());
  }, [transitions]);

  const nodeMap = useMemo(() => {
    const m = new Map<string, NodePos>();
    for (const n of nodes) m.set(n.id, n);
    return m;
  }, [nodes]);

  const maxX = Math.max(...nodes.map(n => n.x)) + MARGIN_X;
  const maxY = Math.max(...nodes.map(n => n.y)) + 100;
  const totalWidth = Math.max(maxX, 300);
  const totalHeight = Math.max(maxY, 300);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-sm font-semibold text-foreground mb-3">State Diagram</div>
      <div className="w-full overflow-auto custom-scroll">
        <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="w-full" style={{ maxHeight: 340, minHeight: 200 }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" className="fill-muted-foreground" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" className="fill-primary" />
            </marker>
            <filter id="glow-b">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Start arrow */}
          {(() => {
            const sn = nodeMap.get(definition.startState);
            if (!sn) return null;
            return (
              <g>
                <line x1={sn.x - NODE_R - 32} y1={sn.y} x2={sn.x - NODE_R - 4} y2={sn.y}
                  className="stroke-muted-foreground" strokeWidth="1.5" markerEnd="url(#arrow)" />
              </g>
            );
          })()}

          {/* Edges */}
          {edges.map(edge => {
            const src = nodeMap.get(edge.source);
            const tgt = nodeMap.get(edge.target);
            if (!src || !tgt) return null;
            const active = edge.transitionIds.includes(currentHighlightedTransition ?? '');

            if (edge.isSelf) {
              const d = selfLoopPath(src.x, src.y, NODE_R);
              const ly = src.y - NODE_R - 65;
              return (
                <g key={edge.id}>
                  <path d={d} fill="none" stroke={active ? 'hsl(var(--primary))' : 'hsl(var(--border))'} strokeWidth={active ? 2 : 1.5}
                    markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'} filter={active ? 'url(#glow-b)' : undefined} />
                  <rect x={src.x - 52} y={ly - 10} width={104} height={edge.labels.length * 14 + 6} rx="4"
                    fill="hsl(var(--card))" stroke={active ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))'} strokeWidth="1" />
                  {edge.labels.map((lbl, i) => (
                    <text key={i} x={src.x} y={ly + i * 14 + 2} textAnchor="middle" fontSize="9"
                      fill={active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} fontFamily="monospace">{lbl}</text>
                  ))}
                </g>
              );
            }

            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const curvature = src.x < tgt.x ? 55 : -55;
            const x1 = src.x + (dx / dist) * (NODE_R + 2);
            const y1 = src.y + (dy / dist) * (NODE_R + 2);
            const x2 = tgt.x - (dx / dist) * (NODE_R + 2);
            const y2 = tgt.y - (dy / dist) * (NODE_R + 2);
            const pathD = quadPath(x1, y1, x2, y2, curvature);
            const lmx = (x1 + x2) / 2;
            const lmy = (y1 + y2) / 2 - curvature - 4;

            return (
              <g key={edge.id}>
                <path d={pathD} fill="none" stroke={active ? 'hsl(var(--primary))' : 'hsl(var(--border))'} strokeWidth={active ? 2 : 1.5}
                  markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'} filter={active ? 'url(#glow-b)' : undefined} />
                <rect x={lmx - 52} y={lmy - 10} width={104} height={edge.labels.length * 13 + 6} rx="4"
                  fill="hsl(var(--card))" stroke={active ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))'} strokeWidth="1" />
                {edge.labels.map((lbl, i) => (
                  <text key={i} x={lmx} y={lmy + i * 13 + 2} textAnchor="middle" fontSize="9"
                    fill={active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} fontFamily="monospace">{lbl}</text>
                ))}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isActive = node.id === currentHighlightedState;
            const isFinal = definition.acceptStates.includes(node.id);
            return (
              <g key={node.id}>
                {isFinal && (
                  <circle cx={node.x} cy={node.y} r={NODE_R + 6} fill="none"
                    stroke={isActive ? 'hsl(var(--success))' : 'hsl(var(--success) / 0.3)'} strokeWidth="1.5" />
                )}
                <circle cx={node.x} cy={node.y} r={NODE_R}
                  fill={isActive ? 'hsl(var(--primary) / 0.15)' : 'hsl(var(--card))'}
                  stroke={isActive ? 'hsl(var(--primary))' : isFinal ? 'hsl(var(--success) / 0.3)' : 'hsl(var(--border))'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  filter={isActive ? 'url(#glow-b)' : undefined} />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold"
                  fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}>{node.id}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
