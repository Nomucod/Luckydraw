import React, { useState, useMemo } from 'react';
import { Participant } from '../types.ts';
import { Upload, Trash2, UserPlus, CheckCircle2, AlertCircle, Users, Copy, Eraser, FileText } from 'lucide-react';

interface SourceInputProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onNext: () => void;
}

const SourceInput: React.FC<SourceInputProps> = ({ participants, onUpdate, onNext }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return counts;
  }, [participants]);

  const processInput = (text: string) => {
    const names = text
      .split(/[\n,，\t]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newParticipants: Participant[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      name
    }));

    if (newParticipants.length === 0) {
      setError("請輸入至少一個有效的姓名。");
      return;
    }

    onUpdate([...participants, ...newParticipants]);
    setInputText('');
    setError(null);
  };

  const loadMockData = () => {
    const mockNames = [
      "王小明", "李美玲", "張博宇", "陳志豪", "林佳蓉", 
      "黃雅婷", "劉子豪", "周杰倫", "趙心怡", "吳柏翰",
      "蔡宗佑", "蘇美雲", "曾文鼎", "郭雪芙", "許名傑",
      "鄭進一", "孫芸芸", "謝霆鋒"
    ];
    const newParticipants: Participant[] = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9) + Math.random(),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
    setError(null);
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const filtered = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(filtered);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processInput(content);
    };
    reader.onerror = () => setError("讀取檔案失敗。");
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearList = () => {
    if (window.confirm("確定要清空整份名單嗎？")) {
      onUpdate([]);
    }
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const duplicateCount = Array.from(duplicates.values()).filter((c: any) => c > 1).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              新增參加者
            </h2>
            <button
              onClick={loadMockData}
              className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              載入範例名單
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                貼上姓名（使用換行或逗號分隔）
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="王小明&#10;李美玲&#10;張博宇"
                className="w-full h-40 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
              />
            </div>
            
            <button
              onClick={() => processInput(inputText)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              加入名單
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 font-medium tracking-widest">或</span>
              </div>
            </div>

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <Upload className="w-8 h-8 mb-2 text-slate-400" />
                  <p className="mb-1 text-sm text-slate-500"><span className="font-semibold text-indigo-600">點擊上傳</span> 或 拖放至此</p>
                  <p className="text-xs text-slate-400">支援 CSV 或純文字檔</p>
                </div>
                <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              目前名單 ({participants.length})
            </h2>
            <div className="flex items-center gap-3">
              {duplicateCount > 0 && (
                <button
                  onClick={removeDuplicates}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded"
                >
                  <Eraser className="w-3 h-3" />
                  移除重複項目
                </button>
              )}
              {participants.length > 0 && (
                <button
                  onClick={clearList}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  全部清空
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p>名單目前是空的。</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {participants.map((p, idx) => {
                  const isDuplicate = (duplicates.get(p.name) || 0) > 1;
                  return (
                    <li key={p.id} className={`py-3 flex justify-between items-center group px-2 rounded-lg transition-colors ${isDuplicate ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <span className={`text-sm font-medium ${isDuplicate ? 'text-amber-800' : 'text-slate-700'}`}>
                        <span className="text-slate-300 mr-2 w-6 inline-block font-mono">{idx + 1}.</span>
                        {p.name}
                        {isDuplicate && <span className="ml-2 text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full">重複</span>}
                      </span>
                      <button
                        onClick={() => removeParticipant(p.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {participants.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={onNext}
                className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors font-semibold shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
              >
                前往抽籤與分組
                <span className="text-slate-400 text-xs font-normal">➔</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceInput;