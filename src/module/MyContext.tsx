// MyContext.ts

import { ReactNode, createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import { authService, db, storageService } from "../Firebase";
import useLoadUser from "../query/loadUser";
import { loadPost, loadUser } from "../module/exportFunction";
import { queryType } from "./interfaceModule";

type MyContextProps = {
  navigate: (params: string) => void;
  dispatch: (params: any) => void;
  authService: firebase.auth.Auth;
  db: firebase.firestore.Firestore;
  storageService: firebase.storage.Storage;
  userData: queryType | {};
};

type MyContextProviderProps = {
  children: ReactNode;
};

const MyContext = createContext<MyContextProps>({
  navigate: () => {},
  dispatch: () => {},
  authService,
  db,
  storageService,
  userData: {},
});
// 이거 ts 때매 쓰네 (context 초기값);
// 함수의 초기값 () => {}

// context provider
export const MyContextProvider = ({
  children,
}: MyContextProviderProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData: queryType = useLoadUser(loadUser);
  //선언은 여기 하데 초기값을 위해 해줘야함
  return (
    <MyContext.Provider
      value={{ navigate, dispatch, authService, db, storageService, userData }}
    >
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
