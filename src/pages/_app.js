import "@/styles/globals.css";
import { Inter , Montserrat} from '@next/font/google';

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }
import { useEffect } from "react";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  subsets: ['latin'], 
  weights: [400, 500, 600, 700], 
});

const montserrat = Montserrat({
  subsets: ['latin'], 
  weights: [400, 500, 600, 700], 
});

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
      <main className={montserrat.className}>
        <Component {...pageProps} />
      </main>
    </AppProvider>
  );
}
