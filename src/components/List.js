import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  tableDataState,
  isDrawerOpenState,
  isEventDrawerOpenState,
  selectedEventState,
} from "@/recoil/atom";

const List = () => {
  const tableData = useRecoilValue(tableDataState);
  const setIsDrawerOpen = useSetRecoilState(isDrawerOpenState);
  const setIsEventDrawerOpen = useSetRecoilState(isEventDrawerOpenState);
  const setSelectedEvent = useSetRecoilState(selectedEventState);

  const groupByCategory = (data) => {
    return data.reduce((groups, item) => {
      const { category } = item;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  };

  const groupedData = groupByCategory(tableData);

  const columns = [
    "NAME",
    "STAKEHOLDERS",
    "CATEGORY",
    "PROPERTY BUNDLES",
    "EVENT PROPERTIES",
    "GROUP PROPERTIES",
    "SOURCE",
    "ACTION",
  ];

  const toggleDrawer = (open, event = null) => {
    setIsDrawerOpen(open);
    setIsEventDrawerOpen(open);
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
    console.log("Selected Event:", event);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 4,
        mb: 4,
        maxHeight: "750px",
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  position: "sticky",
                  top: 0,
                  zIndex: 1000,
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedData).map((category, idx) => (
            <React.Fragment key={idx}>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    backgroundColor: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h6">{category}</Typography>
                </TableCell>
              </TableRow>

              {groupedData[category].map((row) => (
                <TableRow key={row.id}>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      const event = tableData.find((item) => item.id === row.id);
                      toggleDrawer(true, event);
                    }}
                  >
                    <div>
                      <p style={{ margin: 0 }}>{row.name}</p>
                      <p
                        style={{ margin: 0, fontSize: "0.8em", color: "gray" }}
                      >
                        {row.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{row.stakeholders}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.propertyBundles}</TableCell>
                  <TableCell>{row.eventProperties}</TableCell>
                  <TableCell>{row.groupProperties}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{row.action}</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;