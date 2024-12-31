import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material"; // Import Add and Delete Icons
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { sceenLoaded } from '../utils/mixpanel';

const Organizations = () => {
  const router = useRouter();
  const { setCurrentOrganization } = useAppContext();

  const [organizations, setOrganizations] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  //   sceenLoaded({
  //     screen_name: "organization", 
  //     user_channel: "web" 
  // });
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get("/api/organizations");
      setOrganizations(response.data);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    }
  };

  const handleCardClick = (organization) => {
    setCurrentOrganization({
      id: organization._id,
      name: organization.name,
      applicationId: organization.applications?.[0] || null,
    });
    router.push(`/dashboard/${organization._id}`);
  };

  const handleAddOrganization = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewOrganizationName("");
  };

  const handleAddOrganizationSubmit = async () => {
    if (!newOrganizationName.trim()) {
      alert("Organization name is required.");
      return;
    }

    try {
      const response = await axios.post("/api/organizations", { name: newOrganizationName });
      const newOrganization = response.data.organization;

      setOrganizations((prev) => [...prev, newOrganization]);
      handleAddDialogClose();
    } catch (err) {
      console.error("Failed to add organization", err);
      alert("Failed to add organization. Please try again.");
    }
  };

  const handleDeleteOrganization = (organization) => {
    setSelectedOrganization(organization);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedOrganization(null);
  };

  const handleDeleteOrganizationSubmit = async () => {
    try {
      await axios.delete(`/api/organizations?organization_id=${selectedOrganization._id}`);
      setOrganizations((prev) =>
        prev.filter((org) => org._id !== selectedOrganization._id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      console.error("Failed to delete organization", err);
      alert("Failed to delete organization. Please try again.");
    }
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
        {/* Add Organization Card */}
        <Card
          onClick={handleAddOrganization}
          sx={{
            minWidth: 275,
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            cursor: "pointer",
            "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.2)" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1.5rem",
          }}
        >
          <IconButton sx={{ color: "#1976d2", fontSize: "3rem" }}>
            <Add />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" marginTop="0.5rem">
            Add Organization
          </Typography>
        </Card>

        {/* Existing Organization Cards */}
        {organizations.map((org) => (
          <Card
            key={org._id}
            sx={{
              minWidth: 275,
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              "&:hover": { boxShadow: "0 6px 12px rgba(0,0,0,0.2)" },
            }}
          >
            <CardContent onClick={() => handleCardClick(org)}>
              <Typography
                variant="h6"
                fontWeight="bold"
                //onClick={() => handleCardClick(org)} // Route to a new page when clicked
                style={{ cursor: "pointer" }}
              >
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
                {/* <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {org.name.slice(0, 2).toUpperCase()}
                </Avatar> */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    handleDeleteOrganization(org);
                  }}
                  sx={{ color: "#d32f2f", marginLeft: "0.5rem" }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for Adding Organization */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Organization</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Organization Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newOrganizationName}
            onChange={(e) => setNewOrganizationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddOrganizationSubmit} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Deleting Organization */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Organization</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the organization &quot;{selectedOrganization?.name}&quot;? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button
            onClick={handleDeleteOrganizationSubmit}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Organizations;
