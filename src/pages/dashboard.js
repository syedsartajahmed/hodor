import Header from "@/components/Header";
import Table from "@/components/Table";
import EventDrawer from "@/components/EventDrawer";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <Header />
      <Table />
      <EventDrawer />
    </div>
  );
};

export default Dashboard;
