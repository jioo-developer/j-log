import { QueryObserverResult, useQuery } from "react-query";
import { loadUser } from "../module/exportQueryFunction";

export interface LoadUserHookResult {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  updateProfile(): void;
}

const useLoadUser = () => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: QueryObserverResult<LoadUserHookResult> = useQuery("loadUser", loadUser, {
    refetchOnMount: true,
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

export default useLoadUser;
