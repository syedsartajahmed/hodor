import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

const Organizations = () => {
  const router = useRouter();
      const {setCurrentOrganization} = useAppContext();

  // State to store organizations fetched from the API
  const [organizations, setOrganizations] = useState([]);

  // Fetch organizations from the API on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get("/api/organizations"); // Replace with your API endpoint
      setOrganizations(response.data); // Set API response data into state
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    }
  };

  // Navigate to route dynamically
  const handleCardClick = (organization) => {
    setCurrentOrganization({
      id: organization._id, 
      name: organization.name,
      applicationId: organization.applications?.[0] || null,
    });
    router.push(`/dashboard/${organization._id}`); 
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

      <Box sx={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
        {organizations.map((org) => (
          <Card
            key={org._id}
            onClick={() => handleCardClick(org)}
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
                {org.name}
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
                  Applications Count - {org.applications.length}
                </Typography>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {org.name.slice(0, 2).toUpperCase()} {/* Extract initials */}
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
