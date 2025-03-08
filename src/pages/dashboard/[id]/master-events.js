import React, { useEffect } from "react";
import Header from "@/components/Header";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tableDataState, showListState } from "@/recoil/atoms";

const MasterEvents = () => {
  const setTableData = useSetRecoilState(tableDataState);
  const showList = useRecoilValue(showListState);

  useEffect(() => {
    fetchMasterEvents();
  }, []);

  const fetchMasterEvents = async () => {
    try {
      const response = await axios.get("/api/master-events");
      const masterEventsDetails = response.data;
      console.log(masterEventsDetails);
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

            const superProps =
              item.super_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";

            const userProps =
              item.user_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";

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
        ...event,
      }));

      setTableData(updatedRows);
    } catch (err) {
      console.error("Failed to fetch master events:", err);
    }
  };

  return (
    <>
      <Navbar />
      <Header isShowFilter={true} />
      {showList ? (
        <List />
      ) : (
        <Table isShowOrganization={true} page="master-events" isShowCopy={true} />
      )}
      <EventDrawer />
    </>
  );
};

export default MasterEvents;
