import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ImageIcon, FileText, X, Paperclip } from "lucide-react";
import { useChatInterface } from "@/hooks/useChatInterface";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ChatInterfaceProps {
  inputText: string;
}

export function ChatInterface(props: ChatInterfaceProps) {
  const { inputText } = props;
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isLoading) {
      navigate("/agents", {
        state: {
          input,
        },
      });
    }
  }, [isLoading, navigate, input]);

  return (
    <div className="">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <div className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-400">
            💡 Include your industry or use case
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-400">
            🎯 Mention your target audience
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-400">
            ⏰ Add timeline or budget if relevant
          </div>
        </div>

        {attachedFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3"
              >
                <div className="shrink-0">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-blue-400" />
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
                  className="shrink-0 h-8 w-8 text-gray-400 hover:text-gray-300"
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
                  accept="image/*,.pdf,.doc,.docx,.txt"
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
