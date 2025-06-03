'use client';

import { useState, useCallback } from 'react';
import { getFileUrl } from '@/lib/s3';

interface FileUploadProps {
  onUploadCompleteAction: (fileUrl: string) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  className?: string;
}

export default function FileUpload({
  onUploadCompleteAction,
  acceptedFileTypes = 'image/*,video/*',
  maxFileSize = 1 * 1024 * 1024 * 1024, // 1GB default
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { presignedUrl, fileName } = await response.json();

      // Upload file to S3
      console.log('Uploading file to S3:', presignedUrl);
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'Cache-Control': 'max-age=31536000',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      // Get the public URL and pass it to the parent component
      const fileUrl = getFileUrl(fileName);
      onUploadCompleteAction(fileUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [maxFileSize, onUploadCompleteAction]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        disabled={isUploading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 