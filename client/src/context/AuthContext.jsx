import { createContext, useContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
    if (state.token) {
      try {
        const decodedToken = jwtDecode(state.token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decodedToken.exp < currentTime) {
          dispatch({ type: "LOGOUT" }); // Logout if token is expired
        } else {
          // Set timeout to automatically log out user when token expires
          const timeUntilExpiration = (decodedToken.exp - currentTime) * 5000;
          const logoutTimer = setTimeout(() => {
            dispatch({ type: "LOGOUT" });
          }, timeUntilExpiration);

          return () => clearTimeout(logoutTimer);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch({ type: "LOGOUT" });
      }
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
