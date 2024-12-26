import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import OrganizationDrawer from "@/components/OrganizationDrawer";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const MasterEvents = () => {
    const {
      isOrgDrawerOpen,
      toggleOrgDrawer,
      setSelectedOrganization,
      selectOrganization,
      setTableData,
      showList,
      currentOrganization,
    } = useAppContext();


    useEffect(() => {
        fetchMasterEvents();
    }, []);

    const fetchMasterEvents = async () => {
        try {          
            const response = await axios.get('/api/master-events');
            const masterEventsDetails = response.data;      
            const totalEvents = masterEventsDetails.totalEvents || [];
            const updatedRows = totalEvents.map((event) => ({
            id: event._id,
                name: event.eventName,
            
                eventProperties: event.items
                .filter(
                  (item) =>
                    (item.event_property && item.event_property.length > 0) ||
                    (item.super_property && item.super_property.length > 0) ||
                    (item.user_property && item.user_property.length > 0)
                )
                .map((item) => {
                  const eventProps = item.event_property?.length ? 'Event Property' : '';
                  const superProps = item.super_property?.length ? 'Super Property' : '';
                  const userProps = item.user_property?.length ? 'User Property' : '';
              
                  return [eventProps, userProps, superProps].filter(Boolean).join(', ');
                })
                .join('; '),
            stakeholders: event.stakeholders,
            category: event.category,
            propertyBundles: event.propertyBundles,
            groupProperty: event.groupProperty,
            source: event.source,
                action: event.action,
                platform: event.platform,
                ...event,
            }));
            console.log(updatedRows)
        
            setTableData(updatedRows);
        } catch (err) {
        //setError("Failed to fetch organization details");
        console.error(err);
        } finally {
        //setLoading(false);
        }
    };

    return (
        <div>
          <Header/>
          {showList ? <List /> : <Table page="master-events"/>}
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

export default MasterEvents;
