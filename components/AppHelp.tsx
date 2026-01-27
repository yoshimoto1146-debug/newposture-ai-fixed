
import React from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';

interface AppHelpProps {
  onClose: () => void;
}

export const AppHelp: React.FC<AppHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300 border border-white/20">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors z-20">
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="p-8 md:p-12 space-y-10">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-red-500 rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-red-100 mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900">ビルドエラー解決ガイド</h3>
            <p className="text-slate-400 font-bold">安定動作のための手順</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">1</div>
                <div>
                  <p className="text-sm font-black text-slate-900">ファイルの整理</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">不要なフォルダを削除してからアップロードしてください。</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0">2</div>
                <div>
                  <p className="text-sm font-black text-slate-900">APIキーの設定</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">右上の鍵アイコンからAPIキーを選択してください。</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl space-y-3">
              <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase text-center">必須ファイルリスト</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {['App.tsx', 'index.tsx', 'index.html', 'package.json', 'types.ts'].map(f => (
                  <div key={f} className="bg-white px-3 py-2 rounded-xl font-bold text-slate-600 border border-blue-100 flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm tracking-widest uppercase transition-all shadow-xl active:scale-95">
            内容を確認しました
          </button>
        </div>
      </div>
    </div>
  );
};
