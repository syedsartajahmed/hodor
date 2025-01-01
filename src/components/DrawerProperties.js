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
import DrawerPropertiesWithEnvironment from './DrawerPropertiesWithEnvironment';




const DrawerProperties = () => {

  const isInitialLoad  = useRef(true);
  const [showUserProperties, setShowUserProperties] = useState(false);
  const [showLogEvent, setShowLogEvent] = useState(false);
  const [showIdentifyMessage, setShowIdentifyMessage] = useState(false);
  const [showUnidentifyMessage, setShowUnidentifyMessage] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [triggerCode, setTriggerCode] = useState("");

   const { isEventDrawerOpen,tabledata, toggleEventDrawer, selectedEvent, setSelectedEvent , currentOrganization, setTableData,setSelectedOrganization } = useAppContext();


  const [eventProperties, setEventProperties] = useState([
    { name: "", value: "", property_definition: "", type: "String", sampleValue: "" },
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
  const [organization, setOrganization] = useState("");
  const [isMasterEventPage, setIsMasterEventPage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMasterEventPage(
        window.location.pathname.includes("master-event") ||
        window.location.pathname.includes("master-events")
      );
    }
  }, []);
  


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

  const handleEventPropertyChange = (index, field, value) => {
    const updatedProperties = [...eventProperties];
    if (field === 'methodCall') {
      updatedProperties[index]['method_call'] = value;
      updatedProperties[index][field] = value;
    } else if (field === 'type') {
      updatedProperties[index]['data_type'] = value;
      updatedProperties[index][field] = value;
    } else {
      updatedProperties[index][field] = value;
    }

    
    console.log(updatedProperties)
    setEventProperties(updatedProperties);

    setSelectedEvent((prevEvent) => {
      // Make a copy of the current items
      const updatedItems = [...(prevEvent.items || [])];
  
      // Check if the first item exists
      if (updatedItems[0]) {
        console.log('----------1')
        // Update the event_property of the first item
        updatedItems[0] = {
          ...updatedItems[0], // Spread existing properties
          event_property: updatedProperties, // Update event_property
        };
        console.log(updatedItems[0])
      } else {
        console.log('----------2')
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
    console.log(selectedEvent)
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
      const updated = [...prev, { name: "", value: "",property_definition: "", type: "String", sampleValue: "", method_call: "Track" }];
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

  const [functionName, setFunctionName] = useState('');
  const generateCode = () => {
  // Convert event name to proper format (camelCase for functions, snake_case for events)
  const eventName = selectedEvent?.name?.trim()
    ? selectedEvent.name
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[_\s]+/g, '_')
        .toLowerCase()
    : "unnamed_event";
    
  const callFunctionName = eventName
    .split('_')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
    setFunctionName(callFunctionName);
  // Group properties by method call
  const methodGroups = {};
  eventProperties.forEach(prop => {
    if (!methodGroups[prop.method_call]) {
      methodGroups[prop.method_call] = [];
    }
    methodGroups[prop.method_call].push(prop);
  });

  // Generate code for each method type
  const generateMethodCode = (properties, methodType) => {
    console.log(properties, methodType);
    switch (methodType) {
      case 'Track':
        return `mixpanel.track("${eventName}", {
    ${properties.map(prop => 
      `"${prop.name}": data["${prop.type === 'String' ? `${prop.name}` : prop.name}"], // ${prop.type}`
    ).join(',\n    ')}
  });`;
      
      case 'Register':
        return `mixpanel.register({
    ${properties.map(prop => 
      `"${prop.name}": data["${prop.type === 'String' ? `${prop.sampleValue}` : prop.sampleValue}"]`
    ).join(',\n    ')}
  });`;
      
      case 'Register Once':
        return `mixpanel.register_once({
    ${properties.map(prop => 
      `"${prop.name}": data["${prop.type === 'String' ? `${prop.sampleValue}` : prop.sampleValue}"]`
    ).join(',\n    ')}
  });`;
      
      case 'People Set':
        return `mixpanel.people.set({
    ${properties.map(prop => 
      `"${prop.name}": data["${prop.type === 'String' ? `${prop.sampleValue}` : prop.sampleValue}"]`
    ).join(',\n    ')}
  });`;
      
      case 'People Set Once':
        return `mixpanel.people.set_once({
    ${properties.map(prop => 
      `"${prop.name}": data["${prop.type === 'String' ? `${prop.sampleValue}` : prop.sampleValue}"]`
    ).join(',\n    ')}
  });`;
      
      case 'People Increment':
        return `mixpanel.people.increment(${
          properties.length === 1 
            ? `"${properties[0].name}", data["${properties[0].sampleValue}"]`
            : `{
    ${properties.map(prop => `"${prop.name}": data["${prop.sampleValue}"]`).join(',\n    ')}
  }`
        });`;
      
      case 'People Unset':
        return `mixpanel.people.unset([
    ${properties.map(prop => `"${prop.name}"`).join(',\n    ')}
  ]);`;
      
      case 'People Append':
        return `mixpanel.people.append({
    ${properties.map(prop => 
      `"${prop.name}": data["${Array.isArray(prop.sampleValue) ? JSON.stringify(prop.sampleValue) : `${prop.sampleValue}`}"]`
    ).join(',\n    ')}
  });`;
      
      case 'People Union':
        return `mixpanel.people.union({
    ${properties.map(prop => 
      `"${prop.name}": data.${Array.isArray(prop.sampleValue) ? JSON.stringify(prop.sampleValue) : `["${prop.sampleValue}"]`}`
    ).join(',\n    ')}
  });`;
      
      case 'Time Event':
        return `mixpanel.time_event("${eventName}");`;
      
      case 'Opt In Tracking':
        return 'mixpanel.opt_in_tracking();';
      
      case 'Opt Out Tracking':
        return 'mixpanel.opt_out_tracking();';
        
      default:
        return '';
    }
  };

  // Generate code for each method group
  const method_call = Object.entries(methodGroups)
    .map(([method, props]) => generateMethodCode(props, method))
    .filter(code => code)
    .join('\n\n  ');

  // Generate identify/unidentify code if needed
  const identifyCode = selectedEvent?.identify 
    ? '\n  mixpanel.identify(userId);' 
    : '';
  const unidentifyCode = selectedEvent?.unidentify 
    ? '\n  mixpanel.reset();' 
    : '';

  // Generate super properties code
const superPropsCode = superProperties.filter(
  (prop) => prop.name?.trim() && prop.value?.trim()
).length > 0
  ? `\n  mixpanel.register({
    ${superProperties
      .filter((prop) => prop.name?.trim() && prop.value?.trim())
      .map((prop) => `"${prop.name}": data["${prop.type === 'String' ? `${prop.name}` : prop.name}"],`)
      .join('\n    ')}
  });`
  : '';

// Generate user properties code
const userPropsCode = userProperties.filter(
  (prop) => prop.name?.trim() && prop.value?.trim()
).length > 0
  ? `\n  mixpanel.people.set({
    ${userProperties
      .filter((prop) => prop.name?.trim() && prop.value?.trim())
      .map((prop) => `"${prop.name}": data["${prop.type === 'String' ? `${prop.value}` : prop.value}"]`)
      .join(',\n    ')}
  });`
    : '';
    const exampleSuperProps = superProperties
    .filter((prop) => prop.name?.trim() && prop.value?.trim())
    .map((prop) => `${prop.name}: "${prop.value}",`)
    .join("\n    ");
    

    const exampleUserProps = userProperties
    .filter((prop) => prop.name?.trim() && prop.value?.trim())
    .map((prop) => `${prop.name}: "${prop.value}",`)
    .join("\n    ");

  // Combine all code parts
  const code = `// ${selectedEvent?.event_definition || 'Track user interaction'}
export function ${callFunctionName}(${selectedEvent?.identify && userProperties.length > 0 ? 'userId, ' : ''}data) {${identifyCode}${unidentifyCode}${superPropsCode}${userPropsCode}
  ${method_call}
}
`;
  
  
   const secondCode = `${callFunctionName}(${selectedEvent?.identify ? '"user123", ' : ''}{
    ${[...eventProperties].map(prop =>
    `${prop.name}: ${prop.type === 'String' ? `"${prop.sampleValue}"` : `"${prop.sampleValue}"`}`
    ).join(',\n    ')}${eventProperties.length > 0 ? ', ' : ''}
    ${exampleSuperProps}
    ${exampleUserProps}
});`
    
// const secondCode = `${callFunctionName}(
//   ${selectedEvent?.identify ? '"user123", ' : ''}{
//     ${[...eventProperties]
//       .map(
//         (prop) => `${prop.name}: ${
//           prop.type === 'String' ? `"${prop.sampleValue}"` : `"${prop.sampleValue}"`
//         }`
//       )
//       .join(',\n    ')}${eventProperties.length > 0 ? ',' : ''}
//     ${exampleSuperProps}
//   }
// );`;

    

  setGeneratedCode(code);
  setTriggerCode(secondCode);
  };
  
  useEffect(() => {
    if (selectedEvent) {
      generateCode();  
    }
  }, [selectedEvent, eventProperties, superProperties, userProperties]);

  
  useEffect(() => {
    // if (selectedEvent && isInitialLoad.current) {
    if (selectedEvent) {
      generateCode();

      
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
            method_call: prop.method_call || "",
            property_definition: prop.property_definition || "",
          }))
        );
        setEventProperties(eventProps);
        setShowLogEvent(true);
      } else {
        console.log('nnononn')
        setEventProperties([{ name: "", value: "", type: "String", sampleValue: "" , method_call: "Track", property_definition: ""}]);
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
        console.log(selectedEvent.identify)
  
      setShowIdentifyMessage(selectedEvent.identify || false);
      setShowUnidentifyMessage(selectedEvent.unidentify || false);
      generateCode();
    }
  }, [selectedEvent?.id]);

  const handleEventNameChange = (event) => {
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      name: event.target.value
    }));
  };

  const statusOptions = ["not started", "in progress", "completed"]; 

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      status: newStatus, 
    }));
  };
  return (
    <Box
      sx={{ p: 2, maxWidth: 600, backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <TextField
        label="Event Name"
        value={selectedEvent?.name || ''}
        onChange={handleEventNameChange}
        fullWidth
        margin="normal"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        value={selectedEvent?.event_definition || ""}
        onChange={handleDescriptionChange}
        fullWidth
        margin="normal"
        variant="outlined" 
        InputLabelProps={{
          shrink: true, 
        }}
        sx={{
          mb: 2, 
        }}
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
        variant="outlined" 
        InputLabelProps={{
          shrink: true, 
        }}
        sx={{
          mb: 2, 
        }}
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

      {/* <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={selectedEvent?.status || "not_started"}
          onChange={handleStatusChange}
          fullWidth
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace("_", " ").toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      {isMasterEventPage ? (
        // <TextField
        //   label="Organization"
        //   value={selectedEvent?.organization || ""}
        //   onChange={(e) => {
        //     const value = e.target.value;
        //     setOrganization(value);
        //     setSelectedEvent((prevEvent) => ({
        //       ...prevEvent,
        //       organization: value,
        //     }));
        //   }}
        //   fullWidth
        //   margin="normal"
        //   variant="outlined"
        //   InputLabelProps={{
        //     shrink: true,
        //   }}
        //   sx={{
        //     mb: 2,
        //   }}
        // />
        <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
        <InputLabel>Organization</InputLabel>
        <Select
          value={selectedEvent?.organization || ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedEvent((prevEvent) => ({
              ...prevEvent,
              organization: value,
            }));
          }}
        >
          {["EdTech", "FinTech", "Consumer Tech", "Healthcare"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      ) : (
        <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={selectedEvent?.status || "not started"}
          onChange={handleStatusChange}
          fullWidth
        >
           {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status} 
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      )
    }


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
        {(showIdentifyMessage || showUnidentifyMessage ) && (
    <IconButton
      onClick={() => {
              setShowIdentifyMessage(false);
              setShowUnidentifyMessage(false);
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          identify: false,
          unidentify: false,
        }));
      }}
      sx={{ color: "error.main" }}
      size="small"
    >
      <DeleteIcon />
    </IconButton>
  )}
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


        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography fontWeight="bold">Code Generator</Typography>
              <Tooltip title="Info about Code Generator">
                <IconButton sx={{ ml: 1 }}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </div>
          </AccordionSummary>
          <AccordionDetails>
          <Box display="flex" flexDirection="column" alignItems="center">
            {/* <Button
              variant="contained"
              style={{
                backgroundColor: 'black',
                color: 'white',
                marginBottom: '20px',
              }}
              onClick={generateCode}
            >
              Get Code
              </Button> */}
              <DrawerPropertiesWithEnvironment
                generatedCode={generatedCode}
                functionName={functionName}
                setGeneratedCode={setGeneratedCode}
                triggerCode={triggerCode}
      />
            </Box>
          </AccordionDetails>
        </Accordion>
      

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
                    <IconButton 
                    //onClick={deleteEventPropertyGroup}
                    onClick={() => {
                      const updatedProperties = [...userProperties];
                      updatedProperties.splice(index, 1); 
                      setUserProperties(updatedProperties);
          
                      setSelectedEvent((prevEvent) => {
                        const updatedItems = [...(prevEvent.items || [])];
                        if (updatedItems[0]) {
                          updatedItems[0].user_property = updatedProperties; 
                        }
                        return { ...prevEvent, items: updatedItems };
                      });
                    }}
                sx={{ color: 'error.main' }}
                size="small"
              >
      <DeleteIcon />
    </IconButton>

                
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
        value={property.method_call}
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
      label="Property Description"
      value={property.property_definition || ""}
      onChange={(e) =>
        handleEventPropertyChange(index, "property_definition", e.target.value)
      }
      fullWidth
      margin="dense"
    />
    <FormControl fullWidth margin="dense">
      <InputLabel>Data Type</InputLabel>
      <Select
        value={property.type}
        onChange={(e) =>
          handleEventPropertyChange(index, "type", e.target.value)
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
                    <IconButton 
                    //onClick={deleteEventPropertyGroup}
                    onClick={() => {
                      const updatedProperties = [...eventProperties];
                      updatedProperties.splice(index, 1); 
                      setEventProperties(updatedProperties);
        
                      setSelectedEvent((prevEvent) => {
                        const updatedItems = [...(prevEvent.items || [])];
                        if (updatedItems[0]) {
                          updatedItems[0].event_property = updatedProperties; 
                        }
                        return { ...prevEvent, items: updatedItems };
                      });
                    }}
                sx={{ color: 'error.main' }}
                size="small"
              >
      <DeleteIcon />
    </IconButton>
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
                  <IconButton 
                    //onClick={deleteEventPropertyGroup}
                    onClick={() => {
                      const updatedProperties = [...superProperties];
                      updatedProperties.splice(index, 1); 
                      setSuperProperties(updatedProperties);
          
                      setSelectedEvent((prevEvent) => {
                        const updatedItems = [...(prevEvent.items || [])];
                        if (updatedItems[0]) {
                          updatedItems[0].super_property = updatedProperties; 
                        }
                        return { ...prevEvent, items: updatedItems };
                      });
                    }}
                sx={{ color: 'error.main' }}
                size="small"
              >
      <DeleteIcon />
    </IconButton>

                </Box>
                
))}
<Button variant="text" color="primary" onClick={addSuperProperty}>
  + Add System Property
</Button>

            </Box>

            {/* <Box mt={3}>
              <Button variant="contained" color="primary" onClick={generateCode}>
                Generate Code
              </Button>
              <DrawerPropertiesWithEnvironment
                generatedCode={generatedCode}
                functionName={functionName}
                setGeneratedCode={setGeneratedCode}
                triggerCode={triggerCode}
      />
            </Box> */}

            {/* {generatedCode && (
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
            )} */}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default DrawerProperties;
