import { motion } from 'framer-motion';
import { usePDA } from '../../context/PDAContext';

export default function InputTape() {
  const { state } = usePDA();
  const { inputString, simulationStatus, configs } = state;

  const fullInput = inputString || '';
  const chars = fullInput.split('');
  const activeConfig = configs.find(c => !c.dead);
  const remaining = activeConfig?.remainingInput ?? fullInput;
  const consumed = simulationStatus !== 'idle' ? chars.length - remaining.length : 0;

  const accepted = simulationStatus === 'accepted' ? true : simulationStatus === 'rejected' ? false : null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Input Tape</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            {consumed} / {chars.length} consumed
          </span>
          {accepted !== null && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                accepted
                  ? 'bg-success/10 text-success border border-success/30'
                  : 'bg-destructive/10 text-destructive border border-destructive/30'
              }`}
            >
              {accepted ? 'Accepted' : 'Rejected'}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1 min-h-[56px] custom-scroll">
        {chars.length === 0 ? (
          <div className="flex items-center justify-center w-full">
            <div className="border border-dashed border-border rounded-lg px-6 py-2">
              <span className="font-mono text-muted-foreground text-sm">ε (empty string)</span>
            </div>
          </div>
        ) : (
          <>
            {chars.map((ch, i) => {
              const isConsumed = i < consumed;
              const isCurrent = i === consumed && simulationStatus !== 'idle';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-lg border font-mono text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                    isConsumed
                      ? 'bg-muted/40 border-border text-muted-foreground/50'
                      : isCurrent
                      ? 'bg-primary/15 border-primary text-primary shadow-[var(--glow-primary)]'
                      : 'bg-card border-border text-foreground'
                  }`}
                >
                  {ch}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                  )}
                  {isConsumed && (
                    <span className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-lg">
                      ✕
                    </span>
                  )}
                </motion.div>
              );
            })}
            {consumed >= chars.length && chars.length > 0 && simulationStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-dashed border-border text-muted-foreground font-mono text-xs flex-shrink-0"
              >
                END
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
