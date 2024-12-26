import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useRef } from "react";
import DeleteIcon from '@mui/icons-material/Delete';




const DrawerProperties = () => {

  const isInitialLoad  = useRef(true);
  const [showUserProperties, setShowUserProperties] = useState(false);
  const [showLogEvent, setShowLogEvent] = useState(false);
  const [showIdentifyMessage, setShowIdentifyMessage] = useState(false);
  const [showUnidentifyMessage, setShowUnidentifyMessage] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

   const { isEventDrawerOpen,tabledata, toggleEventDrawer, selectedEvent, setSelectedEvent , currentOrganization, setTableData,setSelectedOrganization } = useAppContext();


  const [eventProperties, setEventProperties] = useState([
    { name: "", value: "", type: "String", sampleValue: "" },
  ]);

  const [superProperties, setSuperProperties] = useState([
    { name: "", value: "" },
  ]);

  const [userProperties, setUserProperties] = useState([
    { name: "", value: "" },
  ]);

  const [stakeholders, setStakeholders] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [action, setAction] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [source, setSource] = useState([]);

  const stakeholderOptions = [
    "Executive Sponsor",
    "Main Point of Contact",
    "Product Lead",
    "Product Team",
    "Marketing / Growth",
    "Customer Success",
    "Technical Lead",
    "Technical Team",
    "Data Team",
  ];

  const platformOptions = [
    "Web",
    "Android",
    "iOS",
    "Server Side",
    "All Client Side",
    "All Mobile",
    "All Platforms",
  ];

  const sourceOptions = [
    "Website",
    "Backend",
    "Android",
    "iOS",
  ];

  const methodCallOptions = [
    "Identify",
    "Reset",
    "Track",
    "Register Once",
    "Register",
    "Unregister",
    "People Set",
    "People Set Once",
    "People Increment",
    "People Unset",
    "People Append",
    "People Union",
    "Time Event",
    "Opt In Tracking",
    "Opt Out Tracking",
  ];
  
  const dataTypeOptions = ["String", "Numeric", "Boolean", "Date", "List", "Incremental"];
  

  // const handleEventPropertyChange = (index, field, value) => {
  //   const updatedProperties = [...eventProperties];
  //   updatedProperties[index][field] = value;
  //   setEventProperties(updatedProperties);
  
  //   // Sync with selectedEvent
  //   setSelectedEvent((prevEvent) => ({
  //     ...prevEvent,
  //     add_event_properties: updatedProperties,
  //   }));
  // };

  const handleEventPropertyChange = (index, field, value) => {
    const updatedProperties = [...eventProperties];
    updatedProperties[index][field] = value;
    setEventProperties(updatedProperties);

    setSelectedEvent((prevEvent) => {
      // Make a copy of the current items
      const updatedItems = [...(prevEvent.items || [])];
  
      // Check if the first item exists
      if (updatedItems[0]) {
        // Update the event_property of the first item
        updatedItems[0] = {
          ...updatedItems[0], // Spread existing properties
          event_property: updatedProperties, // Update event_property
        };
      } else {
        // If items[0] does not exist, initialize it
        updatedItems[0] = {
          user_property: [],
          event_property: updatedProperties,
          super_property: [],
        };
      }
  
      // Return the updated event
      return {
        ...prevEvent,
        items: updatedItems,
      };
    });
  };
  

  const handleSuperPropertyChange = (index, field, value) => {
    const updatedProperties = [...superProperties];
    updatedProperties[index][field] = value;
    setSuperProperties(updatedProperties);
  
    // Sync with selectedEvent
    setSelectedEvent((prevEvent) => {
      // Make a copy of the current items
      const updatedItems = [...(prevEvent.items || [])];
  
      // Check if the first item exists
      if (updatedItems[0]) {
        // Update the super_property of the first item
        updatedItems[0] = {
          ...updatedItems[0], // Spread existing properties
          super_property: updatedProperties, // Update super_property
        };
      } else {
        // If items[0] does not exist, initialize it
        updatedItems[0] = {
          user_property: [],
          event_property: [],
          super_property: updatedProperties,
        };
      }
  
      // Return the updated event
      return {
        ...prevEvent,
        items: updatedItems,
      };
    });
  };
  

  // const handleSuperPropertyChange = (index, field, value) => {
  //   const updatedProperties = [...superProperties];
  //   updatedProperties[index][field] = value;
  //   setSuperProperties(updatedProperties);
  
  //   // Sync with selectedEvent
  //   setSelectedEvent((prevEvent) => ({
  //     ...prevEvent,
  //     system_properties: updatedProperties,
  //   }));
  // };

  const handleUserPropertyChange = (index, field, value) => {
    const updatedProperties = [...userProperties];
    updatedProperties[index][field] = value;
    setUserProperties(updatedProperties);
    console.log(updatedProperties);
  
    // Sync with selectedEvent
    // setSelectedEvent((prevEvent) => ({

    //   ...prevEvent,
    //   user_properties: updatedProperties,
    // }));
    // console.log(selectedEvent.items[0].user_property);
    setSelectedEvent((prevEvent) => {
      // Make a copy of the current items
      const updatedItems = [...(prevEvent.items || [])];
    
      // Check if the first item exists
      if (updatedItems[0]) {
        // Update the user_property of the first item
        updatedItems[0] = {
          ...updatedItems[0], // Spread existing properties
          user_property: updatedProperties, // Update user_property
        };
      } else {
        // If items[0] does not exist, initialize it
        updatedItems[0] = {
          user_property: updatedProperties,
          event_property: [],
          super_property: [],
        };
      }
    
      // Return the updated event
      return {
        ...prevEvent,
        items: updatedItems,
      };
    });
    
  };
  

  const addUserProperty = () => {
    setUserProperties((prev) => {
      const updated = [...prev, { name: "", value: "" }];
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        user_properties: updated,
      }));
      return updated;
    });
  };
  
  const addEventProperty = () => {
    setEventProperties((prev) => {
      const updated = [...prev, { name: "", value: "", type: "String", sampleValue: "", methodCall: "Track" }];
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        add_event_properties: updated,
      }));
      return updated;
    });
  };
  
  const addSuperProperty = () => {
    setSuperProperties((prev) => {
      const updated = [...prev, { name: "", value: "" }];
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        system_properties: updated,
      }));
      return updated;
    });
  };

  const handleStakeholdersChange = (event) => {
    const {
      target: { value },
    } = event;
    setStakeholders(typeof value === "string" ? value.split(",") : value);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent, 
      stakeholders:  value, 
    }));

      console.log(selectedEvent);

    
    console.log(value)
  };

  const handlePlatformsChange = (event) => {
    const {
      target: { value },
    } = event;
    setPlatforms(typeof value === "string" ? value.split(",") : value);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent, 
      platform:  value, 
    }));
    console.log(selectedEvent);
  };

  const handleSourceChange = (event) => {
    const {
      target: { value },
    } = event;
    setSource(typeof value === "string" ? value.split(",") : value);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent, 
      source:  value, 
    }));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent, 
      category:  event.target.value, 
    }));
  };

  const handleDescriptionChange = (event) => {
    console.log(selectedEvent);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent, 
      description: event.target.value, 
      event_definition: event.target.value, 

    }));
    console.log(selectedEvent);
    setDescription(event.target.value);
    
  };

  const addEventProperty1 = () => {
    setEventProperties([
      ...eventProperties,
      { name: "", value: "", type: "String", sampleValue: "" },
    ]);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      add_event_properties: eventProperties,
    }));
  };

  const addSuperProperty2 = () => {
    setSuperProperties([...superProperties, { name: "", value: "" }]);
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      system_properties: superProperties,
    }));
  };

  const addUserProperty3 = () => {
    setUserProperties([...userProperties, { name: "", value: "" }]);
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        user_properties: userProperties,
      }));

    console.log(userProperties);
  };

