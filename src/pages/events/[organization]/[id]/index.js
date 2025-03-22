import React, { useEffect } from "react";
import Header from "@/components/Header";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  selectedOrganizationState,
  tableDataState,
  showListState,
  currentOrganizationState,
  allEventsState,
} from "@/recoil/atom";

const Index = () => {
  const setSelectedOrganization = useSetRecoilState(selectedOrganizationState);
  const setTableData = useSetRecoilState(tableDataState);
  const showList = useRecoilValue(showListState);
  const setCurrentOrganization = useSetRecoilState(currentOrganizationState);
  const setAllEvents = useSetRecoilState(allEventsState);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails(id);
    }
  }, [id]);

  const fetchOrganizationDetails = async (organizationId) => {
    try {
      const response = await axios.get(
        `/api/organizations?organization_id=${organizationId}`
      );
      const organizationDetails = response.data;
      const events = organizationDetails.applications?.[0]?.events || [];
      setAllEvents(events);

      const firstApplication = organizationDetails.applications?.[0] || {};

      setCurrentOrganization({
        id: organizationDetails._id,
        name: organizationDetails.name,
        applicationId: firstApplication._id || null,
        applicationDetails: {
          apiSecret: firstApplication.apiSecret || "",
          projectId: firstApplication.projectId || "",
          serviceAccountPassword: firstApplication.serviceAccountPassword || "",
          token: firstApplication.token || "",
        },
      });

      const updatedRows = events.map((event) => ({
        id: event._id,
        name: event.eventName,

        eventProperties: event.items
          .map((item) => {
            // Format Event Properties
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
        ...event,
      }));

      setTableData(updatedRows);
      setSelectedOrganization(organizationDetails);
    } catch (err) {
      console.error(err);
    }
  };

  return (
<div className="ml-64">
<Navbar hideHeader={true} />
      <Header isShowCopy={false} />
      {showList ? <List /> : <Table isEventPage={true} page={"dashboard"} />}
      <EventDrawer isShowSave={false} />
      <Footer />
    </div>
  );
};

export default Index;
