import React, { useEffect, useState } from "react";
import {
  Card,
  View,
  Heading,
  useTheme,
} from "@aws-amplify/ui-react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import CustomSeparator from "../common/Breadcrumbs";

export default function NewsView() {
  const [document, setDocument] = useState({});
  const { tokens } = useTheme();
  const location = useLocation();
  const pathAfterView = location.pathname.split("/view/")[1];

  useEffect(() => {
    const fetchSingleItem = async () => {
      const response = await fetch(
        `http://localhost:5000/api/videos/view/${pathAfterView}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log("the data is",data._id);
        setDocument(data);
      }
    };
    fetchSingleItem();
  }, [pathAfterView]);

  return (
    <>
       
          <CustomSeparator
                                  baseRoute="/admin/video-upload"
                                  /> 

      {/* Page Content */}
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
          {document.title || "News Details"}
        </Heading>

        {/* Table Layout (Option 2: Image Fitting in the Table) */}
        <table style={{ width: "80%", borderCollapse: "collapse"}} border="0" className="mx-auto">
          <tbody>
            
            <tr>
              <td style={styles.titleColumn} className="text-success">ID</td>
              <td style={styles.valueColumn} className="text-success">{document._id || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Title</td>
              <td style={styles.valueColumn} >{document.title || "N/A"}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Description</td>
              <td style={styles.valueColumn}>{document.description || "No description provided."}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Status</td>
              <td style={styles.valueColumn}>{document.status ? 'active' : 'inactive'}</td>
            </tr>
            <tr>
              <td style={styles.titleColumn}>Display At</td>
              <td style={styles.valueColumn} >{document.displayAt || "N/A"}</td>
            </tr>
            {/* <tr>
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
            </tr> */}
            <tr>
            <td style={styles.titleColumn}>Video</td>
            {document.videoLink || document.filePath ? (
                                                    <video width="160" height="150" controls>
                                                        <source
                                                            src={document.videoLink || `http://localhost:5000/uploads/videos/${document.fileName}`}
                                                            type="video/webm"
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <p>No video</p>
                                                )}
            </tr>
          </tbody>
        </table>
      </Card>
    </>
  );
}

// Inline styles for table columns
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
