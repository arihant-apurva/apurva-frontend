import React, { useState, useEffect } from "react";
import { BiCategory } from "react-icons/bi";
import { AiFillDashboard } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { LuFileType } from "react-icons/lu";
import { IoMdGlobe } from "react-icons/io";
import { FaRegFileVideo } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa";
import ApurvaHorizon from "../pages/ApurvaHorizon"
import { GoOrganization } from "react-icons/go";

import "../asset/css/common.css";

const Sidebar = ({ isActive }) => {
  const [activeItem, setActiveItem] = useState(
    localStorage.getItem("activeItem") || "dashboard"
  );

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem);
  }, [activeItem]);


  // Menu items array
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <AiFillDashboard />, link: "/admin" },
    // { id: "content-type", label: "Content-Type", icon: <LuFileType />, link: "/admin/content-type" },
    // { id: "category", label: "Category", icon: <BiCategory />, link: "/admin/category-type/list" },
    // { id: "news", label: "News", icon: <FaRegNewspaper />, link: "/admin/news/list" },
    // { id: "user", label: "User", icon: <FaRegUserCircle />, link: "#" },
    // { id: "country", label: "Country", icon: <IoMdGlobe />, link: "/admin/country-state" },
    { id: "vidupload", label: "Video-Upload", icon: <FaRegFileVideo />, link: "/admin/video-upload/list" },
    { id: "apurvaHorizon", label: "Apurva Horizon", icon: <GoOrganization/>, link: "/admin/apurva-horizon" },
    // { id: "content-type", label: "Content-Type", icon: <LuFileType />, link: "/admin/content-type" },
    // { id: "category", label: "Category", icon: <BiCategory />, link: "/admin/category-type/list" },
    // { id: "news", label: "news", icon: <FaRegUserCircle />, link: "/admin/news/list" },
    // { id: "user", label: "User", icon: <FaRegUserCircle />, link: "#" }

  ];

  return (
    <nav id="sidebar" className={`sidebar ${isActive ? "active" : "inactive"}`}>
      <div className="sidebar-content js-simplebar">
        <a className="sidebar-brand" href="/">
          <span className="align-middle">Apurva Horizon</span>
        </a>

        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
              onClick={() => setActiveItem(item.id)} // Update active state on click
            >
              <a className="sidebar-link" href={item.link}>
                <i className="align-middle">{item.icon}</i>{" "}
                <span className="align-middle">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
