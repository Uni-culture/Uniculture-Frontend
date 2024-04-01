import {IoArrowBack} from "react-icons/io5";
import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Header from "../../components/Header/Header";
import "../Search/search.css";
import { IoSearch } from "react-icons/io5";

const Search = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const [search, setSearch] = useState("");

    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
        console.log("이전 경로 : ", previousPath);
        navigate(previousPath); // 이전 페이지로 이동
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    return (
        <div style={{ backgroundColor: '#FBFBF3', minHeight: '100vh' }}>
            <Header />
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={goBackToPreviousPath}/>
            <div className="search-layout">
                <div className="searchWrap">
                    <IoSearch className="input-icon" />
                    <input className="search-bar" type="text" value={search} onChange={handleSearchChange} placeholder="검색어를 입력하세요"/>
                </div>
            </div>
        </div>
    )
}

export default Search;