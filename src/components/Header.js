import React from "react";
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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
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
import { useRouter } from "next/router";

const Header = ({
  isShowCopy = false,
  isShowMasterEvents = false,
  isShowDownload = false,
  isShowFilter = false,
}) => {
  const [tableData, setTableData] = useRecoilState(tableDataState);
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const allEvents = useRecoilValue(allEventsState);
  const isProductAnalyst = useRecoilValue(isProductAnalystState);
  const [showList, setShowList] = useRecoilState(showListState);

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

    if (isProductAnalyst) {
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
    } else {
      switch (selectedSource) {
        case "Website":
          code = generateRudderStackWebsiteCode(filteredEvents, writeKey);
          filename = "rudderstack-web.js";
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
    }

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

  const handleOrganizationSelection = async (selected) => {
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
  
      setTableData(updatedRows); // Use Recoil setter
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
    stakeholders: savedEvent.stakeholders?.split(',') || [],
    category: savedEvent.category,
    source: savedEvent.source?.split(',') || [],
    action: savedEvent.action,
    platform: savedEvent.platform?.split(',') || [],
    organization: savedEvent.organization,
  });

  const processCSVData = (rows) => {
    const eventGroups = rows.reduce((acc, row) => {
      if (!row.eventName) return acc;
      
      if (!acc[row.eventName]) {
        acc[row.eventName] = {
          eventName: row.eventName,
          event_definition: row.event_definition || "default",
          action: row.action || "default",
          stakeholders: row.stakeholders,
          category: row.category,
          source: row.source,
          platform: row.platform,
          organization: row.organization,
          items: [{
            event_property: [],
            user_property: [],
            super_property: []
          }]
        };
      }

      const property = {
        property_name: row['Property Name'],
        property_definition: row['Property Definition'],
        data_type: row['Data Type'],
        sample_value: row['Sample Values'],
        method_call: row['Method Call']
      };

      switch (row['Property Type']) {
        case 'Event Property':
          acc[row.eventName].items[0].event_property.push(property);
          break;
        case 'User Property':
          acc[row.eventName].items[0].user_property.push({
            name: property.property_name,
            value: property.sample_value,
            type: property.data_type
          });
          break;
        case 'Super Property':
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
        ...event,
      }));

      setTableData(updatedRows);
    } catch (err) {
      console.error(err);
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
          width: "100%",
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
              backgroundColor: "#f0f0f0",
              padding: "4px 8px",
              borderRadius: "4px",
              "&:hover": currentOrganization?.name && {
                textDecoration: "underline",
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            {isMasterEventsPath
              ? "Master Events"
              : currentOrganization?.name || "Organization"}{" "}
            ({eventSize})
          </Typography>

          <Button variant="contained" color="secondary" onClick={handleOpen}>
            + New Event
          </Button>
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
                onChange={handleFileUpload}
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