import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Radio,
  ListSubheader,
  RadioGroup,
  Drawer,
  IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import AddEventModal from "./AddEventModal";
import NewCategoryModal from "./NewCategory";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import ApplicationSetupDialog from "@/components/ApplicationSetupDialog";
import UploadIcon from "@mui/icons-material/Upload";
import Papa from "papaparse";
import showToast from "@/utils/toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  tableDataState,
  currentOrganizationState,
  allEventsState,
  isProductAnalystState,
  showListState,
  viewState,
  openState,
  categoryOpenState,
  selectedOrganizationsState,
  openSourceDialogState,
  selectedSourceState,
  openAppSetupState,
  newOrgIdState,
  uploadingState,
} from "../recoil/atom";
import { filteredTableDataState } from '../recoil/selector'; // or '../recoil/atom' if you added it there
import { useRouter } from "next/router";
import { screenLoad } from "../utils/mixpanel-web (1)";
import { screen_load } from "@/utils/mixpanel-http-api (33)";

const Header = ({
  isShowCopy = false,
  isShowMasterEvents = false,
  isShowDownload = false,
  isShowFilter = false,
}) => {
  const filteredTableData = useRecoilValue(filteredTableDataState);
  console.log('Filtered Table Data:', filteredTableData);
  const [tableData, setTableData] = useRecoilState(tableDataState);
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const allEvents = useRecoilValue(allEventsState);
  const isProductAnalyst = useRecoilValue(isProductAnalystState);
  const [showList, setShowList] = useRecoilState(showListState);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [view, setView] = useRecoilState(viewState);
  const [open, setOpen] = useRecoilState(openState);
  const [categoryOpen, setCategoryOpen] = useRecoilState(categoryOpenState);
  const [selectedOrganizations, setSelectedOrganizations] = useRecoilState(selectedOrganizationsState);
  const [openSourceDialog, setOpenSourceDialog] = useRecoilState(openSourceDialogState);
  const [selectedSource, setSelectedSource] = useRecoilState(selectedSourceState);
  const [openAppSetup, setOpenAppSetup] = useRecoilState(openAppSetupState);
  const [newOrgId, setNewOrgId] = useRecoilState(newOrgIdState);
  const [uploading, setUploading] = useRecoilState(uploadingState);
  const router = useRouter();
  const isMasterEventsPath = router.pathname.includes("/master-event");
  if (!Array.isArray(tableData)) {
    console.error("tableData is not an array. Type:", typeof tableData, "Value:", tableData);
  }
  useEffect(() => {
    screenLoad({
      Screen_name: "Hodor Header",
      User_channel: "web"
    });
    //screenLoaded({ user_channel: "web", screen_name: "Hodor Home" });
  }, []);
  useEffect(() => {
    console.log(selectedSource);
    //screenLoaded({ user_channel: "web", screen_name: "Hodor Home" });
  }, [selectedSource]);
  const safeTableData = Array.isArray(tableData) ? tableData : []; // Ensure tableData is an array
const eventSize = safeTableData.length;  // Use safeTableData here
const sources = [
  { category: "Cross Platform", value: "React Native" },
  { category: "Cross Platform", value: "Flutter" },
  { category: "Android", value: "Kotlin (Android)" },
  { category: "iOS", value: "Swift (iOS)" },
  { category: "Web", value: "Javascript" },
  { category: "Backend", value: "Node.js" },
  { category: "Website", value: "PHP" },
  { category: "API", value: "HTTP API" },
];
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };
  const handleIndustrySelection = (event) => {
    const selected = event.target.value;
    setSelectedOrganizations(selected); // Update the state with the new selection
  };
  const handleOpen = () => setOpen(true);

  const handleCopy = () => {
    const encodedName = encodeURIComponent(currentOrganization.name);
    const url = `${window.location.origin}/events/${encodedName}/${currentOrganization.id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("URL copied to clipboard:", url);
        showToast(`Link copied to clipboard:\n${url}`);
      })
      .catch((err) => {
        console.error("Failed to copy URL to clipboard:", err);
      });
  };
  const uniqueSources = [
    ...new Set(allEvents?.flatMap((event) => event.source || [])),
  ].filter(Boolean);

  const downloadTrackingCode = async (orgId, appId) => {
    const response = await fetch(
      `/api/${orgId}/${appId}/generate-tracking-code`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mixpanel-tracking.js`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadButtonClick = () => {
    setOpenSourceDialog(true);
  };

  const handleDownload = () => {
    const mixpanelToken =
      currentOrganization?.applicationDetails?.token || "YOUR_PROJECT_TOKEN";

    if (!selectedSource) {
      showToast("Please select a source first.");
      return;
    }
    setOpenDrawer(false);
    const filteredEvents = allEvents.filter((event) =>
      event.source.includes(selectedSource)
    );

    let code = "";
    let filename = "";

   // if (isProductAnalyst) {
    switch (selectedSource) {
      case "Javascript":
        code = generateWebsiteCode(filteredEvents, mixpanelToken);
        filename = "mixpanel.js";
        break;
    
      case "Node.js":
        code = generateBackendCode(filteredEvents, mixpanelToken);
        filename = "mixpanel.js";
        break;
    
      case "Kotlin (Android)":
        code = generateAndroidCode(filteredEvents);
        filename = "MixpanelTracking.kt";
        break;
    
      case "Swift (iOS)":
        code = generateIOSCode(filteredEvents);
        filename = "MixpanelTracking.swift";
        break;
    
      case "React Native":
        code = generateReactNativeCode(filteredEvents);
        filename = "MixpanelTracking.js";
        break;
    
      case "Flutter":
        code = generateFlutterCode(filteredEvents);
        filename = "MixpanelTracking.dart";
        break;
    
      case "PHP":
        code = generatePHPCode(filteredEvents);
        filename = "mixpanel-tracking.php";
        break;
    
      case "HTTP API":
        code = generateHTTPAPICode(filteredEvents);
        filename = "mixpanel-http-api.js";
        break;
      default:
        showToast("Unsupported platform");
        return;
    }   
    /*} else {
      switch (selectedSource) {
        case "Website":
          code = generateWebsiteCode(filteredEvents, mixpanelToken);
          filename = "mixpanel-web.js";
          break;
        case "Backend":
          code = generateRudderStackBackendCode(filteredEvents, writeKey);
          filename = "rudderstack-backend.js";
          break;
        case "Android":
          code = generateRudderStackAndroidCode(filteredEvents);
          filename = "RudderTracking.kt";
          break;
        case "iOS":
          code = generateRudderStackIOSCode(filteredEvents);
          filename = "RudderTracking.swift";
          break;
        default:
          showToast("Unsupported platform");
          return;
      }
    }*/

    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    setOpenSourceDialog(false);
  };

  const handleMasterEvents = async () => {
    router.push(`${window.location.pathname}/master-events`);
  };
  const generateRudderStackWebsiteCode = (events, writeKey) => {
  };
  const generateRudderStackBackendCode = (events, writeKey) => {
  };

  const generateRudderStackAndroidCode = (events) => {
  };

  const generateRudderStackIOSCode = (events) => {
  };

  const generateRudderStackEventCode = (events, importSection, platform) => {
  };

  const handleOrganizationSelection = async (selected, setSelectedOrganizations, setTableData, safeTableData) => {
    // Update the selected organizations state
  
    try {
      // Fetch data based on the selected organizations
      const response = await axios.get(`/api/master-events`, {
        params: { organization: selected.join(",") },
      });
  
      // Process the response data
      const updatedRows = response.data.totalEvents.map((event) => ({
        id: event._id,
        name: event.eventName,
        organization: event.organization,
        eventProperties: event.items
          .map((item) => {
            const eventProps =
              item.event_property
                ?.map(
                  (prop) =>
                    `${prop.property_name || "N/A"}: ${
                      prop.sample_value || "N/A"
                    }, method call: ${prop.method_call || "N/A"}`
                )
                .join("; ") || "";
  
            const superProps =
              item.super_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";
  
            const userProps =
              item.user_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";
  
            return [
              eventProps ? `Event Properties: { ${eventProps} }` : "",
              superProps ? `Super Properties: { ${superProps} }` : "",
              userProps ? `User Properties: { ${userProps} }` : "",
            ]
              .filter(Boolean)
              .join(", ");
          })
          .join("; "),
        ...event,
      }));
  
      // Update the table data state
      setTableData(updatedRows);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleOrganizationClick = () => {
    if (currentOrganization?.name) {
      setOpenAppSetup(true);
    }
  };

  const handleAppSetup = async (formData) => {
    console.log(formData, currentOrganization);

    const dataToSubmit = {
      ...formData,
      applicationId: currentOrganization?.applicationId,
    };

    const endpoint = "/api/applications";

    try {
      const response = await axios({
        method: "put",
        url: endpoint,
        data: dataToSubmit,
      });

      if (response.data.success) {
        console.log("Application setup success:", response.data.application);
        setOpenAppSetup(false);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Network error:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const processedData = processCSVData(result.data);
          const newFormattedData = [];

          for (const eventData of processedData) {
            try {
              const response = await axios.post("/api/master-events", eventData);
              const savedEvent = response.data.totalEvents?.find(
                (event) => event.eventName === eventData.eventName
              );

              if (savedEvent) {
                newFormattedData.push(formatForTable(savedEvent));
              }
            } catch (error) {
              console.log(error); 
              showToast(
                error.response?.data?.message || 
                "Failed to save event. Please try again."
              );
            }
          }

          setTableData((prev) => {
            const allData = [...prev, ...newFormattedData];
            return allData.filter(
              (v, i, a) => a.findIndex((t) => t.id === v.id) === i
            );
          });
          fetchMasterEvents();
          showToast("CSV data uploaded successfully!");

          
        } catch (error) {
          showToast("Failed to process CSV data. Please check the format.");
        } finally {
          setUploading(false);
        }
      },
      error: () => {
        setUploading(false);
        showToast("Failed to parse the CSV file. Please try again.");
      },
    });

    event.target.value = null;
  };

  const formatForTable = (savedEvent) => ({
    id: savedEvent._id,
    name: savedEvent.eventName,
    eventProperties: savedEvent.items
      .map((item) => {
        const eventProps = item.event_property
          ?.map(
            (prop) =>
              `Property Name: ${prop.property_name || "N/A"}, Value: ${
                prop.sample_value || "N/A"
              }, Data Type: ${prop.data_type || "N/A"}, Method Call: ${
                prop.method_call || "N/A"
              }`
          )
          .join("; ") || "";
  
        const superProps = item.super_property
          ?.map(
            (prop) =>
              `Name: ${prop.name || "N/A"}, Value: ${prop.value || "N/A"}`
          )
          .join("; ") || "";
  
        const userProps = item.user_property
          ?.map(
            (prop) =>
              `Name: ${prop.name || "N/A"}, Value: ${prop.value || "N/A"}`
          )
          .join("; ") || "";
  
        return [
          eventProps ? `Event Properties: { ${eventProps} }` : "",
          superProps ? `Super Properties: { ${superProps} }` : "",
          userProps ? `User Properties: { ${userProps} }` : "",
        ]
          .filter(Boolean)
          .join(", ");
      })
      .join("; "),
    stakeholders: Array.isArray(savedEvent.stakeholders)
      ? savedEvent.stakeholders
      : savedEvent.stakeholders?.split(",") || [],
  
    category: savedEvent.category,
    
    source: Array.isArray(savedEvent.source)
      ? savedEvent.source
      : savedEvent.source?.split(",") || [],
  
    action: savedEvent.action,
  
    platform: Array.isArray(savedEvent.platform)
      ? savedEvent.platform
      : savedEvent.platform?.split(",") || [],
  
    organization: savedEvent.organization,
  });
  
  const processCSVData = (rows) => {
    const eventGroups = rows.reduce((acc, row) => {
      if (!row.eventName) return acc;
  
      const validPlatforms = ["Web", "Server Side", "All Mobile"];
      const validSources = [
        "Javascript",
        "Node.js",
        "React Native",
        "Kotlin (Android)",
        "Swift (iOS)",
        "Flutter",
        "PHP",
        "HTTP API",
      ];
      const isValidPlatform = validPlatforms.includes(row.platform);
      const isValidSource = validSources.includes(row.source);
      const platform = validPlatforms.includes(row.platform) ? row.platform : "Undefined";
      const source = validSources.includes(row.source) ? row.source : "Undefined";
            

  
      if (!acc[row.eventName]) {
        acc[row.eventName] = {
          eventName: row.eventName,
          event_definition: row.event_definition || "default",
          action: row.action || "default",
          stakeholders: row.stakeholders,
          category: row.category,
          organization: row.organization,
          platform, // Only add if valid
          source, // Only add if valid
          items: [{
            event_property: [],
            user_property: [],
            super_property: []
          }]
        };
      }
  
      const property = {
        property_name: row["Property Name"],
        property_definition: row["Property Definition"],
        data_type: row["Data Type"],
        sample_value: row["Sample Values"],
        method_call: row["Method Call"]
      };
  
      switch (row["Property Type"]) {
        case "Event Property":
          acc[row.eventName].items[0].event_property.push(property);
          break;
        case "User Property":
          acc[row.eventName].items[0].user_property.push({
            name: property.property_name,
            value: property.sample_value,
            type: property.data_type
          });
          break;
        case "Super Property":
          acc[row.eventName].items[0].super_property.push({
            name: property.property_name,
            value: property.sample_value,
            type: property.data_type
          });
          break;
      }
  
      return acc;
    }, {});
  
    return Object.values(eventGroups);
  };
  

  const fetchMasterEvents = async () => {
    try {
      const response = await axios.get("/api/master-events");
      const masterEventsDetails = response.data;
      const totalEvents = masterEventsDetails.totalEvents || [];
      const updatedRows = totalEvents.map((event) => ({
        id: event._id,
        name: event.eventName,
        eventProperties: event.items
          .map((item) => {
            const eventProps =
              item.event_property
                ?.map(
                  (prop) =>
                    `${prop.property_name || "N/A"}: ${
                      prop.sample_value || "N/A"
                    }, method call: ${prop.method_call || "N/A"}`
                )
                .join("; ") || "";

            const superProps =
              item.super_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";

            const userProps =
              item.user_property
                ?.map((prop) => `${prop.name || "N/A"}: ${prop.value || "N/A"}`)
                .join("; ") || "";

            return [
              eventProps ? `Event Properties: { ${eventProps} }` : "",
              superProps ? `Super Properties: { ${superProps} }` : "",
              userProps ? `User Properties: { ${userProps} }` : "",
            ]
              .filter(Boolean)
              .join(", ");
          })
          .join("; "),
        stakeholders: event.stakeholders,
        category: event.category,
        propertyBundles: event.propertyBundles,
        groupProperty: event.groupProperty,
        source: event.source,
        action: event.action,
        platform: event.platform,
        ...event,
      }));

      setTableData(updatedRows);
    } catch (err) {
      console.error(err);
    }
  }; 
   const generateWebsiteCode = (events, mixpanelToken) => {
    const importSection = `
//  # Installation Instructions
//  # via npm
//  npm install --save mixpanel-browser

//  # via yarn
//  yarn add mixpanel-browser

// Use these functions wherever needed by importing them from './utils/mixpanel.js' and calling them like functionName(userId, data).
${generatePlatformImportComment(functionNames, "web")}

import mixpanel from "mixpanel-browser";
mixpanel.init("${mixpanelToken}", {
  debug: true,
  track_pageview: true,
});
  `;

    return generateEventCode(events, importSection, "web");
  };

  // Helper function to generate code for Backend platform
  const generateBackendCode = (events, mixpanelToken) => {
    const importSection = `
//  # Installation Instructions for Backend
//  npm install --save mixpanel
//  yarn add mixpanel

// Use these functions wherever needed by requiring them from './utils/mixpanel.js'
${generatePlatformImportComment(functionNames, "backend")}

const Mixpanel = require("mixpanel");
const mixpanel = Mixpanel.init("${mixpanelToken}", {});
  `;

    return generateEventCode(events, importSection, "backend");
  };

  // Helper function to generate code for Android platform
  const generateAndroidCode = (events) => {
    const importSection = `
import com.mixpanel.android.mpmetrics.MixpanelAPI
import org.json.JSONObject
import android.content.Context

${generatePlatformImportComment(functionNames, "android")}

const val MIXPANEL_TOKEN = "YOUR_PROJECT_TOKEN"

// Initialize Mixpanel in your Application class:
// MixpanelAPI.getInstance(this, MIXPANEL_TOKEN)
  `;

    return generateEventCode(events, importSection, "android");
  };

  // Helper function to generate code for iOS platform
  const generateIOSCode = (events) => {
    const importSection = `
import Mixpanel

${generatePlatformImportComment(functionNames, "ios")}

// Initialize Mixpanel in your AppDelegate:
// Mixpanel.initialize(token: "YOUR_PROJECT_TOKEN", trackAutomaticEvents: false)
  `;

    return generateEventCode(events, importSection, "ios");
  };
  const generateHTTPAPICode = (events, mixpanelToken) => {
  console.log(events,"asdfg");
  const generateEventCode = (events) => {
    return events.map(event => {
      console.log(event.eventName);
      const eventName = event.eventName;
      const eventProperties = event.items[0]?.event_property || [];
      const superProperties = event.items[0]?.super_property || [];
      const userProperties = event.items[0]?.user_property || [];

      // Generate function name
      const functionName = eventName
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/(^_+|_+$)/g, '');console.log(functionName);

      // Generate example properties
      const exampleData = {};
      [...eventProperties, ...superProperties, ...userProperties].forEach(prop => {
        exampleData[prop.property_name || prop.name] = prop.sample_value || 
          (prop.data_type === 'Number' ? 123 : `"example_${prop.property_name || prop.name}"`);
      });

      return `
// ${event.event_definition || 'Track event'}
export async function ${functionName}(distinct_id, properties) {
  try {
    const requests = [];

    // Track Event
    ${eventProperties.length ? `
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "${eventName}",
        properties: {
          ...properties,
          token: "${mixpanelToken}",
          distinct_id: distinct_id,
          $insert_id: \`\${distinct_id}-\${Date.now()}\`
        }
      }]
    }));` : ''}

    // Super Properties
    ${superProperties.length ? `
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "$identify",
        properties: {
          ...properties,
          token: "${mixpanelToken}",
          distinct_id: distinct_id,
          $set: {
            ${superProperties.map(p => 
              `${p.name}: properties.${p.name}`).join(',\n            ')}
          }
        }
      }]
    }));` : ''}

    // User Properties
    ${userProperties.length ? `
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/engage',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        $token: "${mixpanelToken}",
        $distinct_id: distinct_id,
        $set: {
          ${userProperties.map(p => 
            `${p.name}: properties.${p.name}`).join(',\n          ')}
        }
      }]
    }));` : ''}

    const responses = await Promise.all(requests);
    return responses.map(r => r.data);
    
  } catch (error) {
    console.error('Mixpanel API error:', error.response?.data || error.message);
    throw error;
  }
}

// Example invocation
// ${functionName}('user_123', {
${Object.entries(exampleData).map(([key, val]) => 
  `//   ${key}: ${val},`).join('\n')}
// });`.trim();
    }).join('\n\n');
  };

  return `import axios from 'axios';

// HTTP API Documentation:
// https://developer.mixpanel.com/reference/import-events
// https://developer.mixpanel.com/reference/profile-set

${generateEventCode(events)}
`;
};
  const generatePlatformImportComment = (functionNames, platform) => {
    switch (platform) {
      case "HttpApi":
        return `// import { ${functionNames.join(", ")} } from './utils/mixpanel.js';`;
      case "web":
        return `// import { ${functionNames.join(", ")} } from './utils/mixpanel.js';`;
      
      case "backend":
        return `// const { ${functionNames.join(", ")} } = require('./utils/mixpanel.js');`;
      
      case "android":
        return `// Import these functions from MixpanelTracking.kt
  // import com.yourdomain.analytics.MixpanelTracking.${functionNames.join("\n// import com.yourdomain.analytics.MixpanelTracking.")}`;
      
      case "ios":
        return `// Import these functions from MixpanelTracking.swift
  // import MixpanelTracking // Make sure this file is in your project
  // Available functions: ${functionNames.join(", ")}`;
      case "flutter":
        return `// Import these functions from mixpanel_service.dart
    // import 'mixpanel_service.dart';
    // Available functions: ${functionNames.join(", ")}`;
    case "php":
      return `// Import these functions from mixpanel_service.php
  // require 'mixpanel_service.php';
  // Available functions: ${functionNames.join(", ")}`;
      default:
        return "";
    }
  };
  const functionNames = allEvents.map((event) => {
    const name = event?.eventName
      ?.trim()
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[_\s]+/g, "_")
      .toLowerCase();
    return name
      ?.split("_")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  });
  const generateEventCode = (events, importSection, platform) => {
    const formatEventName = (name) => {
      const eventName = name?.trim()
        ? name
            .trim()
            .replace(/([a-z])([A-Z])/g, "$1_$2")
            .replace(/[_\s]+/g, "_")
            .toLowerCase()
        : "unnamed_event";

      const camelCase = eventName
        .split("_")
        .map((word, index) =>
          index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

      return { snakeCase: eventName, camelCase };
    };

    const generateMethodCode = (
      properties,
      methodType,
      eventName,
      platform
    ) => {
      switch (platform) {
        case "web":
        case "backend":
          return generateJSMethodCode(properties, methodType, eventName);
        case "android":
          return generateKotlinMethodCode(properties, methodType, eventName);
        case "ios":
          return generateSwiftMethodCode(properties, methodType, eventName);
        case "react-native":
          return generateReactNativeMethodCode(properties, methodType, eventName);
        case "flutter":
          return generateFlutterMethodCode(properties, methodType, eventName);
          case "php":
        return generatePHPMethodCode(properties, methodType, eventName);
        default:
          return "";
      }
    };
    const generatePHPMethodCode = (properties, methodType, eventName) => {
      switch (methodType) {
        case "Track":
          return `$mp->track("${eventName}", array(
    ${properties
      ?.map(
        (prop) =>
          `"${prop?.property_name}" => $data["${prop?.property_name}"], // ${prop?.property_type}`
      )
      .join(",\n    ")}
  ));`;
  
        case "Register":
        case "Register Once":
          const registerMethod =
            methodType === "Register" ? "registerSuperProperties" : "registerSuperPropertiesOnce";
          return `$mp->${registerMethod}(array(
    ${properties
      ?.map((prop) => `"${prop?.property_name}" => $data["${prop?.property_name}"],`)
      .join(",\n    ")}
  ));`;
  
        case "People Set":
        case "People Set Once":
          const setMethod = methodType === "People Set" ? "set" : "setOnce";
          return `$mp->people->${setMethod}($userId, array(
    ${properties
      ?.map((prop) => `"${prop?.property_name}" => $data["${prop?.property_name}"],`)
      .join(",\n    ")}
  ), $ip = 0);`;
  
        default:
          return "";
      }
    };
    const generateJSMethodCode = (properties, methodType, eventName) => {
      switch (methodType) {
        case "Track":
          return `mixpanel.track("${eventName}", {
  ${properties
    ?.map(
      (prop) =>
        `"${prop?.property_name}": data["${prop?.property_name}"], // ${prop?.property_type}`
    )
    .join(",\n    ")}
});`;

        case "Register":
        case "Register Once":
          const registerMethod =
            methodType === "Register" ? "register" : "register_once";
          return `mixpanel.${registerMethod}({
  ${properties
    ?.map((prop) => `"${prop?.property_name}": data["${prop?.property_name}"],`)
    .join(",\n    ")}
});`;

        case "People Set":
        case "People Set Once":
          const setMethod = methodType === "People Set" ? "set" : "set_once";
          return `mixpanel.people.${setMethod}({
  ${properties
    ?.map((prop) => `"${prop?.property_name}": data["${prop?.property_name}"],`)
    .join(",\n    ")}
});`;

        default:
          return "";
      }
    };

    const generateKotlinMethodCode = (properties, methodType, eventName) => {
      switch (methodType) {
        case "Track":
          return `MixpanelAPI.getInstance(context, MIXPANEL_TOKEN).track("${eventName}", 
  JSONObject().apply {
      ${properties
        ?.map(
          (prop) =>
            `put("${prop?.property_name}", data["${prop?.property_name}"]) // ${prop?.property_type}`
        )
        .join("\n        ")}
  })`;

        case "Register":
        case "Register Once":
          const registerMethod =
            methodType === "Register"
              ? "registerSuperProperties"
              : "registerSuperPropertiesOnce";
          return `MixpanelAPI.getInstance(context, MIXPANEL_TOKEN).${registerMethod}(
  JSONObject().apply {
      ${properties
        ?.map(
          (prop) =>
            `put("${prop?.property_name}", data["${prop?.property_name}"])`
        )
        .join("\n        ")}
  })`;

        default:
          return "";
      }
    };

    const generateSwiftMethodCode = (properties, methodType, eventName) => {
      switch (methodType) {
        case "Track":
          return `Mixpanel.mainInstance().track(
  event: "${eventName}",
  properties: [
      ${properties
        ?.map(
          (prop) =>
            `"${prop?.property_name}": data["${prop?.property_name}"] as Any // ${prop?.property_type}`
        )
        .join(",\n        ")}
  ])`;

        case "Register":
        case "Register Once":
          const registerMethod =
            methodType === "Register"
              ? "registerSuperProperties"
              : "registerSuperPropertiesOnce";
          return `Mixpanel.mainInstance().${registerMethod}([
  ${properties
    ?.map(
      (prop) =>
        `"${prop?.property_name}": data["${prop?.property_name}"] as Any`
    )
    .join(",\n    ")}
])`;

        default:
          return "";
      }
    };
    const generateFlutterMethodCode = (properties, methodType, eventName) => {
      switch (methodType) {
        case "Track":
          return `mixpanel.track("${eventName}", {
    ${properties
      ?.map(
        (prop) =>
          `"${prop?.property_name}": data["${prop?.property_name}"], // ${prop?.property_type}`
      )
      .join(",\n    ")}
  });`;
  
        case "Register":
        case "Register Once":
          const registerMethod =
            methodType === "Register" ? "registerSuperProperties" : "registerSuperPropertiesOnce";
          return `mixpanel.${registerMethod}({
    ${properties
      ?.map((prop) => `"${prop?.property_name}": data["${prop?.property_name}"],`)
      .join(",\n    ")}
  });`;
  
        case "People Set":
        case "People Set Once":
          const setMethod = methodType === "People Set" ? "set" : "setOnce";
          return `mixpanel.people.${setMethod}({
    ${properties
      ?.map((prop) => `"${prop?.property_name}": data["${prop?.property_name}"],`)
      .join(",\n    ")}
  });`;
  
        default:
          return "";
      }
    };

    const generateExampleInvocation = (event, platform) => {
      const { camelCase: functionName } = formatEventName(event?.eventName);

      // Combine all properties from event, user, and super properties
      const allProperties = [
        ...(event.items[0]?.event_property || []),
        ...(event.items[0]?.user_property || []),
        ...(event.items[0]?.super_property || []),
      ];

      // Generate example data based on property types and value sources
      const exampleData = allProperties.reduce((acc, prop) => {
        let propertyName = prop.property_name || prop.name; // Use `property_name` or fallback to `name`
        let exampleValue;

        if (prop.sample_value) {
          // Use sample_value if provided
          exampleValue = JSON.stringify(prop.sample_value);
        } else {
          // Infer example value based on `data_type` or fallback
          switch (prop.data_type?.toLowerCase() || "") {
            case "string":
              exampleValue = `"example_${propertyName}"`;
              break;
            case "number":
              exampleValue = 123; // Example numeric value
              break;
            case "boolean":
              exampleValue = true; // Example boolean value
              break;
            default:
              exampleValue = `"example_value"`; // Default fallback
          }
        }

        if (propertyName) {
          acc[propertyName] = exampleValue;
        }

        return acc;
      }, {});

      const formattedData = Object.entries(exampleData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(",\n  ");

      // Platform-specific example invocation
      switch (platform) {
        case "web":
        case "backend":
          return `// Example invocation:
