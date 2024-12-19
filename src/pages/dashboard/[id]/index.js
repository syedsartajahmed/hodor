import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import OrganizationDrawer from "@/components/OrganizationDrawer";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from "next/router";

const Index = () => {
    const {
      isOrgDrawerOpen,
      toggleOrgDrawer,
      setSelectedOrganization,
      selectOrganization,
      setTableData,
      showList,
      currentOrganization,
    } = useAppContext();

    const router = useRouter();
  const { id } = router.query;
  
    useEffect(() => {
      if (id) {
        fetchOrganizationDetails(id);
      }
    }, [id]);
  
    const fetchOrganizationDetails = async (organizationId) => {
      try {
        const response = await axios.get(`/api/organizations?organization_id=${organizationId}`);
        const organizationDetails = response.data;
    
        console.log("Fetched organization details:", organizationDetails.applications?.[0]?.events);
        const events = organizationDetails.applications?.[0]?.events || [];
        console.log("Fetched organization details:", events);

        const updatedRows = events.map((event) => ({
          id: event._id,
          name: event.eventName,
          eventProperties: event.items.map((item) => `${item.property}:${item.value}`).join(', '),
          ...event,
        }));
  
        setTableData(updatedRows);
        setSelectedOrganization(organizationDetails);
      } catch (err) {
        //setError("Failed to fetch organization details");
        console.error(err);
      } finally {
        //setLoading(false);
      }
    };

  return (
    <div>
      <Header isShowCopy={true} />
      {showList ? <List /> : <Table />}
      <EventDrawer />

      {/* Main Table */}
      {/* {selectedOrganization ? (
        <Table />
      ) : (
        <div className="text-center text-gray-500">
          Please select an organization to view events.
        </div>
      )} */}
    </div>
  );
};

export default Index;
