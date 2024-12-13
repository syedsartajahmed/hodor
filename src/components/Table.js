import { columns } from "@/constants/tableValue";
import { useAppContext } from "@/context/AppContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const Table = () => {
  const { tableData, toggleEventDrawer } = useAppContext();

  const renderEventName = (params) => (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevents row-level click from interfering
        toggleEventDrawer(true, params.row); // Opens the right drawer with event data
      }}
      className="text-indigo-500 hover:underline focus:outline-none"
    >
      {params.row.name}
    </button>
  );

  const modifiedColumns = columns.map((col) => {
    if (col.field === "name") {
      return { ...col, renderCell: renderEventName }; // Attach the event click logic
    }
    return col;
  });

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={modifiedColumns}
        disableColumnFilter
        hideFooterPagination
        hideFooter
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Table;
