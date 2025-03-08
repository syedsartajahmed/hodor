import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
import {
  isOrgDrawerOpenState,
  selectedOrganizationState,
  organizationsState,
  allEventsState,
} from "@/recoil/atoms";

const OrganizationDrawer = () => {
  const [isOrgDrawerOpen, setOrgDrawerOpen] = useRecoilState(isOrgDrawerOpenState);
  const setSelectedOrganization = useSetRecoilState(selectedOrganizationState);
  const setAllEvents = useSetRecoilState(allEventsState);
  const [organizations, setOrganizations] = useRecoilState(organizationsState);

  const [newOrgName, setNewOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/organizations");
      setOrganizations(response.data);
    } catch (err) {
      setError("Failed to fetch organizations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrganization = async () => {
    if (!newOrgName.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const newOrganization = { name: newOrgName };
      await axios.post("/api/organizations", newOrganization);
      setSuccessMessage("Organization added successfully!");
      setNewOrgName("");
      fetchOrganizations();
    } catch (err) {
      setError("Failed to add organization");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationDetails = async (organizationId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/organizations?organization_id=${organizationId}`);
      const organizationDetails = response.data;
      const events = organizationDetails.applications?.[0]?.events || [];
      setAllEvents(events);
    } catch (err) {
      setError("Failed to fetch organization details");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            Organizations
          </h3>
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <ul className="space-y-2">
            {organizations.map((org) => (
              <li
                key={org._id}
                className="p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700"
                onClick={() => {
                  setSelectedOrganization(org);
                  fetchOrganizationDetails(org._id);
                  selectOrganization(org);
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
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            Add New Organization
          </h3>
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
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDrawer;