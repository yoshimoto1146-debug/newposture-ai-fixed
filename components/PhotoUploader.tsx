import React from 'react';
import { Upload } from 'lucide-react';

interface PhotoUploaderProps {
  label: string;
  onUpload: (file: File) => void;
  imageUrl?: string;
  isProcessing?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ label, onUpload, imageUrl, isProcessing }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex justify-between items-center px-2">
        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{label}</span>
      </div>
      
      <div className="relative w-full aspect-[3/4] rounded-[2.5rem] border-4 border-dashed border-slate-200 bg-white overflow-hidden flex items-center justify-center transition-all hover:border-blue-400 hover:bg-blue-50/30 group cursor-pointer">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center p-8 text-center space-y-4">
            <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-600 transition-colors" />
            <p className="font-black text-slate-700 text-sm uppercase tracking-widest">画像をアップロード</p>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
      </div>
    </div>
  );
};