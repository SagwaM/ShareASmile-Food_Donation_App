import React, {useEffect} from "react";
import { useThemeContext } from "@/context/ThemeContext";   // Import theme context
import { Moon, Sun } from "lucide-react"; // Icons for light/dark mode

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: "rgba(9, 120, 48, 0.6)", 
        color:"white",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "24px",
        zIndex: 1000,
      }}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
    </button>
  );
};

export default ThemeToggle;
