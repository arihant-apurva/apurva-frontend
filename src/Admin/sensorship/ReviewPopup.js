import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const ReviewPopup = ({ open, handleClose, handleSubmit }) => {
  const [review, setReview] = useState("");

  const handleReviewSubmit = () => {
    handleSubmit(review);
    setReview(""); // Clear input field after submission
    handleClose(); // Close modal
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="review-modal">
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          Leave a Review
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Your Review"
          variant="outlined"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReviewSubmit}
            disabled={!review.trim()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewPopup;
