import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const {
    setSelectedOrganization,
    setTableData,
    showList,
    setCurrentOrganization,
    setAllEvents,
  } = useAppContext();

  const router = useRouter();
  const { organization, id } = router.query;

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
      //setError("Failed to fetch organization details");
      console.error(err);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <>
      <Navbar hideHeader={true} />
      <Header isShowCopy={false} />
      {showList ? <List /> : <Table isEventPage={true} page={"dashboard"} />}
      <EventDrawer isShowSave={false} />
      <Footer />
    </>
  );
};

export default Index;
