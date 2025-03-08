import "@/styles/globals.css";
import moengage from "@moengage/web-sdk";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as React from "react";
import { CssBaseline } from "@mui/material";
import { RecoilRoot } from "recoil";
import { Analytics } from "@vercel/analytics/react";

export default function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <CssBaseline />
      <Component {...pageProps} />
      <ToastContainer />
      <Analytics />
    </RecoilRoot>
  );
}

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