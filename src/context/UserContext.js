import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the User Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Fetch the user data or token when the app loads
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Fetch user data from backend using token (you could also store the user data in localStorage)
            // For now, we will just set the user as an example
            setUser({ name: 'John Doe', email: 'john.doe@example.com' }); // Replace with actual API request
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => {
    return useContext(UserContext);
};
