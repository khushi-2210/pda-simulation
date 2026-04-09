import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import { usePDA } from '../../context/PDAContext';

export default function StackVisualization() {
  const { state } = usePDA();
  const activeConfig = state.configs.find(c => !c.dead);
  const stack = activeConfig ? [...activeConfig.stack].reverse() : [];

  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Layers size={14} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">Stack</span>
        <span className="text-xs text-muted-foreground ml-auto">{stack.length} item{stack.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[180px]">
        {stack.length === 0 ? (
          <div className="text-muted-foreground text-sm font-mono">empty</div>
        ) : (
          <div className="w-full flex flex-col items-center gap-1.5">
            <div className="text-xs text-muted-foreground tracking-widest uppercase mb-1">TOP</div>
            <AnimatePresence mode="popLayout">
              {stack.map((symbol, i) => {
                const isTop = i === 0;
                return (
                  <motion.div
                    key={`${symbol}-${i}`}
                    initial={{ opacity: 0, y: -16, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.88 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`w-full max-w-[160px] flex items-center justify-center py-2.5 px-4 rounded-lg border font-mono font-bold text-base transition-all duration-200 ${
                      isTop
                        ? 'bg-primary/15 border-primary text-primary shadow-[var(--glow-primary)]'
                        : 'bg-muted/40 border-border text-muted-foreground'
                    }`}
                  >
                    {symbol}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">BOTTOM</div>
          </div>
        )}
      </div>
    </div>
  );
}
