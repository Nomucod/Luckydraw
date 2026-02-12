import React, { useState, useEffect, useRef } from 'react';
import { Participant, DrawWinner } from '../types.ts';
import { Trophy, History, Settings, RotateCcw, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrawModuleProps {
  participants: Participant[];
  onUpdateParticipants: (list: Participant[]) => void;
}

const DrawModule: React.FC<DrawModuleProps> = ({ participants, onUpdateParticipants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [history, setHistory] = useState<DrawWinner[]>([]);
  const [duplicateDraw, setDuplicateDraw] = useState(false);
  const [tempName, setTempName] = useState<string>("準備好了嗎？");
  const [prizeName, setPrizeName] = useState("");
  
  const timerRef = useRef<number | null>(null);

  const startDraw = () => {
    if (participants.length === 0) return;
    if (isDrawing) return;

    setIsDrawing(true);
    setWinner(null);

    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setTempName(participants[randomIndex].name);
        timerRef.current = window.setTimeout(animate, 60 + (elapsed / duration) * 100);
      } else {
        finishDraw();
      }
    };

    animate();
  };

  const finishDraw = () => {
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const selected = participants[winnerIndex];
    
    setWinner(selected);
    setIsDrawing(false);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#fbbf24', '#ef4444', '#a855f7']
    });

    const newWinnerEntry: DrawWinner = {
      ...selected,
      prize: prizeName || "幸運大獎",
      timestamp: Date.now(),
    };
    
    setHistory([newWinnerEntry, ...history]);

    if (!duplicateDraw) {
      onUpdateParticipants(participants.filter(p => p.id !== selected.id));
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

          <div className="z-10 text-center space-y-8 w-full">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              幸運之星即將揭曉
            </div>

            <div className="relative h-32 flex items-center justify-center">
              {isDrawing ? (
                <div className="text-6xl md:text-8xl font-black text-indigo-600 tracking-tight">
                  {tempName}
                </div>
              ) : winner ? (
                <div className="flex flex-col items-center animate-in zoom-in-50 duration-300">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">得獎者是</div>
                  <div className="text-6xl md:text-8xl font-black text-emerald-600 drop-shadow-md">
                    {winner.name}
                  </div>
                </div>
              ) : (
                <div className="text-6xl md:text-8xl font-black text-slate-100 uppercase tracking-tighter">
                  誰會中獎？
                </div>
              )}
            </div>

            <div className="max-w-xs mx-auto space-y-4 pt-10">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="輸入獎項名稱 (例如：百貨禮券)"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  className="w-full p-4 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm text-center font-medium transition-all"
                />
              </div>
              <button
                disabled={isDrawing || participants.length === 0}
                onClick={startDraw}
                className={`w-full py-5 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-xl transition-all shadow-xl
                  ${isDrawing || participants.length === 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.03] active:scale-95 shadow-indigo-200'}`}
              >
                {isDrawing ? "抽籤中..." : <><Play className="w-6 h-6 fill-current" />開始抽籤</>}
              </button>
            </div>
            
            <p className="text-xs text-slate-400 font-medium">
              名單中還有 {participants.length} 位參加者
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            抽籤設定
          </h3>
          <div className="flex flex-wrap gap-4">
             <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={duplicateDraw}
                  onChange={(e) => setDuplicateDraw(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">允許重複抽中 (不移出名單)</span>
            </label>
            <button 
              onClick={() => { if(window.confirm("確定要重設得獎紀錄嗎？")) setHistory([]); }}
              className="text-sm text-slate-400 hover:text-red-500 flex items-center gap-1 ml-auto font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              清除中獎紀錄
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              得獎者名冊
            </h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {history.length}
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-16 text-slate-300">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-10" />
                <p className="text-sm font-medium">尚無得獎紀錄</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((win) => (
                  <div key={`${win.id}-${win.timestamp}`} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-indigo-300 hover:bg-white transition-all duration-300">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{win.name}</div>
                      <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-0.5">{win.prize}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-mono">
                      {new Date(win.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawModule;