import React, { useState } from 'react';
import { Participant, Team } from '../types.ts';
import { Users, LayoutGrid, List, Shuffle, Settings2, Table } from 'lucide-react';

interface GroupModuleProps {
  participants: Participant[];
}

const GroupModule: React.FC<GroupModuleProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const generateTeams = () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const newTeams: Team[] = [];
    
    let currentTeamIndex = 0;
    while (shuffled.length > 0) {
      const teamMembers = shuffled.splice(0, groupSize);
      newTeams.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `第 ${currentTeamIndex + 1} 組`,
        members: teamMembers
      });
      currentTeamIndex++;
    }

    setTimeout(() => {
      setTeams(newTeams);
      setIsGenerating(false);
    }, 400);
  };

  const downloadCSV = () => {
    let csvContent = "\uFEFF組別名稱,姓名\n";
    teams.forEach(team => {
      team.members.forEach(member => {
        csvContent += `${team.name},${member.name}\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-8 md:items-center">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
              <Settings2 className="w-3 h-3" /> 每組預計人數
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max={Math.max(2, participants.length)}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
              />
              <span className="text-xl font-black text-indigo-600 w-10 text-center">{groupSize}</span>
            </div>
          </div>
          
          <button
            onClick={generateTeams}
            disabled={isGenerating || participants.length === 0}
            className="bg-indigo-600 text-white px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? '分組計算中...' : '開始自動分組'}
          </button>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewType('grid')}
            className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button
            onClick={downloadCSV}
            disabled={teams.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-emerald-600 disabled:opacity-30 transition-colors font-medium text-sm"
          >
            <Table className="w-4 h-4" />
            下載報表
          </button>
        </div>
      </div>

      {teams.length > 0 ? (
        <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4 max-w-2xl mx-auto"}>
          {teams.map((team, idx) => (
            <div 
              key={team.id} 
              className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200 
                ${isGenerating ? 'opacity-50 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="bg-indigo-50 px-4 py-3.5 border-b border-indigo-100 flex items-center justify-between">
                <h4 className="font-bold text-indigo-900 tracking-tight">{team.name}</h4>
                <span className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
                  {team.members.length} 人
                </span>
              </div>
              <ul className="p-4 space-y-2.5 bg-white">
                {team.members.map((member, mIdx) => (
                  <li key={member.id} className="flex items-center gap-3 text-sm text-slate-700 font-medium group">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                      {mIdx + 1}
                    </div>
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-3xl border-2 border-dashed border-slate-200 animate-pulse">
          <Users className="w-16 h-16 text-slate-100 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-300 tracking-wider">等待分組指令...</h3>
          <p className="text-slate-300 max-w-xs mx-auto mt-2 text-sm">設定完每組人數後，點擊「開始自動分組」按鈕。</p>
        </div>
      )}
    </div>
  );
};

export default GroupModule;