import React ,{ useState, useEffect} from "react";
import { useRouter } from "next/router";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import Navbar from "@/components/Navbar";
import axios from "axios";

const Welcome = () => {
  const router = useRouter();
  const [counts, setCounts] = useState({ totalOrganizations: 0, events: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("/api/getCounts");
        console.log("Counts:", response.data);
        setCounts(response.data);
        console.log("Counts:", counts);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // const cards = [
  //   { title: "Events", count: 0, initials: "WB", route: "/dashboard" },
  //   {
  //     title: "Organisations",
  //     count: 0,
  //     initials: "WB",
  //     route: "/organizations",
  //   },
  // ];

  const cards = [
    { title: "Events", count: counts.events, initials: "", route: "/master-event" },
    { title: "Organizations", count: counts.totalOrganizations, initials: "", route: "/organizations" },
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
        Hodor Home
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
              cursor: "pointer",
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
                {/* <Avatar
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
                </Avatar> */}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Welcome;
