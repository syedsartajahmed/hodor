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
import { useRecoilValue } from "recoil";
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

const DrawerPropertiesWithEnvironment = ({
  generatedCode,
  setGeneratedCode,
  triggerCode,
  functionName,
}) => {
  const [environment, setEnvironment] = useState("Javascript");
  const [instructions, setInstructions] = useState("");
  const [initCode, setInitCode] = useState("");
  const [token, setToken] = useState("");

  const isEventDrawerOpen = useRecoilValue(isEventDrawerOpenState);
  const selectedEvent = useRecoilValue(selectedEventState);
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const isProductAnalyst = useRecoilValue(isProductAnalystState);

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
  }, [currentOrganization]);

  const handleTokenChange = (event) => {
    const newToken = event.target.value;
    setToken(newToken);
    updateInitCode(newToken);
  };

  const handleEnvironmentChange = (event) => {
    const value = event.target.value;
    setEnvironment(value);

    switch (value) {
      case "Javascript":
        setInstructions(`
# Installation Instructions for Javascript
# via npm
npm install --save mixpanel-browser

# via yarn
yarn add mixpanel-browser
`);
        setInitCode(`
import mixpanel from 'mixpanel-browser';

mixpanel.init('${token || "YOUR_PROJECT_TOKEN"}', {
  debug: true,
  track_pageview: true,
});
`);
        break;

      case "Node.js":
        setInstructions(`
# Installation Instructions for Node.js
npm install --save mixpanel

# via yarn
yarn add mixpanel
`);
        setInitCode(`
const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('${token || "YOUR_PROJECT_TOKEN"}');
`);
        break;

      case "React Native":
        setInstructions(`
# Installation Instructions for React Native
npm install --save mixpanel-react-native

# via yarn
yarn add mixpanel-react-native
`);
        setInitCode(`
import { Mixpanel } from 'mixpanel-react-native';

const mixpanel = new Mixpanel('${token || "YOUR_PROJECT_TOKEN"}');
mixpanel.init();
`);
        break;

      case "Kotlin (Android)":
        setInstructions(`
# Installation Instructions for Kotlin (Android)
# Add the following to your build.gradle file:
implementation 'com.mixpanel.android:mixpanel-android:6.0.0'
`);
        setInitCode(`
val mixpanel = MixpanelAPI.getInstance(context, "${token || "YOUR_PROJECT_TOKEN"}")
`);
        break;

      case "Swift (iOS)":
        setInstructions(`
# Installation Instructions for Swift (iOS)
# Add the following to your Podfile:
pod 'Mixpanel'
`);
        setInitCode(`
import Mixpanel

let mixpanel = Mixpanel.initialize(token: "${token || "YOUR_PROJECT_TOKEN"}")
`);
        break;

      case "Flutter":
        setInstructions(`
# Installation Instructions for Flutter
# Add the following to your pubspec.yaml:
mixpanel_flutter: ^1.x.x
`);
        setInitCode(`
import 'package:mixpanel_flutter/mixpanel_flutter.dart';

Mixpanel mixpanel;

Future<void> initMixpanel() async {
  mixpanel = await Mixpanel.init("${token || "YOUR_PROJECT_TOKEN"}");
}
`);
        break;

      case "PHP":
        setInstructions(`
# Installation Instructions for PHP
# Add the following to your composer.json:
"require": {
  "mixpanel/mixpanel-php": "2.*"
}
`);
        setInitCode(`
require 'vendor/autoload.php';

$mp = Mixpanel::getInstance("${token || "YOUR_PROJECT_TOKEN"}");
`);
        break;

      case "HTTP API":
        setInstructions(`
# HTTP API Instructions
# Use the following endpoint to send events:
POST https://api.mixpanel.com/track
`);
        setInitCode(`
# Example cURL request
curl -X POST https://api.mixpanel.com/track \\
  -d '{
    "event": "your_event_name",
    "properties": {
      "token": "${token || "YOUR_PROJECT_TOKEN"}",
      "distinct_id": "user123",
      "your_property": "your_value"
    }
  }'
`);
        break;

      default:
        setInstructions("");
        setInitCode("");
        break;
    }
  };

  const updateInitCode = (newToken) => {
    handleEnvironmentChange({ target: { value: environment } });
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
          <MenuItem value="Javascript">Javascript</MenuItem>
          <MenuItem value="Node.js">Node.js</MenuItem>
          <MenuItem value="React Native">React Native</MenuItem>
          <MenuItem value="Kotlin (Android)">Kotlin (Android)</MenuItem>
          <MenuItem value="Swift (iOS)">Swift (iOS)</MenuItem>
          <MenuItem value="Flutter">Flutter</MenuItem>
          <MenuItem value="PHP">PHP</MenuItem>
          <MenuItem value="HTTP API">HTTP API</MenuItem>
        </Select>
      </FormControl>

      {["Javascript", "Node.js", "React Native", "Kotlin (Android)", "Swift (iOS)", "Flutter", "PHP"].includes(environment) && (
        <Box mt={2}>
          <Typography
            sx={{
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