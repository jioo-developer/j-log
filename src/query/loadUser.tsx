import { useQuery } from "react-query";
import { loadUser } from "../module/exportFunction";

const useLoadUser = () => {
  const { isLoading, data, isError, error } = useQuery("loadUser", loadUser, {
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
