import React, { useEffect, useState } from "react";
import {
  Card,
  Heading,
  useTheme,
} from "@aws-amplify/ui-react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Button, Stack, Box, TextareaAutosize } from '@mui/material';
import ReviewPopup from "./ReviewPopup";

export default function SensorshipRegionalView() {
  const [document, setDocument] = useState({});
  const [displayUpdateForm, setDisplayUpdateForm] = useState(false); // New state for the suggestion form
  const [suggestion, setSuggestion] = useState(""); // New state for the suggestion input
  const { tokens } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [isApproving, setIsApproving] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const pathAfterView = location.pathname.split("/view/")[1];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchSingleItem = async () => {
      const response = await fetch(
        `http://localhost:5000/api/regional-news/view/${pathAfterView}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      }
    };
    fetchSingleItem();
  }, [pathAfterView]);

  const handleSuggestChange = (event) => {
    setSuggestion(event.target.value); // Update suggestion input value
  };

  const handleSuggestSubmit = async (suggestion) => {
    setIsReviewing(true);
    // Logic to update the suggestion (API request, etc.)
    const response = await fetch(
      `http://localhost:5000/api/regional-news/suggest/${document._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ suggestion }),
      }
    );
    if (response.ok) {
      alert("Suggestion updated successfully!");
      setDocument(prevDocument => ({ ...prevDocument, suggestion })); // Optionally update state
    } else {
      alert("Failed to update suggestion.");
      setIsReviewing(false);
    }
  };

  const handleApproveUpdate = async () => {
    setIsApproving(true);
    const confirmApprove = window.confirm("Are you sure you want to approve this news?");
    if (!confirmApprove) {
      setIsApproving(false);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/regional-news/approve/${document._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      alert("Approved successfully!");
      setDocument(prevDocument => ({ ...prevDocument, suggestion })); // Optionally update state
    } else {
      alert("Failed to approve.");
      setIsApproving(true);
    }
  };


  const handleRejectUpdate = async () => {
    setIsRejecting(true);
    const reason = prompt("Please enter the reason for rejection:");
    if (!reason) {
      alert("Rejection reason is required.");
    setIsRejecting(false);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/regional-news/reject/${document._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }), // Send rejection reason
      }
    );

    if (response.ok) {
      alert("Rejected successfully!");
      // setDocument(prevDocument => ({ ...prevDocument, suggestion })); // Optionally update state
    } else {
      alert("Failed to reject.");
    setIsRejecting(false);
    }
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" className="my-4">
        <Link underline="hover" color="inherit" href="/admin/news/list">
          News
        </Link>
        <Link underline="hover" color="inherit" href={`/admin/news/view/${pathAfterView}`}>
          View
        </Link>
      </Breadcrumbs>

      <Card
        variation="elevated"
        style={{
          padding: "4rem",
          borderRadius: "12px",
          boxShadow: tokens.shadows.large,
          maxWidth: "90%",
          margin: "auto",
        }}
      >
        <Heading level={3} className="text-center mb-4">
          {document.type || "News Details"}
        </Heading>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "2rem",
          }}
          border="0"
          className="mx-auto"
        >
          <tbody>
            {/* <tr>
              <td style={{ ...styles.titleColumn, backgroundColor: "#f1f5f9" }}>News Title</td>
              <td style={styles.valueColumn}>{document.newsTitle || "N/A"}</td>
            </tr> */}
            <tr>
              <td style={{ ...styles.titleColumn, color: "#4CAF50" }}>ID</td>
              <td style={styles.valueColumn} >
                <span style={{ color: "#4CAF50", fontWeight: "bold" }}  >
                  {document._id || "N/A"}
                </span>
              </td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>News Description</td>
              <td style={styles.valueColumn}>{document.newsDescription || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Display Time</td>
              <td style={styles.valueColumn}>
                {document.displayTime ?
                  new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(document.displayTime)) : "N/A"}
              </td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Status</td>
              <td style={styles.valueColumn}>{document.status ? "Active" : "Inactive"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Country</td>
              <td style={styles.valueColumn}>{document.selectedCountry || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>State</td>
              <td style={styles.valueColumn}>{document.selectedState || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>City</td>
              <td style={styles.valueColumn}>{document.selectedCity || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Sensorship Stage</td>
              <td style={styles.valueColumn}>{document.sensorship?.stage  || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Sensorship Feedback</td>
              <td style={styles.valueColumn}>{document.sensorship?.feedback || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Image</td>
              <td style={styles.valueColumn}>
                <img
                  src={document.imageUrl || "https://picsum.photos/100"}
                  alt="News"
                  style={{
                    maxWidth: "100%", // Image fits the table width
                    height: "auto",
                    borderRadius: "4px",
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <Box mt={4} display="flex" justifyContent="center">
          <Stack direction="row" spacing={2} sx={{ width: "100%", maxWidth: "500px" }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleApproveUpdate}
              disabled={isApproving}
            >
              {isApproving ? "Approved" : "Approve"}
            </Button>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              onClick={handleOpen}
              disabled={isReviewing}
            >
              {isReviewing ? "Reviewed" : "Review"}
            </Button>
            <ReviewPopup open={open} handleClose={handleClose}
              handleSubmit={handleSuggestSubmit}
            />
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleRejectUpdate}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejected" : "Reject"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}

const styles = {
  titleColumn: {
    fontWeight: "bold",
    padding: "12px 16px",
    textAlign: "left",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    width: "30%",
  },
  valueColumn: {
    padding: "12px 16px",
    textAlign: "left",
    border: "1px solid #ddd",
    width: "70%",
    color: "#555",
  },
};
