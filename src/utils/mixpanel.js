import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "d5278bec8f08ca3379a158ad5e0bca33"; // Use .env variable

const Mixpanel = {
  init: () => {
    if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, { debug: true, track_pageview: true });
    }
  },
  track: (event, data = {}) => {
    if (typeof window !== "undefined") {
      mixpanel.track(event, data);
    }
  },
  identify: (userId) => {
    if (typeof window !== "undefined") {
      mixpanel.identify(userId);
    }
  },
  people: {
    set: (data) => {
      if (typeof window !== "undefined") {
        mixpanel.people.set(data);
      }
    },
  },
};

// Ensure Mixpanel is initialized before calling register or track
export function screenLoaded(data) {
  if (!mixpanel.__loaded) {
    console.warn("Mixpanel not initialized yet.");
    return;
  }
  
  mixpanel.register({ user_channel: data.user_channel });
  mixpanel.track("screen_loaded", { screen_name: data.screen_name });
}

// Initialize Mixpanel immediately if in the browser
if (typeof window !== "undefined") {
  Mixpanel.init();
}

export default Mixpanel;
