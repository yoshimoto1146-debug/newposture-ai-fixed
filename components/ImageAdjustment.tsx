
import React, { useState, useCallback, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, FlipHorizontal2 } from 'lucide-react';
import { PhotoData, ViewType } from '../types';

interface ImageAdjustmentProps {
  photo: PhotoData;
  onUpdate: (photo: PhotoData) => void;
  viewType: ViewType;
  referencePhoto?: PhotoData;
}

export const ImageAdjustment: React.FC<ImageAdjustmentProps> = ({ photo, onUpdate, viewType, referencePhoto }) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    onUpdate({
      ...photo,
      offset: { x: photo.offset.x + dx, y: photo.offset.y + dy }
    });
    lastPos.current = { x: clientX, y: clientY };
  }, [isDragging, photo, onUpdate]);

  const handleEnd = () => setIsDragging(false);

  // 視点に合わせたシルエットSVGパス（大型化・精緻化）
  const getSilhouettePath = () => {
    if (viewType === 'side') {
      // 側面用シルエット
      return "M50,8 A8,8 0 1,1 50,24 A8,8 0 1,1 50,8 M48,25 C55,25 58,35 58,50 L58,92 L42,92 L42,65 C40,55 40,40 43,30 C45,25 48,25 48,25";
    } else if (viewType === 'flexion') {
      // 屈曲用（前屈み）
      return "M45,15 A8,8 0 1,1 45,31 A8,8 0 1,1 45,15 M43,32 C35,40 30,55 35,70 L40,92 L55,92 L50,70 C52,55 50,40 43,32";
    } else if (viewType === 'extension') {
      // 伸展用（後ろ反り）
      return "M55,15 A8,8 0 1,1 55,31 A8,8 0 1,1 55,15 M57,32 C65,40 70,55 65,70 L60,92 L45,92 L50,70 C48,55 50,40 57,32";
    } else {
      // 前面・後面用シルエット（標準）
      return "M50,8 A9,9 0 1,1 50,26 A9,9 0 1,1 50,8 M50,28 L50,35 M30,35 L70,35 L72,65 L65,65 L63,45 L58,45 L58,92 L42,92 L42,45 L37,45 L35,65 L28,65 Z";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto">
      <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white select-none touch-none">
        {/* 操作エリア（最前面） */}
        <div 
          className="absolute inset-0 z-[100] cursor-move"
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleEnd}
        />

        {/* 赤い十字線とシルエットガイド */}
        <div className="absolute inset-0 z-[80] pointer-events-none flex items-center justify-center">
          {/* 十字線（視認性向上のため赤色を強調） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-red-500/40 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></div>
            <div className="h-full w-[1px] bg-red-500/40 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></div>
          </div>
          
          {/* 大型化した人型点線シルエット */}
          <svg className="w-[90%] h-[95%] text-red-600" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <path 
              d={getSilhouettePath()} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeDasharray="3,3" 
              className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            />
          </svg>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <p className="px-6 py-2 bg-red-600 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-2xl border border-white/30 whitespace-nowrap">
              赤いガイドに合わせてください
            </p>
          </div>
        </div>

        {/* 比較用リファレンス画像（Before/After比較時） */}
        {referencePhoto && referencePhoto.url && (
          <div 
            className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-30 grayscale"
            style={{ 
              transform: `scale(${referencePhoto.scale}) translate(${referencePhoto.offset.x}px, ${referencePhoto.offset.y}px) scaleX(${referencePhoto.isFlipped ? -1 : 1})`,
              transformOrigin: 'center center'
            }}
          >
            <img src={referencePhoto.url} className="w-full h-full object-contain" alt="Reference" />
          </div>
        )}

        {/* メイン画像 */}
        <div 
          className="absolute inset-0 pointer-events-none z-30"
          style={{ 
            transform: `scale(${photo.scale}) translate(${photo.offset.x}px, ${photo.offset.y}px) scaleX(${photo.isFlipped ? -1 : 1})`,
            transformOrigin: 'center center',
            opacity: isDragging ? 0.7 : 1 
          }}
        >
          {photo.url && <img src={photo.url} className="w-full h-full object-contain" alt="Target" />}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 p-2 bg-white rounded-full shadow-lg border border-slate-100 w-fit mx-auto relative z-[110]">
        <button onClick={() => onUpdate({...photo, scale: photo.scale + 0.1})} className="p-3 hover:bg-slate-50 rounded-full text-slate-600 active:scale-125 transition-transform" title="拡大"><ZoomIn className="w-6 h-6"/></button>
        <button onClick={() => onUpdate({...photo, scale: Math.max(0.1, photo.scale - 0.1)})} className="p-3 hover:bg-slate-50 rounded-full text-slate-600 active:scale-125 transition-transform" title="縮小"><ZoomOut className="w-6 h-6"/></button>
        <button onClick={() => onUpdate({...photo, isFlipped: !photo.isFlipped})} className={`p-3 rounded-full transition-all ${photo.isFlipped ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`} title="反転"><FlipHorizontal2 className="w-6 h-6"/></button>
        <button onClick={() => onUpdate({...photo, scale: 1, offset: {x:0, y:0}, isFlipped: false})} className="p-3 text-red-500 hover:bg-red-50 rounded-full active:rotate-180 transition-transform duration-500" title="リセット"><RotateCcw className="w-6 h-6"/></button>
      </div>
    </div>
  );
};
