import { useQuery } from "react-query";

const useLoadDataQuery = (func: any) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["loadPost"],
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

export default useLoadDataQuery;
