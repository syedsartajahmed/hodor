import React, { createContext, useContext, useState } from "react";
import { rows } from "@/constants/tableValue";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tableData, setTableData] = useState(rows);
  const [selectedOrganization, setSelectedOrganization] = useState(null); // New State
  const [isOrgDrawerOpen, setIsOrgDrawerOpen] = useState(false); // Left drawer
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false); // Right drawer
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentOrganization, setCurrentOrganization] = useState({
    id: null,
    name: null,
    applicationId: null,
  }); 

  const toggleOrgDrawer = (open) => {
    setIsOrgDrawerOpen(open);
  };

  const toggleEventDrawer = (open, event = null) => {
    setIsEventDrawerOpen(open); // Ensure this toggles the drawer's visibility
    setSelectedEvent(event); // Set the selected event data
  };

  const selectOrganization = (organization) => {
    setCurrentOrganization({
      id: organization._id, 
      name: organization.name,
      applicationId: organization.applications?.[0] || null,
    });
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
    setTableData,
    selectedOrganization,
    setSelectedOrganization,
    isOrgDrawerOpen,
    toggleOrgDrawer,
    isEventDrawerOpen,
    toggleEventDrawer,
    selectedEvent,
    addEvent,
    setCurrentOrganization,
    currentOrganization,
    selectOrganization,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
