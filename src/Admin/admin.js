import './asset/css/app.css';
import Sidebar from './common/Sidebar';
import Footer from './common/Footer';
import Header from './common/Header';
import Notification from '../Modules/Notification';
import { ToastContainer } from 'react-toastify';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { List } from '@mui/material';
import Add from './content-type/Add';
function Admin() {
    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main">
                <Header />
                <main className="content">
                    {/* <h1> admin page </h1> */}
                    <ToastContainer />
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Admin;