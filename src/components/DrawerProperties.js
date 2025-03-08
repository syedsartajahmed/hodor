import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Add as AddIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Close,
} from "@mui/icons-material";
import styled from "@emotion/styled";
import showToast from "@/utils/toast";
import { useRecoilState } from "recoil";
import {
  selectedEventState,
  eventPropertiesState,
  superPropertiesState,
  userPropertiesState,
} from "@/recoil/atom";

const DrawerProperties = () => {
  const CodeBox = styled(Box)`
    background-color: #2d2d2d;
    color: #f8f8f2;
    padding: 16px;
    border-radius: 8px;
    font-family: "Courier New", Courier, monospace;
    white-space: pre-wrap;
    position: relative;
    overflow-x: auto;
  `;

  const isInitialLoad = useRef(true);
  const [showUserProperties, setShowUserProperties] = useState(false);
  const [showLogEvent, setShowLogEvent] = useState(false);
  const [showIdentifyMessage, setShowIdentifyMessage] = useState(false);
  const [showUnidentifyMessage, setShowUnidentifyMessage] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [triggerCode, setTriggerCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [functionName, setFunctionName] = useState("");
  
  const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventState);
  const [eventProperties, setEventProperties] = useRecoilState(eventPropertiesState);
  const [superProperties, setSuperProperties] = useRecoilState(superPropertiesState);
  const [userProperties, setUserProperties] = useRecoilState(userPropertiesState);

  const handleEventPropertyChange = (index, field, value) => {
    setEventProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index][field] = value;
      return updatedProperties;
    });
  };

  const handleSuperPropertyChange = (index, field, value) => {
    setSuperProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index][field] = value;
      return updatedProperties;
    });
  };

  const handleUserPropertyChange = (index, field, value) => {
    setUserProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index][field] = value;
      return updatedProperties;
    });
  };

  const addEventProperty = () => {
    setEventProperties((prev) => [
      ...prev,
      { name: "", value: "", type: "String", sample_value: "", method_call: "Track" },
    ]);
  };

  const addSuperProperty = () => {
    setSuperProperties((prev) => [...prev, { name: "", value: "" }]);
  };

  const addUserProperty = () => {
    setUserProperties((prev) => [...prev, { name: "", value: "" }]);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleConfirmDelete = () => {
    handleCloseDialog();
    // handleDelete(); // Implement delete logic
  };

  return (
    <Box>
      <Typography variant="h6">Drawer Properties</Typography>
      <Button onClick={addEventProperty} startIcon={<AddIcon />}>
        Add Event Property
      </Button>
      <Button onClick={addSuperProperty} startIcon={<AddIcon />}>
        Add Super Property
      </Button>
      <Button onClick={addUserProperty} startIcon={<AddIcon />}>
        Add User Property
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DrawerProperties;
