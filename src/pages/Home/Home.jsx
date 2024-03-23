import Header from "../../components/Header/Header";
import React, {useEffect, useState} from "react"
import axios from 'axios';
import {Link, useLocation, useNavigate} from "react-router-dom";
import './Home.css';
import Swal from "sweetalert2";
import {Card} from "../../components/Card/Card";
import TotalBoardList from "../BoardList/TotalBoardList";
import DailyBoardList from "../BoardList/DailyBoardList";
import HelpBoardList from "../BoardList/HelpBoardList";


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
            default:
                return null;
        }
    };

    return (
        <div className="home-layout">
            <Header />
            <div className="home-nav-layout">
                <div className="navbar">
                    <span>
                        <ul className="nav nav-underline nav-tab">
                            <li className="nav-item">
                                <button className="nav-link" style={{color: "black"}}
                                        onClick={() => setActiveTab('total')}>전체</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" style={{color: "black"}}
                                        onClick={() => setActiveTab('daily')}>일상</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" style={{color: "black"}}
                                        onClick={() => setActiveTab('help')}>도움</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" style={{color: "black"}}>친구</button>
                            </li>
                        </ul>
                    </span>
                    <span>
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