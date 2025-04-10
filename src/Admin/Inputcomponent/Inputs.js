import React from 'react';
import ReactSearchBox from 'react-search-box';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const Input = ({
    type = 'text',            // Default type is text
    value,                   // Controlled value
    onChange,                // Change handler
    placeholder,             // Placeholder text
    className,               // Class for styling
    label,                   // Label for the input
    options,                 // Options for Select (if type is 'select')
    style,                   // Custom styles
    dateFormat,              // Custom date format (optional)
}) => {

    if (type === 'search') {
        return (
            <ReactSearchBox
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={className}
            />
        );
    }

    if (type === 'select') {
        return (
            <FormControl fullWidth style={style}>
                {label && <InputLabel>{label}</InputLabel>}
                <Select
                    value={value}
                    onChange={onChange}
                    displayEmpty
                    className={className}
                >
                    {options && options.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    if (type === 'date') {
        return (
            <input
                type="date"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                style={style}
            />
        );
    }

    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                style={style}
            />
        </div>
    );
};

export default Input;

