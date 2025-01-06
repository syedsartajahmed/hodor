import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

const DeleteCellRenderer = ({ params, page }) => {
  const { tableData, setTableData, currentOrganization } = useAppContext();

  // State to control the open/close of the confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);

  // Open the confirmation dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close the confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // The actual deletion logic
  const handleDelete = async () => {
    try {
      // Build the API endpoint depending on the page
      let apiEndpoint = "";
      const deletedRow = tableData.filter((row) => row.id === params.row.id);

      switch (page) {
        case "master-events":
          apiEndpoint = `/api/master-events?id=${deletedRow[0].id}`;
          break;
        case "dashboard":
          apiEndpoint = `/api/save?application_id=${currentOrganization.applicationId}&event_id=${deletedRow[0].id}`;
          break;
        default:
          console.error("Unknown page/context for deletion");
          return;
      }

      // Call the API to delete
      await axios.delete(apiEndpoint);

      // Filter out the deleted row from table data
      const updatedData = tableData.filter((row) => row.id !== params.row.id);
      setTableData(updatedData);

      console.log(`Deleted row with ID: ${params.row.id} in context: ${page}`);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  // Confirm deletion: close the dialog, then proceed with deletion
  const handleConfirmDelete = () => {
    handleCloseDialog();
    handleDelete();
  };

  return (
    <>
      {/* The delete icon to trigger dialog */}
      <div onClick={handleOpenDialog} style={{ cursor: "pointer" }}>
        <DeleteIcon color="error" />
      </div>

      {/* The confirmation dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCellRenderer;
