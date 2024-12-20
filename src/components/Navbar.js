import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "1em 7rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => router.push("/welcome")}>
        Optiblack
      </Typography>
      {/* <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Typography>Welcome Back!</Typography>
        <Button variant="outlined" size="small">
          Log out
        </Button>
      </Box> */}
    </Box>
  );
};

export default Navbar;
