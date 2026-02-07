import React, { useState, useEffect } from 'react';
import { DEFAULT_INPUTS } from './constants';
import { Inputs, SimulationResult } from './types';
import { calculateTCO } from './utils/calculations';
import { InputPanel } from './components/InputPanel';
import { Dashboard } from './components/Dashboard';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { SLADetailedAnalysisModal } from './components/SLADetailedAnalysisModal';
import { PrintableReport } from './components/PrintableReport';
import { Activity, Download } from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<SimulationResult>(calculateTCO(DEFAULT_INPUTS));
  const [showSlaModal, setShowSlaModal] = useState(false);

  // Recalculate whenever inputs change
  useEffect(() => {
    setResults(calculateTCO(inputs));
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- INTERACTIVE UI (Hidden during print) --- */}
      <div className="print:hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-900">CloudArchitect<span className="text-indigo-600">.ai</span></h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">TCO & ROI 模拟器</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                  v1.0
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Download size={16} />
                导出报告
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Sidebar: Controls - Adjusted to remove scrollbar */}
            <div className="xl:col-span-3 xl:border-r xl:border-slate-200 xl:pr-6">
              <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">配置参数</h2>
              </div>
              <InputPanel 
                  inputs={inputs} 
                  setInputs={setInputs} 
              />
            </div>

            {/* Right Content: Visualization */}
            <div className="xl:col-span-9 space-y-8">
              <Dashboard 
                  results={results} 
                  inputs={inputs} 
                  onOpenSlaAnalysis={() => setShowSlaModal(true)} 
              />
              <ExecutiveSummary results={results} inputs={inputs} />
            </div>

          </div>
        </main>

        {/* SLA Modal Overlay */}
        {showSlaModal && (
          <SLADetailedAnalysisModal inputs={inputs} onClose={() => setShowSlaModal(false)} />
        )}

        <footer className="border-t border-slate-200 mt-12 py-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Cloud Architect Consulting. 专为云战略分析生成。</p>
        </footer>
      </div>

      {/* --- PRINT ONLY REPORT --- */}
      <PrintableReport inputs={inputs} results={results} />
      
    </div>
  );
};

export default App;