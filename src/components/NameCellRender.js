import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tableDataState, drawerState } from "@/recoil/atom";

const NameCellRenderer = ({ params }) => {
  const tableData = useRecoilValue(tableDataState);
  const setDrawerState = useSetRecoilState(drawerState);

  const handleClick = () => {
    const event = tableData.find((row) => row.id === params.row.id);
    if (event) {
      setDrawerState({ isOpen: true, event });
    }
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
