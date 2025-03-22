
//  # Installation Instructions
//  # via npm
//  npm install --save mixpanel-browser

//  # via yarn
//  yarn add mixpanel-browser

// Use these functions wherever needed by importing them from './utils/mixpanel.js' and calling them like functionName(userId, data).
// import { screenLoad } from './utils/mixpanel.js';

import mixpanel from "mixpanel-browser";
mixpanel.init("7d3cc272c44c84d80d671374397998cd", {
  debug: true,
  track_pageview: true,
});
  export function screenLoad(data) { 
    mixpanel.track("screen_load", {
  "Screen_name": data["Screen_name"], // undefined
});
    mixpanel.register({
  "User_channel": data["User_channel"],
});
  }

screenLoad({
  Screen_name: "data.screen_name",
  User_channel: "data.user_channel"
});