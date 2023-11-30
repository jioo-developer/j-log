import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";

const initialState = {
  posts: [],
  login: false,
};

const POSTDATA = "POSTDATA";

const LOGIN = "LOGIN";

export const PostLoad = (data) => ({
  type: POSTDATA,
  data,
});

export const LoginAction = () => ({
  type: LOGIN,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case POSTDATA:
      return {
        ...state,
        posts: action.data,
      };
    case LOGIN:
      return {
        ...state,
        login: !state.login,
      };
    default:
      return state;
  }
}
let store = createStore(reducer, applyMiddleware(logger));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
