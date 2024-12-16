import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Navbar = () => {
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
      <Typography variant="h5" fontWeight="bold">
        Optiblack
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Typography>Welcome Back!</Typography>
        <Button variant="outlined" size="small">
          Log out
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
