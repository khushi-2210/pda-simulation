import { PDADefinition } from '../types/pda';

let idCounter = 1;
function mkId() {
  return `t${idCounter++}`;
}

export interface SamplePDA {
  id: string; // ✅ added
  name: string;
  description: string;
  definition: PDADefinition;
  examples: { input: string; accepted: boolean }[];
}

export const SAMPLE_PDAS: SamplePDA[] = [
  {
    id: 'anbn',
    name: 'aⁿbⁿ Language',
    description: "Accepts strings of the form aⁿbⁿ (equal a's then b's)",
    definition: {
      states: ['q0', 'q1', 'q2'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z', 'A'],
      startState: 'q0',
      acceptStates: ['q2'],
      initialStackSymbol: 'Z',
      transitions: [
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'ε', toState: 'q0', stackPush: ['A'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'b', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'ε', stackTop: 'Z', toState: 'q2', stackPush: [] },
      ],
    },
    examples: [
      { input: 'aabb', accepted: true },
      { input: 'aaabbb', accepted: true },
      { input: 'ab', accepted: true },
      { input: 'ε', accepted: true },
      { input: 'aab', accepted: false },
      { input: 'abb', accepted: false },
    ],
  },

  {
    id: 'parentheses',
    name: 'Balanced Parentheses',
    description: 'Accepts strings of balanced ( ) pairs',
    definition: {
      states: ['q0', 'q1', 'q2'],
      inputAlphabet: ['(', ')'],
      stackAlphabet: ['Z', 'A'],
      startState: 'q0',
      acceptStates: ['q2'],
      initialStackSymbol: 'Z',
      transitions: [
        { id: mkId(), fromState: 'q0', inputSymbol: 'ε', stackTop: 'ε', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: '(', stackTop: 'ε', toState: 'q1', stackPush: ['A'] },
        { id: mkId(), fromState: 'q1', inputSymbol: ')', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'ε', stackTop: 'Z', toState: 'q2', stackPush: [] },
      ],
    },
    examples: [
      { input: '(())', accepted: true },
      { input: '()()', accepted: true },
      { input: '((()))', accepted: true },
      { input: '(', accepted: false },
      { input: '())', accepted: false },
    ],
  },

  {
    id: 'palindrome-even',
    name: 'Palindromes over {a,b}',
    description: 'Accepts even-length palindromes like abba, baab',
    definition: {
      states: ['q0', 'q1', 'q2'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z', 'A', 'B'],
      startState: 'q0',
      acceptStates: ['q2'],
      initialStackSymbol: 'Z',
      transitions: [
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'ε', toState: 'q0', stackPush: ['A'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'ε', toState: 'q0', stackPush: ['B'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'ε', stackTop: 'ε', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'a', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'b', stackTop: 'B', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'ε', stackTop: 'Z', toState: 'q2', stackPush: [] },
      ],
    },
    examples: [
      { input: 'abba', accepted: true },
      { input: 'baab', accepted: true },
      { input: 'aa', accepted: true },
      { input: 'abc', accepted: false },
    ],
  },

  {
    id: 'wwr',
    name: 'ww^R (Full Palindrome)',
    description: 'Accepts strings ww^R with center marker c',
    definition: {
      states: ['q0', 'q1', 'q2'],
      inputAlphabet: ['a', 'b', 'c'],
      stackAlphabet: ['Z', 'A', 'B'],
      startState: 'q0',
      acceptStates: ['q2'],
      initialStackSymbol: 'Z',
      transitions: [
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'ε', toState: 'q0', stackPush: ['A'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'ε', toState: 'q0', stackPush: ['B'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'c', stackTop: 'ε', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'a', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'b', stackTop: 'B', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'ε', stackTop: 'Z', toState: 'q2', stackPush: [] },
      ],
    },
    examples: [
      { input: 'abcba', accepted: true },
      { input: 'aacaa', accepted: true },
      { input: 'c', accepted: true },
      { input: 'abcab', accepted: false },
      { input: 'abc', accepted: false },
    ],
  },

  {
    id: 'a2n',
    name: 'aⁿb²ⁿ Language',
    description: "Accepts strings with twice as many b's as a's",
    definition: {
      states: ['q0', 'q1', 'q2'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z', 'A'],
      startState: 'q0',
      acceptStates: ['q2'],
      initialStackSymbol: 'Z',
      transitions: [
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'ε', toState: 'q0', stackPush: ['A', 'A'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'b', stackTop: 'A', toState: 'q1', stackPush: [] },
        { id: mkId(), fromState: 'q1', inputSymbol: 'ε', stackTop: 'Z', toState: 'q2', stackPush: [] },
      ],
    },
    examples: [
      { input: 'abb', accepted: true },
      { input: 'aabbbb', accepted: true },
      { input: 'ε', accepted: true },
      { input: 'aabb', accepted: false },
      { input: 'ab', accepted: false },
    ],
  },

  {
    id: 'equal-ab',
    name: "Equal a's and b's",
    description: "Accepts strings with equal number of a's and b's in any order",
    definition: {
      states: ['q0', 'q1'],
      inputAlphabet: ['a', 'b'],
      stackAlphabet: ['Z', 'A', 'B'],
      startState: 'q0',
      acceptStates: ['q1'],
      initialStackSymbol: 'Z',
      transitions: [
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'Z', toState: 'q0', stackPush: ['A', 'Z'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'A', toState: 'q0', stackPush: ['A', 'A'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'a', stackTop: 'B', toState: 'q0', stackPush: [] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'Z', toState: 'q0', stackPush: ['B', 'Z'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'B', toState: 'q0', stackPush: ['B', 'B'] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'b', stackTop: 'A', toState: 'q0', stackPush: [] },
        { id: mkId(), fromState: 'q0', inputSymbol: 'ε', stackTop: 'Z', toState: 'q1', stackPush: [] },
      ],
    },
    examples: [
      { input: 'aabb', accepted: true },
      { input: 'abab', accepted: true },
      { input: 'baba', accepted: true },
      { input: 'ε', accepted: true },
      { input: 'aab', accepted: false },
      { input: 'abb', accepted: false },
    ],
  },
];
