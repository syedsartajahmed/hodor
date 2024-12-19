import { columns } from "@/constants/tableValue";
import { useAppContext } from "@/context/AppContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import DeleteCellRenderer from "@/components/DeleteCellRenderer";

const Table = ({ page }) => {
  const { tableData, toggleDrawer } = useAppContext();

  const enhancedColumns = [
    ...columns,
    {
      field: "delete",
      headerName: "DELETE",
      renderCell: (params) => <DeleteCellRenderer params={params} page={page} />,
      width: 100,
    },
  ];

  return (
    <div>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={tableData}
          columns={enhancedColumns}
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
