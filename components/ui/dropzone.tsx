import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
  maxFiles?: number;
  maxSize?: number;
}

export function Dropzone({
  onDrop,
  className,
  maxFiles = 5,
  maxSize = 5242880, // 5MB
}: DropzoneProps) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles,
    maxSize,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-sm text-gray-500">
        <Upload className="h-8 w-8 mb-2" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            <p>Drag & drop images here, or click to select files</p>
            <p className="mt-1">Max {maxFiles} files, up to {maxSize / 1024 / 1024}MB each</p>
          </>
        )}
      </div>
    </div>
  );
}