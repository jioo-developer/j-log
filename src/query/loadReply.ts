import { QueryObserverResult, useQuery } from "react-query";
import { loadReplys } from "../module/exportQueryFunction";
import { replyType } from "../module/interfaceModule";

const useReply = (params: string) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: QueryObserverResult<replyType[]> = useQuery(
    ["loadReply", params],
    () => loadReplys(params),
    {
      onSuccess(data) {
        // console.log(data);
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
