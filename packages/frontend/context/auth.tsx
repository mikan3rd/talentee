import React, { useCallback } from "react";

import { toast } from "react-semantic-toasts";

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

export const AuthContext = React.createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
      login: () => void;
      logout: () => void;
    }
  | undefined
>(undefined);

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

  const login = React.useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const userCredential = await firebase.auth().signInWithPopup(provider);
    console.log(userCredential);

    await setCurrentUser();

    toast({
      type: "success",
      title: "ログインしました！",
    });
  }, [setCurrentUser]);

  const logout = useCallback(async () => {
    await firebase.auth().signOut();

    dispatch({ type: "SetFirebaseUser", payload: null });

    toast({
      type: "success",
      title: "ログアウトしました！",
    });
  }, []);

  React.useEffect(() => {
    setCurrentUser();
  }, [setCurrentUser]);

  return <AuthContext.Provider value={{ state, dispatch, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
