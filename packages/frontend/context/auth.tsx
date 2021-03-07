import React from "react";

import firebase from "@/firebase/clientApp";

type State = {
  loading: boolean;
  firebaseUser: firebase.User | null;
};

type Action =
  | {
      type: "SetLoading";
      payload: State["loading"];
    }
  | {
      type: "SetFirebaseUser";
      payload: State["firebaseUser"];
    };

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "SetLoading":
      return { ...state, loading: action.payload };

    case "SetFirebaseUser":
      return { ...state, firebaseUser: action.payload };

    default:
      return state;
  }
};

export const AuthContext = React.createContext<[State, React.Dispatch<Action>] | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    loading: false,
    firebaseUser: null,
  });

  const setCurrentUser = React.useCallback(async () => {
    dispatch({ type: "SetLoading", payload: true });

    firebase.auth().onAuthStateChanged(async (currentUser) => {
      dispatch({ type: "SetFirebaseUser", payload: currentUser });

      if (currentUser) {
        // TODO: backendからユーザー情報を取得
      }

      dispatch({ type: "SetLoading", payload: false });
    });
  }, []);

  React.useEffect(() => {
    setCurrentUser();
  }, [setCurrentUser]);

  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
