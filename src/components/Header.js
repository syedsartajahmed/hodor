import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { rows } from "@/constants/tableValue";
import AddEventModal from "./AddEventModal";
import { useAppContext } from "@/context/AppContext";
import NewCategoryModal from "./NewCategory";

const Header = () => {
  const [view, setView] = useState("category");
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { tableData } = useAppContext();

  const eventSize = tableData.length;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        padding={2}
        borderBottom="1px solid #e0e0e0"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight="bold">
            Events ({eventSize})
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleOpen}>
            + New Event
          </Button>
          <Button variant="outlined" onClick={() => setCategoryOpen(true)}>
            + New Category
          </Button>
        </Box>

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
      {open && <AddEventModal open={open} setOpen={setOpen} />}
      {categoryOpen && (
        <NewCategoryModal open={categoryOpen} setOpen={setCategoryOpen} />
      )}
    </>
  );
};

export default Header;
