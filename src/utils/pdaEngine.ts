import { Transition, SimConfig, AcceptanceMode, PDADefinition } from '../types/pda';

const EPSILON = 'ε';
const MAX_CONFIGS = 64;
const MAX_STACK_DEPTH = 128;

export function getApplicableTransitions(
  config: SimConfig,
  transitions: Transition[]
): { transition: Transition; consumesInput: boolean }[] {
  const results: { transition: Transition; consumesInput: boolean }[] = [];
  const { state, remainingInput, stack } = config;
  const stackTop = stack.length > 0 ? stack[stack.length - 1] : EPSILON;
  const inputHead = remainingInput.length > 0 ? remainingInput[0] : EPSILON;

  for (const t of transitions) {
    if (t.fromState !== state) continue;
    const inputMatches = t.inputSymbol === EPSILON || t.inputSymbol === inputHead;
    const stackMatches = t.stackTop === EPSILON || t.stackTop === stackTop;
    if (inputMatches && stackMatches) {
      results.push({ transition: t, consumesInput: t.inputSymbol !== EPSILON });
    }
  }
  return results;
}

function applyTransition(
  config: SimConfig,
  transition: Transition,
  consumesInput: boolean
): SimConfig | null {
  const newStack = [...config.stack];
  if (transition.stackTop !== EPSILON) {
    if (newStack.length === 0) return null;
    newStack.pop();
  }
  const toPush = [...transition.stackPush].reverse();
  newStack.push(...toPush);
  if (newStack.length > MAX_STACK_DEPTH) return null;
  const newRemaining = consumesInput ? config.remainingInput.slice(1) : config.remainingInput;
  return {
    state: transition.toState,
    remainingInput: newRemaining,
    stack: newStack,
    history: [
      ...config.history,
      {
        state: config.state,
        remainingInput: config.remainingInput,
        stack: [...config.stack],
        appliedTransition: transition,
      },
    ],
    dead: false,
  };
}

export function isAccepted(config: SimConfig, definition: PDADefinition, mode: AcceptanceMode): boolean {
  if (config.remainingInput.length > 0) return false;
  if (mode === 'finalState') return definition.acceptStates.includes(config.state);
  return config.stack.length === 0;
}

export function stepAllConfigs(configs: SimConfig[], transitions: Transition[]): SimConfig[] {
  const nextConfigs: SimConfig[] = [];
  const seen = new Set<string>();
  for (const config of configs) {
    if (config.dead) continue;
    const applicable = getApplicableTransitions(config, transitions);
    if (applicable.length === 0) {
      nextConfigs.push({ ...config, dead: true });
      continue;
    }
    for (const { transition, consumesInput } of applicable) {
      const next = applyTransition(config, transition, consumesInput);
      if (!next) continue;
      const key = `${next.state}|${next.remainingInput}|${next.stack.join(',')}`;
      if (!seen.has(key)) {
        seen.add(key);
        nextConfigs.push(next);
      }
    }
  }
  return nextConfigs.slice(0, MAX_CONFIGS);
}

export function createInitialConfig(definition: PDADefinition): SimConfig {
  const initialStack = definition.initialStackSymbol ? [definition.initialStackSymbol] : [];
  return { state: definition.startState, remainingInput: '', stack: initialStack, history: [], dead: false };
}

export function transitionLabel(t: Transition): string {
  const input = t.inputSymbol || EPSILON;
  const stackTop = t.stackTop || EPSILON;
  const push = t.stackPush.length === 0 ? EPSILON : t.stackPush.join('');
  return `${input}, ${stackTop} → ${push}`;
}
