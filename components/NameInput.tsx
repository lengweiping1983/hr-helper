
import React, { useState, useMemo } from 'react';
import { Member } from '../types';

interface NameInputProps {
  onNamesSubmit: (names: Member[]) => void;
  initialNames: Member[];
}

const MOCK_NAMES = [
  "Alice Chen", "Bob Wang", "Charlie Lin", "Diana Chang", "Ethan Huang",
  "Fiona Liu", "George Wu", "Hannah Yeh", "Ian Hsu", "Jenny Tsai",
  "Kevin Kao", "Lily Pan", "Max Su", "Nina Chu", "Oscar Peng"
];

const NameInput: React.FC<NameInputProps> = ({ onNamesSubmit, initialNames }) => {
  const [inputText, setInputText] = useState(initialNames.map(n => n.name).join('\n'));

  const processedLines = useMemo(() => {
    return inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }, [inputText]);

  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    processedLines.forEach(name => {
      const lowerName = name.toLowerCase();
      if (seen.has(lowerName)) {
        dupes.add(lowerName);
      }
      seen.add(lowerName);
    });
    return dupes;
  }, [processedLines]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
      const processedNames = lines.map(line => line.split(',')[0].trim());
      setInputText(prev => (prev ? prev + '\n' : '') + processedNames.join('\n'));
    };
    reader.readAsText(file);
  };

  const loadMockData = () => {
    setInputText(MOCK_NAMES.join('\n'));
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const uniqueLines = processedLines.filter(name => {
      const lowerName = name.toLowerCase();
      if (seen.has(lowerName)) return false;
      seen.add(lowerName);
      return true;
    });
    setInputText(uniqueLines.join('\n'));
  };

  const handleSubmit = () => {
    const names = processedLines.map((n, i) => ({ id: `${Date.now()}-${i}`, name: n }));
    onNamesSubmit(names);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl mx-auto border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Set Up Your List</h2>
        <button 
          onClick={loadMockData}
          className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
        >
          Load Mock List
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Upload CSV or Text File
          </label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-medium text-slate-600">
              Paste Names (one per line)
            </label>
            {duplicates.size > 0 && (
              <div className="flex items-center gap-2 animate-fadeIn">
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded">
                  {duplicates.size} Duplicate(s) Found
                </span>
                <button 
                  onClick={removeDuplicates}
                  className="text-xs font-bold text-white bg-rose-500 px-2 py-1 rounded hover:bg-rose-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`w-full h-64 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-700 transition-colors ${
              duplicates.size > 0 ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
            }`}
            placeholder="John Doe&#10;Jane Smith&#10;Bob Johnson..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-lg shadow-indigo-100"
        >
          Confirm List ({processedLines.length} members)
        </button>
      </div>
    </div>
  );
};

export default NameInput;
