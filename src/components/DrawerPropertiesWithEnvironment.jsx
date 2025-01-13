import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styled from "@emotion/styled";
import { useAppContext } from "@/context/AppContext";
import showToast from "@/utils/toast";

const CodeBox = styled(Box)`
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  position: relative;
  overflow-x: auto;
  font-size: 14px;
`;

const SmallNote = styled(Typography)`
  font-size: 0.75rem;
  color: #000000;
  margin-top: 8px;
  padding-bottom: 10px;
`;

const DrawerPropertiesWithEnvironment = ({
  generatedCode,
  setGeneratedCode,
  triggerCode,
  functionName,
}) => {
  const [environment, setEnvironment] = useState("Frontend");
  const [instructions, setInstructions] = useState("");
  const [initCode, setInitCode] = useState("");
  const [token, setToken] = useState("");

  const {
    isEventDrawerOpen,
    toggleEventDrawer,
    selectedEvent,
    setAllEvents,
    currentOrganization,
    setTableData,
    setSelectedOrganization,
    isProductAnalyst,
  } = useAppContext();

  const analyticsProvider = isProductAnalyst ? "Mixpanel" : "RudderAnalytics";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = currentOrganization?.applicationDetails?.token;
      if (storedToken) {
        console.log("Stored token:", storedToken);
        setToken(storedToken);
        updateInitCode(storedToken);
      }
    }
  }, []);

  const handleTokenChange = (event) => {
    const newToken = event.target.value;
    setToken(newToken);
    updateInitCode(newToken);
  };

  const handleEnvironmentChange = (event) => {
    const value = event.target.value;
    setEnvironment(value);

    if (value === "Frontend") {
      setInstructions(
        isProductAnalyst
          ? `
# Installation Instructions
# via npm
npm install --save mixpanel-browser

# via yarn
yarn add mixpanel-browser
`
          : `
# Installation Instructions
# via npm
npm install --save @rudderstack/rudder-sdk-js

# via yarn
yarn add @rudderstack/rudder-sdk-js
`
      );
      updateInitCode(token);
    } else if (value === "Backend") {
      setInstructions(
        isProductAnalyst
          ? `
# Installation Instructions for Backend
npm install --save mixpanel
yarn add mixpanel
`
          : `
# Installation Instructions for Backend
npm install --save @rudderstack/rudder-sdk-node
yarn add @rudderstack/rudder-sdk-node
`
      );
      setInitCode(
        isProductAnalyst
          ? `
// Backend Initialization
const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('${token || "YOUR_PROJECT_TOKEN"}');
`
          : `
// Backend Initialization
const Analytics = require('@rudderstack/rudder-sdk-node');
const client = new Analytics('${
              token || "YOUR_WRITE_KEY"
            }', 'https://your-data-plane-url');
`
      );
    } else {
      setInstructions(`Chrome integration will be added later.`);
      setInitCode("");
    }
  };

  const updateInitCode = (newToken) => {
    if (isProductAnalyst) {
      setInitCode(`
import mixpanel from 'mixpanel-browser';

mixpanel.init('${newToken || "YOUR_PROJECT_TOKEN"}', {
  debug: true,
  track_pageview: true,
});
`);
    } else {
      setInitCode(`
import * as rudderanalytics from '@rudderstack/rudder-sdk-js';

rudderanalytics.load('${
        newToken || "YOUR_WRITE_KEY"
      }', 'https://your-data-plane-url', {
  logLevel: 'DEBUG',
  configUrl: 'https://api.rudderlabs.com',
});
`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!");
    });
  };

  useEffect(() => {
    handleEnvironmentChange({ target: { value: environment } });
  }, [token, isProductAnalyst]);

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Environment</InputLabel>
        <Select value={environment} onChange={handleEnvironmentChange}>
          <MenuItem value="Frontend">Frontend</MenuItem>
          <MenuItem value="Backend">Backend</MenuItem>
          <MenuItem value="Chrome">Chrome</MenuItem>
        </Select>
      </FormControl>

      {["Frontend", "Backend"].includes(environment) && (
        <Box mt={2}>
          <Typography
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#000000",
              textDecorationThickness: "2px",
            }}
            variant="h6"
            gutterBottom
          >
            {analyticsProvider} Token
          </Typography>
          <SmallNote>
            Enter your {analyticsProvider}{" "}
            {isProductAnalyst ? "project token" : "write key"}. This will be
            used in the initialization code.
          </SmallNote>
          <TextField
            fullWidth
            label={`${analyticsProvider} ${
              isProductAnalyst ? "Token" : "Write Key"
            }`}
            value={currentOrganization?.applicationDetails?.token}
            onChange={handleTokenChange}
            variant="outlined"
          />
        </Box>
      )}

      {instructions && (
        <Box mt={2}>
          <Typography
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#000000",
              textDecorationThickness: "2px",
            }}
            variant="h6"
            gutterBottom
          >
            1. Installation Instructions
          </Typography>
          <CodeBox>
            {instructions}
            <IconButton
              onClick={() => copyToClipboard(instructions)}
              sx={{ position: "absolute", top: 8, right: 8, color: "#ffffff" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </CodeBox>
        </Box>
      )}

      <Box mt={2}>
        <Typography
          sx={{
            textDecoration: "underline",
            textDecorationColor: "#000000",
            textDecorationThickness: "2px",
          }}
          variant="h6"
          gutterBottom
        >
          2. Create a Separate File
        </Typography>
        <SmallNote>
          For better organization, create a file such as{" "}
          <strong>utils/{analyticsProvider.toLowerCase()}.js</strong> (or
          <strong> lib/{analyticsProvider.toLowerCase()}.js</strong>) and place
          the initialization code there.
        </SmallNote>
      </Box>

      {initCode && (
        <Box mt={2}>
          <Typography
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#000000",
              textDecorationThickness: "2px",
            }}
            variant="h6"
            gutterBottom
          >
            3. {analyticsProvider} Initialization
          </Typography>
          <SmallNote>
            Add this initialization code inside your newly created file (e.g.,{" "}
            <strong>{analyticsProvider.toLowerCase()}.js</strong>) before using{" "}
            {analyticsProvider}.
          </SmallNote>
          <CodeBox>
            {initCode}
            <IconButton
              onClick={() => copyToClipboard(initCode)}
              sx={{ position: "absolute", top: 8, right: 8, color: "#ffffff" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </CodeBox>
        </Box>
      )}

      {generatedCode && (
        <Box mt={4}>
          <Typography
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#000000",
              textDecorationThickness: "2px",
            }}
            variant="h6"
            gutterBottom
          >
            4. Generated Code
          </Typography>
          <SmallNote>
            Place this code in the same file where you set up{" "}
            {analyticsProvider}, or in another file if you prefer to keep it
            separate.
          </SmallNote>
          <CodeBox>
            {generatedCode}
            <IconButton
              onClick={() => copyToClipboard(generatedCode)}
              sx={{ position: "absolute", top: 8, right: 8, color: "#ffffff" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </CodeBox>
        </Box>
      )}

      {functionName && (
        <Box mt={4}>
          <Typography
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#000000",
              textDecorationThickness: "2px",
            }}
            variant="h6"
            gutterBottom
          >
            5. Function Import
          </Typography>
          <SmallNote>
            Use this import statement to invoke the generated function.
          </SmallNote>
          <CodeBox>
            {`import { ${functionName} } from '../utils/${analyticsProvider.toLowerCase()}';`}
            <IconButton
              onClick={() =>
                copyToClipboard(
                  `import { ${functionName} } from '../utils/${analyticsProvider.toLowerCase()}';`
                )
              }
              sx={{ position: "absolute", top: 8, right: 8, color: "#ffffff" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </CodeBox>
        </Box>
      )}

      {triggerCode && (
        <Box mt={4}>
          <Typography
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#000000",
              textDecorationThickness: "2px",
            }}
            variant="h6"
            gutterBottom
          >
            6. Trigger Code
          </Typography>
          <SmallNote>
            Call this function wherever you want to trigger {analyticsProvider}{" "}
            tracking.
          </SmallNote>
          <CodeBox>
            {triggerCode}
            <IconButton
              onClick={() => copyToClipboard(triggerCode)}
              sx={{ position: "absolute", top: 8, right: 8, color: "#ffffff" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </CodeBox>
        </Box>
      )}
    </Box>
  );
};

export default DrawerPropertiesWithEnvironment;
