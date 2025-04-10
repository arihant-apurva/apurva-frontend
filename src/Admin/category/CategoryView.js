import React, { useEffect, useState } from 'react'
import {
  Card,
  View,
  Heading,
  Flex,
  useTheme,
} from '@aws-amplify/ui-react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';

export default function CategoryView() {
  const [document, setDocument] = useState({})
  const { tokens } = useTheme();
  const location = useLocation();
  const pathAfterView = location.pathname.split('/view/')[1];

  useEffect(() => {
    const fetchSingleItem = async () => {
      const response = await fetch(`http://localhost:5000/api/category-type/view/${pathAfterView}`, {
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
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/admin/content-type">
          Content - Type
        </Link>
        <Link underline="hover" color="inherit" href={`/admin/content-type/view/${pathAfterView}`}>
          View
        </Link>
      </Breadcrumbs>
      <View
        backgroundColor={tokens.colors.background.secondary}
        padding={tokens.space.medium}
      >
        <Card variation="elevated">
          <div className="container mt-5">
            {/* Content Type */}
            <div className="row mb-3">
              <div className="col">
                <h5 className="fw-bold">Content Type - <span className="text-secondary">{document.ContentType}</span></h5>
              </div>
              <div className="col text-end">
                <p className="text-success fw-bold">Id: {document._id}</p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-3">
              <h6 className="fw-bold">Title - <span className="text-secondary">{document.title}</span></h6>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="fw-bold">Description - <span className="text-secondary">{document.description}</span></h6>
            </div>

            {/* Subtypes */}
            <div>
              <h6 className="fw-bold">Subtypes-</h6>
              <table className="table table-striped table-hover mt-3">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Array.isArray(document.subtype) &&
                    document.subtype.map((entries, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{entries.name}</td>
                        <td>{entries.value}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </View>
    </>

  )
}
