import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  ImageIcon,
  FileText,
  X,
  Paperclip,
  Presentation,
} from "lucide-react";
import { useChatInterface } from "@/hooks/useChatInterface";
import { useNavigate } from "react-router-dom";
import { CHAT_INTERFACE_CHIPS_TEXT } from "@/constants/home";

interface ChatInterfaceProps {
  inputText: string;
}

export function ChatInterface(props: ChatInterfaceProps) {
  const { inputText } = props;

  const {
    input,
    setInput,
    attachedFiles,
    handleSubmit,
    handleFileAttach,
    removeFile,
    formatFileSize,
    isLoading,
  } = useChatInterface();

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

  return (
    <div className="">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {CHAT_INTERFACE_CHIPS_TEXT.map((chip: string) => (
            <div className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-400">
              {chip}
            </div>
          ))}
        </div>

        {attachedFiles.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3">
                <div className="shrink-0">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-blue-400" />
                  ) : isPowerPointFile(file) ? (
                    <Presentation className="h-5 w-5 text-orange-400" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.id)}
                  className="shrink-0 h-8 w-8 text-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-gray-800 rounded-2xl border border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileAttach}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.ppsx,.pptm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-10 w-10 text-gray-400 hover:text-gray-300"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputText}
                className="flex-1 bg-transparent border-none text-gray-300 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-0"
              />

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={!input.trim() && attachedFiles.length === 0}
                className="shrink-0 h-10 w-10 rounded-full bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
