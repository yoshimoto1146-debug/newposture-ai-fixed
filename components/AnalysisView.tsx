
import React, { useState, useMemo } from 'react';
import { CheckCircle2, Activity, ArrowLeft, Info, Sparkles, ChevronLeft, ChevronRight, TrendingUp, ArrowUpRight, Share2 } from 'lucide-react';
import { AnalysisResults, PhotoData, PostureLandmarks, Point2D, PosturePoint } from '../types';

const LandmarkLayer: React.FC<{ 
  landmarks: PostureLandmarks; 
  color: string; 
  photo: PhotoData;
  opacity?: number;
  isDashed?: boolean;
}> = ({ landmarks, color, photo, opacity = 1, isDashed = false }) => {
  if (!landmarks || !landmarks.head) return null;
  const toPct = (val: number) => val / 10;
  
  const generateBodyPath = () => {
    const mainPoints = [
      landmarks.head,
      landmarks.ear,
      landmarks.shoulder,
      ...(landmarks.spinePath || []),
      landmarks.hip,
      landmarks.knee,
      landmarks.ankle,
      landmarks.heel
    ].filter(p => p !== undefined && p !== null);
    
    if (mainPoints.length < 2) return "";
    return `M ${mainPoints.map(p => `${toPct(p.x)} ${toPct(p.y)}`).join(' L ')}`;
  };

  const style = { 
    transform: `scale(${photo.scale}) translate(${photo.offset.x}px, ${photo.offset.y}px) scaleX(${photo.isFlipped ? -1 : 1})`,
    transformOrigin: 'center center',
    opacity: opacity
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40" style={style}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line 
          x1={toPct(landmarks.head.x)} y1={toPct(landmarks.head.y)} 
          x2={toPct(landmarks.head.x)} y2={toPct(landmarks.heel.y)} 
          stroke={color} strokeWidth="0.15" strokeDasharray="1,2" strokeOpacity="0.3" 
        />
        <path 
          d={generateBodyPath()} 
          fill="none" 
          stroke={color} 
          strokeWidth={isDashed ? "0.6" : "1.0"} 
          strokeDasharray={isDashed ? "2,2" : "none"}
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]"
        />
      </svg>
      {Object.entries(landmarks).map(([key, point]) => {
        if (key === 'spinePath' || !point || Array.isArray(point)) return null;
        const p = point as Point2D;
        return (
          <div key={key} className={`absolute rounded-full border border-white shadow-sm -translate-x-1/2 -translate-y-1/2 ${isDashed ? 'w-1 h-1' : 'w-2 h-2'}`}
            style={{ 
              left: `${toPct(p.x)}%`, 
              top: `${toPct(p.y)}%`, 
              backgroundColor: color,
              opacity: isDashed ? 0.6 : 1
            }} />
        );
      })}
    </div>
  );
};

