import React from "react";

import firebase from "@/firebase/clientApp";

type State = {
  authStatus: "initial" | "loading" | "completed";
  firebaseUser: firebase.User | null;
};

type Action =
  | {
      type: "SetAuthStatus";
      payload: State["authStatus"];
    }
  | {
      type: "SetFirebaseUser";
      payload: State["firebaseUser"];
    };

const reducer: React.Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case "SetAuthStatus":
      return { ...state, authStatus: action.payload };

    case "SetFirebaseUser":
      return { ...state, firebaseUser: action.payload };

    default:
      return state;
  }
};

export const AuthContext = React.createContext<[State, React.Dispatch<Action>] | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    authStatus: "initial",
    firebaseUser: null,
  });

  const setCurrentUser = React.useCallback(async () => {
    dispatch({ type: "SetAuthStatus", payload: "loading" });

    firebase.auth().onAuthStateChanged(async (currentUser) => {
      dispatch({ type: "SetFirebaseUser", payload: currentUser });

      if (currentUser) {
        // TODO: backendからユーザー情報を取得
      }

      dispatch({ type: "SetAuthStatus", payload: "completed" });
    });
  }, []);

  React.useEffect(() => {
    setCurrentUser();
  }, [setCurrentUser]);

  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  const [state, dispatch] = context;
  return [state, dispatch] as const;
};
