import React from "react";
import Header from "@/components/Header";
import OrganizationDrawer from "@/components/OrganizationDrawer";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import { useAppContext } from "@/context/AppContext";

const Dashboard = () => {
  const { toggleOrgDrawer, selectedOrganization } = useAppContext();

  return (
    <div>
      <Header />

      {/* Hamburger Menu and Organization Info */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => toggleOrgDrawer(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-md shadow hover:bg-gray-700 flex items-center space-x-2"
        >
          <span>☰</span>
          <span>Menu</span>
        </button>
        {selectedOrganization && (
          <h2 className="text-lg font-bold">
            Current Organization: {selectedOrganization.name}
          </h2>
        )}
      </div>

      {/* Left Drawer (Organization Selection) */}
      <OrganizationDrawer />

      {/* Right Drawer (Event Details) */}
      <EventDrawer />

      {/* Main Table */}
      {selectedOrganization ? (
        <Table />
      ) : (
        <div className="text-center text-gray-500">
          Please select an organization to view events.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
