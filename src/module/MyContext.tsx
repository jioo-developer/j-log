// MyContext.ts

import { ReactNode, createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

type MyContextProps = {
  navigate: (params: string) => void;
  dispatch: (params: any) => void;
};

type MyContextProviderProps = {
  children: ReactNode;
};

const MyContext = createContext<MyContextProps>({
  navigate: () => {},
  dispatch: () => {},
});
// 이거 ts 때매 쓰네 (context 초기값);
// 함수의 초기값 () => {}

// context provider
export const MyContextProvider = ({
  children,
}: MyContextProviderProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //선언은 여기 하데 초기값을 위해 해줘야함
  return (
    <MyContext.Provider value={{ navigate, dispatch }}>
      {children}
    </MyContext.Provider>
  );
};
// context provider

// context 사용 함수
export const useMyContext = (): MyContextProps => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }

  return context;
};
