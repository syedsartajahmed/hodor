import React from "react";
import { useRouter } from "next/router"; // Import useRouter
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import Navbar from "@/components/Navbar";

const Organizations = () => {
  const router = useRouter();

  const cards = [
    { title: "Organization1", count: 0, initials: "WB", route: "/dashboard" },
    { title: "Organization2", count: 0, initials: "WB", route: "/dashboard" },
  ];

  const handleCardClick = (route) => {
    router.push(route);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Navbar />

      <Typography variant="h4" fontWeight="bold" marginTop="2rem">
        {"Hodor Home > Organizations"}
      </Typography>

      <Box sx={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        {cards.map((card, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(card.route)}
            sx={{
              minWidth: 275,
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              cursor: "pointer", // Show pointer cursor
              "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {card.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <Typography color="text.secondary">
                  Count - {card.count}
                </Typography>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {card.initials}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Organizations;
