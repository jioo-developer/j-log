import { useQuery } from "react-query";

const useLoadUser = (func: any) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["loadUser"],
    queryFn: func,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
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
