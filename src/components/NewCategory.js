import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { categoriesState } from "@/recoil/atom";
import showToast from "@/utils/toast";

const NewCategoryModal = ({ open, setOpen }) => {
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [categoryName, setCategoryName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setCategoryName("");
  };

  const handleSubmit = () => {
    if (categoryName.trim() === "") {
      showToast("Category name cannot be empty!");
      return;
    }

    setCategories((prev) => [...prev, categoryName]);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-category-modal"
      aria-describedby="modal-to-create-new-category"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="new-category-modal" variant="h6" component="h2" mb={2}>
          Create New Category
        </Typography>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          margin="normal"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewCategoryModal;
