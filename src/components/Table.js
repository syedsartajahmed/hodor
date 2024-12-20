import { columns } from "@/constants/tableValue";
import { useAppContext } from "@/context/AppContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import DeleteCellRenderer from "@/components/DeleteCellRenderer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Table = ({ page, isShowCopy }) => {
  const { tableData, toggleDrawer } = useAppContext();

  const handleCopy = (rowData) => {
    console.log("Copied row data:", rowData);
    //add api call
  };

  const enhancedColumns = [
    ...columns,
    {
      field: "delete",
      headerName: "DELETE",
      renderCell: (params) => <DeleteCellRenderer params={params} page={page} />,
      width: 100,
    },
    ...(isShowCopy
      ? [
          {
            field: "copy",
            headerName: "Copy to Organization",
            renderCell: (params) => (
              <ContentCopyIcon
                onClick={() => handleCopy(params.row)}
                style={{ cursor: "pointer" }}
              />
            ),
            width: 150,
          },
        ]
      : []),
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
