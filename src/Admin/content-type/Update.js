import React, { useState, useEffect } from 'react';
import { Button, Flex, Input, Label, SelectField, Card, ThemeProvider, Theme, TextAreaField } from '@aws-amplify/ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import CustomSeparator from '../common/Breadcrumbs';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Notification from '../../Modules/Notification';

const theme: Theme = {
    name: 'card-theme',
    tokens: {
        components: {
            card: {
                backgroundColor: { value: '{colors.background.success}' },
                borderRadius: { value: '{radii.large}' },
                padding: { value: '{space.xl}' },
                elevated: {
                    backgroundColor: { value: '{colors.background.info}' },
                    boxShadow: { value: '{shadows.large}' },
                },
            },
        },
    },
};

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ListItem, setListItem] = useState({
        title: "",
        status: true,
        description: ""
    });

    // Fetch existing data for the item
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/content-type/view/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    // console.log(data);

                    setListItem({
                        title: data.title,
                        status: data.status,
                        description: data.description,
                    });
                } else {
                    console.error("Failed to fetch item data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }  finally {
                setTimeout(() => {
                    setLoading(false);  // Hide loader after a delay
                }, 400);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="modal">
        <div className="loader"></div>
    </div> ; // Render a loading indicator
    }
    // Handle input changes
    const inputHandler = (event) => {
        const { name, value } = event.target;
        setListItem((prevValue) => ({
            ...prevValue,
            [name]: name === 'status' ? value === 'true' : value, // Convert to boolean
        }));
    };

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/content-type/update/${id}`, {
                method: "PUT", // Use PUT or PATCH for updates
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ListItem),
            });
            if (response.ok) {
                const ResponseData = await response.json()
                Notification.success(ResponseData.message)
                navigate('/admin/content-type'); // Redirect after update
            } else {
                alert('Failed to update content type');
            }
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <>
         {/* { loading ? <div className="modal">
            <div className="loader"></div>
        </div> :  */}
        {/* <div className="wrapper">
            <Sidebar />
            <div className="main">
                <Header />
                <main className="content"> */}
                <div>
                <CustomSeparator/>
                    <ThemeProvider theme={theme} colorMode="light">
                        <Card variation="elevated" className="container py-5 mx-auto" style={{ width: '500px', height: '700px' }}>
                            <div className="container">
                                <p className="text-primary display-6 text-center fw-medium" style={{
                                    fontSize: '2rem',  // Adjust the font size
                                    fontWeight: '500'  // Lighter font weight
                                }}>UPDATE CONTENT TYPE</p>
                            </div>
                            <Flex as="form" direction="column" width="20rem" onSubmit={submitHandler} className="container">
                                <Flex direction="column" gap="small">
                                    {/* <Label htmlFor="title">Content-Title</Label> */}
                                    {/* <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        isRequired
                                        onChange={inputHandler}
                                        value={ListItem.title}
                                    /> */}
                                    <TextField id="title" name='title' label="Content-Title" variant="outlined" isRequired onChange={inputHandler} value={ListItem.title} />
                                </Flex>
                                <Flex direction="column" gap="small">
                                    {/* <TextAreaField
                                        label="Description"
                                        name="description"
                                        placeholder="Enter a description"
                                        isRequired 
                                        onChange={inputHandler} 
                                        value={ListItem.description} 
                                        rows={3} /> */}
                                    <TextField
                                        id="outlined-multiline-static"

                                        name="description"
                                        placeholder="Enter a description"
                                        isRequired
                                        onChange={inputHandler}
                                        value={ListItem.description}
                                        label="Description"
                                        multiline
                                        rows={4}
                                    />
                                </Flex>
                                <Flex direction="column" gap="small">
                                    <SelectField
                                        label="Status"
                                        descriptiveText="Should your title be Active or Inactive?"
                                        onChange={inputHandler}
                                        name="status"
                                        value={ListItem.status}
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </SelectField>
                                    <Flex direction="column" gap="small">
                                        <Label htmlFor="title">Upload Image</Label>
                                        <div style={{ minHeight: '100px' }}> {/* Reserve space for previews */}
                                           
                                        </div>
                                    </Flex>
                                </Flex>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </Flex>
                        </Card>
                    </ThemeProvider>
                    </div>      
    </>
    );
};

export default Update;
