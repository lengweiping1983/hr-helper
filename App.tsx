
import React, { useState } from 'react';
import NameInput from './components/NameInput';
import LuckyDraw from './components/LuckyDraw';
import GroupingTool from './components/GroupingTool';
import { Member, AppMode } from './types';

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.SETUP);

  const handleNamesSubmit = (newNames: Member[]) => {
    setMembers(newNames);
    if (newNames.length > 0) {
      setMode(AppMode.DRAW);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">HR <span className="text-indigo-600">TOOLBOX</span></h1>
            </div>

            <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setMode(AppMode.SETUP)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === AppMode.SETUP ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List Input
              </button>
              <button
                onClick={() => setMode(AppMode.DRAW)}
                disabled={members.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === AppMode.DRAW ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                } disabled:opacity-50`}
              >
                Lucky Draw
              </button>
              <button
                onClick={() => setMode(AppMode.GROUPING)}
                disabled={members.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === AppMode.GROUPING ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                } disabled:opacity-50`}
              >
                Team Grouping
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {mode === AppMode.SETUP && (
            <NameInput onNamesSubmit={handleNamesSubmit} initialNames={members} />
          )}

          {mode === AppMode.DRAW && (
            <LuckyDraw members={members} />
          )}

          {mode === AppMode.GROUPING && (
            <GroupingTool members={members} />
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-500 text-sm">
          <div>
            Active Members: <span className="font-bold text-slate-800">{members.length}</span>
          </div>
          <div className="flex gap-4">
             <span className="flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               AI Assistant Ready
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
