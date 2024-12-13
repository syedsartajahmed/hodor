import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const OrganizationDrawer = () => {
  const {
    isOrgDrawerOpen,
    toggleOrgDrawer,
    setSelectedOrganization,
  } = useAppContext();
  const [organizations, setOrganizations] = useState([
    { id: "org1", name: "Organization 1" },
    { id: "org2", name: "Organization 2" },
  ]); // Dummy organizations
  const [newOrgName, setNewOrgName] = useState("");

  // Handle adding a new organization
  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;
    const newOrganization = { id: `org${Date.now()}`, name: newOrgName };
    setOrganizations((prev) => [...prev, newOrganization]); // Add to the list
    setSelectedOrganization(newOrganization); // Select the new organization
    setNewOrgName(""); // Clear the input
    toggleOrgDrawer(false); // Close the drawer
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOrgDrawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Select Organization</h2>
          <button
            onClick={() => toggleOrgDrawer(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Organization List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Organizations</h3>
          <ul className="space-y-2">
            {organizations.map((org) => (
              <li
                key={org.id}
                className="p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                onClick={() => {
                  setSelectedOrganization(org);
                  toggleOrgDrawer(false);
                }}
              >
                {org.name}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="my-4 border-t border-gray-700"></div>

          {/* Add New Organization */}
          <h3 className="text-sm font-medium text-gray-300 mb-2">Add New Organization</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter organization name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
            />
            <button
              onClick={handleAddOrganization}
              className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-500"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDrawer;
