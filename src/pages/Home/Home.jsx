import Header from "../../components/Header/Header";
import React, {useEffect, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom";
import './Home.css';
import TotalBoardList from "../BoardList/TotalBoardList";
import DailyBoardList from "../BoardList/DailyBoardList";
import HelpBoardList from "../BoardList/HelpBoardList";
import FriendBoardList from "../BoardList/FriendBoardList";
import { IoSearch } from "react-icons/io5";


const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(false);
    const [activeTab, setActiveTab] = useState('total'); //컴포넌트 선택

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };

    useEffect(() => {
        const token = getToken();
        setIsLogin(!!token); // 토큰이 존재하면 true, 없으면 false로 설정
    }, []);

    // 전체/일상/도움 선택
    const renderTabContent = () => {
        switch (activeTab) {
            case 'total':
                return (
                    <div>
                        <TotalBoardList />
                    </div>
                );
            case 'daily':
                return (
                    <div>
                        <DailyBoardList />
                    </div>
                );
            case 'help':
                return (
                    <div>
                        <HelpBoardList />
                    </div>
                );
            case 'friend':
                return (
                    <div>
                        <FriendBoardList/>
                    </div>
                )
            default:
                return null;
        }
    };

    const navigateToSearch = () => {
        navigate("/search", { state: { from: location.pathname } });
    };

    return (
        <div className="home-layout">
            <Header />
            <div className="home-nav-layout">
                <div className="navbar">
                    <span>
                        <ul className="nav nav-underline nav-tab">
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'total' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('total')}>전체</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('daily')}>일상</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'help' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('help')}>도움</button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === 'friend' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('friend')}>친구</button>
                            </li>
                        </ul>
                    </span>
                    <span>
                        <IoSearch className="search-icon" onClick={navigateToSearch}/>
                        {isLogin ? (
                            <button className="write-button" onClick={() => {
                                navigate("/add-board", {state : {from : location.pathname}});
                            }}>
                                글쓰기
                            </button>
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
            </div>
            <div className="home-content-layout">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Home;