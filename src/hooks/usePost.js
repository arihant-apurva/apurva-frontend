import { useEffect, useState } from "react";

const usePost = (url) => {
    const [data, setData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async (body) => {
        setLoading(true)
        try {
            const response = await fetch(url, {
                method: "POST",
                body: body
            })
            const responseData = await response.json();
            // console.log(responseData);
            
            if (response.ok) {
                // setData(responseData);
                setLoading(false);
                return responseData;
            }
           
        } catch (error) {
            return error;
        }finally{
            setLoading(false);
        }
    }

    return fetchData;
}

export default usePost;