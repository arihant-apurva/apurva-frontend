import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, TextField, MenuItem, Box, Container, Button } from '@mui/material';
import Notification from '../../Modules/Notification';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { SelectField, TextAreaField } from '@aws-amplify/ui-react';


const RegionAdd = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const [cities, setCities] = useState([]);


  const [errors, setErrors] = useState();

  const [formData, setFormData] = useState({
    newsTitle: "",
    newsDescription: "",
    displayTime: "",
    status: true,
    selectedCountry: "",
    selectedState: "",
    selectedCity: "",
  })
  const validationSchema = Yup.object({
    newsTitle: Yup.string()
      .matches(/^[A-Za-z][A-Za-z ]*$/, "*Title must contain only alphabets and single spaces")
      .test("no-leading-space", "*Title cannot start with a space", (value) => !value || !value.startsWith(" "))
      .test("no-consecutive-spaces", "*Title cannot have consecutive spaces", (value) => !value || !/\s{2,}/.test(value))
      .min(5, "*Title must be at least 8 characters")
      .max(50, "*Title cannot exceed 255 characters")
      .required("*Title is required"),

    newsDescription: Yup.string()
      .test("no-leading-space", "*Description cannot start with a space", (value) => !value || !value.startsWith(" "))
      .test("no-consecutive-spaces", "*Description cannot have consecutive spaces", (value) => !value || !/\s{2,}/.test(value))
      .min(8, "*Description must be at least 8 characters")
      .max(255, "*Description cannot exceed 255 characters")
      .required("*Description is required"),

    displayTime: Yup.date().typeError('Invalid date format').required('Display Time is required'),

    status: Yup.boolean()
      .required('Status is required'),

    selectedCountry: Yup.string()
      .required("*Required to select") // Ensure selection is required
      .notOneOf([""], "Please select a valid country"),

    selectedState: Yup.string()
      .required("*Required to select") // Ensure selection is required
      .notOneOf([""], "Please select a valid state"),

    selectedCity: Yup.string()
      .required("*Required to select") // Ensure selection is required
      .notOneOf([""], "Please select a valid city"),

  });


  const navigate = useNavigate();

  const headers = new Headers();
  headers.append("X-CSCAPI-KEY", "Zk10ZVljb0Iybnl1ZE1aU21IY25xUWR0ekpHcXhSSGNMak40S1A3NA==");

  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow',
  };

  const getCountryData = async () => {
    try {
      const response = await fetch("https://api.countrystatecity.in/v1/countries", requestOptions);
      const res = await response.json();
      setCountries(res);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const getStateData = async (countryCode) => {
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, requestOptions);
      const res = await response.json();
      setStates(res);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const getCityData = async (countryCode, stateCode) => {
    try {
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`, requestOptions);
      const res = await response.json();
      setCities(res);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    getCountryData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getStateData(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      getCityData(selectedCountry, selectedState);
    }
  }, [selectedState]);

  const handleSubmit = async () => {
    const ListItem = {
      ...formData,
      sensorship: {
        stage: 'request',
        feedback: null
      },
    };

    try {
      // await validationSchema.validate(formData, { abortEarly: false });
      const response = await fetch("http://localhost:5000/api/regional-news/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ListItem),
      });

      if (response.ok) {
        Notification.success("Successfully added");
        navigate('/admin/regional-news/list');
      } else {
        const errorData = await response.json();
        Notification.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Notification.error("Submission failed. Please try again.");
    }
  };

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    try {
      setFormData((prevValue) => {
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
      await validationSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name]; // Remove error for this field
        return newErrors;
      });
    }
    catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message })); // Set error message
    }
  };

  const isFormValid =
    errors && Object.keys(errors).length === 0 && // Ensure errors exist before checking
    formData?.newsTitle?.trim() && // Avoid null/undefined values
    formData?.newsDescription?.trim() &&
    formData?.displayTime?.trim() &&
    // formData?.status?.trim() &&
    formData?.selectedCountry?.trim() &&
    formData?.selectedState?.trim() &&
    formData?.selectedCity?.trim();

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Card style={{ padding: "2rem" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              News and Region Selector
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={12}
                style={{ height: "6.5rem" }}>
                <TextAreaField
                  label="Title"
                  rows={1}
                  placeholder="Enter title"
                  value={formData.newsTitle}
                  onChange={handleFormChange}
                  name="newsTitle"
                  style={{ border: errors?.newsTitle ? '2px solid red' : '1px solid #ced4da' }}

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
                {errors?.newsTitle && <p style={{ color: 'red' }}>{errors.newsTitle}</p>}

              </Grid>

              <Grid item xs={12}
                style={{ height: "10.3rem" }}
              >
                <TextAreaField
                  label="Description"
                  rows={3}
                  placeholder="Enter description"
                  value={formData.newsDescription}
                  onChange={handleFormChange}
                  name="newsDescription"
                  style={{ border: errors?.newsDescription ? '2px solid red' : '1px solid #ced4da' }}

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
                {errors?.newsDescription && <p style={{ color: 'red' }}>{errors.newsDescription}</p>}
              </Grid>

              <Grid item xs={12}
                style={{ height: "6.3rem" }}
              >
                <label htmlFor="DisplayTime" className='fs-4'>Display Time</label>
                <br />
                <input
                  type="datetime-local"
                  id="DisplayTime"
                  name="displayTime"
                  onChange={handleFormChange}
                  value={formData.displayTime}
                  className="fs-4 w-50"
                />
                {errors?.displayTime && <p className="text-danger">{errors.displayTime}</p>}
              </Grid>
              <Grid item xs={12}>
                <SelectField
                  labelId="status-select-label"
                  value={formData.status}
                  onChange={handleFormChange}
                  style={{ width: '100%' }}
                  name="status"
                  label="Status"
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
                {errors?.status && <Typography color="error">{errors.status}</Typography>}
              </Grid>

              <Grid item xs={12}>
                <SelectField
                  labelId="status-select-label"
                  value={formData.selectedCountry}
                  onChange={(e) => {
                    const country = countries.find(c => c.name === e.target.value);
                    setSelectedCountry(country.iso2);
                    handleFormChange(e);
                  }}
                  style={{ width: '100%' }}
                  name="selectedCountry"
                  label="Select a Country"
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
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </SelectField>
                {errors?.selectedCountry && <Typography color="error">{errors.selectedCountry}</Typography>}
              </Grid>

              {selectedCountry && (
                <Grid item xs={12}>
                  <SelectField
                    labelId="status-select-label"
                    value={formData.selectedState}
                    onChange={(e) => {
                      const state = states.find(s => s.name === e.target.value);
                      setSelectedState(state.iso2);
                      handleFormChange(e);
                    }}
                    style={{ width: '100%' }}
                    name="selectedState"
                    label="Select a State"
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
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>{state.name}</option>
                    ))}
                  </SelectField>
                  {errors?.selectedState && <Typography color="error">{errors.selectedState}</Typography>}
                </Grid>
              )}

              {selectedState && (
                <Grid item xs={12}>
                  <SelectField
                    labelId="status-select-label"
                    value={formData.selectedCity}
                    onChange={handleFormChange}
                    style={{ width: '100%' }}
                    name="selectedCity"
                    label="Select City"
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
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </SelectField>
                  {errors?.selectedCity && <Typography color="error">{errors.selectedCity}</Typography>}
                </Grid>
              )}


              <Grid item xs={12} style={{ textAlign: "center" ,margin:"2rem"}}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!isFormValid}
                  style={{ height: "2.7rem", width: "15rem"}}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RegionAdd;
