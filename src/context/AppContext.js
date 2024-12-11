import React, { createContext, useContext, useState } from "react";
import { rows } from "@/constants/tableValue";

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Create the provider component
export const AppProvider = ({ children }) => {
  const [tableData, setTableData] = useState(rows);

  const addEvent = (event) => {
    setTableData((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...event,
        stakeholders: "",
        category: "",
        propertyBundles: "",
        groupProperties: "",
        source: "",
        action: "",
      },
    ]);
  };

  const value = { tableData, addEvent };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
