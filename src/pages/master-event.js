import React, { useEffect } from "react";
import Header from "@/components/Header";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Navbar from "@/components/Navbar";

const MasterEvents = () => {
  const { setTableData, showList } = useAppContext();

  useEffect(() => {
    fetchMasterEvents();
  }, []);

  const fetchMasterEvents = async () => {
    try {
      const response = await axios.get("/api/master-events");
      const masterEventsDetails = response.data;
      const totalEvents = masterEventsDetails.totalEvents || [];
      const updatedRows = totalEvents.map((event) => ({
        id: event._id,
        name: event.eventName,
        eventProperties: event.items
          .map((item) => {
            const eventProps =
              item.event_property
                ?.map(
                  (prop) =>
                    `${prop.property_name || "N/A"}: ${
                      prop.sample_value || "N/A"
                    }, method call: ${prop.method_call || "N/A"}`
                )
                .join("; ") || "";

            // Format Super Properties
            const superProps =
              item.super_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";

            // Format User Properties
            const userProps =
              item.user_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";

            // Combine all properties into a single formatted string
            return [
              eventProps ? `Event Properties: { ${eventProps} }` : "",
              superProps ? `Super Properties: { ${superProps} }` : "",
              userProps ? `User Properties: { ${userProps} }` : "",
            ]
              .filter(Boolean)
              .join(", ");
          })
          .join("; "),
        stakeholders: event.stakeholders,
        category: event.category,
        propertyBundles: event.propertyBundles,
        groupProperty: event.groupProperty,
        source: event.source,
        action: event.action,
        platform: event.platform,
        ...event,
      }));
      console.log(updatedRows);

      setTableData(updatedRows);
    } catch (err) {
      //setError("Failed to fetch organization details");
      console.error(err);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Header isShowFilter={true} />
      {showList ? (
        <List />
      ) : (
        <Table isShowOrganization={true} page="master-events" />
      )}
      <EventDrawer />
    </>
  );
};

export default MasterEvents;
