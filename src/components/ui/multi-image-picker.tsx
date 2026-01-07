import React from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MultiImagePickerProps {
  images: string[];
  onUpload: (files: FileList) => void;
  onRemove: (index: number) => void;
  uploading: boolean;
  max?: number;
}

export const MultiImagePicker = ({ images, onUpload, onRemove, uploading, max = 5 }: MultiImagePickerProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {images.map((url, i) => (
        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border group">
          <img src={url} className="w-full h-full object-cover" alt="Preview" />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {images.length < max && (
        <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-rose-300 transition-all group">
          {uploading ? (
            <Loader2 className="animate-spin text-rose-500" />
          ) : (
            <>
              <Plus className="text-slate-400 group-hover:text-rose-500" />
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 group-hover:text-rose-500">
                Add Photo
              </span>
            </>
          )}
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => e.target.files && onUpload(e.target.files)}
          />
        </label>
      )}
    </div>
  );
};