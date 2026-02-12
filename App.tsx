
import React, { useState, useCallback } from 'react';
import { AppTab, Participant } from './types';
import SourceInput from './components/SourceInput';
import DrawModule from './components/DrawModule';
import GroupModule from './components/GroupModule';
import { Users, Gift, ListPlus, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 標頭 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">HR 專業工具箱</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>已載入 {participants.length} 位參加者</span>
            </div>
          </div>
        </div>
      </header>

      {/* 導覽分頁 */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab(AppTab.INPUT)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === AppTab.INPUT
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <ListPlus className="w-4 h-4" />
              <span>名單管理</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.DRAW)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === AppTab.DRAW
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>獎品抽籤</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.GROUPING)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === AppTab.GROUPING
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>自動分組</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要內容區 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === AppTab.INPUT && (
          <SourceInput 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
            onNext={() => setActiveTab(AppTab.DRAW)}
          />
        )}
        {activeTab === AppTab.DRAW && (
          <DrawModule 
            participants={participants} 
            onUpdateParticipants={handleUpdateParticipants}
          />
        )}
        {activeTab === AppTab.GROUPING && (
          <GroupModule participants={participants} />
        )}
      </main>

      {/* 頁尾 */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} HR Pro Toolkit. 為您的工作效率而生。
        </div>
      </footer>
    </div>
  );
};

export default App;
