import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import axios from "axios";
import "../PageLayout/PageLayout.css"
import Swal from "sweetalert2";

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
            title: "<span style='font-size: 20px;'>로그아웃 되었습니다.</span>",
            confirmButtonColor: "#8BC765"
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
                console.log("401 오류");
            }
            // else console.error('Login Error:', error);
        }
    };

    const handleToggle = () => {
        setNavOpen(!isNavOpen);
    };

    const activePage = (link) => {
        return location.pathname === link ? 'active fw-bold' : '';
    };

    /*const NavItem = ({ to, text, activePage }) => (
        <li className={`nav-item ${activePage(to)}`}>
            <Link to={isLogin ? to : '/sign-in'} className={`nav-link ${activePage(to)}`}>{text}</Link>
        </li>
    );*/

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
        if(isLogin) {
            navigate(to);
        }
        else {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}}); // 현재 경로를 저장하고 로그인 페이지로 이동
        }
    };

    return (
            <nav className={`navbar navbar-expand-lg`} style={{ backgroundColor: '#C8DCA0' }}>
                <div className="container-fluid" style={{paddingLeft: "80px", paddingRight: "70px"}}>
                    <div className="d-flex align-items-center">
                        <Link to="/" className={`navbar-brand`} aria-current="page" style={{ fontFamily: "SuezOne"}}>
                            <img src={logoImg} alt="Logo" width="30" height="24" className="d-inline-block align-text-top"/>
                            UniCulture
                        </Link>
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
                            <li className="nav-item">
                                <Link to="/?page=0" className={`nav-link ${activePage("/")}`}>홈</Link>
                            </li>
                            <li className="nav-item">
                                <button className={`btn nav-link ${activePage("/friends")}`} onClick={() => handleNavigation("/friends")}>친구</button>
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
                        </ul>
                    </div>
                </div>
            </nav>

    );
};

export default Header;