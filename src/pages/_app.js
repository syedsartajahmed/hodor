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

  useEffect(() => {
    if (window.mixpanel) {
       //Initialize Mixpanel
      window.mixpanel.init("d5278bec8f08ca3379a158ad5e0bca33", { debug: true });

       //Example: Track a page view
      window.mixpanel.track("Page Viewed", {
        page: window.location.pathname,
      });
    }
  }, []);
  return (
    <RecoilRoot>
      <CssBaseline />
      <Component {...pageProps} />
      <ToastContainer />
      <Analytics />
    </RecoilRoot>
  );
}
