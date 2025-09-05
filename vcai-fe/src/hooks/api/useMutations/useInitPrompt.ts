import type { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postInitPrompt } from "@/hooks/api";

export const useInitPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postInitPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["init-prompt"] });
    },
    onError: (res: AxiosResponse<any>) => {
      console.log(res);
    },
  });
};
