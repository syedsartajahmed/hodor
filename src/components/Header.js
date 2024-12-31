import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import AddEventModal from "./AddEventModal";
import { useAppContext } from "@/context/AppContext";
import NewCategoryModal from "./NewCategory";
import { useRouter } from "next/router";
import DownloadIcon from '@mui/icons-material/Download';

const Header = ({ isShowCopy = false, isShowMasterEvents = false, isShowDownload = false }) => {
  const [view, setView] = useState("list");
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { tableData, setShowList, currentOrganization, allEvents } = useAppContext();
  const router = useRouter();
  const eventSize = tableData.length;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleCopy = () => {
    const encodedName = encodeURIComponent(currentOrganization.name);
    const url = `${window.location.origin}/events/${encodedName}/${currentOrganization.id}`;

    navigator.clipboard.writeText(url)
    .then(() => {
      console.log("URL copied to clipboard:", url);
      alert(`Link copied to clipboard:\n${url}`);
    })
    .catch((err) => {
      console.error("Failed to copy URL to clipboard:", err);
    });
  }

  const downloadTrackingCode = async (orgId, appId) => {
    const response = await fetch(`/api/${orgId}/${appId}/generate-tracking-code`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mixpanel-tracking.js`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // const handleDownload = () => {
  //   // Mixpanel initialization token from localStorage
  //   const mixpanelToken = localStorage.getItem("mixpanelToken") || 'YOUR_PROJECT_TOKEN';
  
  //   // Fetch generated Mixpanel event tracking code
  //   const generatedCode = generateAllEventsCode(allEvents);
  
  //   // Final code with import and initialization
  //   const finalCode = `// Place this file in your "lib" or "utils" folder and import these functions wherever needed to trigger Mixpanel events.
    
  // // Import Mixpanel SDK
  // import mixpanel from "mixpanel-browser";
  
  // // Initialize Mixpanel
  // mixpanel.init("${mixpanelToken}", {
  //   debug: true, // Set to true for debugging in development
    
  // });
  
  // // Mixpanel Event Tracking Implementation
  // ${generatedCode}
  
  
  // `;
  
  //   // Create and trigger download of the file
  //   const blob = new Blob([finalCode], { type: "text/javascript" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "mixpanel.js";
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  
  //   // Clean up the URL after download
  //   window.URL.revokeObjectURL(url);
  // };
  const handleDownload = () => {
    const mixpanelToken = localStorage.getItem("mixpanelToken") || "YOUR_PROJECT_TOKEN";
  
  
    // Fetch generated Mixpanel event tracking code

    // Fetch generated Mixpanel event tracking code
    const generatedCode = generateAllEventsCode(allEvents);
  
    // Extract function names for the comment
    const functionNames = allEvents.map((event) => {
      const name = event.eventName
        ?.trim()
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[_\s]+/g, "_")
        .toLowerCase();
      return name
        ?.split("_")
        .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("");
    });
  
    const importComment = `// Import { ${functionNames.join(", ")} } from './utils/mixpanel.js';`;
  
    // Final code with import, initialization, and function implementations
    const finalCode = `  // Use these functions wherever needed by importing them from './utils/mixpanel.js' and calling them like functionName(userId, data).
  ${importComment}
  
  // Import Mixpanel SDK
  import mixpanel from "mixpanel-browser";
  
  // Initialize Mixpanel
  mixpanel.init("${mixpanelToken}", {
    debug: true, // Set to true for debugging in development
    track_pageview: true,
  });
  

  ${generatedCode}
  `;
  
    // Create and trigger download of the file
    const blob = new Blob([finalCode], { type: "text/javascript" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mixpanel.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
  
    // Clean up the URL after download
    window.URL.revokeObjectURL(url);
  };
  
  const generateAllEventsCode = (events) => {
    const formatEventName = (name) => {
      const eventName = name?.trim()
        ? name
            .trim()
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/[_\s]+/g, '_')
            .toLowerCase()
        : "unnamed_event";
      
      return {
        snakeCase: eventName,
        camelCase: eventName
          .split('_')
          .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
          .join('')
      };
    };
  
    const generateMethodCode = (properties, methodType, eventName) => {
      switch (methodType) {
        case 'Track':
          return `mixpanel.track("${eventName}", {
      ${properties.map(prop => 
        `"${prop.property_name}": data["${prop.property_type === 'String' ? `${prop.property_name}` : prop.property_name}"], // ${prop.property_type}`
      ).join('\n      ')}
    });`;
        
        case 'Register':
        case 'Register Once':
          const registerMethod = methodType === 'Register' ? 'register' : 'register_once';
          return `mixpanel.${registerMethod}({
      ${properties.map(prop => 
        `"${prop.property_name}": data["${prop.property_type === 'String' ? `${prop.sample_value}` : prop.sample_value}"],`
      ).join('\n      ')}
    });`;
        
        case 'People Set':
        case 'People Set Once':
          const setMethod = methodType === 'People Set' ? 'set' : 'set_once';
          return `mixpanel.people.${setMethod}({
      ${properties.map(prop => 
        `"${prop.property_name}": data["${prop.property_type === 'String' ? `${prop.sample_value}` : prop.sample_value}"],`
      ).join('\n      ')}
    });`;
        
        case 'People Unset':
          return `mixpanel.people.unset([
      ${properties.map(prop => `"${prop.property_name}",`).join('\n      ')}}
    ]);`;
        
        case 'Opt Out Tracking':
          return 'mixpanel.opt_out_tracking();';
        
        default:
          return '';
      }
    };
  
    // Generate code for all events
    const allEventsCode = events.map(event => {
      const { snakeCase: eventName, camelCase: functionName } = formatEventName(event.eventName);
      
      // Group properties by method call
      const methodGroups = {};
      event.items[0].event_property.forEach(prop => {
        if (!methodGroups[prop.method_call]) {
          methodGroups[prop.method_call] = [];
        }
        methodGroups[prop.method_call].push(prop);
      });
  
      // Generate code for each method group
      const methodCalls = Object.entries(methodGroups)
        .map(([method, props]) => generateMethodCode(props, method, eventName))
        .filter(code => code)
        .join('\n\n  ');
  
      // Generate super properties code
      const superPropsCode = event.items[0].super_property.length > 0
        ? `\n    mixpanel.register({
      ${event.items[0].super_property
        .map(prop => `"${prop.name}": data["${prop.name}"],`)
        .join('\n      ')}
    });`
        : '';
  
      // Generate user properties code
      const userPropsCode = event.items[0].user_property.length > 0
        ? `\n    mixpanel.people.set({
      ${event.items[0].user_property
        .map(prop => `"${prop.name}": data["${prop.value}"],`)
        .join('\n      ')}
    });`
        : '';
  
      // Generate identify/unidentify code
      const identifyCode = event.identify ? '\n    mixpanel.identify(userId);' : '';
      const unidentifyCode = event.unidentify ? '\n    mixpanel.reset();' : '';
  
      // Generate example data for function call
      const exampleData = {
        ...(event.items[0].event_property.reduce((acc, prop) => ({
          ...acc,
          [prop.property_name]: prop.sample_value
        }), {})),
        ...(event.items[0].super_property.reduce((acc, prop) => ({
          ...acc,
          [prop.name]: prop.value
        }), {}))
      };
  
      return {
        implementation: `// ${event.event_definition || 'Track user interaction'}
  export function ${functionName}(${event.identify && event.items[0].user_property.length > 0 ? 'userId, ' : ''}data) {${identifyCode}${unidentifyCode}${superPropsCode}${userPropsCode}
    ${methodCalls}
  }`,
      };
    });
  
    // Combine all implementations and examples
    const finalCode = `${allEventsCode.map(code => code.implementation).join('\n\n')}`;
  
    return finalCode;
  };
  
  const handleMasterEvents = async() => {
    router.push(`${window.location.pathname}/master-events`);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        padding={2}
        borderBottom="1px solid #e0e0e0"
        gap={2}
        sx={{
          // position: "fixed",
          // top: 0,
          // left: 0,
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight="bold">
            Events ({eventSize})
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleOpen}>
            + New Event
          </Button>
          {/* <Button variant="outlined" onClick={() => setCategoryOpen(true)}>
            + New Category
          </Button> */}
        </Box>

        <Box display="flex" alignItems="center">
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
          >
            <ToggleButton
              value="category"
              aria-label="category view"
              onClick={() => setShowList(true)}
            >
              Category
            </ToggleButton>
            <ToggleButton
              value="list"
              aria-label="list view"
              onClick={() => setShowList(false)}
            >
              List
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {/* <IconButton
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
          </IconButton> */}
          {isShowCopy && (
            <Button variant="outlined" onClick={handleCopy}>
              Copy URL
            </Button>
          )}
          {isShowMasterEvents &&
            (<Button variant="outlined" onClick={handleMasterEvents}>
              Master Events
            </Button>
            )
          }
          {isShowDownload && (
            <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            >
              Download
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ marginTop: "10px" }}></Box>

      {open && <AddEventModal open={open} setOpen={setOpen} />}
      {/* {categoryOpen && (
        <NewCategoryModal open={categoryOpen} setOpen={setCategoryOpen} />
      )} */}
    </>
  );
};

export default Header;
