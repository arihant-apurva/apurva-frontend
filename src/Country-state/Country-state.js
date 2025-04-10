import React, { useState, useEffect } from 'react';

const CountryState = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  
  // Headers and request options
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
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        requestOptions
      );
      const res = await response.json();
      setStates(res);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };


  const getCityData = async (countryCode, stateCode) => {
    try {
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
        requestOptions
      );
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

  return (
    <div>
      <h1>Country, State, and City Selector</h1>

     
      <label htmlFor="country-select">Select a Country:</label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">-- Select a Country --</option>
        {countries.map((country) => (
          <option key={country.iso2} value={country.iso2}>
            {country.name}
          </option>
        ))}
      </select>

    
      {selectedCountry && (
        <>
          <label htmlFor="state-select">Select a State:</label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">-- Select a State --</option>
            {states.map((state) => (
              <option key={state.iso2} value={state.iso2}>
                {state.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* City Dropdown */}
      {selectedState && (
        <>
          <label htmlFor="city-select">Select a City:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">-- Select a City --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default CountryState;
