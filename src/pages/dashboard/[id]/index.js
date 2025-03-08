import React, { useEffect } from "react";
import Header from "@/components/Header";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { useSetRecoilState, useRecoilState } from "recoil";
import {
  selectedOrganizationState,
  tableDataState,
  showListState,
  currentOrganizationState,
  allEventsState,
} from "@/recoil/atoms";

const Index = () => {
  const setSelectedOrganization = useSetRecoilState(selectedOrganizationState);
  const setTableData = useSetRecoilState(tableDataState);
  const setCurrentOrganization = useSetRecoilState(currentOrganizationState);
  const setAllEvents = useSetRecoilState(allEventsState);
  const [showList] = useRecoilState(showListState);

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
        status: event.status,
        ...event,
      }));

      setTableData(updatedRows);
      setSelectedOrganization(organizationDetails);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <Header isShowCopy={true} isShowMasterEvents={true} isShowDownload={true} />
      {showList ? <List /> : <Table page={"dashboard"} />}
      <EventDrawer />
    </>
  );
};

export default Index;