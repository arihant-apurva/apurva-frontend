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



const SensorshipList = () => {
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // Total items from backend
    const [isReversed, setIsReversed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState(''); // State for "Created At" filter
    const [page, setPage] = useState(0); // MUI pagination uses 0-based indexing
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({"sensorship.stage":"pending"});  // <-- Add this line
    // const [requestDocument, setRequestDocument] = useState({});  // <-- Add this line

    const [sortOrder, setSortOrder] = useState({
        "title": 0,
        "type": 0,
        "subcategory": 0,
        "description": 0,
        "_id": 0
    });
    const navigate = useNavigate();

    // for loading
    const [loading, setLoading] = useState(false);

    const { fetchData } = useList()


    const deleteHandler = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");

        if (!isConfirmed) {
            return; // Exit if the user cancels
        }
        try {
            const response = await fetch(`https://apurva-backend-repo.onrender.com/api/news/delete/${id}`, {
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
        const fetchDataAsync = async () => {
            try {
                const activeSort = getActiveSort(sortOrder);
                const result = await fetchData("news", filters, page, rowsPerPage, activeSort);
                setList(result.results);  // Populate the list with data
                setTotalCount(result.totalCount);  // Set total count for pagination
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDataAsync();
    }, [page, rowsPerPage, sortOrder, filters]); // Ensure to include sortOrder and filters as dependencies

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

    

    return (
        <>
            {loading ? <div className="modal">
                <div className="loader"></div>
            </div> :

                <>
                    <CustomSeparator />
                    <div className="container d-flex flex-row justify-content-between align-self-center">
                        <p className="text-primary" style={{ fontSize: "200%", fontWeight: "550", height: '10px' }}>Sensorship</p>
                        {/* <buttonCONTENT
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setLoading(true);
                                {
                                    loading ? <div className="modal">
                                        <div className="loader"></div>
                                    </div> : (navigate('/admin/news/add'))
                                }
                            }}
                        >
                            ADD&nbsp;+
                        </buttonCONTENT> */}    
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
                                                <SortSymbol sortOrder={sortOrder.type} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "type")}
                                                onClear={() => searchHandler("", "type")} className="w-75"
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
                                                Subcategory
                                                <SortSymbol sortOrder={sortOrder.subcategory} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "subcategory")}
                                                onClear={() => searchHandler("", "subcategory")}
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
                                                Title
                                                <SortSymbol sortOrder={sortOrder.title} />
                                            </div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => searchHandler(value, "title")}
                                                onClear={() => searchHandler("", "title")}
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
                                            <div className="sorting_button" onClick={() => changeSortOrder("description")} style={{ cursor: 'pointer' }}>
                                                Description
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
                                        <TableCell as="th" colSpan={3} style={{ textAlign: 'center', fontSize: '15px' }}>Activity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {list.map((entry, index) => (
                                        <TableRow key={entry._id}>
                                            <TableCell className='text-center'>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{entry._id}</TableCell>
                                            <TableCell>{entry.type}</TableCell>
                                            <TableCell>{entry.subcategory}</TableCell>
                                            <TableCell>{entry.title}</TableCell>
                                            <TableCell>{entry.description}</TableCell>

                                            {/* <TableCell className="text-center">

                                                        {entry.status ? 'active' : 'inactive'}
                                                    </TableCell> */}
                                            {/* <TableCell>
                                                        {new Intl.DateTimeFormat('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }).format(new Date(entry.createdAt))}
                                                    </TableCell> */}
                                            <TableCell className="text-center" colSpan={3} >
                                                <div className="d-flex justify-content-center gap-3">
                                                <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => navigate(`/admin/sensorship-news/view/${entry._id}`)}
                                                    >
                                                        <i
                                                            className="fa-solid fa-eye fs-3"
                                                            style={{ color: '#63E6BE' }}
                                                        ></i>
                                                    </button>
                                                    {/* commenting reject and approve option for sensorship inl list */}
                                                    
                                                    {/* <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => { requestHandler(entry._id) }}

                                                    >
                                                        <i class="fa-solid fa-xmark" style={{color: "#f52d0a"}}></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => navigate(`/admin/news/view/${entry._id}`)}
                                                    >
                                                        <i class="fa-solid fa-check" style={{color: "#63E6BE"}}></i>
                                                    </button> */}
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

export default SensorshipList;
