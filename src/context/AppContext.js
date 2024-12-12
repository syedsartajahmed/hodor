import React, { createContext, useContext, useState } from "react";
import { rows } from "@/constants/tableValue";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tableData, setTableData] = useState(rows);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleDrawer = (open, event = null) => {
    setIsDrawerOpen(open);
    setSelectedEvent(event);
  };

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

  const value = {
    tableData,
    addEvent, // Ensure this is included in the context value
    isDrawerOpen,
    toggleDrawer,
    selectedEvent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
