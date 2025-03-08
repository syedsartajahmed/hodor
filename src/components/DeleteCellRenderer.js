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
import { useRecoilState } from "recoil";
import { tableDataState, currentOrganizationState } from "@/recoil/atom";

const DeleteCellRenderer = ({ params, page }) => {
  const [tableData, setTableData] = useRecoilState(tableDataState);
  const [currentOrganization] = useRecoilState(currentOrganizationState);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      let apiEndpoint = "";
      const deletedRow = tableData.find((row) => row.id === params.row.id);
      if (!deletedRow) return;

      switch (page) {
        case "master-events":
          apiEndpoint = `/api/master-events?id=${deletedRow.id}`;
          break;
        case "dashboard":
          apiEndpoint = `/api/save?application_id=${currentOrganization.applicationId}&event_id=${deletedRow.id}`;
          break;
        default:
          console.error("Unknown page/context for deletion");
          return;
      }

      await axios.delete(apiEndpoint);
      setTableData((prevData) => prevData.filter((row) => row.id !== params.row.id));
      console.log(`Deleted row with ID: ${params.row.id} in context: ${page}`);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleConfirmDelete = () => {
    handleCloseDialog();
    handleDelete();
  };

  return (
    <>
      <div onClick={handleOpenDialog} style={{ cursor: "pointer" }}>
        <DeleteIcon color="error" />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
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