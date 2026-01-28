import React, { useRef } from 'react';
import { UploadCloud, FileImage, FileCode, X } from 'lucide-react';
import { FileInput } from '../types';

interface FileUploadProps {
  input: FileInput;
  onChange: (input: FileInput) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ input, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          file: file,
          previewUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    onChange({ file: null, previewUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*, .ts, .tsx, .js, .json"
      />
      
      {!input.file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-accent-500 hover:bg-gray-900/50 transition-all group"
        >
          <div className="p-4 bg-gray-800 rounded-full mb-4 group-hover:bg-accent-500/20 group-hover:scale-110 transition-all">
            <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-accent-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Upload Sketch or Legacy Code</h3>
          <p className="text-gray-500 text-sm max-w-sm text-center">
            Drag & drop an ER diagram, Architecture Sketch, or "bad" source code file here to auto-refactor.
          </p>
        </div>
      ) : (
        <div className="relative border border-gray-700 bg-gray-900 rounded-xl overflow-hidden">
          <button 
            onClick={clearFile}
            className="absolute top-2 right-2 p-1.5 bg-gray-950/80 rounded-full text-gray-400 hover:text-red-400 hover:bg-gray-950 border border-gray-800 backdrop-blur-sm transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col md:flex-row h-64">
            <div className="flex-1 bg-gray-950 flex items-center justify-center p-4">
              {input.previewUrl && input.file.type.startsWith('image/') ? (
                <img 
                  src={input.previewUrl} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center">
                  <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-mono text-sm">{input.file.name}</p>
                </div>
              )}
            </div>
            <div className="w-full md:w-64 bg-gray-800/50 border-t md:border-t-0 md:border-l border-gray-700 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <FileImage className="w-5 h-5 text-accent-400" />
                <span className="text-sm font-medium text-gray-200 truncate">{input.file.name}</span>
              </div>
              <div className="text-xs text-gray-500 font-mono space-y-2">
                <p>SIZE: {(input.file.size / 1024).toFixed(2)} KB</p>
                <p>TYPE: {input.file.type || 'UNKNOWN'}</p>
                <p>STATUS: READY_TO_SCAN</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};