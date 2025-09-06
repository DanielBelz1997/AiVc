import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFileUpload } from "./useFileUpload";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;

    navigate("/agents", {
      state: {
        input,
        attachedFiles,
      },
    });

    setTimeout(() => {
      setInput("");
      setAttachedFiles([]);
      setIsLoading(false);
    }, 2000); // Give more time for navigation
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
