import { QueryObserverResult, useQuery } from "react-query";
import { loadReplys } from "../module/exportQueryFunction";

const useReply = (params: string) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: QueryObserverResult<any[]> = useQuery(
    ["loadReply", params],
    () => loadReplys(params),
    {
      onSuccess(data) {
        console.log(data);
      },
      onError(err) {
        console.log(err);
      },
    }
  );

  return {
    isLoading,
    isError,
    data,
    error,
    refetch,
  };
};

export default useReply;
