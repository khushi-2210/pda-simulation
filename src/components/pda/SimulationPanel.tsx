import { useEffect, useRef, useState } from 'react';
import { Play, SkipForward, RotateCcw, CheckCircle, XCircle, Clock, FastForward, BookOpen } from 'lucide-react';
import { usePDA } from '../../context/PDAContext';
import { transitionLabel } from '../../utils/pdaEngine';
import { SAMPLE_PDAS } from '../../utils/samplePDAs';

export default function SimulationPanel() {
  const { state, dispatch } = usePDA();
  const { inputString, simulationStatus, configs, stepIndex, acceptanceMode } = state;

  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [autoRun, setAutoRun] = useState(false);

  useEffect(() => {
    if (autoRun && simulationStatus === 'running') {
      autoRef.current = setInterval(() => dispatch({ type: 'STEP_FORWARD' }), 600);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoRun, simulationStatus, dispatch]);

  useEffect(() => {
    if (simulationStatus !== 'running') setAutoRun(false);
  }, [simulationStatus]);

  const activeConfigs = configs.filter(c => !c.dead);
  const lastApplied = activeConfigs[0]?.history.at(-1)?.appliedTransition;

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition-colors';

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h2 className="font-semibold text-sm text-foreground">Simulation</h2>

      {/* 🔥 FIXED SAMPLE LOADER */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
          Load Sample PDA
        </label>

        <div className="flex gap-2 flex-wrap">
          {SAMPLE_PDAS.map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                // reset everything first
                dispatch({ type: 'RESET_SIMULATION' });

                // load full definition
                dispatch({
                  type: 'SET_DEFINITION',
                  payload: sample.definition,
                });

                // 🔥 IMPORTANT: load transitions
                dispatch({
                  type: 'SET_TRANSITIONS',
                  payload: sample.definition.transitions,
                });

                // track active sample
                dispatch({
                  type: 'SET_ACTIVE_SAMPLE',
                  payload: sample.id,
                });
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-border bg-muted text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <BookOpen className="w-3 h-3" />
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
          Input String
        </label>
        <input
          type="text"
          className={inputClass}
          value={inputString}
          onChange={e =>
            dispatch({ type: 'SET_INPUT_STRING', payload: e.target.value })
          }
          placeholder="Enter input string..."
          disabled={simulationStatus !== 'idle'}
        />
      </div>

      {/* Acceptance mode */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
          Acceptance Mode
        </label>
        <div className="flex gap-2">
          {(['finalState', 'emptyStack'] as const).map(mode => (
            <button
              key={mode}
              onClick={() =>
                dispatch({ type: 'SET_ACCEPTANCE_MODE', payload: mode })
              }
              disabled={simulationStatus !== 'idle'}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                acceptanceMode === mode
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
              }`}
            >
              {mode === 'finalState' ? 'Final State' : 'Empty Stack'}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        {simulationStatus === 'idle' ? (
          <button
            onClick={() => dispatch({ type: 'START_SIMULATION' })}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" /> Start
          </button>
        ) : (
          <>
            <button
              onClick={() => dispatch({ type: 'STEP_FORWARD' })}
              disabled={simulationStatus !== 'running'}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                simulationStatus === 'running'
                  ? 'bg-primary hover:bg-primary/80 text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <SkipForward className="w-4 h-4" /> Step
            </button>

            <button
              onClick={() => setAutoRun(a => !a)}
              disabled={simulationStatus !== 'running'}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRun
                  ? 'bg-destructive hover:bg-destructive/80 text-destructive-foreground'
                  : simulationStatus === 'running'
                  ? 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <FastForward className="w-4 h-4" /> {autoRun ? 'Pause' : 'Auto'}
            </button>

            <button
              onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Status */}
      {simulationStatus === 'accepted' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/30">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">
            Accepted {acceptanceMode === 'finalState' ? 'by final state' : 'by empty stack'}
          </span>
        </div>
      )}

      {simulationStatus === 'rejected' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30">
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Rejected</span>
        </div>
      )}

      {simulationStatus === 'running' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Step {stepIndex} — {activeConfigs.length} active path{activeConfigs.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Current config */}
      {simulationStatus !== 'idle' && activeConfigs.length > 0 && (
        <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/30">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Current Configuration
          </div>

          <div className="flex gap-3 flex-wrap text-sm">
            <div>
              <div className="text-xs text-muted-foreground">State</div>
              <div className="font-mono font-bold text-primary">{activeConfigs[0].state}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Remaining</div>
              <div className="font-mono text-foreground">
                {activeConfigs[0].remainingInput || <em className="opacity-50 text-xs">empty</em>}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Stack top</div>
              <div className="font-mono text-foreground">
                {activeConfigs[0].stack.at(-1) ?? <em className="opacity-50 text-xs">empty</em>}
              </div>
            </div>
          </div>

          {lastApplied && (
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Applied: </span>
              {transitionLabel(lastApplied)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
