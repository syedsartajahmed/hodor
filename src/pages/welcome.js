import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Navbar from "@/components/Navbar";
import axios from "axios";

const Welcome = () => {
  const router = useRouter();
  const [counts, setCounts] = useState({ totalOrganizations: 0, events: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("/api/getCounts");
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Master Events",
      count: counts.events,
      route: "/master-event",
    },
    {
      title: "Organizations",
      count: counts.totalOrganizations,
      route: "/organizations",
    },
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
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar />

      <Typography
        variant="h2"
        fontWeight="bold"
        sx={{ marginTop: "2rem", color: "#333" }}
      >
        HODOR
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          marginTop: "3rem",
          padding: "0 20px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(card.route)}
            sx={{
              width: "300px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                transform: "translateY(-8px)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ padding: "20px" }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginTop: "1rem",
                  color: "#666",
                  fontSize: "1.2rem",
                }}
              >
                Count: {card.count}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Welcome;
