import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Children,
} from "react";
class AppMonostate {
  private static _theme: "light" | "dark" = "light";

  get theme() {
    return AppMonostate._theme;
  }

  set theme(value: "light" | "dark") {
    AppMonostate._theme = value;
    localStorage.setItem("theme", value);
  }
}

type State = {
  theme: "light" | "dark";
};

type Action =
  | { type: "TOGGLE_THEME" }
  | { type: "SET_THEME"; payload: "light" | "dark" };

function reducer(state: State, action: Action): State {
  const appMonoState = new AppMonostate();
  switch (action.type) {
    case "TOGGLE_THEME":
      const newTheme = state.theme === "light" ? "dark" : "light";
      appMonoState.theme = newTheme;
      return { ...state, theme: newTheme };
    case "SET_THEME":
      appMonoState.theme = action.payload;
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

const AppStateContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // localStorage から初期値取得
  const storedTheme =
    (localStorage.getItem("theme") as "light" | "dark") || "light";

  const [state, dispatch] = useReducer(reducer, {
    theme: storedTheme,
  });

  const appMonostate = new AppMonostate();
  // Monostate 初期化
  useEffect(() => {
    appMonostate.theme = state.theme;
  }, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// -------------------------
// Hook で Context 利用
// -------------------------
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export function ThemeToggle() {
  const { state, dispatch } = useAppState();

  return (
    <div
      style={{
        background: state.theme === "dark" ? "#222" : "#fff",
        color: state.theme === "dark" ? "#fff" : "#000",
        padding: "1rem",
      }}
    >
      <p>Current Theme: {state.theme}</p>
      <button onClick={() => dispatch({ type: "TOGGLE_THEME" })}>
        Toggle Theme
      </button>
    </div>
  );
}
