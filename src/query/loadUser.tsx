import { QueryObserverResult, useQuery } from "react-query";
import { loadUser } from "../module/exportFunction";

interface LoadUserHookResult {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

const useLoadUser = () => {
  const {
    isLoading,
    data,
    isError,
    error,
  }: QueryObserverResult<LoadUserHookResult> = useQuery("loadUser", loadUser, {
    onSuccess(data) {
      console.log(data);
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
  };
};

export default useLoadUser;
