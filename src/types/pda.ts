export interface Transition {
  id: string;
  fromState: string;
  inputSymbol: string;
  stackTop: string;
  toState: string;
  stackPush: string[];
}

export type AcceptanceMode = 'finalState' | 'emptyStack';

export interface StepRecord {
  state: string;
  remainingInput: string;
  stack: string[];
  appliedTransition?: Transition;
}

export interface SimConfig {
  state: string;
  remainingInput: string;
  stack: string[];
  history: StepRecord[];
  dead: boolean;
}

export interface PDADefinition {
  states: string[];
  inputAlphabet: string[];
  stackAlphabet: string[];
  startState: string;
  acceptStates: string[];
  initialStackSymbol: string;
  transitions: Transition[];
}

export type SimulationStatus = 'idle' | 'running' | 'accepted' | 'rejected';

export interface PDAState {
  definition: PDADefinition;
  transitions: Transition[];
  inputString: string;
  acceptanceMode: AcceptanceMode;
  simulationStatus: SimulationStatus;
  configs: SimConfig[];
  stepIndex: number;
  currentHighlightedState: string | null;
  currentHighlightedTransition: string | null;
}
