import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const ApplicationSetupDialog = ({
  open,
  onClose,
  onSubmit,
  isEdit = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    projectId: "",
    token: "",
    serviceAccountPassword: "",
    apiSecret: "",
  });

  // Sync formData with initialData when initialData changes
  useEffect(() => {
    setFormData({
      projectId: initialData.projectId || "",
      token: initialData.token || "",
      serviceAccountPassword: initialData.serviceAccountPassword || "",
      apiSecret: initialData.apiSecret || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // localStorage.setItem("mixpanelToken", formData.token);
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Application Details" : "Setup Application Details"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          name="projectId"
          label="Project ID"
          value={formData.projectId}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="token"
          label="Token"
          value={formData.token}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="serviceAccountPassword"
          label="Service Account Password"
          value={formData.serviceAccountPassword}
          onChange={handleChange}
          type="password"
        />
        <TextField
          fullWidth
          margin="normal"
          name="apiSecret"
          label="API Secret"
          value={formData.apiSecret}
          onChange={handleChange}
          //type="password"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Update" : "Setup"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationSetupDialog;
