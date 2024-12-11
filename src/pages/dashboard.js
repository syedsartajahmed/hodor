import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";

const columns = [
  {
    field: "name",
    headerName: "NAME",
    renderCell: (params) => (
      <div onClick={() => console.log("Clicked on the Event")}>
        <p style={{ margin: 0 }}>{params.row.name}</p>
        <p style={{ margin: 0, fontSize: "0.8em", color: "gray" }}>
          {params.row.description}
        </p>
      </div>
    ),
    flex: 1,
  },
  {
    field: "stakeholders",
    headerName: "STAKEHOLDERS",
    flex: 1,
  },
  {
    field: "category",
    headerName: "CATEGORY",
    flex: 1,
  },
  {
    field: "propertyBundles",
    headerName: "PROPERTY BUNDLES",
    flex: 1,
  },
  {
    field: "eventProperties",
    headerName: "EVENT PROPERTIES",
    flex: 1,
  },
  {
    field: "groupProperties",
    headerName: "GROUP PROPERTIES",
    flex: 1,
  },
  {
    field: "source",
    headerName: "SOURCE",
    flex: 1,
  },
  {
    field: "action",
    headerName: "ACTION",
    flex: 1,
  },
];

const rows = [
  {
    id: 1,
    name: "Event Name",
    description: "Description",
    stakeholders: "",
    category: "User Interaction",
    propertyBundles: "checkout_properties",
    eventProperties:
      "5:utm_source,utm_medium,utm_campaign,utm_term,utm_content",
    groupProperties: "Write anything here...",
    source: "IOS, Backend",
    action: "ACTION",
  },
  {
    id: 2,
    name: "Event Name",
    description: "Description",
    stakeholders: "stakeholders",
    category: "User Interaction",
    propertyBundles: "checkout_properties",
    eventProperties:
      "5:utm_source,utm_medium,utm_campaign,utm_term,utm_content",
    groupProperties: "",
    source: "IOS, Backend",
  },
];

const Dashboard = () => {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnFilter
        hideFooterPagination
        hideFooter
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
  );
};

export default Dashboard;
