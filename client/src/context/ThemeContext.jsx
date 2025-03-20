import React, { createContext, useState, useMemo, useEffect, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState(() => { // Default theme is light
  // Get theme from localStorage or default to light
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light"; 
      localStorage.setItem("theme", newMode); // Save theme to localStorage
      return newMode;
    });
  };

  useEffect(() => {
    localStorage.setItem("theme", mode); // Ensure theme is stored
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                primary: { main: "#4CAF50" }, // Green for FoodShare
                background: { default: "#1E1E2F", paper: "#2A2A40" },
                text: { primary: "#FFFFFF", secondary: "#b0b0b0", },
              }
            : {
                primary: { main: "#4CAF50" },
                background: { default: "#F5F5F5", paper: "#FFFFFF" },
                text: { primary: "#333333", secondary: "#b0b0b0", },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
