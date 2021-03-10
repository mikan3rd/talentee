import React from "react";

import { toast } from "react-semantic-toasts";

import firebase from "@/firebase/clientApp";
import { useGetCurrentUserLazyQuery } from "@/graphql/generated";

type State = {
  authStatus: "initial" | "loading" | "completed";
  firebaseUser: firebase.User | null;
  currentUser: any | null;
};

type Action =
  | {
      type: "SetAuthStatus";
      payload: State["authStatus"];
    }
  | {
      type: "SetFirebaseUser";
      payload: State["firebaseUser"];
    }
  | {
      type: "SetCurrentUser";
      payload: State["currentUser"];
    };

const reducer: React.Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case "SetAuthStatus":
      return { ...state, authStatus: action.payload };

    case "SetFirebaseUser":
      return { ...state, firebaseUser: action.payload };

    case "SetCurrentUser":
      return { ...state, currentUser: action.payload };

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
    currentUser: null,
  });

  const [fetchCurrentUser, { data: currentUserData, error: currentUserError }] = useGetCurrentUserLazyQuery();

  const setCurrentUser = React.useCallback(async () => {
    dispatch({ type: "SetAuthStatus", payload: "loading" });

    firebase.auth().onAuthStateChanged(async (currentUser) => {
      dispatch({ type: "SetFirebaseUser", payload: currentUser });

      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        localStorage.setItem("token", idToken);
        fetchCurrentUser();
      }

      dispatch({ type: "SetAuthStatus", payload: "completed" });
    });
  }, [fetchCurrentUser]);

  const login = React.useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    await setCurrentUser();
    toast({
      type: "success",
      title: "ログインしました！",
    });
  }, [setCurrentUser]);

  const logout = React.useCallback(async (withToast = true) => {
    await firebase.auth().signOut();
    dispatch({ type: "SetFirebaseUser", payload: null });
    dispatch({ type: "SetCurrentUser", payload: null });
    localStorage.removeItem("token");

    if (withToast) {
      toast({
        type: "success",
        title: "ログアウトしました！",
      });
    }
  }, []);

  React.useEffect(() => {
    setCurrentUser();
  }, [setCurrentUser]);

  React.useEffect(() => {
    dispatch({ type: "SetCurrentUser", payload: currentUserData?.getCurrentUser ?? null });
  }, [currentUserData]);

  React.useEffect(() => {
    if (currentUserError) {
      logout(false);
      toast({
        type: "error",
        title: currentUserError.name,
        description: currentUserError.message,
      });
    }
  }, [currentUserError, logout]);

  return <AuthContext.Provider value={{ state, dispatch, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
