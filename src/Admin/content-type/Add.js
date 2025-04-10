import React, { useState } from 'react'
import { Button, Flex, Input, Label, SelectField, Card, ThemeProvider, Theme, TextAreaField } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Notification from '../../Modules/Notification';
import * as Yup from 'yup';
import './css/add.css'

const theme: Theme = {

    name: 'card-theme',
    tokens: {
        components: {
            card: {
                // You can reference other tokens
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


const Add = () => {

    const navigate = useNavigate()

    const [ListItem, setListItem] = useState({
        title: "",
        status: true,
        description: "",
        contentTypeImage: null
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState();

    const validationSchema = Yup.object({
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

        status: Yup.boolean().required("*Status is required"),
        contentTypeImage: Yup.string().required("*Image is required"),
    });


    const inputHandler = async (event) => {
        const { name, value, type, files } = event.target;
        // console.log(files);
        
        // Update the ListItem state
        setListItem((prevValue) => {
            if (type === 'file') {
                return {
                    ...prevValue,
                    [name]: files[0], // Set the file object
                };
            }
            if (name === 'status') {
                return {
                    ...prevValue,
                    [name]: value === 'true', // Convert to boolean for status
                };
            }
            else {
                return {
                    ...prevValue,
                    [name]: value, // Set the value
                };
            }
        });

        // Validate the specific field on change
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
    };

    const isFormValid =
        errors && Object.keys(errors).length === 0 && // Ensure errors exist before checking
        ListItem?.title?.trim() && // Avoid null/undefined values
        ListItem?.description?.trim() &&
        ListItem?.status !== null &&
        ListItem?.contentTypeImage;


    //New Submit Handler for Image Upload and other data too
    const submitHandler = async (e) => {
        e.preventDefault();

        // Create FormData object to send data
        const formData = new FormData();
        formData.append("title", ListItem.title);
        formData.append("status", ListItem.status);
        formData.append("description", ListItem.description);
        formData.append("contentTypeImage", ListItem.contentTypeImage);

        try {
            const response = await fetch("http://localhost:5000/api/content-type/add", {
                method: "POST",
                body: formData, // Send FormData
            });
            const data = await response.json()

            if (response.ok) {
                setListItem({ title: "", status: true, description: "" });
                Notification.success(data.message)
                navigate('/admin/content-type')
            }
            else {
                Notification.error(data.message)
            }
        } catch (error) {
            Notification.error("Some Backend error ❌")

        } finally {
            setTimeout(() => {
                setLoading(false);  // Hide loader after a delay
            }, 400);
        }
    };

    return (
        <>
            <ThemeProvider theme={theme} colorMode="light">
                <Card variation="elevated" className='container w-50 py-5 mx-auto '>
                    <div className='container'>
                        <p className='text-primary display-6 text-center fw-medium'>Add New Type</p>
                    </div>
                    <Flex as="form" direction="column" width="70%" onSubmit={submitHandler} className='container'>
                        <Flex direction="column" gap="small" style={{ height: '7rem' }}>
                            <Label htmlFor="title">Content-Title</Label>
                            <Input
                                id="title"
                                type="text"
                                name='title'
                                onChange={inputHandler} value={ListItem.title}
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
                            {errors?.title && <p className='text-danger'>{errors.title}</p>}
                        </Flex>
                        <Flex direction="column" gap="small" style={{ height: '9.5rem' }}>
                            <TextAreaField
                                label="Description"
                                name="description"
                                placeholder="Enter a description"
                                // isRequired
                                onChange={inputHandler}
                                value={ListItem.description}
                                rows={3}
                                style={{ border: errors?.description ? '2px solid red' : '1px solid #ced4da' }}
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
                            {errors?.description && <p className='text-danger'>{errors.description}</p>}
                        </Flex>
                        <Flex direction="column" gap="small" style={{ height: '5rem' }}>
                            <SelectField
                                label="Status"
                                // descriptiveText="Should your title be Active or Inactive?"
                                onChange={inputHandler}
                                name='status'
                                value={ListItem.status}
                                // style={{ border: errors?.status ? '2px solid red' : '1px solid #ced4da' }}
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
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>

                            </SelectField>
                            {errors?.status && <p className='text-danger'>{errors.status}</p>}

                        </Flex>
                        <Flex direction="column" gap="small">
                            <Label htmlFor="image_input">Upload Image</Label>
                            <div style={{ minHeight: '3rem' }}> {/* Reserve space for previews */}
                                <input type="file" id="image_input" name="contentTypeImage" onChange={inputHandler} />
                                {errors?.contentTypeImage && <p className='text-danger'>{errors.contentTypeImage}</p>}
                            </div>
                        </Flex>

                        <button
                            type="submit"
                            className="btn btn-success"
                            // style={{height:"2rem",width}}
                            disabled={!isFormValid}
                        >
                            Submit
                        </button>
                    </Flex>

                </Card>

            </ThemeProvider>



        </>

    )
}

export default Add;
