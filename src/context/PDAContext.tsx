import React, { createContext, useContext, useReducer } from 'react';
import {
  PDAState,
  PDADefinition,
  Transition,
  AcceptanceMode,
  SimConfig,
  SimulationStatus,
} from '../types/pda';
import {
  stepAllConfigs,
  createInitialConfig,
  isAccepted,
} from '../utils/pdaEngine';
import { SamplePDA } from '../utils/samplePDAs';

type Action =
  | { type: 'SET_DEFINITION'; payload: Partial<PDADefinition> }
  | { type: 'SET_TRANSITIONS'; payload: Transition[] } // ✅ added
  | { type: 'ADD_TRANSITION'; payload: Transition }
  | { type: 'UPDATE_TRANSITION'; payload: Transition }
  | { type: 'DELETE_TRANSITION'; payload: string }
  | { type: 'SET_INPUT_STRING'; payload: string }
  | { type: 'SET_ACCEPTANCE_MODE'; payload: AcceptanceMode }
  | { type: 'SET_ACTIVE_SAMPLE'; payload: string | null } // ✅ added
  | { type: 'START_SIMULATION' }
  | { type: 'STEP_FORWARD' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'LOAD_SAMPLE'; payload: SamplePDA };

const defaultDefinition: PDADefinition = {
  states: ['q0', 'q1'],
  inputAlphabet: ['a', 'b'],
  stackAlphabet: ['Z', 'A'],
  startState: 'q0',
  acceptStates: ['q1'],
  initialStackSymbol: 'Z',
  transitions: [],
};

const initialState: PDAState = {
  definition: defaultDefinition,
  transitions: [],
  inputString: '',
  acceptanceMode: 'finalState',
  simulationStatus: 'idle',
  configs: [],
  stepIndex: 0,
  currentHighlightedState: null,
  currentHighlightedTransition: null,
  activeSampleId: null,
};

function checkAcceptance(
  configs: SimConfig[],
  definition: PDADefinition,
  mode: AcceptanceMode
): SimulationStatus {
  const alive = configs.filter(c => !c.dead);
  if (alive.some(c => isAccepted(c, definition, mode))) return 'accepted';
  if (alive.length === 0) return 'rejected';
  return 'running';
}

function reducer(state: PDAState, action: Action): PDAState {
  switch (action.type) {
    case 'SET_DEFINITION':
      return {
        ...state,
        definition: { ...state.definition, ...action.payload },
        activeSampleId: null, // ✅ clear sample when user edits
      };

    case 'SET_TRANSITIONS':
      return {
        ...state,
        transitions: action.payload,
      };

    case 'ADD_TRANSITION':
      return {
        ...state,
        transitions: [...state.transitions, action.payload],
        activeSampleId: null, // ✅ user edited
      };

    case 'UPDATE_TRANSITION':
      return {
        ...state,
        transitions: state.transitions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        activeSampleId: null,
      };

    case 'DELETE_TRANSITION':
      return {
        ...state,
        transitions: state.transitions.filter(t => t.id !== action.payload),
        activeSampleId: null,
      };

    case 'SET_INPUT_STRING':
      return { ...state, inputString: action.payload };

    case 'SET_ACCEPTANCE_MODE':
      return { ...state, acceptanceMode: action.payload };

    case 'SET_ACTIVE_SAMPLE':
      return {
        ...state,
        activeSampleId: action.payload,
      };

    case 'START_SIMULATION': {
      const initial = createInitialConfig(state.definition);
      const startConfig: SimConfig = {
        ...initial,
        remainingInput: state.inputString,
      };

      const status = checkAcceptance(
        [startConfig],
        state.definition,
        state.acceptanceMode
      );

      return {
        ...state,
        simulationStatus: status === 'running' ? 'running' : status,
        configs: [startConfig],
        stepIndex: 0,
        currentHighlightedState: state.definition.startState,
        currentHighlightedTransition: null,
      };
    }

    case 'STEP_FORWARD': {
      if (state.simulationStatus !== 'running') return state;

      const next = stepAllConfigs(state.configs, state.transitions);
      const status = checkAcceptance(
        next,
        state.definition,
        state.acceptanceMode
      );

      const active = next.find(c => !c.dead);
      const lastTrans = active?.history.at(-1)?.appliedTransition ?? null;

      return {
        ...state,
        configs: next,
        stepIndex: state.stepIndex + 1,
        simulationStatus: status,
        currentHighlightedState: active?.state ?? null,
        currentHighlightedTransition: lastTrans?.id ?? null,
      };
    }

    case 'RESET_SIMULATION':
      return {
        ...state,
        simulationStatus: 'idle',
        configs: [],
        stepIndex: 0,
        currentHighlightedState: null,
        currentHighlightedTransition: null,
      };

    case 'LOAD_SAMPLE': {
      const { definition, id } = action.payload;

      return {
        ...state,
        definition,
        transitions: definition.transitions, // ✅ important
        simulationStatus: 'idle',
        configs: [],
        stepIndex: 0,
        currentHighlightedState: null,
        currentHighlightedTransition: null,
        inputString: '',
        activeSampleId: id, // ✅ track sample
      };
    }

    default:
      return state;
  }
}

interface PDAContextValue {
  state: PDAState;
  dispatch: React.Dispatch<Action>;
}

const PDAContext = createContext<PDAContextValue | null>(null);

export function PDAProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PDAContext.Provider value={{ state, dispatch }}>
      {children}
    </PDAContext.Provider>
  );
}

export function usePDA() {
  const ctx = useContext(PDAContext);
  if (!ctx) throw new Error('usePDA must be used inside PDAProvider');
  return ctx;
}