import React, { useEffect, useState } from 'react'
import {
  Card,
  View,
  Heading,
  Flex,
  useTheme,
} from '@aws-amplify/ui-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export default function ViewPage() {
  const [document, setDocument] = useState({})
  const { tokens } = useTheme();
  const location = useLocation();
  const pathAfterView = location.pathname.split('/view/')[1];

  useEffect(() => {
    const fetchSingleItem = async () => {
      const response = await fetch(`http://localhost:5000/api/content-type/view/${pathAfterView}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (response.ok) {
        const data = await response.json()
        // console.log(data);
        setDocument(data)


      }
    }
    fetchSingleItem();
  }, [])

  return (
    <View
      backgroundColor={tokens.colors.background.secondary}
      padding={tokens.space.medium}
    >
      <Card variation="elevated">
        <div className="container mt-5">
          {/* Content Type */}
          <div className="col text-end">
            <p className="text-success fw-bold">Id: {document._id}</p>
          </div>


          {/* Title */}
          <div className="mb-3">
            <h6 className="fw-bold">Title - <span className="text-secondary">{document.title}</span></h6>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h6 className="fw-bold">Description - <span className="text-secondary">{document.description}</span></h6>
          </div>
          <div className="mb-4">
            <h6 className="fw-bold">Status - <span className="text-secondary">{document.status ? "Active" : "Inactive"}</span></h6>
          </div>
          <div className="mb-4">
            <h6 className="fw-bold">Created At - <span className="text-secondary"> {document.createdAt ?
                                    new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }).format(new Date(document.createdAt)) : "N/A"}</span></h6>
          </div>
        </div>
      </Card>
    </View>
  )
}
