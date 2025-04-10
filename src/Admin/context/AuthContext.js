import { createContext, useContext, useState,useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [loggedIn, setLoggedIn] = useState(false);

    const checkAuth = async () => {
        try {
          const response = await fetch("https://apurva-backend-repo.onrender.com/api/auth/remember", {
            method: "GET",
            credentials: "include", // Allows sending cookies
          });
          const data = await response.json();
          console.log(data);
          
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