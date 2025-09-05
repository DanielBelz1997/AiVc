import api from "@/services/axios";

export const postInitPrompt = async () => {
  const response = await api.post("/init-prompt");
  return response.data;
};
