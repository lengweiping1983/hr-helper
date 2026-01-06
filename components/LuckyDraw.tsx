
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Member } from '../types';

interface LuckyDrawProps {
  members: Member[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ members }) => {
  const [remainingMembers, setRemainingMembers] = useState<Member[]>(members);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentName, setCurrentName] = useState<string>('???');
  const [winner, setWinner] = useState<Member | null>(null);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [history, setHistory] = useState<Member[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingMembers(members);
  }, [members]);

  const spin = useCallback(() => {
    if (remainingMembers.length === 0 && !allowRepeat) {
      alert("No more members left to draw!");
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    
    let startTime = Date.now();
    const duration = 2000; // 2 seconds spin

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const pool = allowRepeat ? members : remainingMembers;
      
      if (elapsed < duration) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        setCurrentName(pool[randomIndex]?.name || '???');
        timerRef.current = requestAnimationFrame(animate);
      } else {
        const finalPool = allowRepeat ? members : remainingMembers;
        const randomIndex = Math.floor(Math.random() * finalPool.length);
        const finalWinner = finalPool[randomIndex];
        
        setWinner(finalWinner);
        setCurrentName(finalWinner.name);
        setIsSpinning(false);

        if (!allowRepeat) {
          setRemainingMembers(prev => prev.filter(m => m.id !== finalWinner.id));
        }
        setHistory(prev => [finalWinner, ...prev]);
      }
    };

    timerRef.current = requestAnimationFrame(animate);
  }, [remainingMembers, members, allowRepeat]);

  const reset = () => {
    setRemainingMembers(members);
    setWinner(null);
    setCurrentName('???');
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Lucky Draw</h2>
        <p className="text-slate-500 mb-8">
          {allowRepeat ? 'Drawing from all members' : `${remainingMembers.length} members remaining`}
        </p>

        <div className="relative h-48 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mb-8 overflow-hidden">
          <div className={`text-5xl font-black transition-all duration-300 ${isSpinning ? 'text-indigo-400 scale-110' : winner ? 'text-indigo-600 scale-125' : 'text-slate-300'}`}>
            {currentName}
          </div>
          {winner && !isSpinning && (
            <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-2xl" />
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            disabled={isSpinning || (remainingMembers.length === 0 && !allowRepeat)}
            onClick={spin}
            className={`px-12 py-4 rounded-full text-xl font-bold transition-all shadow-lg ${
              isSpinning || (remainingMembers.length === 0 && !allowRepeat)
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105 active:scale-95'
            }`}
          >
            {isSpinning ? 'Spinning...' : 'Draw Winner!'}
          </button>
          
          <button
            onClick={reset}
            className="px-6 py-4 text-slate-500 font-medium hover:text-indigo-600 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowRepeat}
              onChange={(e) => setAllowRepeat(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="ml-2 text-slate-600 font-medium">Allow repeated winners</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Winners
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {history.length === 0 && <p className="text-slate-400 italic text-sm">No winners yet...</p>}
            {history.map((win, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-fadeIn">
                <span className="font-semibold text-slate-700">{win.name}</span>
                <span className="text-xs text-slate-400">Winner #{history.length - idx}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Remaining Pool ({remainingMembers.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 content-start">
            {remainingMembers.map(m => (
              <span key={m.id} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                {m.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
