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
  FormControlLabel,
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
import { screenLoaded } from "../utils/mixpanel";

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
    screenLoaded({ user_channel: "web", screen_name: "Hodor Home" });
  }, []);
  const safeTableData = Array.isArray(tableData) ? tableData : []; // Ensure tableData is an array
const eventSize = safeTableData.length;  // Use safeTableData here

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

    const filteredEvents = allEvents.filter((event) =>
      event.source.includes(selectedSource)
    );

    let code = "";
    let filename = "";

   // if (isProductAnalyst) {
      switch (selectedSource) {
        case "Web":
          code = generateWebsiteCode(filteredEvents, mixpanelToken);
          filename = "mixpanel-web.js";
          break;
        case "server":
          code = generateBackendCode(filteredEvents, mixpanelToken);
          filename = "mixpanel-backend.js";
          break;
        case "Android":
          code = generateAndroidCode(filteredEvents);
          filename = "MixpanelTracking.kt";
          break;
        case "iOS":
          code = generateIOSCode(filteredEvents);
          filename = "MixpanelTracking.swift";
          break;
          case "App":
            // Generate both Android and iOS files
            const androidCode = generateAndroidCode(filteredEvents);
            const iosCode = generateIOSCode(filteredEvents);
        
            // Function to trigger file downloads
            downloadFile("MixpanelTracking.kt", androidCode);
            downloadFile("MixpanelTracking.swift", iosCode);
            
            showToast("Android & iOS files generated!");
            return; 
        default:
          showToast("Unsupported platform");
          return;
      }
      function downloadFile(filename, content) {
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
      const validSources = ["web", "server side", "app"];
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
  };  const generateWebsiteCode = (events, mixpanelToken) => {
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
  const generatePlatformImportComment = (functionNames, platform) => {
    switch (platform) {
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
      default:
        return "";
    }
  };
  return (
    <>
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
        }}
      >
     <Box display="flex" alignItems="center" gap={2}>
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
        textDecoration: "underline",
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
         <Box display="flex" alignItems="center" gap={2}>
  {/* ToggleButtonGroup */}
  <ToggleButtonGroup
    value={view}
    exclusive
    onChange={handleViewChange}
    aria-label="view toggle"
    sx={{
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
        height: "100%", // Full height of the ToggleButtonGroup
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
        height: "100%", // Full height of the ToggleButtonGroup
      }}
    >
      List
    </ToggleButton>
  </ToggleButtonGroup>

  {/* FormControl with Select */}
  {isShowFilter && (
        <FormControl sx={{ minWidth: 200, height: "56px" }}>
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
              height: "56px",
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
             onClick={handleCopy}
             sx={{
              color: "black", // White font color
              borderRadius: "8px", // Rounded corners
              borderColor:"black",
              "&:hover": {
                color:"white",
                backgroundColor: "#333", // Darker background on hover
              },
            }}>
              Copy URL
            </Button>
          )}
          

<Button
  variant="contained"
  onClick={handleOpen}
  sx={{
    backgroundColor: "black", // Dark black background
    color: "white", // White font color
    borderRadius: "8px", // Rounded corners
    "&:hover": {
      backgroundColor: "#333", // Darker background on hover
    },
  }}
>
  + New Event
</Button>
          {isShowDownload && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadButtonClick}
              sx={{
                color: "black", // White font color
                borderRadius: "8px", // Rounded corners
                borderColor:"black",
                "&:hover": {
                  backgroundColor: "#333", // Darker background on hover
                  color:"white",
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
          <FormControl component="fieldset">
            <RadioGroup
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              {uniqueSources.map((source) => (
                <FormControlLabel
                  key={source}
                  value={source}
                  control={<Radio />}
                  label={
                    source === "Backend"
                      ? `${source} (NodeJS)`
                      : source === "Android"
                      ? `${source} (Kotlin)`
                      : source === "iOS"
                      ? `${source} (Swift)`
                      : source
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSourceDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDownload}>
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
                  backgroundColor: "#333", // Darker background on hover
                  color:"white",
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
                color:"white",
                backgroundColor: "#333", // Darker background on hover
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
    </>
  );
};

export default Header;