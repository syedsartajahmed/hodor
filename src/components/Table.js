import { columns, rows } from "@/constants/tableValue";
import { useAppContext } from "@/context/AppContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";

const Table = () => {
  const { addEvent, tableData } = useAppContext();

  return (
    <div>
      <div></div>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={tableData}
          columns={columns}
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
