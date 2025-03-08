import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { addEventSelector } from "@/recoil/atom";

const AddEventModal = ({ open, setOpen }) => {
  const [eventData, setEventData] = useState({
    name: "",
    event_definition: "",
  });
  const setAddEvent = useSetRecoilState(addEventSelector);

  const handleClose = () => {
    setOpen(false);
    setEventData({ name: "", event_definition: "" });
  };

  const handleSubmit = () => {
    if (eventData.name && eventData.event_definition) {
      setAddEvent(eventData);
      console.log(eventData);
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="new-event-modal"
      aria-describedby="modal-to-create-new-event"
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
        <Typography id="new-event-modal" variant="h6" component="h2" mb={2}>
          Create New Event
        </Typography>
        <TextField
          label="Event Name"
          fullWidth
          variant="outlined"
          margin="normal"
          value={eventData.name}
          onChange={(e) =>
            setEventData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextField
          label="Event Description"
          fullWidth
          variant="outlined"
          margin="normal"
          multiline
          rows={3}
          value={eventData.event_definition}
          onChange={(e) =>
            setEventData((prev) => ({
              ...prev,
              event_definition: e.target.value,
            }))
          }
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

export default AddEventModal;
