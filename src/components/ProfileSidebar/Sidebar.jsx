import React from 'react'
import {Link, useLocation, useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                <NavItem to="/account/edit" text={t('Sidebar.editProfile')} />
                <NavItem to="/account/personal-info" text={t('Sidebar.personalInfo')} />
                <NavItem to="/account/delete" text={t('Sidebar.deleteAccount')} />
            </ul>
        </div>
    );
};

export default Sidebar;