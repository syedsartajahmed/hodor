import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { rows } from "@/constants/tableValue";

const Header = () => {
  const [view, setView] = useState("category");
  const eventSize = rows.length;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      padding={2}
      borderBottom="1px solid #e0e0e0"
      gap={2}
    >
      {/* Left Section */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h6" fontWeight="bold">
          Events ({eventSize})
        </Typography>
        <Button variant="contained" color="secondary">
          + New Event
        </Button>
        <Button variant="outlined">+ New Category</Button>
      </Box>

      {/* Center Section */}
      <Box display="flex" alignItems="center">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="category" aria-label="category view">
            Category
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            List
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Right Section */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          aria-label="customize"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <CalendarViewMonthIcon />
          <Typography variant="body2">Customize</Typography>
        </IconButton>
        <IconButton
          aria-label="filter"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <FilterListIcon />
          <Typography variant="body2">Filter</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
