import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';
import ReactSearchBox from "react-search-box";
import Button from '@mui/material/Button';
import { MdModeEditOutline } from "react-icons/md";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { RiDeleteBinLine } from "react-icons/ri";
import { Switch } from '@mui/material';
import { TableSortLabel } from '@mui/material';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
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
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';
import { Badge } from '@mui/material';
import CustomSeparator from "../common/Breadcrumbs";
import '../asset/css/Loader.css';
import '../asset/css/common.css';
import './css/List.css';
import Input from '../Inputcomponent/Inputs.js';
import { useList } from '../content-type/store/contentcontext.js';
import Notification from '../../Modules/Notification.js';
import DatePicker from 'react-datepicker';

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
    palette: {
        primary: '#a2cf6e',
        secondary: '#ff3d00',
    },
};



const IndexingRegionalNews = () => {
    const [list, setList] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [totalCount, setTotalCount] = useState(0); // Total items from backend
    const [isReversed, setIsReversed] = useState(false);
        const [selectedDate, setSelectedDate] = useState(new Date());
    
    const [page, setPage] = useState(0); // MUI pagination uses 0-based indexing
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const [statusFilter, setStatusFilter] = useState('');
    const [filters, setFilters] = useState({});  // <-- Add this line

    const [sortOrder, setSortOrder] = useState({
        "newsTitle": 0,
        "newsDescription": 0,
        "displayTime": 0,
        "status": 0,
        "_id": 0,
        "name": 0,
        "stateName": 0,
        "cityName": 0
    });
    const navigate = useNavigate();

    // for loading
    const [loading, setLoading] = useState(false);

    const { fetchData } = useList()


    const searchHandler = async (value, name) => {
        const updatedFilters = {
            ...filters,  // Maintain existing filters
            [name]: value // Update field dynamically
        };
        setFilters(updatedFilters);  // Store for pagination
    };

    const toggleOrder = () => {
        setIsReversed(!isReversed);
    };

    // const finalList = isReversed ? [...list].reverse() : list;

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
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
                const response = await fetch(
                    `http://localhost:5000/api/news-indexing/regional-news/list/${collectionName}?page=${page + 1}&limit=${limit}&sort=${JSON.stringify(sort)}&filters=${JSON.stringify(filters)}`,
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
                // console.log(data);
                
                return data;
            } catch (error) {
                console.error("Error in fetchData:", error);
                return { results: [], totalCount: 0 };
            }
        };
        const fetchDataAsync = async () => {
            try {
                const activeSort = getActiveSort(sortOrder);
                const result = await fetchData("countryStateCities", filters, page, rowsPerPage, activeSort);
                // console.log(result);
                

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

    const deleteHandler = async (id) => {
        // Confirmation prompt
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");

        if (!isConfirmed) {
            return; // If user cancels, exit the function
        }

        try {
            const response = await fetch(`http://localhost:5000/api/regional-news/delete/${id}`, {
                method: "GET",
            });

            const data = await response.json();

            if (response.ok) {
                if (data.type === "info") Notification.info(data.message);
                else Notification.success(data.message);
            }

        } catch (error) {
            Notification.error("Some backend error ❌");
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
                        <p className="text-primary" style={{ fontSize: "200%", fontWeight: "550", height: '10px' }}>Regional News</p>
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
                                        <TableCell as="th" >
                                            <div className="sorting_button">
                                                Image
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
                                            <div className="sorting_button" onClick={() => changeSortOrder("newsTitle")} style={{ cursor: 'pointer' }}>
                                                Title
                                                <SortSymbol sortOrder={sortOrder.newsTitle} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "newsTitle")}
                                                onClear={() => searchHandler("", "newsTitle")} className="w-75"
                                                style={{
                                                    marginTop: '200px',
                                                    padding: '4px',
                                                    height: '40px',
                                                    width: '30px',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" onClick={() => changeSortOrder("name")} style={{ cursor: 'pointer' }}>
                                                Country
                                                <SortSymbol sortOrder={sortOrder.name} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "name")}
                                                onClear={() => searchHandler("", "name")}
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
                                            <div className="sorting_button" onClick={() => changeSortOrder("stateName")} style={{ cursor: 'pointer' }}>
                                                State
                                                <SortSymbol sortOrder={sortOrder.stateName} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "stateName")}
                                                onClear={() => searchHandler("", "stateName")}
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
                                            <div className="sorting_button" onClick={() => changeSortOrder("cityName")} style={{ cursor: 'pointer' }}>
                                                City
                                                <SortSymbol sortOrder={sortOrder.cityName} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "cityName")}
                                                onClear={() => searchHandler("", "cityName")}
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
                                            <div className="sorting_button" onClick={() => changeSortOrder("status")} style={{ cursor: 'pointer' }}>
                                                Status
                                                <SortSymbol sortOrder={sortOrder.status} />
                                            </div>
                                            {/* <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "status")}
                                                onClear={() => searchHandler("", "status")}
                                                className="w-75"
                                                style={{
                                                    marginTop: '200px',
                                                    padding: '4px',
                                                    height: '40px',
                                                    width: '30px',
                                                }}
                                            /> */}
                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" onClick={() => changeSortOrder("displayTime")} style={{ cursor: 'pointer' }}>
                                                Display Time
                                                <SortSymbol sortOrder={sortOrder.displayTime} />
                                            </div>
                                        </TableCell>
                                        <TableCell as="th" colSpan={3} style={{ textAlign: 'center', fontSize: '15px' }}>Activity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {list.map((entry, index) => (
                                        <TableRow key={entry._id}>
                                            <TableCell className='text-center'>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell className='text-center'>
                                                <img src="https://picsum.photos/200/300" alt="image" />                                            </TableCell>
                                            <TableCell onClick={() => { navigate(`/admin/regional-news/view/${entry._id}`) }} style={{ cursor: "pointer" }}>{entry._id}</TableCell>
                                            <TableCell>{entry.used?"present":"absent"}</TableCell>
                                            {/* <TableCell>{entry.newsDescription}</TableCell> */}
                                            <TableCell>{entry.name}</TableCell>
                                            <TableCell>{entry.stateName}</TableCell>
                                            <TableCell>{entry.cityName}</TableCell>

                                            <TableCell className="text-center">
                                                {entry.status ? "Active" : "Inactive"}

                                            </TableCell>
                                            

                                            <TableCell className="text-center" colSpan={3} >
                                                <div className="d-flex justify-content-center gap-3">
                                                {entry.used ? (
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
                                                            onClick={() => navigate(`/admin/regional-news/update/${entry._id}`)}
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

export default IndexingRegionalNews;
