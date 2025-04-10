import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';
import ReactSearchBox from "react-search-box";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    ThemeProvider,
    Theme,
    SearchField,
    SelectField,
    Loader,
    Breadcrumbs,
} from '@aws-amplify/ui-react';
import CustomSeparator from "../common/Breadcrumbs";
import '../asset/css/Loader.css';
import '../asset/css/common.css';
import './css/List.css';
import { useList } from '../content-type/store/contentcontext.js';
import Notification from '../../Modules/Notification.js';
import Input from '../Inputcomponent/Inputs.js';


const theme: Theme = {

    name: 'table-theme',
    tokens: {
        components: {
            table: {
                row: {
                    hover: {
                        backgroundColor: { value: '{colors.blue.20}' },
                    },
                    striped: {
                        backgroundColor: { value: '{colors.blue.10}' },
                    },
                },
                header: {
                    color: { value: '{colors.blue.80}' },
                    fontSize: { value: '{fontSizes.xl}' },
                },
                data: {
                    fontWeight: { value: '{fontWeights.semibold}' },
                },
            },
        },
    },
};



const IndexingNews = () => {
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // Total items from backend
    const [isReversed, setIsReversed] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [page, setPage] = useState(0); // MUI pagination uses 0-based indexing
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({});  // <-- Add this line
    // const [requestDocument, setRequestDocument] = useState({});  // <-- Add this line

    const [sortOrder, setSortOrder] = useState({
        "title": 0,
        "name": 0,
        "subcategory": 0,
        "description": 0,
        "_id": 0,
        "createdAt": 0
    });
    const navigate = useNavigate();

    // for loading
    const [loading, setLoading] = useState(false);


    const deleteHandler = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");

        if (!isConfirmed) {
            return; // Exit if the user cancels
        }
        try {
            const response = await fetch(`http://localhost:5000/api/news/delete/${id}`, {
                method: "DELETE", // Use DELETE instead of GET
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            const result = await response.json();
        } catch (error) {
            console.log(error);
        }

    }


    const searchHandler = async (value, name) => {
        const updatedFilters = {
            ...filters,  // Maintain existing filters
            [name]: value // Update field dynamically
        };
        // console.log(updatedFilters);

        setFilters(updatedFilters);  // Store for pagination
    };

    // const toggleOrder = () => {
    //     setIsReversed(!isReversed);
    // };

    // const finalList = isReversed ? [...list].reverse() : list;

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0); // Reset to the first page
    };


    const SortSymbol = ({ sortOrder }) => {
        if (sortOrder % 3 === 0) {
            return <i class="fa-solid fa-sort"></i>
        }
        else if (sortOrder % 3 === 1) {
            return <i class="fa-solid fa-sort-up"></i>
        }
        else if (sortOrder % 3 === 2) {
            return <i class="fa-solid fa-sort-down"></i>
        }
    }

    useEffect(() => {
        const fetchData = async (collectionName, filters = {}, page = 1, limit = 10, sort = {}) => {
            try {
                // console.log(sort);

                const response = await fetch(
                    `http://localhost:5000/api/news-indexing/list/${collectionName}?page=${page + 1}&limit=${limit}&sort=${JSON.stringify(sort)}&filters=${JSON.stringify(filters)}`,
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
        const fetchDataAsync = async () => {
            try {
                const activeSort = getActiveSort(sortOrder);
                const result = await fetchData("category-type", filters, page, rowsPerPage, activeSort);
                // console.log(result.results);

                setList(result.results);  // Populate the list with data
                setTotalCount(result.totalCount);  // Set total count for pagination
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDataAsync();
    }, [page, rowsPerPage, sortOrder, filters, buttonClicked]); // Ensure to include sortOrder and filters as dependencies

    const getActiveSort = (sortOrder) => {
        const activeSort = {};

        // Iterate through the sortOrder object and build activeSort
        for (const [key, value] of Object.entries(sortOrder)) {
            if (value === 1) activeSort[key] = 1;  // Ascending
            if (value === 2) activeSort[key] = -1; // Descending
            // No need to add the key if value === 0 (no sorting for this field)
        }

        return activeSort;
    };

    const changeSortOrder = async (field) => {
        const updatedSortOrder = {
            ...sortOrder,
            [field]: (sortOrder[field] + 1) % 3
        };

        setSortOrder(updatedSortOrder);  // Update sort state
    };

    //request for approval button logic
    const sendApprovalRequest = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/news/update/sensorship/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseData = await response.json()
            if (response.ok) {
                Notification.success(responseData.message)
                setButtonClicked(!buttonClicked);
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };


    const renderSensorshipStatus = (sensorship, id) => {
        switch (sensorship.stage) {
            case "request":
                return (
                    <button className="btn btn-primary equal-btn" onClick={() => sendApprovalRequest(id)}>
                        Request
                    </button>
                );
            case "approved":
                return <button className="btn btn-success equal-btn" style={{ cursor: "default" }}>Approved</button>;
            case "rejected":
                return <button className="btn btn-danger equal-btn">Rejected</button>;
            case "review":
                return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                    <button
                        className="btn btn-info"
                        style={{ height: "25px", width: "110px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}
                    >
                        Review
                    </button>
                    <button
                        className="btn"
                        style={{ height: "15px", width: "130px", backgroundColor: "purple", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}
                    >
                        Re-Request
                    </button>
                </div>
            case "pending":
                return <button className="btn btn-warning equal-btn" style={{ cursor: "default" }}>Pending</button>;
            default:
                return <button className="btn btn-secondary equal-btn" style={{ cursor: "default" }}>Unknown</button>;
        }
    };

    return (
        <>
            {loading ? <div className="modal">
                <div className="loader"></div>
            </div> :

                <>
                    <CustomSeparator />
                    <div className="container mt-4">
                        <h3>Select a Date</h3>
                        <div className="border p-3 rounded">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    if (date) {
                                        const formattedDate = date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
                                        searchHandler(formattedDate, "createdAt"); // Send only the date part
                                        setSelectedDate(date);
                                    }
                                }}
                                inline
                            />
                        </div>
                        <p className="mt-2">Selected Date: {selectedDate.toDateString()}</p>
                    </div>
                    <div className="container d-flex flex-row justify-content-between align-self-center">
                        <p className="text-primary" style={{ fontSize: "200%", fontWeight: "550", height: '10px' }}>News</p>

                    </div>
                    <br></br>

                    <ThemeProvider theme={theme} colorMode="light">
                        <div class="table-responsive">
                            <Table highlightOnHover variation="striped" className="table-container">
                                <TableHead>
                                    <TableRow>
                                        <TableCell as="th" >
                                            <div className="sorting_button">
                                                S.No

                                            </div>


                                        </TableCell>
                                        <TableCell as="th">Id
                                            <div style={{ marginTop: '5px', height: '40px', }}>
                                                <ReactSearchBox
                                                    placeholder="Search"
                                                    onChange={(value) => searchHandler(value, "_id")}
                                                    onClear={() => searchHandler("", "_id")} name="id"
                                                    className="w-75"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" onClick={() => changeSortOrder("type")} style={{ cursor: 'pointer' }}>
                                                Type
                                                <SortSymbol sortOrder={sortOrder.title} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "title")}
                                                onClear={() => searchHandler("", "title")} className="w-75"
                                                style={{
                                                    marginTop: '200px',
                                                    padding: '4px',
                                                    height: '40px',
                                                    width: '30px',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" onClick={() => changeSortOrder("subcategory")} style={{ cursor: 'pointer' }}>
                                                description
                                                <SortSymbol sortOrder={sortOrder.description} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "description")}
                                                onClear={() => searchHandler("", "description")}
                                                className="w-75"
                                                style={{
                                                    marginTop: '200px',
                                                    padding: '4px',
                                                    height: '40px',
                                                    width: '30px',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" onClick={() => changeSortOrder("title")} style={{ cursor: 'pointer' }}>
                                                Subtype
                                                <SortSymbol sortOrder={sortOrder.name} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "subtypes.name")}
                                                onClear={() => searchHandler("", "subtypes.name")}
                                                className="w-75"
                                                style={{
                                                    marginTop: '200px',
                                                    padding: '4px',
                                                    height: '40px',
                                                    width: '30px',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" onClick={() => changeSortOrder("createdAt")} style={{ cursor: 'pointer' }}>
                                                Display date
                                                <SortSymbol sortOrder={sortOrder.createdAt} />
                                            </div>
                                        </TableCell>

                                        {/* <TableCell as="th" style={{ textAlign: 'center', fontSize: '15px' }}>Sensorship</TableCell> */}
                                        <TableCell as="th" colSpan={3} style={{ textAlign: 'center', fontSize: '15px' }}>Activity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {list.map((entry, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='text-center'>
                                                {page * rowsPerPage + index + 1}
                                            </TableCell>
                                            <TableCell>{entry._id}</TableCell>
                                            <TableCell>{entry.title}</TableCell>
                                            <TableCell>{entry.description}</TableCell>
                                            <TableCell>{entry.subtypes.name} ({entry.subtypes.value})</TableCell>
                                            <TableCell>
                                                {new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }).format(new Date(entry.createdAt))}
                                            </TableCell>
                                            <TableCell className="text-center" colSpan={3}>
                                                <div className="d-flex justify-content-center gap-3">
                                                    {entry.subtypes.used ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn"
                                                                onClick={() => navigate(`/admin/category-type/update/${entry._id}`)}
                                                            >
                                                                <i className="fa-solid fa-pen-nib fs-4" style={{ color: '#FFD43B' }}></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn"
                                                                onClick={() => navigate(`/admin/category-type/view/${entry._id}`)}
                                                            >
                                                                <i className="fa-solid fa-eye fs-3" style={{ color: '#63E6BE' }}></i>
                                                            </button>

                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn"
                                                            onClick={() => navigate(`/admin/category-type/update/${entry._id}`)}
                                                        >
                                                            <i className="fa-solid fa-plus" style={{ color: "#1920f0" }}></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <TablePagination
                            component="div"
                            count={totalCount} // Use totalCount from API
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className='mt-3'
                        />
                    </ThemeProvider>
                    {/* )} */}


                </>

            }
        </>
    );
};

export default IndexingNews;
