import { usePDA } from '../../context/PDAContext';
import { SAMPLE_PDAS } from '../../utils/samplePDAs';

export default function ExampleChips() {
  const { state, dispatch } = usePDA();

  // Use explicit active sample tracking
  const currentSample = SAMPLE_PDAS.find(
    (s) => s.id === state.activeSampleId
  );

  // Hide if no sample selected (custom PDA mode)
  if (!currentSample || !currentSample.examples?.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-semibold">Try:</span>

      {currentSample.examples.map((ex, i) => (
        <button
          key={i}
          onClick={() => {
            dispatch({ type: 'RESET_SIMULATION' });
            dispatch({
              type: 'SET_INPUT_STRING',
              payload: ex.input === 'ε' ? '' : ex.input,
            });
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all hover:scale-105 ${
            ex.accepted
              ? 'border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10'
              : 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10'
          }`}
        >
          {ex.input || 'ε'}
          <span className="ml-1 text-[10px] opacity-60">
            {ex.accepted ? '✓' : '✗'}
          </span>
        </button>
      ))}
    </div>
  );
}