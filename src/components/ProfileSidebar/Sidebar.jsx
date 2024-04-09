import React from 'react'
import {Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const activePage = (link) => {
        return location.pathname === link ? "nav-link active" : "nav-link link-dark";
    };

    const NavItem = ({ to, text }) => (
        <li>
            <Link to={to} className={`${activePage(to)}`}>{text}</Link>
        </li>
    );

    const goBack = () => {
        navigate(-1);
    };
    
    return (
        <div className="col-md-3 col-lg-2 d-flex flex-column flex-shrink-0 p-3" style={{ backgroundColor: "#FBFBF3" }}>
            <span className="fs-4" onClick={goBack}>←</span>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <NavItem to="/account/edit" text="프로필 편집" />
                <NavItem to="/account/personal-info" text="개인정보" />
                <NavItem to="/account/delete" text="계정 탈퇴" />
            </ul>
        </div>
    );
};

export default Sidebar;