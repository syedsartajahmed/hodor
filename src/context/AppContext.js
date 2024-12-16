import React, { createContext, useContext, useState } from "react";
import { rows } from "@/constants/tableValue";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tableData, setTableData] = useState(rows);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showList, setShowList] = useState(false);

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
    addEvent, 
    isDrawerOpen,
    toggleDrawer,
    selectedEvent,
    showList,
    setShowList
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
