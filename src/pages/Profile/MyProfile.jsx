import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AiOutlineBell } from "react-icons/ai";
import { Badge} from "antd";
import styles from './Profile.module.css';
import PercentBar from "../../components/PercentBar/PercentBar";
import { PiPlusCircleBold, PiPlusCircleFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { FaExchangeAlt } from "react-icons/fa";
import MyBoardList from "./MyBoardList";
import ShowAllLanguage from './Modal/ShowAllLanguage';
import MyStudyList from "./MyStudyList";
import RequestModal from '../../components/Friend/RequestModal';
import {useTranslation} from "react-i18next";

export default function MyProfile({myInfo}) {
    const navigate = useNavigate();
    const [friendNum, setFriendNum] = useState(myInfo.friendnum) // 친구 수 (친구수락, 삭제시 친구수 관리를 위해)
    const [receivedRequestsNum, setReceivedRequestsNum] = useState(myInfo.receiverequestnum); //받은 친구 신청 수
    const [maxCanLanguage, setMaxCanLanguage] = useState(); // 능숙도가 가장 높은 사용 언어
    const [maxWantLanguage, setMaxWantLanguage] = useState(); // 능숙도가 가장 높은 학습 언어

    //친구 모달창
    const [showFriendModal, setShowFriendModal] = useState(false); //친구 모달창
    const [showFriend, setShowFriend] = useState(false); //친구리스트 보기

    //언어 모달창
    const [onMouseSpan, setOnMouseSpan] = useState(false);
    const [showAllLanguage, setShowAllLanguage] = useState(false);
    const [canLanguages, setCanLanguages] = useState([]); //사용 언어 능숙도가 높은 순
    const [wantLanguages, setWantLanguages] = useState([]); //학습 언어 능숙도가 높은 순

    const [activeTab, setActiveTab] = useState('boardList'); //게시글, 스터디 보기
    const { t } = useTranslation();

    useEffect(() => {
        // 사용 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 순으로 정렬
        const canLanguagesArray = Object.entries(myInfo.canlanguages).map(([language, level]) => ({ language, level }));
        setCanLanguages(canLanguagesArray);
        setCanLanguages(prevCanLanguages => [...prevCanLanguages].sort((a, b) => b.level - a.level));

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 순으로 정렬
        const wantLanguagesArray = Object.entries(myInfo.wantlanguages).map(([language, level]) => ({ language, level }));
        setWantLanguages(wantLanguagesArray);
        setWantLanguages(prevWantLanguages => [...prevWantLanguages].sort((a, b) => b.level - a.level));  
    }, [myInfo]);

    useEffect(() => {
        setMaxCanLanguage(canLanguages[0]);
    }, [canLanguages]);
    
    useEffect(() => {
        setMaxWantLanguage(wantLanguages[0]);
    }, [wantLanguages]);


    // 게시물, 스터디
    const renderTabContent = () => {
        switch (activeTab) {
            case 'boardList':
                return (
                    <div className={styles.boardStyle}>
                        <MyBoardList />
                    </div>
                );
            case 'studyList':
                return (
                    <div style={{marginTop: "30px"}}>
                        <MyStudyList />
                    </div>
                );
            default:
                return ;
        }
    };

    const handleReceivedRequestsNum = (type) => {
        if(type === "add") setReceivedRequestsNum(receivedRequestsNum + 1);
        else if( type === "subtract") setReceivedRequestsNum(receivedRequestsNum - 1);
    }

    const handleFriendNum = (type) => {
        if(type === "add") setFriendNum(friendNum + 1);
        else if( type === "subtract") setFriendNum(friendNum - 1);
    }

    useEffect(() => {
        if(!showFriendModal) {
            setShowFriend(false);
        }
    }, [showFriendModal])

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                {/* 프로필 사진 */}
                <div className={styles.imageWrapper}>
                    <div className={styles.profileImageWrapper}>
                        <img
                            src={myInfo?.profileurl ? myInfo.profileurl : "/default_profile_image.png"}
                            alt="profile"
                            className={styles.image}
                        />
                    </div>

                    <div className={styles.countryImageWrapper}>
                        <img className={styles.country} alt='country' src={`/${myInfo.country}.png`} />
                    </div>
                </div>

                <div className={styles.info}>
                    <div className={styles.name}>
                        {myInfo?.nickname}
                        <span className={styles.nameSpan} onClick={()=> {navigate('/account/edit')}}><IoIosSettings size={20} color="gray" /></span>
                    </div>
                        
                    {/* 소개 */}
                    {myInfo?.introduce && <div className={styles.intro}>{myInfo.introduce}</div>}

                    {/* 게시글, 친구 */}
                    <div className={styles.count}>
                        <div className={styles.post}>{t('profile.posts')}</div>
                        <div className={styles.postNum}>{myInfo?.postnum}</div>
                        {/* 친구, 친구수중 아무거나 클릭하더라도 setShowFriend state 를 변경시켜서 모달창을띄움(useEffect 에 showfriend 가 걸려있기때문에 리렌더링) */}
                        <div className={styles.friend} onClick={()=> {setShowFriend(true); setShowFriendModal(true);}}>{t('profile.friends')}</div>
                        <div className={styles.friendNum} onClick={()=> {setShowFriend(true); setShowFriendModal(true);}}>{friendNum}</div>
                        <Badge count={receivedRequestsNum} size="small" overflowCount={10}>
                            <AiOutlineBell size={20} onClick={() => {
                                setShowFriendModal(true);
                            }}/>
                        </Badge>
                    </div>

                    {/* 언어 */}
                    {(maxCanLanguage || maxWantLanguage) &&
                        <div className={styles.language}>
                            {maxCanLanguage && <div><PercentBar language={maxCanLanguage.language} level={maxCanLanguage.level} color={"blue"} /></div>}
                            {maxCanLanguage && maxWantLanguage && <div style={{ marginLeft : "20px", marginRight : "20px" }}><FaExchangeAlt /></div>}
                            {maxWantLanguage && <div><PercentBar language={maxWantLanguage.language} level={maxWantLanguage.level} color={"red"} /></div>}
                            <span
                                style={{marginLeft: "10px"}}
                                onClick={()=> setShowAllLanguage(true)}
                                onMouseEnter={()=> setOnMouseSpan(true)}                                
                                onMouseLeave={()=> setOnMouseSpan(false)}
                            >
                                {onMouseSpan ? <PiPlusCircleFill size={20}/> : <PiPlusCircleBold size={20}/>}
                            </span>
                        </div>
                    }

                    {/* 취미 */}
                    <div className={styles.hobby}>
                        {myInfo.hobbies && myInfo.hobbies.map((hobby, index) => (
                            <div
                                className={styles.hbTag}
                                key={index}
                            >
                                # {t(`interestTag.${hobby}`)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <ul className="nav nav-underline nav-tab">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'boardList' ? 'active' : ''}`} style={{color: "black"}}
                                onClick={() => setActiveTab('boardList')}>{t('profile.게시물')}</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'studyList' ? 'active' : ''}`} style={{color: "black"}}
                                onClick={() => setActiveTab('studyList')}>{t('profile.스터디')}</button>
                    </li>
                </ul>
        
                {renderTabContent()}
            </div>

            {/* 친구리스트 모달창 */}
            {showFriendModal && (
                showFriend ? (
                    <RequestModal modal={setShowFriendModal} handleReceivedRequestsNum={handleReceivedRequestsNum} handleFriendNum={handleFriendNum} type="showFriendList" />
                ) : (
                    <RequestModal modal={setShowFriendModal} handleReceivedRequestsNum={handleReceivedRequestsNum} handleFriendNum={handleFriendNum} type="includeFriendList" />
            ))}

            {/* 전체 사용, 학습 언어 보기 모달창 */}
            {showAllLanguage && (
                <ShowAllLanguage  canLanguages={canLanguages} wantLanguages={wantLanguages} showAllLanguage={()=>setShowAllLanguage(false)}/>
            )}

        </div>
    );
};
