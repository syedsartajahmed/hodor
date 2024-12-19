"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
  Tooltip,
  Alert,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DrawerProperties = () => {
  return (
    <Box
      sx={{ p: 2, maxWidth: 600, backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Actions
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography fontWeight="bold">Update User Properties</Typography>
            <Tooltip title="Info about Update User Properties">
              <IconButton sx={{ ml: 1 }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Add one or more user properties that should be attached to the
            user’s profile in your analytics tool.
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              <strong>product_id</strong> (string) — Always sent
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Identifier for the product
            </Typography>
          </Box>
          <Button variant="text" color="primary">
            + Add User Property
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography fontWeight="bold">Log Event</Typography>
            <Tooltip title="Info about Log Event">
              <IconButton sx={{ ml: 1 }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              EVENT PROPERTIES
            </Typography>

            <Box sx={{ pl: 2, mb: 2 }}>
              <Typography variant="body2">
                <strong>checkout_properties</strong> — Bundle of 6 Properties
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Properties related to checkouts
              </Typography>
            </Box>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                <strong>product_id</strong> (string) — Always sent
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Identifier for the product
              </Typography>
            </Box>

            <Button variant="text" color="primary" sx={{ mt: 1 }}>
              + Add Event Property
            </Button>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              SYSTEM PROPERTIES
            </Typography>
            <Box>
              <Typography variant="body2">
                <strong>app_name</strong> (string) — Always sent
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Name of the application generating the events
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="body2">
                <strong>app_version</strong> (string) — Always sent
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Version of the application creating the events
              </Typography>
            </Box>
            <Button variant="text" color="primary" sx={{ mt: 1 }}>
              + Add System Property
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box mt={2}>
        <Button variant="text" color="primary">
          + Add Action
        </Button>
      </Box>
    </Box>
  );
};

export default DrawerProperties;