export const AnalysisView: React.FC<{ results: AnalysisResults; photos: Record<string, PhotoData>; onReset: () => void }> = ({ results, photos, onReset }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const viewData = results.viewA;
  const photoBefore = photos[`v1-before`];
  const photoAfter = photos[`v1-after`];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '姿勢分析レポート',
          text: `【姿勢改善結果】Before: ${results.overallBeforeScore}点 → After: ${results.overallAfterScore}点！\n${results.summary}`,
          url: window.location.href
        });
      } catch (e) {
        window.print();
      }
    } else {
      window.print();
    }
  };

  if (!viewData || !photoBefore?.url || !photoAfter?.url) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-xl text-center space-y-6 max-w-lg mx-auto">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <Info className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">表示エラー</h2>
        <p className="text-slate-500 font-bold">データを読み込めませんでした。</p>
        <button onClick={onReset} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> 最初に戻る
        </button>
      </div>
    );
  }

  const scoreDiff = results.overallAfterScore - results.overallBeforeScore;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full pb-20 px-2 md:px-0 print:p-0">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100 print:hidden">
        <button onClick={onReset} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
          <ArrowLeft className="w-4 h-4" /> 戻る
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className="flex items-center gap-2 bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
            <Share2 className="w-4 h-4" /> レポートを共有・保存
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6 print:break-after-page">
          <div className="relative aspect-[3/4] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group touch-none select-none">
            <div className="absolute inset-0 z-10">
              <img 
                src={photoBefore.url} 
                className="w-full h-full object-contain" 
                style={{ 
                  transform: `scale(${photoBefore.scale}) translate(${photoBefore.offset.x}px, ${photoBefore.offset.y}px) scaleX(${photoBefore.isFlipped ? -1 : 1})`, 
                  transformOrigin: 'center center' 
                }} 
              />
              <LandmarkLayer landmarks={viewData.beforeLandmarks} color="#64748b" photo={photoBefore} />
            </div>
            
            <div className="absolute inset-0 z-20" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img 
                src={photoAfter.url} 
                className="w-full h-full object-contain" 
                style={{ 
                  transform: `scale(${photoAfter.scale}) translate(${photoAfter.offset.x}px, ${photoAfter.offset.y}px) scaleX(${photoAfter.isFlipped ? -1 : 1})`, 
                  transformOrigin: 'center center' 
                }} 
              />
              <LandmarkLayer landmarks={viewData.beforeLandmarks} color="#64748b" photo={photoAfter} opacity={0.3} isDashed={true} />
              <LandmarkLayer landmarks={viewData.afterLandmarks} color="#3b82f6" photo={photoAfter} />
            </div>
            
            <div className="absolute top-0 bottom-0 z-[60] w-1 bg-white/80 shadow-2xl flex items-center justify-center pointer-events-none print:hidden" style={{ left: `${sliderPos}%` }}>
              <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-blue-600 pointer-events-auto active:scale-110 transition-transform">
                <ChevronLeft className="w-4 h-4 text-blue-600" /><ChevronRight className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            <input type="range" className="absolute inset-0 z-[70] w-full h-full opacity-0 cursor-ew-resize print:hidden" min="0" max="100" value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))} />
            
            <div className="absolute top-6 left-6 z-[80] bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
              Visual Analysis Comparison
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">総合スコア</p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-slate-500">{results.overallBeforeScore}点</span>
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    <span className="text-6xl font-black text-blue-400">{results.overallAfterScore}点</span>
                  </div>
                </div>
                {scoreDiff > 0 && (
                  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl border border-green-500/30 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="font-black text-sm">+{scoreDiff}pts Up</span>
                  </div>
                )}
              </div>
              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10">
                <p className="text-sm font-bold text-blue-50/90 leading-relaxed italic">"{results.summary}"</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 print:space-y-8">
            {(Object.entries(results.detailedScores) as [string, PosturePoint][]).map(([key, item]) => {
               const diff = item.afterScore - item.beforeScore;
               return (
                <div key={key} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 print:border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${diff > 0 ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-600'}`}>
                        {diff > 0 ? <CheckCircle2 className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                      </div>
                      <div className="flex-grow">
                        <span className="font-black text-xs text-slate-800 uppercase tracking-wider">{item.label}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-bold text-slate-400">{item.beforeScore}点</span>
                          <span className="text-xs text-slate-300">→</span>
                          <span className={`text-xl font-black ${diff > 0 ? 'text-green-500' : 'text-blue-600'}`}>{item.afterScore}点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-slate-300/30" style={{ width: `${item.beforeScore}%` }}></div>
                    <div className={`absolute inset-0 ${diff > 0 ? 'bg-green-500' : 'bg-blue-600'} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.afterScore}%` }}></div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[12px] font-bold text-slate-600 leading-relaxed italic">
                      <span className="text-blue-500 mr-2">アドバイス:</span>{item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={onReset} className="w-full py-6 bg-slate-950 text-white rounded-[2.5rem] font-black text-sm uppercase hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-3 group active:scale-95 print:hidden">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 最初に戻る
          </button>
        </div>
      </div>
      
      <div className="hidden print:block text-center pt-10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Generated by PostureRefine AI Pro • AI-Powered Posture Analysis Report
      </div>
    </div>
  );
};
