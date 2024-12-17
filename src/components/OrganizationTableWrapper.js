import React, { useState } from "react";
import Table from "./Table";
import OrganizationDrawer from "./OrganizationDrawer";

const OrganizationTableWrapper = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Initially open for organization selection
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const handleSelectOrganization = (org) => {
    setSelectedOrganization(org);
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      {/* Sidebar Drawer */}
      <OrganizationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectOrganization={handleSelectOrganization}
      />

      {/* Main Content */}
      <div className="p-4">
        {selectedOrganization ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Events for {selectedOrganization.name}
            </h2>
            <Table />
          </>
        ) : (
          <div className="text-center text-gray-500">
            Please select an organization to view events.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationTableWrapper;
