import React, { useEffect, useState } from 'react'

import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import Notification from '../../Modules/Notification';
import * as Yup from 'yup';
import { SelectField, TextAreaField } from '@aws-amplify/ui-react';


export default function CategoryForm() {
    const navigate = useNavigate()


    //final list to submit to backend
    const [ListItem, setListItem] = useState({
        ContentType: "",
        title: "",
        description: "",
        subtype: []
    })

    // const [contentType, setContentType] = useState(0)

    // adding subtype logic begin
    const [ContentType, setContentType] = useState([]);
    const [items, setItems] = useState([]); // State to hold the list of items
    const [newTitle, setNewTitle] = useState(''); // State to hold the title field
    const [newDescription, setNewDescription] = useState(''); // State to hold the description field
    const [editingIndex, setEditingIndex] = useState(null); // Track which item is being edited
    const [errors, setErrors] = useState();


    const validationSchema = Yup.object({
        ContentType: Yup.string()
            .required("*Required to select") // Ensure selection is required
            .notOneOf([""], "Please select a valid type"),
        title: Yup.string()
            .matches(/^[A-Za-z][A-Za-z ]*$/, "*Title must contain only alphabets and single spaces")
            .test("no-leading-space", "*Title cannot start with a space", (value) => !value || !value.startsWith(" "))
            .test("no-consecutive-spaces", "*Title cannot have consecutive spaces", (value) => !value || !/\s{2,}/.test(value))
            .min(5, "*Title must be at least 8 characters")
            .max(50, "*Title cannot exceed 255 characters")
            .required("*Title is required"),

        description: Yup.string()
            .test("no-leading-space", "*Description cannot start with a space", (value) => !value || !value.startsWith(" "))
            .test("no-consecutive-spaces", "*Description cannot have consecutive spaces", (value) => !value || !/\s{2,}/.test(value))
            .min(8, "*Description must be at least 8 characters")
            .max(255, "*Description cannot exceed 255 characters")
            .required("*Description is required"),
        newTitle: Yup.string()
            .matches(/^[A-Za-z][A-Za-z ]*$/, "*Title must contain only alphabets and single spaces")
            .test("no-leading-space", "*Title cannot start with a space", (value) => !value || !value.startsWith(" "))
            .test("no-consecutive-spaces", "*Title cannot have consecutive spaces", (value) => !value || !/\s{2,}/.test(value))
            .min(5, "*Title must be at least 8 characters")
            .max(50, "*Title cannot exceed 255 characters")
            .required("*Title is required"),
        newDescription: Yup.string()
            .test("no-leading-space", "*Description cannot start with a space", (value) => !value || !value.startsWith(" "))
            .test("no-consecutive-spaces", "*Description cannot have consecutive spaces", (value) => !value || !/\s{2,}/.test(value))
            .min(8, "*Description must be at least 8 characters")
            .max(255, "*Description cannot exceed 255 characters")
            .required("*Description is required"),
        subtype: Yup.array().min(1, 'At least one subtype is required'),
    });


    useEffect(() => {
        const fetchAllContentType = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/content-type/fetchAll`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setContentType(data)
                } else {
                    console.error('Failed to fetch item data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };
        fetchAllContentType();
    }, [])
    //handler to add new item value in title and desctiption of top level
    const handleChangeInTopTitleDesc = async (e) => {
        const { name, value } = e.target;
        setListItem((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
        try {
            await validationSchema.validateAt(name, { [name]: value });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name]; // Remove error for this field
                return newErrors;
            });
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message })); // Set error message
        }
    }

    // Handler to update the new item value
    const handleTitleChange = async (e) => {
        const { value } = e.target;
        setNewTitle(value);
        try {
            await validationSchema.validateAt("newTitle", { ["newTitle"]: value });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors["newTitle"]; // Remove error for this field
                return newErrors;
            });
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, ["newTitle"]: error.message })); // Set error message
        }
    };

    const handleDescriptionChange = async (e) => {
        const { value } = e.target;
        setNewDescription(value);
        try {
            await validationSchema.validateAt("newDescription", { ["newDescription"]: value });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors["newDescription"]; // Remove error for this field
                return newErrors;
            });
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, ["newDescription"]: error.message })); // Set error message
        }
    };

    // Handler to add or update an item
    const handleAddOrUpdateItem = async () => {
        if (newTitle.trim() === '' || newDescription.trim() === '') return;

        if (editingIndex !== null) {
            // Update existing item
            const updatedItems = items.map((item, index) =>
                index === editingIndex ? { title: newTitle, description: newDescription } : item
            );
            setItems(updatedItems);
            setListItem((preValue) => {
                return {
                    ...preValue,
                    subtype: updatedItems
                }
            })
            setEditingIndex(null); // Reset editing state
        } else {
            // Add new item
            const updatedItems = [...items, { title: newTitle, description: newDescription }];
            setItems(updatedItems);
            setListItem((prev) => ({
                ...prev,
                subtype: updatedItems, // Update subtype to reflect the latest items
            }));
        }
        setNewTitle(''); // Clear the title field
        setNewDescription(''); // Clear the description field
    };

    // Handler to delete an item
    const handleDeleteItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setListItem((preValue) => {
            return {
                ...preValue,
                subtype: updatedItems
            }
        })
    };

    // Handler to edit an item
    const handleEditItem = async (index) => {
        setNewTitle(items[index].title);
        setNewDescription(items[index].description);
        setEditingIndex(index);
    };
    // adding subtype logic ends


    //submit button validation
    const isFormValid =
        errors && Object.keys(errors).length === 0 && // Ensure errors exist before checking
        ListItem?.ContentType?.trim() && // Avoid null/undefined values
        ListItem?.title?.trim() &&
        ListItem?.description?.trim() &&
        ListItem?.subtype?.length > 0;

    //add and update button validation for sub-category
    const isSubtypeValid = errors?.newTitle===undefined && errors?.newDescription===undefined;

    //submit handler
    const submitHandler = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/category-type/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ListItem)
            })
            // console.log("submit clicked");
            
            if (response.ok) {
                Notification.success("successfully added")
                navigate('/admin/category-type/list')
            }
        } catch (error) {
            Notification.error("Some Backend error ❌")
            
        }
    }

    return (


        <Card sx={{ minWidth: 275 }} className='w-lg-75 w-md-80 w-sm-100 mx-auto'>
            <CardContent className='p-lg-7 p-md-5 p-sm-4 container '>
                <h1 className='fs-1 fw-bold font-monospace'>Add Category</h1>
                    <div className='w-100' style={{ height: '5rem' }}>
                        {/* <InputLabel id="demo-select-small-label">Type</InputLabel> */}
                        <SelectField
                            value={ListItem.ContentType}
                            label="Type"
                            onChange={handleChangeInTopTitleDesc}
                            // style={{ }}
                            style={{ border: errors?.type ? '2px solid red' : '1px solid #ced4da',width: '100%' }} 

                            name="ContentType"
                            onFocus={(e) => {
                                e.target.style.backgroundColor = "#e6f7ff"; // Light blue on focus
                                e.target.style.border = "1px solid #007bff"; // Optional: Blue border
                                e.target.style.outline = "none"; // Ensure no thick border
                                e.target.style.boxShadow = "none"; // Remove Amplify UI focus glow
                            }}
                            onBlur={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.border = errors?.title ? "2px solid red" : "1px solid #ced4da"; // Reset border
                                e.target.style.outline = "none"; // Ensure no outline
                                e.target.style.boxShadow = "none"; // Remove shadow
                            }}
                        >
                            {
                                ContentType.map((values, index) => {
                                    return <option value={values.title} key={index}>{values.title}</option>
                                })
                            }
                        </SelectField>
                        {errors?.ContentType && <p style={{ color: 'red' }}>{errors.ContentType}</p>}
                    </div>
                    <div className='w-100' style={{ height: '6rem' }}>
                        <TextAreaField
                            label="Title"
                            rows={1}
                            placeholder="Enter title"
                            value={ListItem.title}
                            onChange={handleChangeInTopTitleDesc}
                            name="title"
                            style={{ border: errors?.title ? '2px solid red' : '1px solid #ced4da' }}

                            onFocus={(e) => {
                                e.target.style.backgroundColor = "#e6f7ff"; // Light blue on focus
                                e.target.style.border = "1px solid #007bff"; // Optional: Blue border
                                e.target.style.outline = "none"; // Ensure no thick border
                                e.target.style.boxShadow = "none"; // Remove Amplify UI focus glow
                            }}
                            onBlur={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.border = errors?.title ? "2px solid red" : "1px solid #ced4da"; // Reset border
                                e.target.style.outline = "none"; // Ensure no outline
                                e.target.style.boxShadow = "none"; // Remove shadow
                            }}
                        />
                        {errors?.title && <p style={{ color: 'red' }}>{errors.title}</p>}

                    </div>
                    <div className='w-100' style={{ height: '9rem' }}>
                        <TextAreaField
                            // style={{ width: '100%' }}
                            style={{ border: errors?.description ? '2px solid red' : '1px solid #ced4da' }}

                            label="Description"
                            placeholder="Enter description"
                            onChange={handleChangeInTopTitleDesc}
                            value={ListItem.description}
                            // multiline
                            name="description"
                            rows={3}
                            onFocus={(e) => {
                                e.target.style.backgroundColor = "#e6f7ff"; // Light blue on focus
                                e.target.style.border = "1px solid #007bff"; // Optional: Blue border
                                e.target.style.outline = "none"; // Ensure no thick border
                                e.target.style.boxShadow = "none"; // Remove Amplify UI focus glow
                            }}
                            onBlur={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.border = errors?.title ? "2px solid red" : "1px solid #ced4da"; // Reset border
                                e.target.style.outline = "none"; // Ensure no outline
                                e.target.style.boxShadow = "none"; // Remove shadow
                            }}
                        />
                        {errors?.description && <p style={{ color: 'red' }}>{errors.description}</p>}

                    </div>
                    {/* Adding subtype ui */}
                    <div style={{ fontFamily: 'Arial, sans-serif' }} className="w-100">
                        <h2 className='mb-2'>Sub Categories</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
                            <div style={{ height: "5rem" }}>
                                <TextAreaField
                                    value={newTitle}
                                    onChange={handleTitleChange}
                                    placeholder="Enter title"
                                    // style={{ flex: 1 }}
                            style={{ border: errors?.newTitle ? '2px solid red' : '1px solid #ced4da' }}

                                    label="Title"
                                    variant="outlined"
                                    rows={1}
                                    size="small"
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = "#e6f7ff"; // Light blue on focus
                                        e.target.style.border = "1px solid #007bff"; // Optional: Blue border
                                        e.target.style.outline = "none"; // Ensure no thick border
                                        e.target.style.boxShadow = "none"; // Remove Amplify UI focus glow
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = "transparent";
                                        e.target.style.border = errors?.title ? "2px solid red" : "1px solid #ced4da"; // Reset border
                                        e.target.style.outline = "none"; // Ensure no outline
                                        e.target.style.boxShadow = "none"; // Remove shadow
                                    }}
                                />
                                {errors?.newTitle && <p style={{ color: 'red' }}>{errors.newTitle}</p>}

                            </div>
                            <div style={{ height: "9.5rem" }}>
                                <TextAreaField
                                    // style={{ width: '100%' }}
                            style={{ border: errors?.newDescription ? '2px solid red' : '1px solid #ced4da' }}

                                    label="Description"
                                    value={newDescription}
                                    onChange={handleDescriptionChange}
                                    placeholder="Enter description"
                                    // multiline
                                    rows={3}
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = "#e6f7ff"; // Light blue on focus
                                        e.target.style.border = "1px solid #007bff"; // Optional: Blue border
                                        e.target.style.outline = "none"; // Ensure no thick border
                                        e.target.style.boxShadow = "none"; // Remove Amplify UI focus glow
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = "transparent";
                                        e.target.style.border = errors?.title ? "2px solid red" : "1px solid #ced4da"; // Reset border
                                        e.target.style.outline = "none"; // Ensure no outline
                                        e.target.style.boxShadow = "none"; // Remove shadow
                                    }}
                                />

                                {errors?.newDescription && <p style={{ color: 'red' }}>{errors.newDescription}</p>}

                            </div>

                            <button
                                className="btn btn-primary w-25"
                                onClick={handleAddOrUpdateItem}
                                style={{ height: "2.7rem", width: "10rem" }}
                                disabled={!isSubtypeValid}
                            >
                                {editingIndex !== null ? 'Update Subtype' : 'Add Subtype'}
                            </button>

                        </div>
                        {errors?.subtype && <p style={{ color: 'red' }}>{errors.subtype}</p>}

                        {/* List Display */}
                        <ul style={{ padding: '0', listStyleType: 'none' }}>
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
                                        <strong>{item.title}</strong>
                                        <p style={{ margin: '5px 0' }}>{item.description}</p>
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
                        <hr className='mt-5 mb-2' />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-success submitButton"
                        disabled={!isFormValid}
                        style={{ height: "2.7rem", width: "10rem" }}
                        onClick={submitHandler}
                    >
                        Submit
                    </button>
            </CardContent>
        </Card>

    )
}
