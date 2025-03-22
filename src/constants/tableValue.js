import NameCellRenderer from "@/components/NameCellRender";

export const columns = [
  {
    field: "name",
    headerName: "NAME",
    renderCell: (params) => <NameCellRenderer params={params} />,
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
    field: "eventProperties",
    headerName: "EVENT PROPERTIES",
    flex: 1,
  },
  {
    field: "source",
    headerName: "SOURCE",
    flex: 1,
  },
];