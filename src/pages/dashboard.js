import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import EventDrawer from "@/components/EventDrawer";
import Table from "@/components/Table";
import List from "@/components/List";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import {
  selectedOrganizationState,
  tableDataState,
  showListState,
  currentOrganizationState,
  allEventsState,
} from "@/recoil/atom";
import axios from "axios";

const Dashboard = () => {
  const setSelectedOrganization = useSetRecoilState(selectedOrganizationState);
  const setTableData = useSetRecoilState(tableDataState);
  const showList = useRecoilValue(showListState);
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const setAllEvents = useSetRecoilState(allEventsState);

  useEffect(() => {
    if (currentOrganization?.id) {
      fetchOrganizationDetails(currentOrganization.id);
    }
  }, [currentOrganization]);

  const fetchOrganizationDetails = async (organizationId) => {
    try {
      const response = await axios.get(`/api/organizations?organization_id=${organizationId}`);
      const organizationDetails = response.data;

      const events = organizationDetails.applications?.[0]?.events || [];
      setAllEvents(events);

      const updatedRows = events.map((event) => ({
        id: event._id,
        name: event.eventName,
        eventProperties: event.items
          .map((item) => `${item.property}:${item.value}`)
          .join(", "),
        ...event,
      }));

      setTableData(updatedRows);
      setSelectedOrganization(organizationDetails);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header isShowCopy={true} />
      {showList ? <List /> : <Table />}
      <EventDrawer />
    </div>
  );
};

export default Dashboard;