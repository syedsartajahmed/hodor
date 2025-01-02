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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("mixpanelToken");
      if (storedToken) {
        setToken(storedToken);
        updateInitCode(storedToken);
      }
    }
  }, []);

  const handleTokenChange = (event) => {
    const newToken = event.target.value;
    setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("mixpanelToken", newToken);
    }
    updateInitCode(newToken);
  };

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
const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('${token || "YOUR_PROJECT_TOKEN"}');
`);
    } else {
      setInstructions(`Chrome integration will be added later.`);
      setInitCode("");
    }
  };

  const updateInitCode = (newToken) => {
    setInitCode(`
import mixpanel from 'mixpanel-browser';

mixpanel.init('${newToken || "YOUR_PROJECT_TOKEN"}', {
  debug: true,
  track_pageview: true,
});
`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  useEffect(() => {
    // Initialize instructions and code on component load
    handleEnvironmentChange({ target: { value: environment } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* NEW STEP 2: Creating a separate file */}
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
          For better organization, create a file such as <strong>utils/mixpanel.js</strong> (or 
          <strong> lib/mixpanel.js</strong>) and place the initialization code there.
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
            3. Mixpanel Initialization
          </Typography>
          <SmallNote>
            Add this initialization code inside your newly created file (e.g., <strong>mixpanel.js</strong>) before using Mixpanel.
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
            Place this code in the same file where you set up Mixpanel, or in another file if you prefer to keep it separate.
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
            {`import { ${functionName} } from '../utils/mixpanel';`}
            <IconButton
              onClick={() =>
                copyToClipboard(`import { ${functionName} } from './filePath';`)
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
            Call this function wherever you want to trigger Mixpanel tracking.
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
