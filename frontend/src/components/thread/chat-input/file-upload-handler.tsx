'use client';

import React, { forwardRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { File, Loader2, Plus, Trash, X } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UploadedFile } from './chat-input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Divider } from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const handleLocalFiles = (
  files: File[],
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
) => {
  const filteredFiles = files.filter((file) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error(`File size exceeds 50MB limit: ${file.name}`);
      return false;
    }
    return true;
  });

  setPendingFiles((prevFiles) => [...prevFiles, ...filteredFiles]);

  const newUploadedFiles: UploadedFile[] = filteredFiles.map((file) => ({
    name: file.name,
    path: `/workspace/${file.name}`,
    size: file.size,
    type: file.type || 'application/octet-stream',
    localUrl: URL.createObjectURL(file)
  }));

  setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
  filteredFiles.forEach((file) => {
    toast.success(`File attached: ${file.name}`);
  });
};

const uploadFiles = async (
  files: File[],
  sandboxId: string,
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsUploading(true);

    const newUploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File size exceeds 50MB limit: ${file.name}`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadPath = `/workspace/${file.name}`;
      formData.append('path', uploadPath);

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_URL}/sandboxes/${sandboxId}/files`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      newUploadedFiles.push({
        name: file.name,
        path: uploadPath,
        size: file.size,
        type: file.type || 'application/octet-stream',
      });

      toast.success(`File uploaded: ${file.name}`);
    }

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
  } catch (error) {
    console.error('File upload failed:', error);
    toast.error(
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : 'Failed to upload file',
    );
  } finally {
    setIsUploading(false);
  }
};

const handleFiles = async (
  files: File[],
  sandboxId: string | undefined,
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>,
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (sandboxId) {
    // If we have a sandboxId, upload files directly
    await uploadFiles(files, sandboxId, setUploadedFiles, setIsUploading);
  } else {
    // Otherwise, store files locally
    handleLocalFiles(files, setPendingFiles, setUploadedFiles);
  }
};

interface FileUploadHandlerProps {
  loading: boolean;
  disabled: boolean;
  isAgentRunning: boolean;
  isUploading: boolean;
  sandboxId?: string;
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploadedFiles: UploadedFile[];
  removeUploadedFile: (index: number) => void;
}

export const FileUploadHandler = forwardRef<
  HTMLInputElement,
  FileUploadHandlerProps
>(
  (
    {
      loading,
      disabled,
      isAgentRunning,
      isUploading,
      sandboxId,
      setPendingFiles,
      setUploadedFiles,
      setIsUploading,
      uploadedFiles,  
      removeUploadedFile,
    },
    ref,
  ) => {
    // Clean up object URLs when component unmounts
    useEffect(() => {
      return () => {
        // Clean up any object URLs to avoid memory leaks
        setUploadedFiles(prev => {
          prev.forEach(file => {
            if (file.localUrl) {
              URL.revokeObjectURL(file.localUrl);
            }
          });
          return prev;
        });
      };
    }, []);

    const handleFileUpload = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.click();
      }
    };

    const processFileUpload = async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (!event.target.files || event.target.files.length === 0) return;

      const files = Array.from(event.target.files);

      // Use the helper function instead of the static method
      handleFiles(
        files,
        sandboxId,
        setPendingFiles,
        setUploadedFiles,
        setIsUploading,
      );

      event.target.value = '';
    };

    return (
      <>
        {
          uploadedFiles.length > 0 ?
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="default" className="h-7 rounded-md text-muted-foreground">
                  <File className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                <div className="w-full flex justify-between items-center px-2">
                  <div>Attached Files</div>
                  <div className="flex gap-3">
                    <button className="text-mainFont text-sm flex items-center gap-1 p-1 bg-transparent" onClick={handleFileUpload}>
                      <Plus />
                      Add
                    </button>
                    <button className="text-mainFont text-sm flex items-center gap-1 p-1 bg-transparent" onClick={() => setUploadedFiles([])}>
                      <Trash />
                      Clear
                    </button>
                  </div>
                </div>
                <Divider sx={{
                  borderColor: "#25252799",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  width: "100%",
                }} />
                {uploadedFiles.map((file, index) => (
                  // <DropdownMenuItem key={index}>
                    <div className="flex justify-between items-center p-2" key={index}>
                      <div className="flex items-center gap-2">
                        <File />
                        <div className="max-w-[150px] truncate">
                          {file.name}
                        </div>
                      </div>
                      <X className="cursor-pointer rounded-full p-[1px] hover:border hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-150" onClick={() => removeUploadedFile(index)} />
                    </div>
                  // </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu > :
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={handleFileUpload}
                    variant="ghost"
                    size="default"
                    className="h-7 rounded-md text-muted-foreground"
                    disabled={
                      loading || (disabled && !isAgentRunning) || isUploading
                    }
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {/* <span className="text-sm">Attachments</span> */}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach files</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

        }

        <input
          type="file"
          ref={ref}
          className="hidden"
          onChange={processFileUpload}
          multiple
        />
      </>
    );
  },
);

FileUploadHandler.displayName = 'FileUploadHandler';
export { handleFiles, handleLocalFiles, uploadFiles };
