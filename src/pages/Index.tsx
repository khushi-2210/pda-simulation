import { PDAProvider } from '../context/PDAContext';
import InputTape from '../components/pda/InputTape';
import StackVisualization from '../components/pda/StackVisualization';
import SimulationLog from '../components/pda/SimulationLog';
import StateDiagram from '../components/pda/StateDiagram';
import PDADefinitionPanel from '../components/pda/PDADefinitionPanel';
import TransitionBuilder from '../components/pda/TransitionBuilder';
import SimulationPanel from '../components/pda/SimulationPanel';
import ExampleChips from '../components/pda/ExampleChips';

function PDASimulator() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Pushdown Automaton <span className="text-primary">Simulator</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define, visualize, and simulate pushdown automata step by step
        </p>
      </header>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Input tape + examples */}
        <InputTape />
        <ExampleChips />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Left: Definition + Transitions */}
          <div className="lg:col-span-4 space-y-4 overflow-y-auto custom-scroll pr-1">
            <PDADefinitionPanel />
            <TransitionBuilder />
          </div>

          {/* Center: Diagram + Simulation */}
          <div className="lg:col-span-5 space-y-4 overflow-y-auto custom-scroll pr-1">
            <StateDiagram />
            <SimulationPanel />
          </div>

          {/* Right: Stack + Log */}
          <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
            <StackVisualization />
            <div className="flex-1 min-h-0 flex flex-col">
              <SimulationLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <PDAProvider>
      <PDASimulator />
    </PDAProvider>
  );
}
