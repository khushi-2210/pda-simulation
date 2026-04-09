import { useState } from 'react';
import { Plus, Trash2, ArrowRight, Table } from 'lucide-react';
import { usePDA } from '../../context/PDAContext';
import { Transition } from '../../types/pda';

const EPSILON = 'ε';

function genId() {
  return `t${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function describeStackOp(t: Transition): string {
  const pops = t.stackTop !== EPSILON;
  const pushes = t.stackPush.length > 0;
  if (pops && pushes) return `Pop(${t.stackTop}) → Push(${t.stackPush.join('')})`;
  if (pops && !pushes) return `Pop(${t.stackTop})`;
  if (!pops && pushes) return `Push(${t.stackPush.join('')})`;
  return 'No-op';
}

export default function TransitionBuilder() {
  const { state, dispatch } = usePDA();
  const { transitions, definition } = state;
  const states = definition.states.length > 0 ? definition.states : ['q0'];

  const [newT, setNewT] = useState<Omit<Transition, 'id'>>({
    fromState: states[0],
    inputSymbol: EPSILON,
    stackTop: EPSILON,
    toState: states[0],
    stackPush: [],
  });

  const cellClass = 'px-2 py-1.5 rounded border border-border bg-muted text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full';
  const selectClass = 'px-2 py-1.5 rounded-lg border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary';
  const inputSmClass = 'px-2 py-1.5 rounded-lg border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary w-16';

  function handleAdd() {
    dispatch({ type: 'ADD_TRANSITION', payload: { ...newT, id: genId() } });
  }

  function handlePushChange(val: string) {
    if (val === EPSILON || val === '') setNewT(p => ({ ...p, stackPush: [] }));
    else setNewT(p => ({ ...p, stackPush: val.split('').filter(Boolean) }));
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Table className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">Transitions</h2>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{transitions.length}</span>
      </div>

      {/* Add new transition */}
      <div className="rounded-lg border border-border mb-3 overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 p-2">
          <span className="text-xs font-medium text-muted-foreground">Add:</span>
          <select className={selectClass} value={newT.fromState}
            onChange={e => setNewT(p => ({ ...p, fromState: e.target.value }))}>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-muted-foreground text-xs">,</span>
          <input className={inputSmClass} value={newT.inputSymbol}
            onChange={e => setNewT(p => ({ ...p, inputSymbol: e.target.value || EPSILON }))}
            placeholder="ε" maxLength={2} />
          <span className="text-muted-foreground text-xs">,</span>
          <input className={inputSmClass} value={newT.stackTop}
            onChange={e => setNewT(p => ({ ...p, stackTop: e.target.value || EPSILON }))}
            placeholder="ε" maxLength={2} />
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <select className={selectClass} value={newT.toState}
            onChange={e => setNewT(p => ({ ...p, toState: e.target.value }))}>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="text-muted-foreground text-xs">,</span>
          <input className={inputSmClass} value={newT.stackPush.join('')}
            onChange={e => handlePushChange(e.target.value)} placeholder="ε" maxLength={6} />
          <button onClick={handleAdd}
            className="ml-1 p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-2 pb-2">
          <span className="text-[10px] text-muted-foreground">Format: state, input, stackTop → state, push (ε = epsilon)</span>
        </div>
      </div>

      {/* Transition table */}
      {transitions.length > 0 && (
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">From</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Input</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stack</th>
                <th className="px-1 py-2"></th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">To</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Push</th>
                <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Op</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {transitions.map(t => (
                <tr key={t.id} className={`border-b border-border/50 transition-colors ${
                  state.currentHighlightedTransition === t.id ? 'bg-primary/10' : ''
                }`}>
                  <td className="px-2 py-1.5">
                    <select className={cellClass} value={t.fromState}
                      onChange={e => dispatch({ type: 'UPDATE_TRANSITION', payload: { ...t, fromState: e.target.value } })}>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input className={cellClass} value={t.inputSymbol}
                      onChange={e => dispatch({ type: 'UPDATE_TRANSITION', payload: { ...t, inputSymbol: e.target.value || EPSILON } })}
                      maxLength={2} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input className={cellClass} value={t.stackTop}
                      onChange={e => dispatch({ type: 'UPDATE_TRANSITION', payload: { ...t, stackTop: e.target.value || EPSILON } })}
                      maxLength={2} />
                  </td>
                  <td className="px-1 py-1.5 text-center">
                    <ArrowRight className="w-3 h-3 mx-auto text-muted-foreground" />
                  </td>
                  <td className="px-2 py-1.5">
                    <select className={cellClass} value={t.toState}
                      onChange={e => dispatch({ type: 'UPDATE_TRANSITION', payload: { ...t, toState: e.target.value } })}>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input className={cellClass} value={t.stackPush.length === 0 ? EPSILON : t.stackPush.join('')}
                      onChange={e => {
                        const val = e.target.value;
                        const push = val === EPSILON || val === '' ? [] : val.split('').filter(Boolean);
                        dispatch({ type: 'UPDATE_TRANSITION', payload: { ...t, stackPush: push } });
                      }} maxLength={6} />
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{describeStackOp(t)}</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <button onClick={() => dispatch({ type: 'DELETE_TRANSITION', payload: t.id })}
                      className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
