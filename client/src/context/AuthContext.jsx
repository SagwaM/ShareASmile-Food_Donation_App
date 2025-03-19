import { createContext, useContext, useReducer, useEffect } from "react";

// Safe function to get and parse JSON from localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null; // Only parse if user exists
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null; //Prevent crashes
  }
};

// Initial state
const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { user, token } = action.payload;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { ...state, user, token };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return { user: null, token: null };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);


  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try{
        dispatch({ 
          type: "LOGIN", 
          payload: {user: JSON.parse(storedUser), token: storedToken} });
      } catch (error) {
        console.error("Error restoring user session:", error);
        localStorage.removeItem("user"); // Clear invalid data
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
