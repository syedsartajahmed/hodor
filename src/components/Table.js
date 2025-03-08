import { columns } from "@/constants/tableValue";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tableDataState, drawerState, selectedEventState } from "@/recoil/atom";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import DeleteCellRenderer from "@/components/DeleteCellRenderer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { useRouter } from "next/router";
import showToast from "@/utils/toast";

const Table = ({
  page,
  isShowCopy,
  isShowOrganization = false,
  isEventPage = false,
}) => {
  const tableData = useRecoilValue(tableDataState);
  const setSelectedEvent = useSetRecoilState(selectedEventState);
  const setDrawerState = useSetRecoilState(drawerState);
  const router = useRouter();

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
        showToast("Copied successfully to your organization!");
      }
    } catch (err) {
      console.error("Error saving event:", err.message);
    }
  };

  const handleRowClick = (rowData) => {
    setSelectedEvent(rowData.row);
    setDrawerState({ isOpen: true, event: rowData.row });
  };

  const enhancedColumns = [
    ...columns,
    ...(isShowOrganization
      ? [
          {
            field: "organization",
            headerName: "INDUSTRY",
            flex: 1,
          },
        ]
      : []),
    ...(!isShowOrganization
      ? [
          {
            field: "status",
            headerName: "STATUS",
            width: 150,
          },
        ]
      : []),
    ...(!isEventPage
      ? [
          {
            field: "delete",
            headerName: "DELETE",
            renderCell: (params) => (
              <DeleteCellRenderer params={params} page={page} />
            ),
            width: 100,
          },
        ]
      : []),

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
  console.log(tableData);
    return (
    <div className="mx-10 mt-5 mb-[261px]">
      <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
  rows={tableData.map((row) => ({ ...row, id: row.id || row._id }))} // Ensure 'id' exists
  getRowClassName={() => "bg-lightgray-50"}
  columns={enhancedColumns}
  onRowClick={handleRowClick}
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
    "& .MuiDataGrid-columnHeader:last-child, & .MuiDataGrid-cell:last-child": {
      borderRight: "none",
    },
  }}
/>
      </Box>
    </div>
  );
};

export default Table;
