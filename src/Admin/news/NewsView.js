import React, { useEffect, useState } from "react";
import {
  Card,
  Heading,
  useTheme,
} from "@aws-amplify/ui-react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

export default function NewsView() {
  const [document, setDocument] = useState({});
  const [originalDocument, setOriginalDocument] = useState({});
  const { tokens } = useTheme();
  const { languageCollection, id } = useParams();

  useEffect(() => {
    const fetchSingleItem = async () => {
      const response = await fetch(
        `http://localhost:5000/api/news/${languageCollection}/view/${id}`,
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
        // console.log(data);

      }
    };
    fetchSingleItem();

  }, [id, languageCollection]);
  useEffect(() => {
    fetchOriginalItem();
  }, [document.news])
  const fetchOriginalItem = async () => {
    const response = await fetch(
      `http://localhost:5000/api/news/news/view/${document.news}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setOriginalDocument(data);
      // console.log(data);

    }
  };

  return (
    <>
      {/* Breadcrumbs for Navigation */}
      <Breadcrumbs aria-label="breadcrumb" className="my-4">
        <Link underline="hover" color="inherit" href="/admin/news/list">
          News
        </Link>
        <Link underline="hover" color="inherit" href={`/admin/news/view/${id}`}>
          View
        </Link>
      </Breadcrumbs>

      {/* Page Content */}
      <Card
        variation="elevated"
        style={{
          padding: "4rem",
          borderRadius: "12px",
          boxShadow: tokens.shadows.large,
          maxWidth: "100%",
          margin: "auto",
        }}
      >
        <Heading level={3} className="text-center mb-4">
          {document.title || "News Details"}
        </Heading>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // flexDirection: "",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
          <table style={{ width: "45%", borderCollapse: "collapse" }} border="0" className="mx-auto">
            <tbody>
              <tr>
                <td style={styles.titleColumn}>Type</td>
                <td style={styles.valueColumn}>{document.type || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn} className="text-success">ID</td>
                <td style={styles.valueColumn} className="text-success">{document._id || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Subcategory</td>
                <td style={styles.valueColumn}>{document.subcategory || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Short Description</td>
                <td style={styles.valueColumn}>{document.shortDescription || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Description</td>
                <td style={styles.valueColumn}>{document.description || "No description provided."}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Status</td>
                <td style={styles.valueColumn}>{document.status === true ? "Active" : "Inactive"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Display - Time</td>
                <td style={styles.valueColumn}>{document.DisplayTime ?
                  new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(document.DisplayTime)) : "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Sensorship Stage</td>
                <td style={styles.valueColumn}>{document.sensorship?.stage || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Feedback</td>
                <td style={styles.valueColumn}>{document.sensorship?.feedback || "N/A"}</td>
              </tr>

              {/* Optionally add the image inside the table */}
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
          <table style={{ width: "45%", borderCollapse: "collapse" }} border="0" className="mx-auto">
            <tbody>
              <tr>
                <td style={styles.titleColumn}>Type</td>
                <td style={styles.valueColumn}>{originalDocument.type || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn} className="text-success">ID</td>
                <td style={styles.valueColumn} className="text-success">{originalDocument._id || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Subcategory</td>
                <td style={styles.valueColumn}>{originalDocument.subcategory || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Short Description</td>
                <td style={styles.valueColumn}>{originalDocument.shortDescription || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Description</td>
                <td style={styles.valueColumn}>{originalDocument.description || "No description provided."}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Status</td>
                <td style={styles.valueColumn}>{originalDocument.status === true ? "Active" : "Inactive"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Display - Time</td>
                <td style={styles.valueColumn}>{originalDocument.DisplayTime ?
                  new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(document.DisplayTime)) : "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Sensorship Stage</td>
                <td style={styles.valueColumn}>{originalDocument.sensorship?.stage || "N/A"}</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Feedback</td>
                <td style={styles.valueColumn}>{originalDocument.sensorship?.feedback || "N/A"}</td>
              </tr>

              {/* Optionally add the image inside the table */}
              <tr>
                <td style={styles.titleColumn}>Image</td>
                <td style={styles.valueColumn}>
                  <img
                    src={originalDocument.imageUrl || "https://picsum.photos/100"}
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
          <table style={{ width: "96%", borderCollapse: "collapse" }} border="0" className="mx-auto">
            <tbody>
              <tr>
                <td style={styles.titleColumn}>Title</td>
                <td style={styles.valueColumn}>N/A</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Keywords</td>
                <td style={styles.valueColumn}>N/A</td>
              </tr>
              <tr>
                <td style={styles.titleColumn}>Others</td>
                <td style={styles.valueColumn}>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
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
