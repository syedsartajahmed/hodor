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
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isEventDrawerOpenState,
  selectedEventState,
  currentOrganizationState,
  isProductAnalystState,
} from "@/recoil/atom";
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

const DrawerPropertiesWithEnvironment = ({ generatedCode, setGeneratedCode, triggerCode, functionName }) => {
  const [environment, setEnvironment] = useState("Frontend");
  const [instructions, setInstructions] = useState("");
  const [initCode, setInitCode] = useState("");
  const [token, setToken] = useState("");

  const isEventDrawerOpen = useRecoilValue(isEventDrawerOpenState);
  const selectedEvent = useRecoilValue(selectedEventState);
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const isProductAnalyst = useRecoilValue(isProductAnalystState);

  const analyticsProvider = isProductAnalyst ? "Mixpanel" : "RudderAnalytics";

  useEffect(() => {
    const storedToken = currentOrganization?.applicationDetails?.token;
    if (storedToken) {
      setToken(storedToken);
      updateInitCode(storedToken);
    }
  }, [currentOrganization]);

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
          ? `# Installation Instructions\n# via npm\nnpm install --save mixpanel-browser\n\n# via yarn\nyarn add mixpanel-browser\n`
          : `# Installation Instructions\n# via npm\nnpm install --save @rudderstack/rudder-sdk-js\n\n# via yarn\nyarn add @rudderstack/rudder-sdk-js\n`
      );
      updateInitCode(token);
    } else if (value === "Backend") {
      setInstructions(
        isProductAnalyst
          ? `# Installation Instructions for Backend\nnpm install --save mixpanel\nyarn add mixpanel\n`
          : `# Installation Instructions for Backend\nnpm install --save @rudderstack/rudder-sdk-node\nyarn add @rudderstack/rudder-sdk-node\n`
      );
      setInitCode(
        isProductAnalyst
          ? `const Mixpanel = require('mixpanel');\nconst mixpanel = Mixpanel.init('${token || "YOUR_PROJECT_TOKEN"}');`
          : `const Analytics = require('@rudderstack/rudder-sdk-node');\nconst client = new Analytics('${token || "YOUR_WRITE_KEY"}', 'https://your-data-plane-url');`
      );
    } else {
      setInstructions(`Chrome integration will be added later.`);
      setInitCode("");
    }
  };

  const updateInitCode = (newToken) => {
    setInitCode(
      isProductAnalyst
        ? `import mixpanel from 'mixpanel-browser';\n\nmixpanel.init('${newToken || "YOUR_PROJECT_TOKEN"}', {\n  debug: true,\n  track_pageview: true,\n});`
        : `import * as rudderanalytics from '@rudderstack/rudder-sdk-js';\n\nrudderanalytics.load('${newToken || "YOUR_WRITE_KEY"}', 'https://your-data-plane-url', {\n  logLevel: 'DEBUG',\n  configUrl: 'https://api.rudderlabs.com',\n});`
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard!"));
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

      {initCode && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Initialization Code
          </Typography>
          <CodeBox>
            {initCode}
            <IconButton onClick={() => copyToClipboard(initCode)} sx={{ position: "absolute", top: 8, right: 8, color: "#ffffff" }}>
              <ContentCopyIcon />
            </IconButton>
          </CodeBox>
        </Box>
      )}
    </Box>
  );
};

export default DrawerPropertiesWithEnvironment;
