import React, { createContext } from 'react';

export const authDataContext = createContext();

function AuthContext({ children }) {
  // 🔁 Dynamically set server URL based on environment
  const serverUrl = "http://localhost:3000"
  let value = { serverUrl };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
