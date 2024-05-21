import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import "../PageLayout/PageLayout.css"
import Swal from "sweetalert2";
import "./Header.css";
import {IoSearch} from "react-icons/io5";
import { Badge } from "antd";
import {CaretDownOutlined} from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import { AiOutlineBell } from "react-icons/ai";
import NotificationModal from "../Notification/NotificationModal";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";
import api from "../../pages/api";

const Header = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const [isNavOpen, setNavOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const [myNotification, setMyNotification] = useState(null); //알림 개수
    const [showDetailAlert, setShowDetailAlert] = useState(false); //알림 상세보기 모달창
    const [detailNotification, setDetailNotification] = useState([]); //알림 상세내용
    const [chatCount, setChatCount] = useState(null); //안 읽은 채팅 개수

    const { t } = useTranslation();
    const [selectedLabel, setSelectedLabel] = useState(getInitialLanguageLabel()); // 선택된 언어 아이템 라벨을 저장
    const [imageSrc, setImageSrc] = useState('/translate.png'); // 초기 이미지 설정
    const [hasLanguageChanged, setHasLanguageChanged] = useState(false); // 언어 변경이 명시적으로 발생했을 때만 알림이 표시되도록 하기 위함

    // 언어 라벨 초기값 설정
    function getInitialLanguageLabel() {
        const savedLang = localStorage.getItem('i18nextLng'); // 로컬 스토리지에서 언어 설정을 가져옴
        switch(savedLang) {
            case 'ko':
                return '한국어';
            case 'en':
                return 'English';
            case 'jp':
                return '日本語';
            case 'cn':
                return '中国人';
            default:
                return '한국어'; // 기본값
        }
    }

    // 언어를 변경하는 함수
    const changeLanguage = (language) => {
        console.log("언어 변경");
        i18n.changeLanguage(language, () => {
            setHasLanguageChanged(true); // 언어가 변경되었다는 상태를 true로 설정
        });
    };

    useEffect(() => {
        loginCheck();

        const interval = setInterval(() => {
            loginCheck();
        }, 10000); // 5초마다 API 호출

        return () => clearInterval(interval); // 컴포넌트가 unmount될 때 interval을 정리
    }, []);

    /*useEffect(() => {
        interval(); // 컴포넌트가 마운트될 때 로그인 상태 확인
    }, []);*/


    const longPolling = async () => {
        while (true) {
            await loginCheck();
            // 재요청 전에 짧은 지연을 추가할 수 있습니다.
            await new Promise(resolve => setTimeout(resolve, 100000)); // 5초 후에 재요청
        }
    };

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };

    const getUsername = () => {
        console.log(localStorage.getItem('username'));
        return localStorage.getItem('username'); // 로컬 스토리지에서 닉네임 가져옴
    };

    const removeToken = () => {
        localStorage.removeItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
        localStorage.removeItem('username');
        Swal.fire({
            title: `<span style='font-size: 18px;'>${t('header.logoutMessage')}</span>`,
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

    const errorModal = (error) => {
        if(error.response.status === 401) {
            Swal.fire({
                icon: "warning",
                title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
                confirmButtonColor: "#8BC765",
                confirmButtonText: t('loginWarning.confirmButton'),
            }).then(() => {
                navigate("/sign-in");
            })
        }
        else {
            Swal.fire({
                icon: "warning",
                title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('serverError.title')}</div>`,
                confirmButtonColor: "#8BC765",
                confirmButtonText: t('serverError.confirmButton'),
            })
        }
    };

    const loginCheck = async () => {
        console.log('loginCheck');
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await api.get('/api/auth/sec/home', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setIsLogin(true);
                    getNotification();
                    getChatCount();
                }
            }
        } catch (error) {
            if(error.response.status === 401) {
                localStorage.removeItem('accessToken');
                console.log("401 오류");
            }
            else errorModal(error);
        }
    };

    //알림 개수 
    const getNotification = async () => {
        console.log('get notification count');
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await api.get('/api/auth/notification/count', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setMyNotification(response.data);
                    console.log("notification : " + response.data);
                }
            }
        } catch (error) {
            errorModal(error);
        }
    };

    //알림 내용 보기
    const getNotificationDetail = async () => {
        console.log('get notification');
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await api.get('/api/auth/notification', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setDetailNotification(response.data);
                    console.log("알림 상세보기 : " + JSON.stringify(response.data));
                }
            }
        } catch (error) {
            errorModal(error);
        }
    };

    //안 읽은 채팅 개수
    const getChatCount = async () => {
        console.log('get chat count');
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await api.get('/api/auth/chat/count', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    setChatCount(response.data);
                    console.log("chatcount : " + response.data);
                }
            }
        } catch (error) {
            errorModal(error);
        }
    };

    //알림 읽기
    const readNotification = async (id) => {
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await api.post(`/api/auth/notification/${id}`, {
                    id: id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    console.log("알림읽기 성공");
                }
            }
        } catch (error) {
            errorModal(error);
        }
    };

    //알림 모두 읽기
    const readAllNotification = async () => {
        try {
            const token = getToken(); // 토큰 가져오기
            if(token){
                const response = await api.post(`/api/auth/notification/all`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    console.log("알림 모두 읽기 성공");
                    getNotification();
                    getNotificationDetail();
                }
            }
        } catch (error) {
            errorModal(error);
        }
    };

    const handleToggle = () => {
        setNavOpen(!isNavOpen);
    };

    const activePage = (link) => {
        // if (location.pathname === link) {
        //     return 'active';
        // } else if (location.pathname.startsWith('/profile/') && link === '/friend') {
        //     return 'active';
        // } else {
        //     return '';
        // }
        if(link === '/'){
            return location.pathname === link ? 'active' : '';
        }
        return location.pathname.startsWith(link) ? 'active' : '';
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
            title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
            confirmButtonColor: "#8BC765",
            confirmButtonText: t('loginWarning.confirmButton'),
        }).then(() => {
            navigate("/sign-in", {state: {from: location.pathname}});
        });
    };

    const handleProfileURL = () => {
        if (isLogin) {
            const name = getUsername();
            const profileURL = `/profile/${name}`;
            handleNavigation(profileURL);
        } else {
            LoginWarning();
        }
    }

    const handleNavigation = (to) => {
        console.log("handleNavigation :", isLogin);
        if(isLogin) {
            if(('/profile/'+ getUsername()) === to) window.location.reload();
            else if (location.pathname === to) {
                window.location.reload();
            } 
            else{
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
            }    
        }
    };

    const navigateToSearch = () => {
        navigate("/search", { state: { from: location.pathname } });
    };

    //알림 아이콘 클릭 시 
    const handleNotification = () => {
        if(isLogin){
            getNotificationDetail(); 
            setShowDetailAlert(true); //모달창 
        }
        else {
            LoginWarning();
        }
    }

    //알림 모달창
    const handleModal = () => {
        setShowDetailAlert(!showDetailAlert);
    }

    // 언어 설정
    useEffect(() => {
        // 언어 변경이 감지되었고, 명시적인 변경이 있었을 때만 알림 표시
        if (i18n.language && hasLanguageChanged) {
            const currentItem = items.find(item => item.langCode === i18n.language);
            if (currentItem) {
                setSelectedLabel(currentItem.text);
                // 현재 언어가 한국어일 경우와 그 외 언어일 경우를 구분하여 메시지 표시
                const messageText = i18n.language === 'ko' ? `${currentItem.text} 선택` : `${t('header.select')} ${currentItem.text}`;
                message.info(messageText, 1.5);
                setHasLanguageChanged(false); // 알림 표시 후 상태 초기화
            }
        }
    }, [i18n.language, hasLanguageChanged]);

    const onClick = ({ key }) => {
        const item = items.find(item => item.key === key); // 클릭된 아이템 찾기
        changeLanguage(item.langCode); // 언어 변경
    };

    const items = [
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/korea.png" alt="korea" className="national-flag"/>
                    {t('header.한국어')}
                </div>
            ),
            text: t('header.한국어'),
            langCode: 'ko',
            key: '1',
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/USA.png" alt="united-states" className="national-flag"/>
                    {t('header.영어')}
                </div>
            ),
            text: t('header.영어'),
            langCode: 'en',
            key: '2',
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/japan.png" alt="japan" className="national-flag"/>
                    {t('header.일본어')}
                </div>
            ),
            text: t('header.일본어'),
            langCode: 'jp',
            key: '3',
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/china.png" alt="china" className="national-flag"/>
                    {t('header.중국어')}
                </div>
            ),
            text: t('header.중국어'),
            langCode: 'cn',
            key: '4',
        },
    ];

    return (
        <nav className={`navbar navbar-expand-lg`} 
            style={{ 
                // backgroundColor: '#C8DCA0',
                padding: "15px 0px", 
                // padding: "15px 0px" ,
                backgroundColor: "rgb(251 251 243)",
                borderBottom: "1px solid #d0d0d0",
                boxShadow: "rgb(0 0 0 / 15%) 0px 0px 5px"
            }}>
            <div className="container-fluid" style={{paddingLeft: "80px", paddingRight: "70px"}}>
                <div className="d-flex align-items-center">
                    <div className={`navbar-brand ${activePage("/")}`} style={{ fontFamily: "SuezOne", cursor: "pointer"}} onClick={() => handleNavigation("/")}>
                        <img src="/LogoHeart.png" alt="Logo" width="35" height="30" className="d-inline-block align-text-top"/>
                        <span style={{color:"#06AB62"}}>&nbsp;&nbsp;UniCulture</span>
                    </div>
                </div>
                <div className={`ms-auto order-lg-last`}>
                    <Dropdown menu={{ items, onClick }} className="dropdown-style">
                        <a onClick={(e) => e.preventDefault()}>
                            <Space className="custom-color" size={3}
                                   onMouseEnter={() => setImageSrc('/Gtranslate.png')} // 마우스를 올렸을 때 이미지 변경
                                   onMouseLeave={() => setImageSrc('/translate.png')} // 마우스가 떠났을 때 이미지 원상 복구
                            >
                                <img src={imageSrc} alt="translate Image" className="translateImg"/>
                                <span className="selectedLabel">{selectedLabel}</span>
                                <CaretDownOutlined className="dropdownIcon"/>
                            </Space>
                        </a>
                    </Dropdown>
                    <IoSearch className="search-icon" onClick={navigateToSearch}/>
                    <Badge className="alert-icon" count={myNotification} size="small" overflowCount={99}>
                        <AiOutlineBell onClick={handleNotification} />
                    </Badge>
                </div>
                {isLogin ? (
                    <button className={`btn nav-link order-lg-last`} onClick={removeToken} style={{ backgroundColor: "#00b943",color:"white",fontWeight:"bold", padding: "5px 15px", marginRight: "10px"}}>
                        {t(`header.로그아웃`)}
                    </button>
                ) : (
                    <>
                        <div className={`order-lg-last`}>
                            <button className={`btn nav-link`} style={{ backgroundColor: "#00b943", color:"white",fontWeight:"bold",padding: "5px 15px", marginRight: "10px" }} onClick={handleSignIn}>
                                {t(`header.로그인`)}
                            </button>
                        </div>
                        <div className={`order-lg-last`}>
                            <button className={`btn nav-link`} style={{ backgroundColor: "#00b943",color:"white",fontWeight:"bold", padding: "5px 15px", marginRight: "10px" }} onClick={handleSignUp}>
                                {t(`header.회원가입`)}
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
                            <button className={`btn nav-link ${activePage("/")}`} onClick={() => handleNavigation("/")}>{t(`header.홈`)}</button>
                        </li>
                        <li className={`nav-item ${activePage("/friend")}`}>
                            <button className={`btn nav-link ${activePage("/friend")}`} onClick={() => handleNavigation("/friend")}>{t(`header.친구`)}</button>
                        </li>
                        <li className="nav-item">
                            <button className={`btn nav-link ${activePage("/study")}`} onClick={() => handleNavigation("/study")}>{t(`header.스터디`)}</button>
                        </li>
                        <li className={`nav-item ${activePage("/chat")}`}>
                            <Badge className="chat-icon" count={chatCount} size="small" overflowCount={99}>
                                <button className={`btn nav-link ${activePage("/chat")}`} onClick={() => handleNavigation("/chat")}>{t(`header.채팅`)}</button>
                            </Badge>
                        </li>
                        <li className={`nav-item ${activePage(`/profile`)}`}>
                            <button className={`btn nav-link ${activePage("/profile")}`} onClick={() => handleProfileURL() }>{t(`header.프로필`)}</button>
                        </li>
                        <li className={`nav-item ${activePage(`/translate`)}`}>
                            <button className={`btn nav-link ${activePage("/translate")}`} onClick={() => handleNavigation(`/translate`)}>{t(`header.번역`)}</button>
                        </li>
                    </ul>
                </div>
            </div>
            {showDetailAlert && <NotificationModal handleModal={handleModal} myNotification={detailNotification} readNotification={readNotification} readAllNotification={readAllNotification} />}
        </nav>
    );
};

export default Header;