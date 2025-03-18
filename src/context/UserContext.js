"use client";
import { createContext, useState, useEffect } from "react";

// Context बनाओ
export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // जब भी app load हो, localStorage से user लोड करो
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
