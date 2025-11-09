// src/context/LoaderContext.jsx
import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = () => setLoadingCount((n) => n + 1);
  const hideLoader = () => setLoadingCount((n) => Math.max(n - 1, 0));

  return (
    <LoaderContext.Provider value={{ isLoading: loadingCount > 0, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
