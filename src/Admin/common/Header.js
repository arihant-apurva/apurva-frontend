import React, { useState } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineExpandMore } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import Notification from '../../Modules/Notification';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = function () {
    // const [sidebarOpen, setSidebarOpen] = useState(false);

    // const toggleSidebar = () => {
    //     setSidebarOpen(!sidebarOpen);
    // };

    const { setLoggedIn } = useAuth();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include", // Allows sending cookies
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful logout (e.g., redirect to login page)
                setLoggedIn(false);
                Notification.success(data.message);
                navigate("/");
            } else {
                // Handle error
                Notification.error(data.message);
            }
        } catch (error) {
            Notification.error("An error occurred. Please try again later.");
        }
    }

    return (
        <>
            {/* <Sidebar isActive={sidebarOpen} /> */}
            <nav className="navbar navbar-expand navbar-light navbar-bg">
                {/* onClick={toggleSidebar} */}
                <a className="sidebar-toggle js-sidebar-toggle"  >
                    <i className="hamburger align-self-center"></i>
                </a>
                <div className="navbar-collapse collapse">
                    <ul className="navbar-nav navbar-align">
                        <li className="nav-item dropdown">
                            <a className="nav-icon dropdown-toggle" href="#" id="alertsDropdown" data-bs-toggle="dropdown">
                                <div className="position-relative">
                                    <i className="align-middle" data-feather="bell"> <IoIosNotificationsOutline /></i>
                                    {/* <span className="indicator">  </span> */}
                                </div>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end" aria-labelledby="alertsDropdown">
                                <div className="dropdown-menu-header">
                                    4 New Notifications
                                </div>
                                <div className="list-group">
                                    <a href="#" className="list-group-item">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-2">
                                                <i className="text-danger" data-feather="alert-circle"></i>
                                            </div>
                                            <div className="col-10">
                                                <div className="text-dark">Update completed</div>
                                                <div className="text-muted small mt-1">Restart server 12 to complete the update.</div>
                                                <div className="text-muted small mt-1">30m ago</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" className="list-group-item">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-2">
                                                <i className="text-warning" data-feather="bell"></i>
                                            </div>
                                            <div className="col-10">
                                                <div className="text-dark">Lorem ipsum</div>
                                                <div className="text-muted small mt-1">Aliquam ex eros, imperdiet vulputate hendrerit et.</div>
                                                <div className="text-muted small mt-1">2h ago</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" className="list-group-item">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-2">
                                                <i className="text-primary" data-feather="home"></i>
                                            </div>
                                            <div className="col-10">
                                                <div className="text-dark">login info</div>
                                                <div className="text-muted small mt-1">Login from 192.186.1.8</div>
                                                <div className="text-muted small mt-1">5h ago</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" className="list-group-item">
                                        <div className="row g-0 align-items-center">
                                            <div className="col-2">
                                                <i className="text-success" data-feather="user-plus"></i>
                                            </div>
                                            <div className="col-10">
                                                <div className="text-dark">New connection</div>
                                                <div className="text-muted small mt-1">Christina accepted your request.</div>
                                                <div className="text-muted small mt-1">14h ago</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="dropdown-menu-footer">
                                    <a href="#" className="text-muted"><MdOutlineExpandMore /> </a>
                                </div>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                                <img src="../../avatar.jpg" className="avatar img-fluid rounded-circle me-1" ></img>
                            </a>
                            <a className="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
                                <i className="align-middle" data-feather="settings"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                                <a className="dropdown-item" href="pages-profile.html"><i className="align-middle me-1" data-feather="user"></i> <FaUserCircle />  Profile</a>
                                <a className="dropdown-item" href="#"><i className="align-middle me-1" data-feather="pie-chart"></i> <MdAnalytics />  Analytics</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="index.html"><i className="align-middle me-1" data-feather="settings"></i><IoMdSettings />  Settings</a>
                                <a className="dropdown-item" href="#"><i className="align-middle me-1" data-feather="help-circle"></i> <IoIosHelpCircleOutline />  Help Center</a>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item" href="#" onClick={logoutHandler}> <LuLogOut /> Log out</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Header;