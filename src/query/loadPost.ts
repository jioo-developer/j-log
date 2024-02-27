import { QueryObserverResult, useQuery } from "react-query";
import { loadPost } from "../module/exportQueryFunction";

const useLoadPost = () => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: QueryObserverResult<any[]> = useQuery("loadPost", loadPost, {
    onSuccess(data) {
      // console.log(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  return {
    isLoading,
    isError,
    data,
    error,
    refetch,
  };
};

export default useLoadPost;
