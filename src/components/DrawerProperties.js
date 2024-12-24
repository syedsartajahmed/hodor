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
  TextField,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DrawerProperties = () => {
  const [eventProperties, setEventProperties] = useState([{
    name: "",
    value: "",
    type: "String",
    sampleValue: ""
  }]);

  const [superProperties, setSuperProperties] = useState([{
    name: "",
    value: "",
  }]);

  const [userProperties, setUserProperties] = useState([{
    name: "",
    value: "",
  }]);

  const [generatedCode, setGeneratedCode] = useState("");

  const handleEventPropertyChange = (index, field, value) => {
    const updatedProperties = [...eventProperties];
    updatedProperties[index][field] = value;
    setEventProperties(updatedProperties);
  };

  const handleSuperPropertyChange = (index, field, value) => {
    const updatedProperties = [...superProperties];
    updatedProperties[index][field] = value;
    setSuperProperties(updatedProperties);
  };

  const handleUserPropertyChange = (index, field, value) => {
    const updatedProperties = [...userProperties];
    updatedProperties[index][field] = value;
    setUserProperties(updatedProperties);
  };

  const addEventProperty = () => {
    setEventProperties([...eventProperties, {
      name: "",
      value: "",
      type: "String",
      sampleValue: ""
    }]);
  };

  const addSuperProperty = () => {
    setSuperProperties([...superProperties, {
      name: "",
      value: ""
    }]);
  };

  const addUserProperty = () => {
    setUserProperties([...userProperties, {
      name: "",
      value: ""
    }]);
  };

  const generateCode = () => {
    if (eventProperties.some(prop => !prop.name || !prop.value)) {
      alert("Please complete all event properties.");
      return;
    }

    if (superProperties.some(prop => !prop.name || !prop.value)) {
      alert("Please complete all super properties.");
      return;
    }

    if (userProperties.some(prop => !prop.name || !prop.value)) {
      alert("Please complete all user properties.");
      return;
    }

    const eventPropsCode = eventProperties.map(prop => `\t\t"${prop.name}": product.${prop.name}, // data type: ${prop.type}, sample value: ${prop.sampleValue}`).join(",\n");

    const superPropsCode = superProperties.map(prop => `\t\t"${prop.name}": product.${prop.name}`).join(",\n");

    const userPropsCode = userProperties.map(prop => `\t\t"${prop.name}": product.${prop.name}`).join(",\n");

    const code = `
function logEvent(product) {
  mixpanel.track("event_triggered", {
${eventPropsCode}
  });

  mixpanel.people.set({
${userPropsCode}
  });

  mixpanel.register({
${superPropsCode}
  });
}
    `;
    setGeneratedCode(code);
  };

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
          {userProperties.map((property, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                label="User Property Name"
                value={property.name}
                onChange={(e) => handleUserPropertyChange(index, "name", e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="User Property Value"
                value={property.value}
                onChange={(e) => handleUserPropertyChange(index, "value", e.target.value)}
                fullWidth
                margin="dense"
              />
            </Box>
          ))}
          <Button variant="text" color="primary" onClick={addUserProperty}>
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
            {eventProperties.map((property, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  label="Property Name"
                  value={property.name}
                  onChange={(e) => handleEventPropertyChange(index, "name", e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Property Value"
                  value={property.value}
                  onChange={(e) => handleEventPropertyChange(index, "value", e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Type"
                  value={property.type}
                  onChange={(e) => handleEventPropertyChange(index, "type", e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Sample Value"
                  value={property.sampleValue}
                  onChange={(e) => handleEventPropertyChange(index, "sampleValue", e.target.value)}
                  fullWidth
                  margin="dense"
                />
              </Box>
            ))}
            <Button variant="text" color="primary" onClick={addEventProperty}>
              + Add Event Property
            </Button>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              SYSTEM PROPERTIES (SUPER PROPERTIES)
            </Typography>
            {superProperties.map((property, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  label="Super Property Name"
                  value={property.name}
                  onChange={(e) => handleSuperPropertyChange(index, "name", e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Super Property Value"
                  value={property.value}
                  onChange={(e) => handleSuperPropertyChange(index, "value", e.target.value)}
                  fullWidth
                  margin="dense"
                />
              </Box>
            ))}
            <Button variant="text" color="primary" onClick={addSuperProperty}>
              + Add System Property
            </Button>
          </Box>

          <Box mt={3}>
            <Button variant="contained" color="primary" onClick={generateCode}>
              Generate Code
            </Button>
          </Box>

          {generatedCode && (
            <Box mt={3}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                GENERATED CODE
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <pre>{generatedCode}</pre>
              </Box>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DrawerProperties;
