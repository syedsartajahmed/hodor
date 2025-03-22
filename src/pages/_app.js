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
