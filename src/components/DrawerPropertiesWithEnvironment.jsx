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

const CodeBox = styled(Box)`
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  position: relative;
  overflow-x: auto;
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
  const [token, setToken] = useState(localStorage.getItem("mixpanelToken") || "");

  const handleEnvironmentChange = (event) => {
    const value = event.target.value;
    setEnvironment(value);

    if (value === "Frontend") {
      setInstructions(`
# Installation Instructions
# via npm
npm install --save mixpanel-browser

# via yarn
yarn add mixpanel-browser
`);
      updateInitCode(token);
    } else if (value === "Backend") {
      setInstructions(`
# Installation Instructions for Backend
npm install --save mixpanel
yarn add mixpanel
`);
      setInitCode(`
// Backend Initialization
const mixpanel = require('mixpanel');
const tracker = mixpanel.init('${token || "YOUR_PROJECT_TOKEN"}');
`);
    } else {
      setInstructions(`Chrome integration will be added later.`);
      setInitCode("");
    }
  };

  const updateInitCode = (newToken) => {
    setInitCode(`
// Add this to your common file before calling Mixpanel init:
import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with tracking options
mixpanel.init('${newToken || "YOUR_PROJECT_TOKEN"}', {
  debug: true,
  track_pageview: true,
});
`);
  };

  const handleTokenChange = (event) => {
    const newToken = event.target.value;
    setToken(newToken);
    localStorage.setItem("mixpanelToken", newToken);
    updateInitCode(newToken);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  useEffect(() => {
    // Initialize instructions and code on component load
    handleEnvironmentChange({ target: { value: environment } });
  }, [token]);

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
            Mixpanel Token
          </Typography>
          <SmallNote>
            Enter your Mixpanel project token. This will be used in the initialization code.
          </SmallNote>
          <TextField
            fullWidth
            label="Mixpanel Token"
            value={token}
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
            2. Mixpanel Initialization
          </Typography>
          <SmallNote>
            Add this to your common file (e.g., mixpanel.js or mipanelUtils.js) before initializing Mixpanel.
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
            3. Generated Code
          </Typography>
          <SmallNote>
            Place this code in a separate file and export it for reuse.
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
            4. Function Import 
          </Typography>
          <SmallNote>
            Use this import statement to invoke the generated function.
          </SmallNote>
          <CodeBox>
            {`import { ${functionName} } from './filePath';`}
            <IconButton
              onClick={() => copyToClipboard(`import { ${functionName} } from './filePath';`)}
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
            5. Trigger Code
          </Typography>
          <SmallNote>
            Call this function where you want to trigger Mixpanel tracking.
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
