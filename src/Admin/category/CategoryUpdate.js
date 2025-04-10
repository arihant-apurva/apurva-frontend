import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import { Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from 'react-router-dom';
import Notification from '../../Modules/Notification'

export default function CategoryUpdate() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the category ID from the route

    // Final list to submit to the backend
    const [ListItem, setListItem] = useState({
        ContentType: "",
        title: "",
        description: "",
        subtype: [],
    });

    // State for subtypes
    const [items, setItems] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    // Fetch existing data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/category-type/view/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setListItem({
                        ContentType: data.ContentType,
                        title: data.title,
                        description: data.description,
                        subtype: data.subtype || [],
                    });
                    setItems(data.subtype || []); // Populate items for subtypes
                }
            } catch (error) {
                console.error('Error fetching category data:', error);
            }
        };

        fetchData();
    }, [id]);

    // Handler to update the ListItem state
    const handleChangeInTopTitleDesc = (e) => {
        const { name, value } = e.target;
        setListItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler for subtypes
    const handleTitleChange = (e) => setNewTitle(e.target.value);
    const handleDescriptionChange = (e) => setNewDescription(e.target.value);

    const handleAddOrUpdateItem = () => {
        if (newTitle.trim() === '' || newDescription.trim() === '') return;

        if (editingIndex !== null) {
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? { title: newTitle, description: newDescription } : item
            );
            setItems(updatedItems);
            setListItem((prev) => ({ ...prev, subtype: updatedItems }));
            setEditingIndex(null);
        } else {
            const updatedItems = [...items, { title: newTitle, description: newDescription }];
            setItems(updatedItems);
            setListItem((prev) => ({ ...prev, subtype: updatedItems }));
        }
        setNewTitle('');
        setNewDescription('');
    };

    const handleDeleteItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setListItem((prev) => ({ ...prev, subtype: updatedItems }));
    };

    const handleEditItem = (index) => {
        setNewTitle(items[index].title);
        setNewDescription(items[index].description);
        setEditingIndex(index);
    };

    // Submit handler for updating the category
    const submitHandler = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/category-type/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ListItem),
            });
            
            if (response.ok) {
                // console.log('Category successfully updated');
                navigate('/admin/category-type/list');
                Notification.success(response.message)
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <Card sx={{ minWidth: 275 }} className="w-lg-75 w-md-80 w-sm-100 mx-auto">
            <CardContent className="p-lg-7 p-md-5 p-sm-4 container">
                <h1 className="fs-1 fw-bold font-monospace">Update Category</h1>
                <h2 className="mb-4">Category</h2>
                <FormControl
                    fullWidth
                    size="small"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '15px',
                        alignItems: 'center',
                    }}
                >

                    <InputLabel id="demo-select-small-label">Type</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={ListItem.ContentType}
                        label="Type"
                        onChange={handleChangeInTopTitleDesc}
                        // className='w-50'
                        style={{ width: '40%' }}
                        name="ContentType"
                    >
                        <MenuItem value={ListItem.ContentType}>{ListItem.ContentType}</MenuItem>
                        {/* <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                    <TextField
                        label="Title"
                        variant="outlined"
                        size="small"
                        placeholder="Enter title"
                        value={ListItem.title}
                        onChange={handleChangeInTopTitleDesc}
                        name="title"
                        style={{ flex: 1 }}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        size="small"
                        placeholder="Enter description"
                        value={ListItem.description}
                        onChange={handleChangeInTopTitleDesc}
                        name="description"
                        multiline
                        rows={3}
                        style={{ width: '100%' }}
                    />

                    <div className="w-100">
                        <h2>Sub Categories</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                            <TextField
                                id="filled-hidden-label-small"
                                value={newTitle}
                                onChange={handleTitleChange}
                                placeholder="Enter title"
                                style={{ flex: 1 }}
                                label="Title"
                                variant="outlined"
                                size="small"

                            />
                            <TextField id="filled-hidden-label-small"
                                style={{ width: '100%' }}
                                label="Description" variant="outlined" size="small"
                                value={newDescription}
                                onChange={handleDescriptionChange}
                                placeholder="Enter description"
                                multiline
                                rows={3}
                            />
                            <Button
                                className="w-25"
                                variant="contained"
                                onClick={handleAddOrUpdateItem}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    alignSelf: 'start', // Align button to the left
                                }}
                            >
                                {editingIndex !== null ? 'Update Subtype' : 'Add Subtype'}
                            </Button>
                        </div>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        margin: '5px 0',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p style={{ margin: '5px 0' }}>{item.value}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEditItem(index)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteItem(index)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Button variant="contained" color="success" endIcon={<SendIcon />} className='px-3 py-3 w-25 mx-auto' onClick={submitHandler}>
                        Update
                    </Button>
                </FormControl>
            </CardContent>
        </Card>
    );
}
