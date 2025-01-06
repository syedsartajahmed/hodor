import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }
import { useEffect } from "react";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { AppProvider } from "@/context/AppContext";

export default function MyApp({ Component, pageProps }) {


  // useEffect(() => {
  //   if (window.mixpanel) {
  //     // Initialize Mixpanel
  //     window.mixpanel.init("d46d915c637daa47331afa606e81f7d5", { debug: true });

  //     // Example: Track a page view
  //     window.mixpanel.track("Page Viewed", {
  //       page: window.location.pathname,
  //     });
  //   }
  // }, []);
  return (
    <AppProvider>
      <CssBaseline />
        <Component {...pageProps} />
    </AppProvider>
  );
}
