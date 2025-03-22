import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  organizationsState,
  currentOrganizationState,
  newOrganizationNameState,
  openAddDialogState,
  openDeleteDialogState,
  selectedOrganizationState,
  openAppSetupState,
  newOrgIdState,
  tableDataState
} from "@/recoil/atom";
import Avatar from "@mui/material/Avatar";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import GroupsIcon from "@mui/icons-material/Groups";
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
import ApplicationSetupDialog from "@/components/ApplicationSetupDialog";
import showToast from "@/utils/toast";
import DeleteIcon from "@mui/icons-material/Delete";

const Organizations = () => {
  const router = useRouter();
  
  // Recoil state
  const [organizations, setOrganizations] = useRecoilState(organizationsState);
  const setCurrentOrganization = useSetRecoilState(currentOrganizationState);
  const [newOrganizationName, setNewOrganizationName] = useRecoilState(newOrganizationNameState);
  const [openAddDialog, setOpenAddDialog] = useRecoilState(openAddDialogState);
  const [openDeleteDialog, setOpenDeleteDialog] = useRecoilState(openDeleteDialogState);
  const [selectedOrganization, setSelectedOrganization] = useRecoilState(selectedOrganizationState);
  const [openAppSetup, setOpenAppSetup] = useRecoilState(openAppSetupState);
  const [newOrgId, setNewOrgId] = useRecoilState(newOrgIdState);
  
  // State to store event sizes for organizations
  const [eventSizes, setEventSizes] = useState({});

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (organizations.length > 0) {
      fetchAllEventSizes();
    }
  }, [organizations]);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get("/api/organizations");
      setOrganizations(response.data);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    }
  };

  const fetchTableData = async (organizationId) => {
    try {
      const response = await axios.get(`/api/organizations?organization_id=${organizationId}`);
      const events =  response.data.applications?.[0]?.events || [];
      return events.length;
    } catch (err) {
      console.error("Failed to fetch events", err);
      return 0;
    }
  };

  const fetchAllEventSizes = async () => {
    const sizes = {};
    for (const org of organizations) {
      sizes[org._id] = await fetchTableData(org._id);
    }
    console.log("Event Sizes:", sizes); // Log the sizes object
    setEventSizes(sizes);
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
      showToast("Organization name is required.");
      return;
    }

    try {
      const response = await axios.post("/api/organizations", {
        name: newOrganizationName,
      });

      if (response.data.success === false) {
        showToast(
          response.data.message ||
            "Failed to add organization. Please try again."
        );
      } else {
        const newOrganization = response.data.organization;
        setOrganizations((prev) => [...prev, newOrganization]);
        handleAddDialogClose();
        // Open application setup dialog
        setNewOrgId(newOrganization._id);
        setOpenAppSetup(true);
      }
    } catch (err) {
      showToast("Failed to add organization. Please try again.");
    }
  };

  const handleAppSetup = async (appData) => {
    try {
      const response = await axios.post("/api/applications", {
        ...appData,
        organizationId: newOrgId,
      });

      if (response.data.success) {
        setOpenAppSetup(false);
        router.push(`/dashboard/${newOrgId}`);
      }
    } catch (error) {
      showToast("Failed to setup application. Please try again.");
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
      await axios.delete(
        `/api/organizations?organization_id=${selectedOrganization._id}`
      );
      setOrganizations((prev) =>
        prev.filter((org) => org._id !== selectedOrganization._id)
      );
      handleDeleteDialogClose();
    } catch (err) {
      console.error("Failed to delete organization", err);
      showToast("Failed to delete organization. Please try again.");
    }
  };

  return (
    <Box
    className="ml-64"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
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
          onClick={() => router.push("/")}
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
          paddingBottom:"5rem",
        }}
      >
        {/* Add Organization Card */}
        <Card
          onClick={handleAddOrganization}
          sx={{
            width: "300px",
            minHeight: "150px",
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
      minHeight: "150px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      borderRadius: "12px",
      cursor: "pointer",
      backgroundColor: "#ffffff",
      position: "relative",
      "&:hover": {
        boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
        transform: "translateY(-5px)",
        transition: "all 0.3s ease",
      },
    }}
  >
    {/* Delete Icon Button */}
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
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
      <DeleteIcon />
    </IconButton>

    {/* Card Content */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "20px",
      }}
      onClick={() => handleCardClick(org)}
    >
      {/* Organization Icon */}
      <Avatar
        sx={{
          width: "60px",
          height: "60px",
          backgroundColor: "black", // Customize the background color
          marginBottom: "16px", // Space between icon and text
        }}
      >
        <BusinessIcon /> {/* Use an appropriate icon for organizations */}
      </Avatar>

      {/* Organization Name */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ cursor: "pointer" }}
      >
        {org.name} ({eventSizes[org._id]})
      </Typography>
    </Box>
  </Card>
))}
      </Box>

      {/* Add Organization Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        fullWidth
        maxWidth="sm"
      >
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
          <Button
            onClick={handleAddOrganizationSubmit}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Organization Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Organization</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the organization &quot;
          {selectedOrganization?.name}&quot;? This action cannot be undone.
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
      <ApplicationSetupDialog
        open={openAppSetup}
        onClose={() => setOpenAppSetup(false)}
        onSubmit={handleAppSetup}
        initialData={{}}
      />
    </Box>
  );
};

export default Organizations;