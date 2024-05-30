import Header from "../../components/Header/Header";
import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import './Home.css';
import TotalBoardList from "../BoardList/TotalBoardList";
import { Select, Space } from 'antd';
import {useTranslation} from "react-i18next";
import ImgSlider from "./ImgSlider";
import {IoMdAlert} from "react-icons/io";

const Home = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [activeTab, setActiveTab] = useState('live'); //컴포넌트 선택
    const { t } = useTranslation();

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };

    useEffect(() => {
        const token = getToken();
        setIsLogin(!!token); // 토큰이 존재하면 true, 없으면 false로 설정
    }, []);

    useEffect(()=>{
        console.log("전환");
    },[activeTab])

    const renderActiveTabText = () => {
        switch (activeTab) {
            case 'live':
                return t('tabTexts.live');
            case 'new':
                return t('tabTexts.new');
            case 'help':
                return t('tabTexts.help');
            case 'friend':
                return t('tabTexts.friend');
            default:
                return '';
        }
    };

    return (
        <div className="home-layout">
            <Header />
            <ImgSlider />
            <div className="home-nav-layout">
                <div className="navbar">
                    <span>
                        <ul className="nav nav-underline nav-tab">
                            <li className="nav-item"> {/*실시간*/}
                                <button className={`nav-link ${activeTab === 'live' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('live')}>
                                    <img src={activeTab === 'live' ? '/uptrend_active.png' : '/uptrend.png'} alt="Trend Icon" className="nav-icon-style"/>
                                    {t(`nav.실시간`)}
                                </button>
                            </li>
                            <li className="nav-item"> {/*최신*/}
                                <button className={`nav-link ${activeTab === 'new' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('new')}>
                                    <img src={activeTab === 'new' ? '/new_active.png' : '/new.png'} alt="New Icon" className="nav-icon-style" style={{marginRight: "5px"}}/>
                                    {t(`nav.최신`)}
                                </button>
                            </li>

                            <li className="nav-item"> {/*도움*/}
                                <button className={`nav-link ${activeTab === 'help' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('help')}>
                                    <img src={activeTab === 'help' ? '/help_active.png' : '/help.png'} alt="Help Icon" className="nav-icon-style"/>
                                    {t(`nav.도움`)}
                                </button>
                            </li>
                            <li className="nav-item"> {/*피드*/}
                                <button className={`nav-link ${activeTab === 'friend' ? 'active' : ''}`} style={{color: "black"}}
                                        onClick={() => setActiveTab('friend')}>
                                    <img src={activeTab === 'friend' ? '/friend_active.png' : '/friend.png'} alt="friend Icon" className="nav-icon-style" style={{marginRight: "3px"}}/>
                                    {t(`nav.피드`)}
                                </button>
                            </li>
                        </ul>
                    </span>

                    <span>
                        {isLogin ? (
                            <button className="write-button" onClick={() => {
                                navigate("/post/new?type=post")
                            }}>
                                {t(`nav.글쓰기`)}
                            </button>
                        ) : (
                            <></>
                        )}
                    </span>
                </div>
                <div className="infoText"><IoMdAlert size={16} style={{marginBottom: '4px', marginRight: '5px'}}/>{renderActiveTabText()}</div>
            </div>
            <div className="home-content-layout">
                <TotalBoardList activeTab={activeTab}/>
            </div>
        </div>
    );
};

export default Home;