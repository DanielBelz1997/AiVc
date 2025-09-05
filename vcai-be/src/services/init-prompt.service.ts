import { ApiResponse } from "@/types";

const initPromptService = async (): Promise<ApiResponse<string>> => {
  return {
    success: true,
    data: "Init prompt",
  };
};

export { initPromptService };
