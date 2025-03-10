import React from "react";
import { useRecoilState } from "recoil";
import { eventDrawerState } from "@/recoil/atom"; // Adjust the import path as necessary

const NameCellRenderer = ({ params }) => {
  const [drawerState, setDrawerState] = useRecoilState(eventDrawerState);

  const handleClick = () => {
    const event = params.api.getRowNode(params.row.id).data; // Get the row data directly from params
    setDrawerState({ isEventDrawerOpen: true, selectedEvent: event }); // Open the drawer and set the selected event
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        flex: 1,
      }}
    >
      <p style={{ margin: 0 }}>{params.row.name}</p>
      <p style={{ margin: 0, fontSize: "0.8em", color: "gray" }}>
        {params.row.description}
      </p>
    </div>
  );
};

export default NameCellRenderer;