// ${event?.event_definition || "Track user interaction"}
${functionName}(${event?.identify ? '"user123", ' : ""}{
  ${formattedData}
});`;

        case "android":
          return `// Example invocation:
// ${event?.event_definition || "Track user interaction"}
val data = mapOf(
  ${formattedData.split(",\n  ").join(",\n  ").replace(/:/g, " to")}
)
${functionName}(context${event?.identify ? ', "user123"' : ""}, data)`;

        case "ios":
          return `// Example invocation:
// ${event?.event_definition || "Track user interaction"}
let data: [String: Any] = [
  ${formattedData}
]
${functionName}(${event?.identify ? 'userId: "user123", ' : ""}data: data)`;
        case "react-native":
          return `// Example invocation:
        // ${event?.event_definition || "Track user interaction"}
        ${functionName}(${event?.identify ? '"user123", ' : ""}{
        ${formattedData}
        });`;
        case "flutter":
                return `// Example invocation:
        // ${event?.event_definition || "Track user interaction"}
        ${functionName}(${event?.identify ? '"user123", ' : ""}{
          ${formattedData}
        });`;
        case "php":
                return `// Example invocation:
        // ${event?.event_definition || "Track user interaction"}
        ${functionName}(${event?.identify ? '"user123", ' : ""}array(
          ${formattedData}
        ));`;
        default:
          return "";
      }
    };

    const eventsCode = events.map((event) => {
      const { snakeCase: eventName, camelCase: functionName } = formatEventName(
        event?.eventName
      );

      // Group properties by method call
      const methodGroups = {};
      event.items[0]?.event_property?.forEach((prop) => {
        if (!methodGroups[prop?.method_call]) {
          methodGroups[prop?.method_call] = [];
        }
        methodGroups[prop?.method_call].push(prop);
      });

      const methodCalls = Object.entries(methodGroups)
        .map(([method, props]) =>
          generateMethodCode(props, method, eventName, platform)
        )
        .filter((code) => code)
        .join("\n\n    ");

      const superPropsCode = generateSuperPropertiesCode(
        event.items[0]?.super_property,
        platform
      );

      const userPropsCode = generateUserPropertiesCode(
        event.items[0]?.user_property,
        platform
      );

      const identifyCode = generateIdentifyCode(event?.identify, platform);
      const unidentifyCode = generateUnidentifyCode(
        event?.unidentify,
        platform
      );

      const functionSignature = getFunctionSignature(
        platform,
        functionName,
        event?.identify
      );

      const exampleInvocation = generateExampleInvocation(event, platform);

      return `
  // ${event?.event_definition || "Track user interaction"}
  ${functionSignature} {${identifyCode}${unidentifyCode}
    ${superPropsCode}
    ${userPropsCode}
    ${methodCalls}
  }
  
  ${exampleInvocation}`;
    });

    return `${importSection}
  
  ${eventsCode.join("\n\n")}`;
  };
  const generateSuperPropertiesCode = (superProperties, platform) => {
    if (!superProperties?.length) return "";

    const propsString = superProperties
      .map((prop) => `"${prop?.name}": data["${prop?.name}"]`)
      .join(",\n        ");

    switch (platform) {
      case "web":
      case "backend":
        return `mixpanel.register({
      ${propsString}
  });`;
      case "android":
        return `MixpanelAPI.getInstance(context, MIXPANEL_TOKEN).registerSuperProperties(
      JSONObject().apply {
          ${superProperties
            .map((prop) => `put("${prop.name}", data["${prop.name}"])`)
            .join("\n            ")}
      }
  )`;
      case "ios":
        return `Mixpanel.mainInstance().registerSuperProperties([
      ${propsString}
  ])`;
      case "react-native":
          return `mixpanel.register({
        ${propsString}
    });`;
    case "flutter":
      return `mixpanel.registerSuperProperties({
    ${propsString}
});`;
case "php":
  return `$mp->registerSuperProperties(array(
${propsString}
));`;
      default:
        return "";
    }
  };

  // Helper function to generate user properties code
  const generateUserPropertiesCode = (userProperties, platform) => {
    if (!userProperties?.length) return "";

    const propsString = userProperties
      .map((prop) => `"${prop?.name}": data["${prop?.name}"]`)
      .join(",\n        ");

    switch (platform) {
      case "web":
      case "backend":
        return `mixpanel.people.set({
      ${propsString}
  });`;
      case "android":
        return `MixpanelAPI.getInstance(context, MIXPANEL_TOKEN).people.set(
      JSONObject().apply {
          ${userProperties
            .map((prop) => `put("${prop.name}", data["${prop.name}"])`)
            .join("\n            ")}
      }
  )`;
      case "ios":
        return `Mixpanel.mainInstance().people.set(properties: [
      ${propsString}
  ])`;
      case "react-native":
          return `mixpanel.people.set({
        ${propsString}
});`;
case "flutter":
  return `mixpanel.people.set({
${propsString}
});`;
case "php":
  return `$mp->people->set($userId, array(
${propsString}
), $ip = 0);`;
      default:
        return "";
    }
  };

  // Helper function to generate identify code
  const generateIdentifyCode = (shouldIdentify, platform) => {
    if (!shouldIdentify) return "";

    switch (platform) {
      case "web":
      case "backend":
        return "\n    mixpanel.identify(userId);";
      case "android":
        return "\n    MixpanelAPI.getInstance(context, MIXPANEL_TOKEN).identify(userId);";
      case "ios":
        return "\n    Mixpanel.mainInstance().identify(distinctId: userId)";
      case "react-native":
        return "\n  mixpanel.identify(userId);";
      case "flutter":
        return "\n  mixpanel.identify(userId);";
        case "php":
      return "\n  $mp->identify($userId);";
      default:
        return "";
    }
  };

  // Helper function to generate unidentify code
  const generateUnidentifyCode = (shouldUnidentify, platform) => {
    if (!shouldUnidentify) return "";

    switch (platform) {
      case "web":
      case "backend":
        return "\n    mixpanel.reset();";
      case "android":
        return "\n    MixpanelAPI.getInstance(context, MIXPANEL_TOKEN).reset();";
      case "ios":
        return "\n    Mixpanel.mainInstance().reset()";
      case "react-native":
        return "\n  mixpanel.reset();";
      case "flutter":
        return "\n  mixpanel.reset();";
        case "php":
          return "\n  $mp->reset();";    
      default:
        return "";
    }
  };

  // Helper function to generate function signatures
  const getFunctionSignature = (platform, functionName, hasUserId) => {
    switch (platform) {
      case "web":
      case "backend":
        return `export function ${functionName}(${
          hasUserId ? "userId, " : ""
        }data)`;
      case "android":
        return `fun ${functionName}(context: Context, ${
          hasUserId ? "userId: String, " : ""
        }data: Map<String, Any>)`;
      case "ios":
        return `func ${functionName}(${
          hasUserId ? "userId: String, " : ""
        }data: [String: Any])`;
        case "react-native":
      return `export function ${functionName}(${
        hasUserId ? "userId, " : ""
      }data)`;
      case "flutter":
      return `Future<void> ${functionName}(${
        hasUserId ? "String userId, " : ""
      }Map<String, dynamic> data) async`;
      case "php":
        return `function ${functionName}(${
          hasUserId ? "$userId, " : ""
        }$data)`;
      default:
        return "";
    }
  };
  const generateReactNativeCode = (events) => {
    const importSection = `
  // Import Mixpanel
  import mixpanel from 'mixpanel-browser';
  
  // Initialize Mixpanel
  mixpanel.init('YOUR_PROJECT_TOKEN', {
    debug: true, // Enable debug mode for development
    track_pageview: true, // Automatically track page views
  });
  `;
  
    return generateEventCode(events, importSection, "react-native");
  };
  
  const generateFlutterCode = (events) => {
    const importSection = `
  import 'package:mixpanel_flutter/mixpanel_flutter.dart';
  
  ${generatePlatformImportComment(functionNames, "flutter")}
  
  // Initialize Mixpanel in your app
  // Add this to your app's initialization logic (e.g., in main.dart or a dedicated service)
  Mixpanel mixpanel;
  
  Future<void> initMixpanel() async {
    mixpanel = await Mixpanel.init("YOUR_PROJECT_TOKEN", trackAutomaticEvents: false);
  }
  `;
  
    return generateEventCode(events, importSection, "flutter");
  };  
  const generatePHPCode = (events) => {
    const importSection = `
  <?php
  // Import dependencies
  require 'vendor/autoload.php';
  
  ${generatePlatformImportComment(functionNames, "php")}
  
  // Initialize Mixpanel
  $mp = Mixpanel::getInstance("YOUR_PROJECT_TOKEN", array(
      "debug" => true, // Enable debug mode
      "max_batch_size" => 50, // Set max batch size
  ));
  `;
  
    return generateEventCode(events, importSection, "php");
  };
  const generateReactNativeMethodCode = (properties, methodType, eventName) => {
    switch (methodType) {
      case "Track":
        return `mixpanel.track("${eventName}", {
  ${properties
    ?.map(
      (prop) =>
        `"${prop?.property_name}": data["${prop?.property_name}"], // ${prop?.property_type}`
    )
    .join(",\n    ")}
});`;

      case "Register":
      case "Register Once":
        const registerMethod =
          methodType === "Register" ? "register" : "register_once";
        return `mixpanel.${registerMethod}({
  ${properties
    ?.map((prop) => `"${prop?.property_name}": data["${prop?.property_name}"],`)
    .join(",\n    ")}
});`;

      case "People Set":
      case "People Set Once":
        const setMethod = methodType === "People Set" ? "set" : "set_once";
        return `mixpanel.people.${setMethod}({
  ${properties
    ?.map((prop) => `"${prop?.property_name}": data["${prop?.property_name}"],`)
    .join(",\n    ")}
});`;

      default:
        return "";
    }
  };
  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };
  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={2}
        borderBottom="1px solid #e0e0e0"
        gap={2}
        sx={{
          width: "100%",
          zIndex: 1000,
          height: "60px", // Set a fixed height for the header
        }}
      >
     <Box display="flex" alignItems="center" gap={2} >
  <Typography
    variant="h6"
    fontWeight="bold"
    onClick={isMasterEventsPath ? undefined : handleOrganizationClick}
    sx={{
      cursor: isMasterEventsPath
        ? "default"
        : currentOrganization?.name
        ? "pointer"
        : "default",
      color: currentOrganization?.name ? "white" : "black",
      backgroundColor: currentOrganization?.name ? "black" : "#ffff",
      padding: "4px 8px",
      borderRadius: "8px",
      "&:hover": !isMasterEventsPath && currentOrganization?.name && {
        backgroundColor: "#333",
      },
    }}
  >
    {isMasterEventsPath
      ? "Master Events"
      : currentOrganization?.name || "Organization"}{" "}
    ({eventSize})
  </Typography>
      { /*</Box>
        <Box display="flex" alignItems="center">*/}
         <Box display="flex" alignItems="center" gap={2} >
  {/* ToggleButtonGroup */}
  <ToggleButtonGroup
    value={view}
    exclusive
    onChange={handleViewChange}
    aria-label="view toggle"
    sx={{
      alignItems:"center",
      justifyContent:"center",
      width: "200px", // Set the same width as the FormControl
      height: "56px", // Match the height of the Select component
    }}
  >
    <ToggleButton
      value="category"
      aria-label="category view"
      onClick={() => setShowList(true)}
      sx={{
        width: "50%", // Each ToggleButton takes half the width
        height: "70%", // Full height of the ToggleButtonGroup
      }}
    >
      Category
    </ToggleButton>
    <ToggleButton
      value="list"
      aria-label="list view"
      onClick={() => setShowList(false)}
      sx={{
        width: "50%", // Each ToggleButton takes half the width
        height: "70%", // Full height of the ToggleButtonGroup
      }}
    >
      List
    </ToggleButton>
  </ToggleButtonGroup>

  {/* FormControl with Select */}
  {isShowFilter && (
  <Box sx={{ height: "50%", display: "flex", alignItems: "center" }}> {/* Parent with defined height */}
    <FormControl
      sx={{
        minWidth: 200,
        height: "50%", // Take full height of the parent (70% of the header)
      }}
    >
      <InputLabel
        id="organization-filter-label"
        sx={{
          color: "black",
          "&.Mui-focused": {
            color: "black",
          },
        }}
      >
        Industry
      </InputLabel>
      <Select
        labelId="organization-filter-label"
        multiple
        value={selectedOrganizations}
        onChange={handleIndustrySelection}
        renderValue={(selected) => selected.join(", ")}
        sx={{
          color: "black",
          height: "100%", // Take full height of the FormControl
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
        }}
      >
        {Array.isArray(safeTableData) ? (
          Array.from(
            new Set(
              safeTableData
                .map((event) => event.organization)
                .filter((org) => org && org.trim() !== "")
            )
          )
            .concat(
              selectedOrganizations.filter(
                (org) => !safeTableData.some((e) => e.organization === org)
              )
            )
            .map((org) => (
              <MenuItem
                key={org}
                value={org}
                sx={{
                  color: "black",
                  "&.Mui-selected": {
                    backgroundColor: "#f0f0f0",
                  },
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <Checkbox
                  checked={selectedOrganizations.includes(org)}
                  sx={{
                    color: "black",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                />
                <ListItemText primary={org} />
              </MenuItem>
            ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No data available" />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  </Box>
)}
</Box>
        </Box>

<IconButton
        onClick={() => setOpenDrawer(true)}
        sx={{ color: "black", marginRight: 2 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer (Hamburger Menu) */}
      <Drawer
        anchor="right"
        open={openDrawer}
        transitionDuration={500} // 500ms animation
        SlideProps={{
          direction: "left", // Customize slide direction
        }}
        onClose={() => setOpenDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": { // Target the paper (content) inside the Drawer
            height:400,
            width: 300, // Set the width of the drawer
            padding: 2, // Add padding
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5", // Set background color
            borderRadius:2,
          },
        }}      > <IconButton
        onClick={() => setOpenDrawer(false)} // Close the drawer when clicked
        sx={{
          position: "absolute", // Position the icon absolutely
          top: 8, // Adjust top position
          right: 8, // Adjust right position
          color: "black", // Icon color
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)", // Light hover effect
          },
        }}
      >
        <CloseIcon />
      </IconButton>
        <Box display="flex" alignItems="center" gap={2} flexDirection="column">
          {isShowCopy && (
            <Button variant="outlined"
            onClick={() => {handleCopy();setOpenDrawer(false);}} // Close the drawer when clicked
             sx={{
              color: "black", // White font color
              borderRadius: "8px", // Rounded corners
              borderColor:"black",
              "&:hover": {
                borderColor:"rgb(255,14,180)",
                color:"rgb(255,14,180)",
                backgroundColor: "white", // Darker background on hover
              },
            }}>
              Copy URL
            </Button>
          )}
          

<Button
  variant="contained"
  onClick={() => {handleOpen();setOpenDrawer(false);}} // Close the drawer when clicked
  sx={{
    backgroundColor: "black", // Dark black background
    color: "white", // White font color
    borderRadius: "8px", // Rounded corners
    "&:hover": {
      backgroundColor: "black", // Dark black background
      color: "rgb(255,14,180)", // Darker background on hover
    },
  }}
>
  + New Event
</Button>
          {isShowDownload && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadButtonClick} // Close the drawer when clicked
              sx={{
                color: "black", // White font color
                borderRadius: "8px", // Rounded corners
                borderColor:"black",
                "&:hover": {
                  borderColor:"rgb(255,14,180)",
                  color:"rgb(255,14,180)",
                  backgroundColor: "white", // Darker background on hover
                },
              }}>
              Download
            </Button>
          )}
 <Dialog
      open={openSourceDialog}
      onClose={() => setOpenSourceDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Select a Source</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <InputLabel id="source-select-label">Source</InputLabel>
          <Select
            labelId="source-select-label"
            id="source-select"
            value={selectedSource}
            label="Source"
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            {sources.map((source, index) => {
              // Add a subheader for each category
              
              if (
                index === 0 || source.category !== sources[index - 1].category
              ) {
                return [
                  <ListSubheader  sx={{ color: "black", fontWeight:"bold", marginTop:"4px",marginBottom:"4px" }} key={source.category}>
                    {source.category}
                  </ListSubheader>,
                  <MenuItem  sx={{ fontSize: "12px", paddingLeft:"34px"}}key={source.value} value={source.value}>
                    {source.value}
                  </MenuItem>,
                ];
              }
              return (
                <MenuItem key={source.value} value={source.value}>
                  {source.value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ color: "black" }}
          onClick={() => {
            setOpenSourceDialog(false);
            setOpenDrawer(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "rgb(255,14,180)",
            "&:hover": { backgroundColor: "rgb(220,10,160)" },
          }}
          onClick={handleDownload}
        >
          Handle
        </Button>
      </DialogActions>
    </Dialog>
      {isMasterEventsPath && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
              disabled={uploading}
              sx={{
                color: "black", // White font color
                borderRadius: "8px", // Rounded corners
                borderColor:"black",
                "&:hover": {
                  borderColor:"rgb(255,14,180)",
                  backgroundColor: "white", // Darker background on hover
                  color:"rgb(255,14,180)",
                },
              }}>
              Upload CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        )}
        {isShowMasterEvents && (
            <Button variant="outlined"
             onClick={handleMasterEvents}
             sx={{
              color: "black", // White font color
              borderRadius: "8px", // Rounded corners
              borderColor:"black",
              "&:hover": {
                borderColor:"rgb(255,14,180)",
                color:"rgb(255,14,180)",
                backgroundColor: "white", // Darker background on hover
              },
            }}>
              Master Events
            </Button>
          )}</Box>
      </Drawer>
        <ApplicationSetupDialog
          open={openAppSetup}
          onClose={() => setOpenAppSetup(false)}
          onSubmit={handleAppSetup}
          isEdit={!!currentOrganization?.applicationId}
          initialData={currentOrganization?.applicationDetails || {}}
        />
      </Box>
      <Box sx={{ marginTop: "10px" }}></Box>
      {open && <AddEventModal open={open} setOpen={setOpen} />}
    </Box>
  );
};

export default Header;