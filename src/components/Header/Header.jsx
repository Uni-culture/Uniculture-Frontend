import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import axios from "axios";
import "../PageLayout/PageLayout.css"
import Swal from "sweetalert2";
import "./Header.css";
import {IoSearch} from "react-icons/io5";

const Header = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const [isNavOpen, setNavOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        loginCheck(); // 컴포넌트가 마운트될 때 로그인 상태 확인
    }, []);

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };

    const removeToken = () => {
        localStorage.removeItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
        Swal.fire({
            title: "<span style='font-size: 18px;'>로그아웃 되었습니다.</span>",
            confirmButtonColor: "#8BC765",
            customClass: {
                popup: 'custom-logout-popup',
                confirmButton: 'custom-logout-button',
                title: 'custom-logout-title'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload(); // 페이지 새로고침
            }
        });
        setIsLogin(false);
    };

    const loginCheck = async () => {
        console.log('loginCheck');
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await axios.get('/api/auth/sec/home', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setIsLogin(true);
                }
            }
        } catch (error) {
            if(error.response.status === 401) {
                localStorage.removeItem('accessToken');
                console.log("401 오류");
            }
            // else console.error('Login Error:', error);
        }
    };

    const handleToggle = () => {
        setNavOpen(!isNavOpen);
    };

    const activePage = (link) => {
        if (location.pathname === link) {
            return 'active';
        } else if (location.pathname.startsWith('/profile/') && link === '/friend') {
            return 'active';
        } else {
            return '';
        }

    };

    const handleSignUp = () => {
        navigate("/sign-up", { state: { from: location.pathname } }); // 현재 경로를 저장하고 회원가입 페이지로 이동
    };

    const handleSignIn = () => {
        navigate("/sign-in", { state: { from: location.pathname } }); // 현재 경로를 저장하고 로그인 페이지로 이동
    };

    const LoginWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "<div style='font-size: 21px; margin-bottom: 10px;'>로그인 후 이용해 주세요.</div>",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    const handleNavigation = (to) => {
        console.log("handleNavigation :", isLogin);
        if(isLogin) {
            if (location.pathname === to) {
                window.location.reload();
            } else{
                navigate(to);
            }

        }
        else {
            if(to==='/') { // to가 이동할 경로
                if (location.pathname === to) { // 현재 경로와 to가 같을 때
                    window.location.reload();
                } else{ // 현재 주소가 /가 아닐 때
                    navigate(to);
                }
            }
            else if(to==='/translate') navigate(to); // 로그인x 번역페이지 이동
            else{
                LoginWarning();
                navigate("/sign-in", {state: {from: location.pathname}}); // 현재 경로를 저장하고 로그인 페이지로 이동
        
            }    
        }
    };

    const navigateToSearch = () => {
        navigate("/search", { state: { from: location.pathname } });
    };

    return (
            <nav className={`navbar navbar-expand-lg`} style={{ backgroundColor: '#C8DCA0' }}>
                <div className="container-fluid" style={{paddingLeft: "80px", paddingRight: "70px"}}>
                    <div className="d-flex align-items-center">
                        <div className={`navbar-brand ${activePage("/")}`} style={{ fontFamily: "SuezOne", cursor: "pointer"}} onClick={() => handleNavigation("/")}>
                            <img src={logoImg} alt="Logo" width="30" height="24" className="d-inline-block align-text-top"/>
                            UniCulture
                        </div>
                    </div>
                    <div className={`ms-auto order-lg-last`}>
                        <IoSearch className="search-icon" onClick={navigateToSearch}/>
                    </div>
                    {isLogin ? (
                        <button className={`btn nav-link ms-auto order-lg-last`} onClick={removeToken} style={{ backgroundColor: "#B3C693", padding: "5px 15px", marginRight: "10px"}}>
                            로그아웃
                        </button>
                    ) : (
                        <>
                            <div className={`ms-auto order-lg-last`}>
                                <button className={`btn nav-link`} style={{ backgroundColor: "#B3C693", padding: "5px 15px", marginRight: "10px" }} onClick={handleSignIn}>
                                    로그인
                                </button>
                            </div>
                            <div className={`order-lg-last`}>
                                <button className={`btn nav-link`} style={{ backgroundColor: "#B3C693", padding: "5px 15px", marginRight: "10px" }} onClick={handleSignUp}>
                                    회원가입
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isNavOpen ? 'true' : 'false'}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav">
                            <li className={`nav-item ${activePage("/")}`}>
                                <button className={`btn nav-link ${activePage("/")}`} onClick={() => handleNavigation("/")}>홈</button>
                            </li>
                            <li className={`nav-item ${activePage("/friend")}`}>
                                <button className={`btn nav-link ${activePage("/friend")}`} onClick={() => handleNavigation("/friend")}>친구</button>
                            </li>
                            <li className="nav-item">
                                <button className={`btn nav-link ${activePage("/study")}`} onClick={() => handleNavigation("/study")}>스터디</button>
                            </li>
                            <li className={`nav-item ${activePage("/chat")}`}>
                                <button className={`btn nav-link ${activePage("/chat")}`} onClick={() => handleNavigation("/chat")}>채팅</button>
                            </li>
                            <li className={`nav-item ${activePage(`/profile`)}`}>
                                <button className={`btn nav-link ${activePage("/profile")}`} onClick={() => handleNavigation(`/profile`)}>프로필</button>
                            </li>
                            <li className={`nav-item ${activePage(`/translate`)}`}>
                                <button className={`btn nav-link ${activePage("/translate")}`} onClick={() => handleNavigation(`/translate`)}>번역</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

    );
};

export default Header;