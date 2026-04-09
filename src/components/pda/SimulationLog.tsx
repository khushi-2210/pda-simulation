import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { usePDA } from '../../context/PDAContext';
import { transitionLabel } from '../../utils/pdaEngine';

export default function SimulationLog() {
  const { state } = usePDA();
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeConfig = state.configs.find(c => !c.dead);
  const history = activeConfig?.history ?? [];

  // Build step entries from history + current
  const steps = history.map((h, i) => ({
    index: i,
    state: h.state,
    remainingInput: h.remainingInput || 'ε',
    stack: h.stack,
    transition: h.appliedTransition,
  }));

  // Add current config as the latest step
  if (activeConfig && state.simulationStatus !== 'idle') {
    steps.push({
      index: steps.length,
      state: activeConfig.state,
      remainingInput: activeConfig.remainingInput || 'ε',
      stack: activeConfig.stack,
      transition: undefined,
    });
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps.length]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col flex-1 min-h-0">
      <div className="flex items-center gap-2 mb-3">
        <Terminal size={14} className="text-success" />
        <span className="text-sm font-semibold text-foreground">Simulation Log</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {steps.length} step{steps.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1 custom-scroll">
        <AnimatePresence initial={false}>
          {steps.map((step, idx) => (
            <motion.div
              key={step.index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`rounded-lg p-3 border text-xs transition-all ${
                idx === steps.length - 1
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/20 border-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-muted-foreground font-mono">Step {step.index}</span>
              </div>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-12 flex-shrink-0">State:</span>
                  <span className="text-primary font-mono font-semibold">{step.state}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-12 flex-shrink-0">Input:</span>
                  <span className="text-foreground font-mono">{step.remainingInput}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-12 flex-shrink-0">Stack:</span>
                  <span className="text-secondary-foreground font-mono">[{step.stack.join(', ')}]</span>
                </div>
              </div>
              {step.transition && (
                <div className="mt-2 pt-2 border-t border-border">
                  <span className="text-success font-mono text-[10px]">
                    → {transitionLabel(step.transition)}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
