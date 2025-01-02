import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

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

      if (response.data.success === false) {
        alert(response.data.message || "Failed to add organization. Please try again.");
       
      } else {
        const newOrganization = response.data.organization;
        setOrganizations((prev) => [...prev, newOrganization]);
        handleAddDialogClose();
      }
    } catch (err) {

      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); 
      } else {
        alert("Failed to add organization. Please try again.");
      }
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
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar />

      {/* Main Heading */}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ marginTop: "2rem", color: "#333", textAlign: "center" }}
      >
        Organizations
      </Typography>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator="›"
        aria-label="breadcrumb"
        sx={{ marginTop: "1rem", fontSize: "1rem", color: "#666" }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => router.push("/welcome")}
          sx={{ cursor: "pointer" }}
        >
          Dashboard
        </Link>
        <Typography color="textPrimary">Organizations</Typography>
      </Breadcrumbs>

      {/* Organization Cards */}
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          marginTop: "3rem",
          padding: "0 20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Add Organization Card */}
        <Card
          onClick={handleAddOrganization}
          sx={{
            width: "300px",
            minHeight: "150px", // Ensure uniform height
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            cursor: "pointer",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            "&:hover": {
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              transform: "translateY(-5px)",
              transition: "all 0.3s ease",
            },
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Add Organization
          </Typography>
          <IconButton sx={{ fontSize: "3rem", marginTop: "1rem" }}>
            <Add />
          </IconButton>
        </Card>

        {/* Existing Organizations */}
        {organizations.map((org) => (
          <Card
            key={org._id}
            sx={{
              width: "300px",
              minHeight: "150px", // Ensure uniform height
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              position: "relative", // For absolute positioning of the cross icon
              "&:hover": {
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                transform: "translateY(-5px)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation
                handleDeleteOrganization(org);
              }}
              sx={{
                position: "absolute",
                top: "0px",
                right: "0px",
                color: "#d32f2f",
                zIndex: 10,
              }}
            >
              <Close />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
              onClick={() => handleCardClick(org)}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ cursor: "pointer" }}>
                {org.name}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Add Organization Dialog */}
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

      {/* Delete Organization Dialog */}
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
