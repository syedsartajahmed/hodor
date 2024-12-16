import Header from "@/components/Header";
import Table from "@/components/Table";
import EventDrawer from "@/components/EventDrawer";
import React from "react";
import List from "@/components/List";
import { useAppContext } from "@/context/AppContext";

const Dashboard = () => {
  const { showList } = useAppContext();

  return (
    <div>
      <Header />
      {showList ? <List /> : <Table />}
      <EventDrawer />
    </div>
  );
};

export default Dashboard;
