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
// import SwapVertIcon from '@mui/icons-material/SwapVert';
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

const List = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // Total items from backend
    const [isReversed, setIsReversed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState(''); // State for "Created At" filter
    const [page, setPage] = useState(0); // MUI pagination uses 0-based indexing
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    // for loading
    const [loading, setLoading] = useState(false);

    // const [sortKey, setSortKey] = useState('');
    // const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/category-type/users?page=${page + 1}&limit=${rowsPerPage}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);

                    setList(data.results);
                    setTotalCount(data.totalCount); // Update totalCount from API
                } else {
                    console.error('Failed to fetch item data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setTimeout(() => {
                    setLoading(false);  // Hide loader after a delay
                }, 400);
            }
        };

        fetchData();
    }, [page, rowsPerPage]);


    const deleteHandler = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");

        if (!isConfirmed) {
            return; // Exit if the user cancels
        }
        try {
            const response = await fetch(`http://localhost:5000/api/category-type/delete/${id}`, {
                method: "DELETE", // Use DELETE instead of GET
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            const result = await response.json();
            // console.log(result.message);
            console.log(result);


        } catch (error) {
            console.log(error);
        }

    }

    // Filter list based on search query
    const filteredList = list.filter((entry) =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredListByStatus = filteredList.filter((entry) => {
        if (statusFilter === '') return true;
        const filterValue = statusFilter === 'true';
        return entry.status === filterValue;
    });

    const filteredListByDate = filteredListByStatus.filter((entry) => {
        if (!searchDate) return true;
        const createdAtDate = new Date(entry.createdAt).toISOString().split('T')[0];
        return createdAtDate === searchDate;
    });

    // Reverse order logic
    const toggleOrder = () => {
        setIsReversed(!isReversed);
    };

    const finalList = isReversed ? [...filteredListByDate].reverse() : filteredListByDate;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const handleDateChange = (event) => {
        setSearchDate(event.target.value);
    };

    return (
        <>
            {loading ? <div className="modal">
                <div className="loader"></div>
            </div> :

                <>
                    <CustomSeparator />
                    <div className="container d-flex flex-row justify-content-between align-self-center">
                        <p className="text-primary" style={{ fontSize: "200%", fontWeight: "550", height: '10px' }}>Category</p>
                        <buttonCONTENT
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setLoading(true);
                                {
                                    loading ? <div className="modal">
                                        <div className="loader"></div>
                                    </div> : (navigate('/admin/category-type/add'))
                                }
                            }}
                        >
                            ADD&nbsp;+
                        </buttonCONTENT>

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
                                                {isReversed ? (
                                                    <UnfoldLessIcon
                                                        fontSize="small"
                                                        onClick={toggleOrder}
                                                        className="cursor-pointer cursor-pointer icon-spacing"
                                                    />
                                                ) : (
                                                    <UnfoldMoreIcon
                                                        fontSize="small"
                                                        onClick={toggleOrder}
                                                        className="cursor-pointer cursor-pointer icon-spacing"
                                                    />
                                                )}
                                            </div>


                                        </TableCell>
                                        <TableCell as="th">Id
                                            <div style={{ marginTop: '5px', height: '40px', }}>
                                                <ReactSearchBox
                                                    placeholder="Search"
                                                    onChange={(value) => setSearchQuery(value)}
                                                    onClear={() => setSearchQuery('')}
                                                    className="w-75"
                                                />
                                            </div>


                                        </TableCell>
                                        <TableCell as="th">
                                            <div className="sorting_button" >
                                                Title

                                                {isReversed ? (
                                                    <UnfoldLessIcon
                                                        fontSize="small"
                                                        onClick={toggleOrder}
                                                        className="cursor-pointer cursor-pointer icon-spacing"
                                                    />
                                                ) : (
                                                    <UnfoldMoreIcon
                                                        fontSize="small"
                                                        onClick={toggleOrder}
                                                        className="cursor-pointer cursor-pointer icon-spacing"
                                                    />)}</div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => setSearchQuery(value)}
                                                onClear={() => setSearchQuery('')}
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
                                            <div className="sorting_button" >
                                                Description
                                                {isReversed ? (
                                                    <UnfoldLessIcon
                                                        fontSize="small"
                                                        onClick={toggleOrder}
                                                        className="cursor-pointer cursor-pointer icon-spacing"
                                                    />
                                                ) : (
                                                    <UnfoldMoreIcon
                                                        fontSize="small"
                                                        onClick={toggleOrder}
                                                        className="cursor-pointer cursor-pointer icon-spacing"
                                                    />)}</div>
                                            <ReactSearchBox
                                                placeholder="Search"
                                                onChange={(value) => setSearchQuery(value)}
                                                onClear={() => setSearchQuery('')}
                                                className="w-75"
                                                style={{
                                                    marginTop: '200px',
                                                    padding: '4px',
                                                    height: '40px',
                                                    width: '30px',
                                                }}
                                            />
                                        </TableCell>

                                        {/* <TableCell as="th">Created At
                                                    <Input
                                                        type="date"
                                                        className="form-control"
                                                        value={searchDate}
                                                        onChange={handleDateChange}
                                                        style={{
                                                            fontSize: '12px', // Reduce font size
                                                            padding: '4px',   // Reduce padding
                                                            height: '40px',
                                                            width: '70px',   // Adjust widt
                                                        }}
                                                    />
                                                </TableCell> */}
                                        <TableCell as="th" colSpan={3} style={{ textAlign: 'center', fontSize: '15px' }}>Activity</TableCell>

                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {finalList.map((entry, index) => (
                                        <TableRow key={entry._id}>
                                            <TableCell className='text-center'>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{entry._id}</TableCell>
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
                                                        onClick={() => { deleteHandler(entry._id) }}
                                                    >
                                                        <i
                                                            className="fa-solid fa-trash fs-5"
                                                            style={{ color: '#d71919' }}
                                                        ></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => navigate(`/admin/category-type/update/${entry._id}`)}
                                                    >
                                                        <i
                                                            className="fa-solid fa-pen-nib fs-4"
                                                            style={{ color: '#FFD43B' }}
                                                        ></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => navigate(`/admin/category-type/view/${entry._id}`)}
                                                    >
                                                        <i
                                                            className="fa-solid fa-eye fs-3"
                                                            style={{ color: '#63E6BE' }}
                                                        ></i>
                                                    </button>
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

export default List;
