import { columns } from "@/constants/tableValue";
import { useAppContext } from "@/context/AppContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import DeleteCellRenderer from "@/components/DeleteCellRenderer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { useRouter } from 'next/router';

const Table = ({ page, isShowCopy, isShowOrganization = false }) => {
  const { tableData, toggleDrawer, setSelectedEvent } = useAppContext();
  const router = useRouter();
  const { pathname } = router;

  const handleCopy = async (rowData) => {
    const { query } = router; 
    const organizationId = query.id;
    const masterEventId = rowData.id;
    const payload = {
      organizationId,
      masterEventId,
    };

    try {
      const response = await axios.post("/api/copyMasterEvents", payload);
      if (response.status === 201) {
        alert('Copied successfully to your organization!');
      }
    } catch (err) {
      console.error("Error saving event:", err.message);
    } finally {
      
    }
  };

  const handleRowClick = (rowData) => {
    console.log(rowData.row); 
    setSelectedEvent(rowData.row);
    toggleDrawer(true, rowData.row); 
  };

  const enhancedColumns = [
    ...columns,
    ...(isShowOrganization
      ? [
          // {
          //   field: "organization",
          //   headerName: "Organization",
          //   renderCell: (params) => (
          //     <Box>
          //       {params.row.organization || "N/A"}
          //     </Box>
          //   ),
          //   width: 150,
        // },
        {
          field: "organization",
          headerName: "INDUSTRY",
          flex: 1,
        },
        ]
      : []),
      ...(!isShowOrganization
        ? [
            // {
            //   field: "organization",
            //   headerName: "Organization",
            //   renderCell: (params) => (
            //     <Box>
            //       {params.row.organization || "N/A"}
            //     </Box>
            //   ),
            //   width: 150,
          // },
          {
            field: "status",
            headerName: "STATUS",
            // flex: 1,
            width: 150,
          },
          ]
        : []),
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
  // console.log(tableData)

  return (
    <div className="mx-10 mt-5">
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={tableData}
          getRowClassName={(params) =>
            "bg-lightgray-50" 
          }
          columns={enhancedColumns}
          //onRowClick={handleRowClick}
          disableColumnFilter
          hideFooterPagination
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgb(243 244 246)", 
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
