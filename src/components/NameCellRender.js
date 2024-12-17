import React from "react";
import { useAppContext } from "@/context/AppContext";

const NameCellRenderer = ({ params }) => {
  const { tableData, toggleDrawer } = useAppContext();

  const handleClick = () => {
    const event = tableData.find((row) => row.id === params.row.id);
    toggleDrawer(true, event);
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
