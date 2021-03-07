import React from "react";

type State = {
  loading: boolean;
};

type Action = {
  type: "setLoading";
  payload: State["loading"];
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

export const AuthContext = React.createContext<[State, React.Dispatch<Action>] | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    loading: false,
  });

  return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
