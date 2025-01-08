import React, { createContext, useContext, useState } from "react";
import { rows } from "@/constants/tableValue";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null); // New State
  const [isOrgDrawerOpen, setIsOrgDrawerOpen] = useState(false); // Left drawer
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false); // Right drawer
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState({
    id: null,
    name: null,
    applicationId: null,
    applicationDetails: {},
  });
  const [allEvents, setAllEvents] = useState([]);

  const toggleOrgDrawer = (open) => {
    setIsOrgDrawerOpen(open);
  };

  const toggleEventDrawer = (open, event = null) => {
    setIsEventDrawerOpen(open); // Ensure this toggles the drawer's visibility
    setSelectedEvent(event); // Set the selected event data
    //if (!open) setSelectedEvent([]);
  };

  const toggleDrawer = (open, event = null) => {
    setIsDrawerOpen(open);
    setIsEventDrawerOpen(open);
    //setSelectedEvent(event);
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
    console.log("Selected Event:", event);
    //if (!open) setSelectedEvent([]);
  };

  const selectOrganization = (organization) => {
    setCurrentOrganization({
      id: organization._id,
      name: organization.name,
      applicationId: organization.applications?.[0] || null,
    });
  };

  const addEvent = (event) => {
    console.log("Adding event:", event);
    setTableData((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...event,
        stakeholders: "",
        category: "",
        source: "",
        action: "",
        platform: "",
      },
    ]);
    console.log(tableData);
  };

  const value = {
    tableData,
    addEvent, // Ensure this is included in the context value
    isDrawerOpen,
    toggleDrawer,
    selectedEvent,
    setTableData,
    selectedOrganization,
    setSelectedOrganization,
    isOrgDrawerOpen,
    toggleOrgDrawer,
    isEventDrawerOpen,
    toggleEventDrawer,
    setCurrentOrganization,
    currentOrganization,
    selectOrganization,
    showList,
    setShowList,
    setSelectedEvent,
    setAllEvents,
    allEvents,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
