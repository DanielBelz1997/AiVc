import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFileUpload } from "./useFileUpload";
import { useStartupAnalysis } from "./useStartupAnalysis";

export const useChatInterface = () => {
  const {
    attachedFiles,
    setAttachedFiles,
    handleFileAttach,
    removeFile,
    formatFileSize,
  } = useFileUpload();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { startAnalysis, state: analysisState } = useStartupAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;

    setIsLoading(true);

    try {
      // Convert attached files to File objects
      const files = attachedFiles
        .map((file) => {
          // If it's already a File object, use it; otherwise create a new one
          if (file instanceof File) {
            return file;
          }
          // For URL-based files (from file picker), we'd need to fetch them
          // For now, we'll skip URL-based files and only handle actual File objects
          return null;
        })
        .filter(Boolean) as File[];

      // Start the analysis workflow
      await startAnalysis({
        prompt: input,
        files: files.length > 0 ? files : undefined,
      });

      // Navigate to agents page with the analysis state
      navigate("/agents", {
        state: {
          input,
          attachedFiles,
          conversationId: analysisState.conversationId,
          usingBackend: true,
        },
      });
    } catch (error) {
      console.error("Failed to start analysis:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
      // Don't clear the form immediately in case of error
      setTimeout(() => {
        setInput("");
        setAttachedFiles([]);
      }, 1000);
    }
  };

  // Helper function to determine if a file is a PowerPoint file
  const isPowerPointFile = (file: { name: string; type: string }) => {
    const powerPointExtensions = [".ppt", ".pptx", ".ppsx", ".pptm"];
    const powerPointMimeTypes = [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
    ];

    const fileName = file.name.toLowerCase();
    const hasExtension = powerPointExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    const hasMimeType = powerPointMimeTypes.includes(file.type);

    return hasExtension || hasMimeType;
  };

  const isDocFile = (file: { name: string; type: string }) => {
    const docExtensions = [".doc", ".docx", ".txt"];
    const docMimeTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const fileName = file.name.toLowerCase();
    const hasExtension = docExtensions.some((ext) => fileName.endsWith(ext));
    const hasMimeType = docMimeTypes.includes(file.type);

    return hasExtension || hasMimeType;
  };

  const isPdfFile = (file: { name: string; type: string }) => {
    const pdfExtensions = [".pdf"];
    const pdfMimeTypes = ["application/pdf"];

    const fileName = file.name.toLowerCase();
    const hasExtension = pdfExtensions.some((ext) => fileName.endsWith(ext));
    const hasMimeType = pdfMimeTypes.includes(file.type);

    return hasExtension || hasMimeType;
  };

  const isImageFile = (file: { name: string; type: string }) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    const imageMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];

    const fileName = file.name.toLowerCase();
    const hasExtension = imageExtensions.some((ext) => fileName.endsWith(ext));
    const hasMimeType = imageMimeTypes.includes(file.type);

    return hasExtension || hasMimeType;
  };

  return {
    attachedFiles,
    setAttachedFiles,
    handleSubmit,
    handleFileAttach,
    removeFile,
    formatFileSize,
    isLoading,
    setIsLoading,
    setInput,
    input,
    isPowerPointFile,
    isDocFile,
    isPdfFile,
    isImageFile,
  };
};
