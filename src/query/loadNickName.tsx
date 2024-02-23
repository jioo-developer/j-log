import { QueryObserverResult, useQuery } from "react-query";
import { loadNickName } from "../module/exportFunction";

export interface LoadNickFilter {
  nickname: string;
}

const useLoadNickName = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: QueryObserverResult<LoadNickFilter[]> = useQuery(
    "loadNick",
    loadNickName,
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
  };
};

export default useLoadNickName;
