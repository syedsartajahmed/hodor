import { columns } from "@/constants/tableValue";
import { useAppContext } from "@/context/AppContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const Table = () => {
  const { tableData, toggleDrawer } = useAppContext();

  const handleRowClick = (params) => {
    const event = tableData.find((row) => row.id === params.id);
    toggleDrawer(true, event);
  };

  return (
    <div>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          onRowClick={handleRowClick}
          disableColumnFilter
          hideFooterPagination
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
              borderRight: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .MuiDataGrid-columnHeader:last-child, & .MuiDataGrid-cell:last-child":
              {
                borderRight: "none",
              },
          }}
        />
      </Box>
    </div>
  );
};

export default Table;
