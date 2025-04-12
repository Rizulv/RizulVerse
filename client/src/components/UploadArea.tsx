import { FC, useState, useCallback } from 'react';

interface UploadAreaProps {
  onUpload: (file: File) => void;
}

const UploadArea: FC<UploadAreaProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      }
    }
  }, [onUpload]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  }, [onUpload]);
  
  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput.click();
  };
  
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-neutral-700'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mx-auto flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-base text-gray-300 mb-4">Drag and drop your design image here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        <button 
          className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition duration-150"
          onClick={handleButtonClick}
        >
          Upload Image
        </button>
        <p className="text-xs text-gray-500 mt-4">Supports JPG, PNG, SVG, Figma links</p>
      </div>
    </div>
  );
};

export default UploadArea;
