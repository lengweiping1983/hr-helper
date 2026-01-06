
import React, { useState } from 'react';
import { Member, Group } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface GroupingToolProps {
  members: Member[];
}

const GroupingTool: React.FC<GroupingToolProps> = ({ members }) => {
  const [membersPerGroup, setMembersPerGroup] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState("Corporate Innovation");

  const generateGroups = async () => {
    if (members.length === 0) return;
    setIsGenerating(true);

    const shuffled = [...members].sort(() => Math.random() - 0.5);
    const numGroups = Math.ceil(members.length / membersPerGroup);
    
    const teamNames = await generateTeamNames(numGroups, theme);

    const newGroups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: teamNames[i] || `Team ${i + 1}`,
        members: shuffled.slice(i * membersPerGroup, (i + 1) * membersPerGroup)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Team Name,Member Name\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        // Escape commas in names if any
        const escapedMemberName = `"${member.name.replace(/"/g, '""')}"`;
        const escapedGroupName = `"${group.name.replace(/"/g, '""')}"`;
        csvContent += `${escapedGroupName},${escapedMemberName}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hr_toolbox_groups_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Team Formation</h2>
          {groups.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Results (.csv)
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Members per Group</label>
            <input
              type="number"
              min="1"
              max={members.length}
              value={membersPerGroup}
              onChange={(e) => setMembersPerGroup(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Team Name Theme (AI Generated)</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Galactic Explorers, Zen Warriors..."
            />
          </div>
          <button
            onClick={generateGroups}
            disabled={isGenerating || members.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition duration-200 disabled:bg-slate-300 shadow-md"
          >
            {isGenerating ? 'Generating...' : 'Form Teams'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, idx) => (
          <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group transition-all hover:shadow-md animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
              <h3 className="text-white font-bold text-lg truncate">{group.name}</h3>
              <p className="text-indigo-100 text-xs">{group.members.length} members</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {group.members.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-700 font-medium">{member.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && !isGenerating && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Set your group size and click "Form Teams" to visualize results.</p>
        </div>
      )}
    </div>
  );
};

export default GroupingTool;
