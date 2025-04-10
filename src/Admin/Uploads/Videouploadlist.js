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
import Notification from '../../Modules/Notification';

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

const NewsList = () => {
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // Total items from backend
    const [isReversed, setIsReversed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState(''); // State for "Created At" filter
    const [searchdisDate, setSearchdisDate] = useState('');
    const [page, setPage] = useState(0); // MUI pagination uses 0-based indexing
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();
    // for loading
    const [loading, setLoading] = useState(false);



    // const [sortKey, setSortKey] = useState('');
    // const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/videos/users?page=${page + 1}&limit=${rowsPerPage}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setList(data.results);
                    setTotalCount(data.totalCount); // Update totalCount from API
                } else {
                    console.error('Failed to fetch item data');
                }
                // setList(prevList =>
                //     prevList.map(item =>
                //         item._id === id ? { ...item, status: newStatus } : item
                //     )
                // );
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
        try {
            const response = await fetch(`http://localhost:5000/api/videos/delete/${id}`, {
                method: "GET",
            })

            const data = await response.json()
            console.log(data);

            if (response.ok) {
                if (data.type === "info") Notification.info(data.message)
                else Notification.success(data.message)
            }

        } catch (error) {
            Notification.error("error", error);
        }

    }

    // Filter list based on search query
    const filteredList = list.filter((entry) =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredListByStatus = filteredList.filter((entry) => {
        if (statusFilter === '') return 'true';
        const filterValue = statusFilter === 'true';
        return entry.status === filterValue;
    });

    const filteredListByDate = filteredListByStatus.filter((entry) => {
        if (!searchDate) return true;
        const createdDate = new Date(entry.createdDate).toISOString().split('T')[0];
        return createdDate === searchDate;
    });

    const filteredListByDisplayDate = filteredListByDate.filter((entry) => {
        if (!searchdisDate) return true;
        const creatdisplayDate = new Date(entry.displayAt).toISOString().split('T')[0];
        return creatdisplayDate === searchdisDate;
    });

    // const toggleSortByTitle = () => {
    //     setIsReversed(!isReversed);
    // };
    // Reverse order logic

    const toggleOrder = () => {
        setIsReversed(!isReversed);
    };

    // const finalList = isReversed ? [...filteredListByDate].reverse() : filteredListByDate;
    const finalList = isReversed ? [...filteredListByDisplayDate].reverse() : filteredListByDisplayDate;


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

    const handleDateChange2 = (event) => {
        setSearchdisDate(event.target.value);
    };

    return (
        <>
            {loading ? <div className="modal">
                <div className="loader"></div>
            </div> :

                <>
                    <CustomSeparator
                        baseRoute="/admin/video-upload"

                    />
                    <div className="container d-flex flex-row justify-content-between align-self-center">
                        <p className="text-primary" style={{ fontSize: "200%", fontWeight: "550", height: '10px' }}>Video-Upload</p>
                        <buttonCONTENT
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setLoading(true);
                                {
                                    loading ? <div className="modal">
                                        <div className="loader"></div>
                                    </div> : (navigate('/admin/video-upload/addvideo'))
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

                                        <TableCell className="text-center" as="th">Status

                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-filter-select"
                                                value={statusFilter}
                                                label="status"
                                                className="status_icon"
                                                displayEmpty
                                                onChange={(e) => setStatusFilter(e.target.value)} // This should update the statusFilter state
                                            >
                                                <MenuItem value="">All</MenuItem>
                                                <MenuItem value="true">Active</MenuItem>
                                                <MenuItem value="false">Inactive</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-center" as="th">Video Preview</TableCell>
                                        <TableCell as="th">Created At
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
                                        </TableCell>
                                        <TableCell as="th">Display At
                                            <Input
                                                type="date"
                                                className="form-control"
                                                value={searchdisDate}
                                                onChange={handleDateChange2}
                                                style={{
                                                    fontSize: '12px', // Reduce font size
                                                    padding: '4px',   // Reduce padding
                                                    height: '40px',
                                                    width: '70px',   // Adjust widt
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell as="th" colSpan={3} style={{ textAlign: 'center', fontSize: '15px' }}>Activity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {finalList.map((entry, index) => (
                                        <TableRow key={entry._id}>
                                            <TableCell className='text-center'>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{entry._id}</TableCell>
                                            <TableCell>{entry.title}</TableCell>
                                            <TableCell className="text-center">
                                                {entry.status ? 'active' : 'inactive'}
                                            </TableCell>
                                            {/* <TableCell className="text-center">
                                                {entry.videoLink || entry.filePath ? (
                                                    <video width="100" height="70" controls>
                                                        <source
                                                            src={entry.videoLink || `http://localhost:5000/uploads/videos/${entry.fileName}`}
                                                            type="video/webm"
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <p>No video</p>
                                                )}
                                            </TableCell> */}
                                            <TableCell className="text-center">
                                                {entry.videoLink || entry.filePath ? (
                                                    <video width="100" height="70" controls>
                                                        <source
                                                            src={entry.videoLink || `http://localhost:5000/${entry.filePath}`}
                                                            type="video/webm"
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <p>No video</p>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {entry.createdDate && !isNaN(new Date(entry.createdDate)) ?
                                                    new Intl.DateTimeFormat('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }).format(new Date(entry.createdDate)) :
                                                    'Invalid date'}
                                            </TableCell>
                                            <TableCell>
                                                {entry.displayAt && !isNaN(new Date(entry.displayAt)) ?
                                                    new Intl.DateTimeFormat('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    }).format(new Date(entry.displayAt)) :
                                                    'Invalid date'}
                                            </TableCell>

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
                                                        onClick={() => navigate(`/admin/video-upload/update/${entry._id}`)}
                                                    >
                                                        <i
                                                            className="fa-solid fa-pen-nib fs-4"
                                                            style={{ color: '#FFD43B' }}
                                                        ></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => navigate(`/admin/video-upload/view/${entry._id}`)}
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
                </>
            }
        </>
    );
};

export default NewsList;
