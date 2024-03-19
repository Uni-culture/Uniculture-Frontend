import Header from "../../components/Header/Header";
import React, {useEffect, useState} from "react"
import axios from 'axios';
import {Link, useLocation, useNavigate} from "react-router-dom";
import './Home.css';
import Swal from "sweetalert2";
import {Card} from "../../components/Card/Card";
import BoardList from "../BoardList/BoardList";


const Home = () => {
    const [isLogin, setIsLogin] = useState(false);

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };

    useEffect(() => {
        const token = getToken();
        setIsLogin(!!token); // 토큰이 존재하면 true, 없으면 false로 설정
    }, []);

    return (
        <div className="home-layout">
            <Header />
            <div className="home-nav-layout">
                <div className="navbar">
                    <span>
                        <ul className="nav nav-underline nav-tab">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="#" style={{color: "black"}}>전체</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#" style={{color: "black"}}>일상</Link>
                            </li>
                            <li className="nav-item">
                                <Link class="nav-link" to="#" style={{color: "black"}}>도움</Link>
                            </li>
                            <li className="nav-item">
                                <Link class="nav-link" to="#" style={{color: "black"}}>친구</Link>
                            </li>
                        </ul>
                    </span>
                    <span>
                        {isLogin ? (
                            <button className="write-button">
                                <Link to="/add-board" className="write-link">글쓰기</Link>
                            </button>
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
            </div>
            <div className="home-content-layout">
                <BoardList />
            </div>
        </div>
    );
};

export default Home;