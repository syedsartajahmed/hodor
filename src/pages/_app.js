import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { AppProvider } from "@/context/AppContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <AppProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </AppProvider>
    </>
  );
}
