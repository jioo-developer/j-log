import { QueryObserverResult, useQuery } from "react-query";
import { loadDetail } from "../module/exportQueryFunction";
import { FirebaseData } from "../module/interfaceModule";

const useLoadDetail = (params: string) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: QueryObserverResult<FirebaseData> = useQuery(
    ["loadDetail", params],
    () => loadDetail(params),
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

export default useLoadDetail;
