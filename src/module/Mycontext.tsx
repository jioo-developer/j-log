import { useLocation, useNavigate } from "react-router-dom";
import useLoadPost from "../query/loadPost";
import useLoadUser from "../query/loadUser";
import { postProps } from "./interfaceModule";
import { createContext } from "react";
import { ReactNode, useContext } from "react";

export const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const { data, refetch } = useLoadUser();
  const {
    data: posts,
    refetch: postRefetch,
    isLoading: postIsLoading,
  } = useLoadPost();

  const Loading = postIsLoading;

  const location = useLocation();
  const navigate = useNavigate();
  return (
    <MyContext.Provider
      value={{ data, posts, refetch, postRefetch, navigate, location, Loading }}
    >
      {children}
    </MyContext.Provider>
  );
};

interface MyContextProps {
  data: any;
  posts: postProps[] | undefined;
  refetch: any;
  postRefetch: any;
  navigate: (params: string, state?: {}) => void;
  location: any;
  Loading: boolean;
}

const MyContext = createContext<MyContextProps>({
  data: {},
  posts: [],
  refetch: () => {},
  postRefetch: () => {},
  navigate: () => {},
  location: {},
  Loading: false,
});

export const useMyContext = (): MyContextProps => {
  return useContext(MyContext);
};