//   const generateCode = () => {
//       // if (eventProperties.some((prop) => !prop.name || !prop.value)) {
//     //   alert("Please complete all event properties.");
//     //   return;
//     // }

//     // if (superProperties.some((prop) => !prop.name || !prop.value)) {
//     //   alert("Please complete all super properties.");
//     //   return;
//     // }

//     // if (userProperties.some((prop) => !prop.name || !prop.value)) {
//     //   alert("Please complete all user properties.");
//     //   return;
//     // }

//     // const eventPropsCode = eventProperties
//     //   .map(
//     //     (prop) =>
//     //       `\t\t"${prop.name}": product.${prop.name}, // data type: ${prop.type}, sample value: ${prop.sampleValue}`
//     //   )
//     //   .join(",\n");
    
//     const eventPropsCode = eventProperties.length > 0
//     ? eventProperties
//         .map(
//           (prop) =>
//             `\t\t"${prop.name}": product.${prop.name}, // Method: ${prop.methodCall}, Data type: ${prop.dataType}, Sample value: ${prop.sampleValue}`
//         )
//         .join(",\n")
//     : "";

//     // Generate super properties code only if superProperties is not empty
    
//     console.log(superProperties)
//   const superPropsCode = superProperties.length > 0
//     ? superProperties
//         .map((prop) => `\t\t"${prop.name}": product.${prop.name}`)
//         .join(",\n")
//     : "";

