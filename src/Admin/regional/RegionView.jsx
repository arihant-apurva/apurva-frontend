import React, { useEffect, useState } from "react";
import {
    Card,
    Heading,
    useTheme,
} from "@aws-amplify/ui-react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

export default function RegionView() {
    const [document, setDocument] = useState({});
    const { tokens } = useTheme();
    const location = useLocation();
    const pathAfterView = location.pathname.split("/view/")[1];

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
                console.log(data);
            }
        };
        fetchSingleItem();
    }, [pathAfterView]);

    return (
        <>
            {/* Breadcrumbs for Navigation */}
            <Breadcrumbs aria-label="breadcrumb" className="my-4" separator="›">
                <Link underline="hover" color="inherit" href="/admin/regional-news/list">
                    Regional News
                </Link>
                <Link underline="hover" color="inherit" href={`/admin/regional-news/view/${pathAfterView}`}>
                    View
                </Link>
            </Breadcrumbs>

            {/* Page Content */}
            <Card
                variation="elevated"
                style={{
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: tokens.shadows.large,
                    maxWidth: "80%",
                    margin: "auto",
                    backgroundColor: "#f4f7fa", // Light background
                }}
            >
                <Heading level={3} className="text-center mb-6" style={{ color: "#4A90E2" }}>
                    {document.newsTitle || "Regional News Details"}
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
                            <td style={styles.valueColumn}>{document.sensorship?.stage}</td>
                        </tr>
                        <tr>
                            <td style={styles.titleColumn}>Sensorship Feedback</td>
                            <td style={styles.valueColumn}>{document.sensorship?.feedback}</td>
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
            </Card>
        </>
    );
}

// Inline styles for table columns
const styles = {
    titleColumn: {
        fontWeight: "bold",
        padding: "16px 20px",
        textAlign: "left",
        backgroundColor: "#e9eff1", // Light background for title columns
        border: "1px solid #ddd",
        fontSize: "16px",
        width: "35%",
    },
    valueColumn: {
        padding: "16px 20px",
        textAlign: "left",
        border: "1px solid #ddd",
        fontSize: "16px",
        width: "65%",
        color: "#555",
    },
};
