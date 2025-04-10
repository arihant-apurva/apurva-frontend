import React, { createContext, useContext, useState, useEffect } from 'react';

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
    const [List, setList] = useState([])

    
    
    const fetchData = async (collectionName, filters ={}, page = 1, limit = 10, sort = {}) => {
        try {
            // console.log(sort);
            
            const response = await fetch(
                `http://localhost:5000/api/search/${collectionName}?page=${page+1}&limit=${limit}&sort=${JSON.stringify(sort)}&filters=${JSON.stringify(filters)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
    
            const data = await response.json();
            // console.log(sort);  // Debugging response
    
            return data;
        } catch (error) {
            console.error("Error in fetchData:", error);
            return { results: [], totalCount: 0 };
        }
    };
    
    
    

    return (
        <ListContext.Provider value={{ List, fetchData}}>
            {children}
        </ListContext.Provider>
    );
};

export const useList = () => {
    const listContextValue = useContext(ListContext);
    return listContextValue;
};
