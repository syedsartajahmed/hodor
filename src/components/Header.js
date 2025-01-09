import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import AddEventModal from "./AddEventModal";
import { useAppContext } from "@/context/AppContext";
import NewCategoryModal from "./NewCategory";
import { useRouter } from "next/router";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import ApplicationSetupDialog from "@/components/ApplicationSetupDialog";
import UploadIcon from "@mui/icons-material/Upload";
import Papa from "papaparse";
import showToast from "@/utils/toast";

const Header = ({
  isShowCopy = false,
  isShowMasterEvents = false,
  isShowDownload = false,
  isShowFilter = false,
}) => {
  const [view, setView] = useState("list");
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const {
    tableData,
    setShowList,
    currentOrganization,
    allEvents,
    setTableData,
  } = useAppContext();
  const router = useRouter();
  const isMasterEventsPath = router.pathname.includes("/master-event");

  const eventSize = tableData.length;
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
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
  const [openSourceDialog, setOpenSourceDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");

  // *** Extract unique sources from allEvents (assuming allEvents is an array) ***
  const uniqueSources = [
    ...new Set(allEvents?.flatMap((event) => event.source || [])),
  ].filter(Boolean);

  // *** Updated handleDownloadButtonClick to open dialog instead of downloading directly ***
  const handleDownloadButtonClick = () => {
    setOpenSourceDialog(true);
  };

  //   const handleDownload = () => {
  //     const mixpanelToken =
  //       localStorage.getItem("mixpanelToken") || "YOUR_PROJECT_TOKEN";

  //     if (!selectedSource) {
  //       showToast("Please select a source first.");
  //       return;
  //     }

  //     // 1) Filter events to only those containing the chosen source
  //     const filteredEvents = allEvents.filter((event) =>
  //       event.source.includes(selectedSource)
  //     );

  //     // 2) Choose different import/init code based on Website vs. Backend
  //     let importSection = "";
  //     if (selectedSource === "Website") {
  //       importSection = `

  // //  # Installation Instructions
  // //  # via npm
  // //  npm install --save mixpanel-browser

  // //  # via yarn
  // //  yarn add mixpanel-browser

  // import mixpanel from "mixpanel-browser";
  // mixpanel.init("${mixpanelToken}", {
  //   debug: true,
  //   track_pageview: true,
  // });
  //         `;
  //     } else if (selectedSource === "Backend") {
  //       importSection = `

  // //  # Installation Instructions for Backend
  // //  npm install --save mixpanel
  // //  yarn add mixpanel

  // const Mixpanel = require("mixpanel");
  // const mixpanel = Mixpanel.init("${mixpanelToken}", {});
  //         `;
  //     }

  //     // 3) Generate event code only for the filtered events
  //     const eventCode = generateAllEventsCode(filteredEvents);

  //     // Extract function names for the comment
  //     const functionNames = allEvents.map((event) => {
  //       const name = event?.eventName
  //         ?.trim()
  //         .replace(/([a-z])([A-Z])/g, "$1_$2")
  //         .replace(/[_\s]+/g, "_")
  //         .toLowerCase();
  //       return name
  //         ?.split("_")
  //         .map((word, index) =>
  //           index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  //         )
  //         .join("");
  //     });

  //     const importComment = `// import { ${functionNames.join(
  //       ", "
  //     )} } from './utils/mixpanel.js';`;

  //     const finalCode = `
  // // Use these functions wherever needed by importing them from './utils/mixpanel.js' and calling them like functionName(userId, data).
  // ${importComment}
  // ${importSection}

  // ${eventCode}
  //       `;

  //     const blob = new Blob([finalCode], { type: "text/javascript" });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "mixpanel.js";
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //     setOpenSourceDialog(false);

  //   };

  //   const generateAllEventsCode = (events) => {
  //     const formatEventName = (name) => {
  //       const eventName = name?.trim()
  //         ? name
  //             .trim()
  //             .replace(/([a-z])([A-Z])/g, "$1_$2")
  //             .replace(/[_\s]+/g, "_")
  //             .toLowerCase()
  //         : "unnamed_event";

  //       return {
  //         snakeCase: eventName,
  //         camelCase: eventName
  //           .split("_")
  //           .map((word, index) =>
  //             index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  //           )
  //           .join(""),
  //       };
  //     };

  //     const generateMethodCode = (properties, methodType, eventName) => {
  //       switch (methodType) {
  //         case "Track":
  //           return `mixpanel.track("${eventName}", {
  //       ${properties
  //         ?.map(
  //           (prop) =>
  //             `"${prop?.property_name}": data["${
  //               prop?.property_type === "String"
  //                 ? `${prop?.property_name}`
  //                 : prop?.property_name
  //             }"], // ${prop?.property_type}`
  //         )
  //         .join("\n      ")}
  //     });`;

  //         case "Register":
  //         case "Register Once":
  //           const registerMethod =
  //             methodType === "Register" ? "register" : "register_once";
  //           return `mixpanel.${registerMethod}({
  //       ${properties
  //         ?.map(
  //           (prop) =>
  //             `"${prop?.property_name}": data["${
  //               prop?.property_type === "String"
  //                 ? `${prop?.sample_value}`
  //                 : prop?.sample_value
  //             }"],`
  //         )
  //         .join("\n      ")}
  //     });`;

  //         case "People Set":
  //         case "People Set Once":
  //           const setMethod = methodType === "People Set" ? "set" : "set_once";
  //           return `mixpanel.people.${setMethod}({
  //       ${properties
  //         ?.map(
  //           (prop) =>
  //             `"${prop?.property_name}": data["${
  //               prop?.property_type === "String"
  //                 ? `${prop?.sample_value}`
  //                 : prop?.sample_value
  //             }"],`
  //         )
  //         .join("\n      ")}
  //     });`;

  //         case "People Unset":
  //           return `mixpanel.people.unset([
  //       ${properties
  //         ?.map((prop) => `"${prop?.property_name}",`)
  //         .join("\n      ")}}
  //     ]);`;

  //         case "Opt Out Tracking":
  //           return "mixpanel.opt_out_tracking();";

  //         default:
  //           return "";
  //       }
  //     };

  //     // Generate code for all events
  //     const allEventsCode = events.map((event) => {
  //       const { snakeCase: eventName, camelCase: functionName } = formatEventName(
  //         event?.eventName
  //       );

  //       // Group properties by method call
  //       const methodGroups = {};
  //       event.items[0]?.event_property?.forEach((prop) => {
  //         if (!methodGroups[prop?.method_call]) {
  //           methodGroups[prop?.method_call] = [];
  //         }
  //         methodGroups[prop?.method_call].push(prop);
  //       });

  //       // Generate code for each method group
  //       const methodCalls = Object.entries(methodGroups)
  //         .map(([method, props]) => generateMethodCode(props, method, eventName))
  //         .filter((code) => code)
  //         .join("\n\n  ");

  //       // Generate super properties code
  //       const superPropsCode =
  //         event.items[0]?.super_property?.length > 0
  //           ? `\n    mixpanel.register({
  //       ${event?.items[0]?.super_property
  //         .map((prop) => `"${prop?.name}": data["${prop?.name}"],`)
  //         .join("\n      ")}
  //     });`
  //           : "";

  //       // Generate user properties code
  //       const userPropsCode =
  //         event.items[0]?.user_property.length > 0
  //           ? `\n    mixpanel.people.set({
  //       ${event?.items[0]?.user_property
  //         .map((prop) => `"${prop?.name}": data["${prop?.name}"],`)
  //         .join("\n      ")}
  //     });`
  //           : "";

  //       // Generate identify/unidentify code
  //       const identifyCode = event?.identify
  //         ? "\n    mixpanel.identify(userId);"
  //         : "";
  //       const unidentifyCode = event?.unidentify ? "\n    mixpanel.reset();" : "";

  //       // Generate example data for function call
  //       const exampleData = {
  //         ...event.items[0]?.event_property.reduce(
  //           (acc, prop) => ({
  //             ...acc,
  //             [prop?.property_name]: prop?.sample_value,
  //           }),
  //           {}
  //         ),
  //         ...event.items[0]?.super_property.reduce(
  //           (acc, prop) => ({
  //             ...acc,
  //             [prop?.name]: prop?.value,
  //           }),
  //           {}
  //         ),
  //       };

  //       return {
  //         implementation: `// ${
  //           event?.event_definition || "Track user interaction"
  //         }
  //   export function ${functionName}(${
  //           event?.identify ? "userId, " : ""
  //         }data) {${identifyCode}${unidentifyCode}${superPropsCode}${userPropsCode}
  //     ${methodCalls}
  //   }`,
  //       };
  //     });

  //     // Combine all implementations and examples
  //     const finalCode = `${allEventsCode
  //       .map((code) => code?.implementation)
  //       .join("\n\n")}`;

  //     return finalCode;
  //   };

  const handleDownload = () => {
    const mixpanelToken =
      currentOrganization?.applicationDetails?.token || "YOUR_PROJECT_TOKEN";

    if (!selectedSource) {
      showToast("Please select a source first.");
      return;
    }

    // Filter events to only those containing the chosen source
    const filteredEvents = allEvents.filter((event) =>
      event.source.includes(selectedSource)
    );

    let code = "";
    let filename = "";

    // Generate code based on selected platform
    switch (selectedSource) {
      case "Website":
        code = generateWebsiteCode(filteredEvents, mixpanelToken);
        filename = "mixpanel-web.js";
        break;
      case "Backend":
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
      default:
        showToast("Unsupported platform");
        return;
    }

    // Create and download the file
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

  // Helper function to generate code for Website platform
  const generateWebsiteCode = (events, mixpanelToken) => {
    const importSection = `
//  # Installation Instructions
//  # via npm
//  npm install --save mixpanel-browser

//  # via yarn
//  yarn add mixpanel-browser

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

// Initialize Mixpanel in your AppDelegate:
// Mixpanel.initialize(token: "YOUR_PROJECT_TOKEN", trackAutomaticEvents: false)
  `;

    return generateEventCode(events, importSection, "ios");
  };

  // Main event code generator function
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

    //   const generateExampleInvocation = (event, platform) => {
    //     const { camelCase: functionName } = formatEventName(event?.eventName);
    //     const properties = event.items[0]?.event_property || [];

    //     const exampleData = properties.reduce((acc, prop) => {
    //       let exampleValue = "";
    //       switch(prop.property_type?.toLowerCase()) {
    //         case "string":
    //           exampleValue = `"example_${prop.property_name}"`;
    //           break;
    //         case "number":
    //           exampleValue = "123";
    //           break;
    //         case "boolean":
    //           exampleValue = "true";
    //           break;
    //         default:
    //           exampleValue = `"example_value"`;
    //       }
    //       acc[prop.property_name] = exampleValue;
    //       return acc;
    //     }, {});

    //     switch (platform) {
    //       case "web":
    //       case "backend":
    //         return `// Example invocation:
    // // ${event?.event_definition || "Track user interaction"}
    // ${functionName}(${event?.identify ? '"user123", ' : ''}{
    //   ${Object.entries(exampleData)
    //     .map(([key, value]) => `${key}: ${value}`)
    //     .join(",\n  ")}
    // });`;

    //       case "android":
    //         return `// Example invocation:
    // // ${event?.event_definition || "Track user interaction"}
    // val data = mapOf(
    //   ${Object.entries(exampleData)
    //     .map(([key, value]) => `"${key}" to ${value}`)
    //     .join(",\n  ")}
    // )
    // ${functionName}(context${event?.identify ? ', "user123"' : ''}, data)`;

    //       case "ios":
    //         return `// Example invocation:
    // // ${event?.event_definition || "Track user interaction"}
    // let data: [String: Any] = [
    //   ${Object.entries(exampleData)
    //     .map(([key, value]) => `"${key}": ${value}`)
    //     .join(",\n  ")}
    // ]
    // ${functionName}(${event?.identify ? 'userId: "user123", ' : ''}data: data)`;

    //       default:
    //         return "";
    //     }
    //   };

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
  // Helper function to generate super properties code
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

  const handleMasterEvents = async () => {
    router.push(`${window.location.pathname}/master-events`);
  };

  const handleOrganizationSelection = async (
    selected,
    setSelectedOrganizations,
    setTableData,
    tableData
  ) => {
    setSelectedOrganizations(selected);

    try {
      const response = await axios.get(`/api/master-events`, {
        params: { organization: selected.join(",") },
      });

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

      setTableData(updatedRows);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const [openAppSetup, setOpenAppSetup] = useState(false);
  const [newOrgId, setNewOrgId] = useState(null);

  const handleOrganizationClick = () => {
    if (currentOrganization?.name) {
      setOpenAppSetup(true);
    }
  };

  const [uploading, setUploading] = useState(false);

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
          // backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            onClick={handleOrganizationClick}
            sx={{
              cursor: currentOrganization?.name ? "pointer" : "default",
              color: currentOrganization?.name ? "#333" : "#888",
              backgroundColor: "#f0f0f0", // Light gray background color
              padding: "4px 8px", // Add some padding for better spacing
              borderRadius: "4px", // Rounded corners
              "&:hover": currentOrganization?.name && {
                textDecoration: "underline",
                backgroundColor: "#e0e0e0", // Slightly darker gray on hover
              },
            }}
          >
            {isMasterEventsPath
              ? "Master Events"
              : currentOrganization?.name || "Organization"}{" "}
            ({eventSize})
            {/* {currentOrganization?.name || "Organization"} ({eventSize}) */}
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
          {isShowCopy && (
            <Button variant="outlined" onClick={handleCopy}>
              Copy URL
            </Button>
          )}
          {isShowMasterEvents && (
            <Button variant="outlined" onClick={handleMasterEvents}>
              Master Events
            </Button>
          )}
          {isShowDownload && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadButtonClick}
            >
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
                  {/* {uniqueSources.map((source) => (
                    <FormControlLabel
                      key={source}
                      value={source}
                      control={<Radio />}
                      label={source}
                    />
                  ))} */}
                  {uniqueSources.map((source) => (
                    <FormControlLabel
                      key={source}
                      value={source}
                      control={<Radio />}
                      label={
                        // Dynamically add brackets with platform information
                        source === "Backend"
                          ? `${source} (NodeJS)`
                          : source === "Android"
                          ? `${source} (Kotlin)`
                          : source === "iOS"
                          ? `${source} (Swift)`
                          : source // Default to just the source name
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
          {isShowFilter && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="organization-filter-label">
                Organizations
              </InputLabel>
              <Select
                labelId="organization-filter-label"
                multiple
                value={selectedOrganizations}
                onChange={(e) =>
                  handleOrganizationSelection(
                    e.target.value,
                    setSelectedOrganizations,
                    setTableData,
                    tableData
                  )
                }
                renderValue={(selected) => selected.join(", ")}
              >
                {Array.from(
                  new Set(
                    tableData
                      .map((event) => event.organization)
                      .filter((org) => org && org.trim() !== "")
                  )
                )
                  .concat(
                    selectedOrganizations.filter(
                      (org) => !tableData.some((e) => e.organization === org)
                    )
                  )
                  .map((org) => (
                    <MenuItem key={org} value={org}>
                      <Checkbox checked={selectedOrganizations.includes(org)} />
                      <ListItemText primary={org} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Box>
        {isMasterEventsPath && (
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
              disabled={uploading}
            >
              Upload CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={async (event) => {
                  const file = event.target.files[0];
                  if (file) {
                    setUploading(true);

                    Papa.parse(file, {
                      header: true,
                      skipEmptyLines: true,
                      complete: async (result) => {
                        const rows = result.data;
                        const newFormattedData = []; // Temporary array for new rows

                        for (const [index, row] of rows.entries()) {
                          try {
                            // Format the row data for API payload
                            const payload = {
                              eventName: row.eventName || "Unnamed Event",
                              event_definition:
                                row.event_definition ||
                                "No description provided",
                              platform: row.platform
                                ? row.platform.split(",")
                                : ["Unknown"],
                              stakeholders: row.stakeholders
                                ? row.stakeholders.split(",")
                                : [],
                              category: row.category || "Uncategorized",
                              source: row.source
                                ? row.source.split(",")
                                : ["Unknown"],
                              action: row.action || "No action",
                              items: row.items
                                ? JSON.parse(row.items).map((item) => ({
                                    user_property: item.user_property || [],
                                    event_property:
                                      item.event_property?.map((prop) => ({
                                        property_name:
                                          prop.property_name || prop.name,
                                        sample_value:
                                          prop.sample_value || prop.value,
                                        data_type: prop.data_type || prop.type,
                                        property_type: prop.property_type,
                                        property_definition:
                                          prop.property_definition ||
                                          "Event property definition",
                                        method_call:
                                          prop.method_call || "Track",
                                      })) || [],
                                    super_property: item.super_property || [],
                                  }))
                                : [],
                              identify: row.identify === "true",
                              unidentify: row.unidentify === "true",
                              organization: row?.organization || "",
                            };

                            // Make API call to save the row to the master events
                            const response = await axios.post(
                              "/api/master-events",
                              payload
                            );
                            const savedEvent = response.data.totalEvents?.find(
                              (event) => event.eventName === payload.eventName
                            );

                            if (savedEvent) {
                              // Add the saved event to the temporary array
                              newFormattedData.push({
                                id: savedEvent._id,
                                name: savedEvent.eventName,
                                eventProperties: savedEvent.items
                                  .map((item) => {
                                    const eventProps =
                                      item.event_property
                                        ?.map(
                                          (prop) =>
                                            `Property Name: ${
                                              prop.property_name || "N/A"
                                            }, Value: ${
                                              prop.sample_value || "N/A"
                                            }, Data Type: ${
                                              prop.data_type || "N/A"
                                            }, Method Call: ${
                                              prop.method_call || "N/A"
                                            }`
                                        )
                                        .join("; ") || "";

                                    const superProps =
                                      item.super_property
                                        ?.map(
                                          (prop) =>
                                            `Name: ${
                                              prop.name || "N/A"
                                            }, Value: ${prop.value || "N/A"}`
                                        )
                                        .join("; ") || "";

                                    const userProps =
                                      item.user_property
                                        ?.map(
                                          (prop) =>
                                            `Name: ${
                                              prop.name || "N/A"
                                            }, Value: ${prop.value || "N/A"}`
                                        )
                                        .join("; ") || "";

                                    return [
                                      eventProps
                                        ? `Event Properties: { ${eventProps} }`
                                        : "",
                                      superProps
                                        ? `Super Properties: { ${superProps} }`
                                        : "",
                                      userProps
                                        ? `User Properties: { ${userProps} }`
                                        : "",
                                    ]
                                      .filter(Boolean)
                                      .join(", ");
                                  })
                                  .join("; "),
                                stakeholders: savedEvent.stakeholders,
                                category: savedEvent.category,
                                source: savedEvent.source,
                                action: savedEvent.action,
                                platform: savedEvent.platform,
                                organization : savedEvent?.organization
                              });
                              showToast("CSV data uploaded successfully!");
                            }
                          } catch (error) {
                            if (
                              error.response &&
                              error.response.data &&
                              error.response.data.message
                            ) {
                              showToast(error.response.data.message);
                            } else {
                              showToast("Failed to save event. Please try again.");
                            }
                          }
                        }

                        // Deduplicate and update the table data
                        setTableData((prev) => {
                          const allData = [...prev, ...newFormattedData];
                          const deduplicatedData = allData.filter(
                            (v, i, a) => a.findIndex((t) => t.id === v.id) === i
                          ); // Remove duplicates based on the `id`
                          return deduplicatedData;
                        });

                        setUploading(false);
                      },
                      error: () => {
                        setUploading(false);
                        showToast(
                          "Failed to parse the CSV file. Please try again."
                        );
                      },
                    });

                    event.target.value = null; // Reset the file input
                  }
                }}
              />
            </Button>
          </Box>
        )}

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
