import { createContext, useContext, useState,useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [loggedIn, setLoggedIn] = useState(false);

    const checkAuth = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/auth/remember", {
            method: "GET",
            credentials: "include", // Allows sending cookies
          });
          const data = await response.json();
          if (response.ok) {            
            setLoggedIn(data.loggedIn);
          } else {
            setLoggedIn(false);
          }
        }
        catch (error) {
          setLoggedIn(false);
        }
      };
    
      useEffect(() => {
        !loggedIn && checkAuth();
      }, []);

    return <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}