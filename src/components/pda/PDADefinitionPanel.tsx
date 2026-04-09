import { Settings } from 'lucide-react';
import { usePDA } from '../../context/PDAContext';

function parseList(val: string): string[] {
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

export default function PDADefinitionPanel() {
  const { state, dispatch } = usePDA();
  const { definition } = state;

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition-colors';

  function setField(key: string, val: string | string[]) {
    dispatch({ type: 'SET_DEFINITION', payload: { [key]: val } });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">PDA Definition</h2>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
            States (Q) <span className="normal-case font-normal">comma-separated</span>
          </label>
          <input type="text" className={inputClass} value={definition.states.join(', ')}
            onChange={e => setField('states', parseList(e.target.value))} placeholder="q0, q1, q2" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
            Input Alphabet (Σ)
          </label>
          <input type="text" className={inputClass} value={definition.inputAlphabet.join(', ')}
            onChange={e => setField('inputAlphabet', parseList(e.target.value))} placeholder="a, b" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
            Stack Alphabet (Γ)
          </label>
          <input type="text" className={inputClass} value={definition.stackAlphabet.join(', ')}
            onChange={e => setField('stackAlphabet', parseList(e.target.value))} placeholder="Z, A, B" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">Start State</label>
            <select className={inputClass} value={definition.startState}
              onChange={e => setField('startState', e.target.value)}>
              <option value="">--</option>
              {definition.states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">Stack Init</label>
            <input type="text" className={inputClass} value={definition.initialStackSymbol}
              onChange={e => setField('initialStackSymbol', e.target.value.trim())} placeholder="Z" maxLength={4} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 uppercase tracking-wide text-muted-foreground">
            Accept States
          </label>
          <input type="text" className={inputClass} value={definition.acceptStates.join(', ')}
            onChange={e => setField('acceptStates', parseList(e.target.value))} placeholder="q2" />
        </div>
        <div className="text-xs rounded-lg px-3 py-2 bg-muted/50 text-muted-foreground">
          ℹ️ ε means no input consumed or no stack condition required
        </div>
      </div>
    </div>
  );
}
