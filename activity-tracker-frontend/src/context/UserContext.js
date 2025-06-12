import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    username: null,
    user_id: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser({
          isAuthenticated: true,
          username: decoded.username,
          user_id: decoded.user_id,
        });
      } catch (err) {
        console.error("Failed to decode token:", err);
        setUser({ isAuthenticated: false, username: null, user_id: null });
      }
    } else {
      setUser({ isAuthenticated: false, username: null, user_id: null });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("❌ useUser() must be used within a <UserProvider>");
  }
  return context;
};