//   // Generate user properties code only if userProperties is not empty
//   const userPropsCode = userProperties.length > 0
//     ? userProperties
//         .map((prop) => `\t\t"${prop.name}": product.${prop.name}`)
//         .join(",\n")
//     : "";

//   // Build the function dynamically based on the available properties
//   const codeParts = [];

//   if (superPropsCode) {
//     codeParts.push(`
//       mixpanel.register({
// ${superPropsCode}
//       });
//     `);
//   }

//   if (userPropsCode) {
//     codeParts.push(`
//       mixpanel.people.set({
// ${userPropsCode}
//       });
//     `);
//   }

//   if (eventPropsCode) {
//     codeParts.push(`
//       mixpanel.track("event_triggered", {
// ${eventPropsCode}
//       });
//     `);
//   }

//   // Combine all parts into the final function code
//   const code = codeParts.length > 0
//     ? `
// function logEvent(product) {
// ${codeParts.join("\n")}
// }
//   `
//     : `
// function logEvent(product) {
//   // No properties to log
// }
//   `;

//   setGeneratedCode(code);
//   };
  

  const generateCode = () => {
    const eventName = selectedEvent?.name?.trim()
    ? selectedEvent.name
        .trim()
        .replace(/[_\s]+(.)/g, (_, char) => char.toUpperCase()) 
        .replace(/^(.)/, (_, char) => char.toLowerCase())       
    : "unnamedEvent";
  
    
  // Filter out invalid properties with empty name or value
  const validSuperProperties = superProperties.filter(
    (prop) => prop.name?.trim() && prop.value?.trim()
  );

  const validUserProperties = userProperties.filter(
    (prop) => prop.name?.trim() && prop.value?.trim()
  );

  const validEventProperties = eventProperties.filter(
    (prop) => prop.name?.trim() && prop.value?.trim()
  );

  // Generate event properties code only if validEventProperties is not empty
  const eventPropsCode = validEventProperties.length > 0
    ? validEventProperties
        .map(
          (prop) =>
            `\t\t"${prop.name}": product.${prop.name}, // Method: ${prop.methodCall}, Data type: ${prop.dataType}, Sample value: ${prop.sampleValue}`
        )
        .join(",\n")
    : "";

  // Generate super properties code only if validSuperProperties is not empty
  const superPropsCode = validSuperProperties.length > 0
    ? validSuperProperties
        .map((prop) => `\t\t"${prop.name}": product.${prop.name}`)
        .join(",\n")
    : "";

  // Generate user properties code only if validUserProperties is not empty
  const userPropsCode = validUserProperties.length > 0
    ? validUserProperties
        .map((prop) => `\t\t"${prop.name}": product.${prop.name}`)
        .join(",\n")
    : "";

  // Build the function dynamically based on the available properties
  const codeParts = [];

      if (superPropsCode) {
        codeParts.push(`
          mixpanel.register({
    ${superPropsCode}
          });
        `);
      }

      if (userPropsCode) {
        codeParts.push(`
          mixpanel.people.set({
    ${userPropsCode}
          });
        `);
      }

      if (eventPropsCode) {
        codeParts.push(`
          mixpanel.track("event_triggered", {
    ${eventPropsCode}
          });
        `);
      }

      // Combine all parts into the final function code
      const code = codeParts.length > 0
        ? `
    function ${eventName}(product) {
    ${codeParts.join("\n")}
    }
        `
        : `
    function ${eventName}(product) {
      // No properties to log
    }
        `;

      setGeneratedCode(code);
  };
  

  const removeSuperPropertySet = (index) => {
    const updatedProperties = [...superProperties];
    updatedProperties.splice(index, 1); // Remove the specific set
    setSuperProperties(updatedProperties);
  
    // If all super properties are deleted, handle visibility
    if (updatedProperties.length === 0) {
      setShowLogEvent(false); // Hide log event when no super properties are left
    }
  };
  
  const removeUserPropertySet = (index) => {
    console.log(userProperties)
    const updatedProperties = [...userProperties];
    updatedProperties.splice(index, 1); // Remove the specific set
    setUserProperties(updatedProperties);
  
    // If all user properties are deleted, handle visibility
    if (updatedProperties.length === 0) {
      setShowUserProperties(false); // Hide user properties section
    }
  };
  
  const removeEventPropertySet = (index) => {
    const updatedProperties = [...eventProperties];
    updatedProperties.splice(index, 1); // Remove the specific set
    setEventProperties(updatedProperties);
  
    // If all event properties are deleted, handle visibility
    if (updatedProperties.length === 0) {
      setShowLogEvent(false); // Hide log event section
    }
  };
  

  
  useEffect(() => {
    if (selectedEvent && isInitialLoad.current) {
      isInitialLoad.current = false;
  
      // Initialize values from `selectedEvent`
      console.log(selectedEvent);
  
      setDescription(selectedEvent.event_definition || "");
      setStakeholders(selectedEvent.stakeholders || []);
      setCategory(selectedEvent.category || "");
      setPlatforms(selectedEvent.platform || []);
      setSource(selectedEvent.source || []);
  
      // Event properties
      if (selectedEvent.items?.some((item) => item.event_property?.length > 0)) {
        const eventProps = selectedEvent.items.flatMap((item) =>
          item.event_property.map((prop) => ({
            name: prop.property_name,
            value: prop.sample_value || "",
            type: prop.data_type || "String",
            sampleValue: prop.sample_value || "",
            methodCall: prop.method_call || "",
          }))
        );
        setEventProperties(eventProps);
        setShowLogEvent(true);
      } else {
        console.log('nnononn')
        setEventProperties([{ name: "", value: "", type: "String", sampleValue: "" }]);
        setShowLogEvent(false);
      }
  
      // Super properties
      if (selectedEvent.items?.some((item) => item.super_property?.length > 0)) {
        const superProps = selectedEvent.items.flatMap((item) =>
          item.super_property.map((prop) => ({
            name: prop.name,
            value: prop.value || "",
          }))
        );
        setSuperProperties(superProps);
      } else {
        setSuperProperties([{ name: "", value: "" }]);
      }
  
      // User properties
      if (selectedEvent.items?.some((item) => item.user_property?.length > 0)) {
        console.log('adfafafaaa')
        const userProps = selectedEvent.items.flatMap((item) =>
          item.user_property.map((prop) => ({
            name: prop.name,
            value: prop.value || "",
          }))
        );
        setUserProperties(userProps);
        setShowUserProperties(true);
      } else {
        setUserProperties([{ name: "", value: "" }]);
        setShowUserProperties(false);
      }
  
      setShowIdentifyMessage(selectedEvent.identify || false);
      setShowUnidentifyMessage(selectedEvent.unidentify || false);
    }
  }, [selectedEvent]);
  
  return (
    <Box
      sx={{ p: 2, maxWidth: 600, backgroundColor: "#fafafa", borderRadius: 2 }}
    >
            <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
        margin="normal"
        
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Stakeholders</InputLabel>
        <Select
          multiple
          //need to chagne here
          value={stakeholders}

          onChange={handleStakeholdersChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {stakeholderOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={stakeholders.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Category"
        value={selectedEvent?.category}
        onChange={handleCategoryChange}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Platforms</InputLabel>
        <Select
          multiple
          value={platforms}
          onChange={handlePlatformsChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {platformOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={platforms.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Source</InputLabel>
        <Select
          multiple
          value={source}
          onChange={handleSourceChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {sourceOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={source.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Actions Heading */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Actions
      </Typography>

      <Box sx={{ mb: 2 }}>
        {!showUserProperties && !showLogEvent && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Add actions to proceed.
            </Typography>
          </Box>
        )}
        {!showUserProperties && (
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 2, mt: 1 }}
            startIcon={<AddIcon />}
            onClick={() => setShowUserProperties(true)}
          >
            Add Update User Properties
          </Button>
        )}
        {!showLogEvent && (
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 1 }}
            startIcon={<AddIcon />}
            onClick={() => setShowLogEvent(true)}
          >
            Add Log Event
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mr: 2, mt: 1 }}
          startIcon={<AddIcon />}
          onClick={() => {
            setShowIdentifyMessage(true);
            setSelectedEvent((prevEvent) => ({
              ...prevEvent,
              identify: true,
              unidentify: false,
            }));
          }}
          disabled={showUnidentifyMessage || showIdentifyMessage}
        >
          Identify
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 1 }}
          startIcon={<AddIcon />}
          onClick={() => {
            setShowUnidentifyMessage(true);
            setSelectedEvent((prevEvent) => ({
              ...prevEvent,
              identify: false,
              unidentify: true,
            }));
          }}
          disabled={showUnidentifyMessage || showIdentifyMessage}
        >
          Unidentify
        </Button>
      </Box>

      {showIdentifyMessage && (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          <strong>Identify User:</strong> Identify the user in your analytics
          tool such that they go from anonymous to a user with a user ID.
        </Typography>
      )}

      {showUnidentifyMessage && (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          <strong>Unidentify User:</strong> Unidentify the user in your analytics
          tool such that they go from an identified user with a user ID to an
          anonymous user.
        </Typography>
      )}

      {showUserProperties && (
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
                  onChange={(e) =>
                    handleUserPropertyChange(index, "name", e.target.value)
                   // handleTempEventPropertyChange("name", e.target.value)
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="User Property Value"
                  value={property.value}
                  onChange={(e) =>
                    handleUserPropertyChange(index, "value", e.target.value)
                  }
                  fullWidth
                  margin="dense"
                />
                    {/* <IconButton
                  color="secondary"
                  onClick={() => removeUserPropertySet(index)}
                >
                  <DeleteIcon />
                </IconButton> */}

                
              </Box>
            ))}
            <Button variant="text" color="primary" onClick={addUserProperty}>
              + Add User Property
            </Button>
          </AccordionDetails>
        </Accordion>
      )}

      {showLogEvent && (
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
    <FormControl fullWidth margin="dense">
      <InputLabel>Method Call</InputLabel>
      <Select
        value={property.methodCall}
        onChange={(e) =>
          handleEventPropertyChange(index, "methodCall", e.target.value)
        }
      >
        {methodCallOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label="Property Name"
      value={property.name}
      onChange={(e) =>
        handleEventPropertyChange(index, "name", e.target.value)
      }
      fullWidth
      margin="dense"
    />
    <TextField
      label="Property Value"
      value={property.value}
      onChange={(e) =>
        handleEventPropertyChange(index, "value", e.target.value)
      }
      fullWidth
      margin="dense"
    />
    <FormControl fullWidth margin="dense">
      <InputLabel>Data Type</InputLabel>
      <Select
        value={property.type}
        onChange={(e) =>
          handleEventPropertyChange(index, "dataType", e.target.value)
        }
      >
        {dataTypeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label="Sample Value"
      value={property.sampleValue}
      onChange={(e) =>
        handleEventPropertyChange(index, "sampleValue", e.target.value)
      }
      fullWidth
      margin="dense"
                  />
                  {/* <IconButton
                  color="secondary"
                  onClick={() => removeEventPropertySet(index)}
                >
                  <DeleteIcon />
                </IconButton> */}
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
      onChange={(e) =>
        handleSuperPropertyChange(index, "name", e.target.value)
      }
      fullWidth
      margin="dense"
    />
    <TextField
      label="Super Property Value"
      value={property.value}
      onChange={(e) =>
        handleSuperPropertyChange(index, "value", e.target.value)
      }
      fullWidth
      margin="dense"
                  />
                  {/* <IconButton
              color="secondary"
              onClick={() => removeSuperPropertySet(index)}
            >
              <DeleteIcon />
            </IconButton> */}

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
      )}
    </Box>
  );
};

export default DrawerProperties;
