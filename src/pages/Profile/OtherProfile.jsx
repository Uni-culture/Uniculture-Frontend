import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import PercentBar from "../../components/PercentBar/PercentBar";
import { FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { PiPlusCircleBold, PiPlusCircleFill } from "react-icons/pi";
import Swal from 'sweetalert2';
import OtherBoardList from "./OtherBoardList";
import ShowAllLanguage from './Modal/ShowAllLanguage';
import OtherStudyList from "./OtherStudyList";
import {useTranslation} from "react-i18next";
import api from "../api";

export default function OtherProfile({otherInformation}) {
    const [otherInfo, setOtherInfo] = useState(otherInformation);
    const navigate = useNavigate();

    const [friendNum, setFriendNum] = useState(otherInfo?.friendnum) // 친구수락, 삭제시 친구수 관리를 위해
    const [friendStatus, setFriendStatus] = useState(otherInfo.friendstatus); // 친구사이에 따라 버튼 변경
    const [maxCanLanguage, setMaxCanLanguage] = useState(); // 능숙도가 가장 높은 사용 언어
    const [maxWantLanguage, setMaxWantLanguage] = useState(); // 능숙도가 가장 높은 학습 언어

    //언어 모달창
    const [onMouseSpan, setOnMouseSpan] = useState(false);
    const [showAllLanguage, setShowAllLanguage] = useState(false);
    const [canLanguages, setCanLanguages] = useState([]); //사용 언어 능숙도가 높은 순
    const [wantLanguages, setWantLanguages] = useState([]); //학습 언어 능숙도가 높은 순

    const [activeTab3, setActiveTab3] = useState('boardList'); //게시글, 스터디 보기
    const { t } = useTranslation();

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
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
    }

    useEffect(() => {
        // 사용 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 순으로 정렬
        const canLanguagesArray = Object.entries(otherInfo.canlanguages).map(([language, level]) => ({ language, level }));
        setCanLanguages(canLanguagesArray);
        setCanLanguages(prevCanLanguages => [...prevCanLanguages].sort((a, b) => b.level - a.level));

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 순으로 정렬
        const wantLanguagesArray = Object.entries(otherInfo.wantlanguages).map(([language, level]) => ({ language, level }));
        setWantLanguages(wantLanguagesArray);
        setWantLanguages(prevWantLanguages => [...prevWantLanguages].sort((a, b) => b.level - a.level));

        setFriendStatus(otherInfo.friendstatus);
    }, [otherInfo]);

    useEffect(() => {
        setMaxCanLanguage(canLanguages[0]);
    }, [canLanguages]);

    useEffect(() => {
        setMaxWantLanguage(wantLanguages[0]);
    }, [wantLanguages]);

    // friendStatus 상태값이 달라지면 Button 바뀜 (4개의 버튼)
    useEffect(()=>{
        friendButton();
    },[friendStatus])

    // 주의점 1번(친구삭제), 4번(친구수락)시 상대의 친구수가 변해야됨 ==> 리렌더링 필요
    const friendButton = () => {
        switch (friendStatus){
            case 1 :
                return (
                    <button
                        className={styles.buttonStyle}
                        onClick={deleteFriend}
                    >{t('profile.removeFriend')}</button>
                );

            case 2 :
                return (
                    <button
                        className={styles.buttonStyle}
                        onClick={sendFriendRequest}
                    >{t('profile.addFriend')}</button>
                );

            case 3 :
                return (
                    <button
                        className={styles.buttonStyle}
                        onClick={cancelRequest}
                    >{t('profile.cancelRequest')}</button>
                );
            case 4 :
                return (
                    <button
                        className={styles.buttonStyle}
                        onClick={acceptReceivedRequest}
                    >{t('profile.acceptFriend')}</button>
                );
            default:
                return ;
        }
    };

    //친구 신청
    const sendFriendRequest = async () => {
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await api.post('/api/auth/friend-requests', {
                targetId: otherInfo.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if(response.status === 200){
                Swal.fire({
                    icon: "success",
                    title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('friendSuccess.title')}</div>`,
                    confirmButtonColor: "#8BC765",
                    confirmButtonText: t('friendSuccess.confirmButton'),
                });
                setFriendStatus(3); //친구 신청 중으로 변경
            }
        } catch (error) {
            errorModal(error);
        }
    }

    // 친구 삭제
    const deleteFriend = () => {
        Swal.fire({
            title: t('friendDelete.title'),
            text: t('friendDelete.text'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: t('friendDelete.deleteButton'),
            cancelButtonText: t('friendDelete.cancelButton')
        }).then(async (result) => { // async 키워드를 사용하여 비동기 함수로 변환
            if (result.isConfirmed) {
                try {
                    const token = getToken();

                    const response = await api.delete('/api/auth/friend', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            targetId: otherInfo.id
                        }
                    });
                    
                    if(response.status === 200){
                        setFriendStatus(2);
                        setFriendNum(friendNum-1);
                    }
                } catch (error) {
                    errorModal(error);
                }      
            }
        });
    };


    // 보낸 친구 신청 취소
    const  cancelRequest = async () => {
        try {
            const token = getToken();

            const response = await api.delete('/api/auth/friend-requests', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    targetId: otherInfo.id
                }
            });
            
            if(response.status === 200){
                setFriendStatus(2); 
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 친구 신청 받기
    const  acceptReceivedRequest = async () => {
        try {
            const token = getToken();

            const response = await api.put(`/api/auth/friend-requests/${otherInfo.id}`, {
                status: 'accepted'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setFriendStatus(1); //친구 상태로 변경
                setFriendNum(friendNum+1);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    //채팅 보내기
    const sendMessage = async () => {
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await api.get(`/api/auth/room/duo?toId=${otherInfo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200){
                console.log(response);
                navigate(`/chat/${response.data.chatRoomId}`);
            }
        } catch (error) {
            errorModal(error);
        }
    }

    // 게시물, 스터디
    const renderTabContent3 = () => {
        switch (activeTab3) {
            case 'boardList':
                return (
                    <div className={styles.boardStyle}>
                        <OtherBoardList memberId={otherInfo.id} />
                    </div>
                );
            case 'studyList':
                return (
                    <div style={{marginTop: "30px"}}>
                        <OtherStudyList memberId={otherInfo.id}/>
                    </div>
                );
            default:
                return ;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                {/* 프로필 사진 */}
                <div className={styles.imageWrapper}>
                    <div className={styles.profileImageWrapper}>
                        <img
                            src={otherInfo?.profileurl ? otherInfo.profileurl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                            alt="profile"
                            className={styles.image}
                        />
                    </div>
                    
                    <div className={styles.countryImageWrapper}>
                        <img className={styles.country} alt='country' src={`/${otherInfo.country}.png`} />
                    </div>
                </div>

                <div className={styles.info}>
                    <div className={styles.name}>
                        {otherInfo?.nickname}
                        {/* 친구 걸기/채팅 보내기 */}
                        {friendButton()}
                        <button
                            className={styles.buttonStyle}
                            style={{marginLeft: "10px"}}
                            onClick={sendMessage}
                        >{t('profile.sendMessage')}</button>
                    </div>
            
                    {/* 소개 */}
                    {otherInfo?.introduce && <div className={styles.intro}>{otherInfo.introduce}</div>}

                    {/* 게시글, 친구 */}
                    <div className={styles.count}>
                        <div className={styles.post}>{t('profile.posts')}</div>
                        <div className={styles.postNum}>{otherInfo?.postnum}</div>
                        <div className={styles.friend}>{t('profile.friends')}</div>
                        <div className={styles.friendNum}>{friendNum}</div>
                    </div>

                    {/* 언어 */}
                    {(maxCanLanguage || maxWantLanguage) &&
                        <div className={styles.language}>
                            {maxCanLanguage && <PercentBar language={maxCanLanguage.language} level={maxCanLanguage.level} color={"blue"}/>}
                            {maxCanLanguage && maxWantLanguage && <div style={{ marginLeft : "20px", marginRight : "20px" }}><FaExchangeAlt /></div>}
                            {maxWantLanguage && <PercentBar language={maxWantLanguage.language} level={maxWantLanguage.level} color={"red"}/>}
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
                        {otherInfo.hobbies && otherInfo.hobbies.map((hobby, index) => (
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
                        <button className={`nav-link ${activeTab3 === 'boardList' ? 'active' : ''}`} style={{color: "black"}}
                                onClick={() => setActiveTab3('boardList')}>{t('profile.게시물')}</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab3 === 'studyList' ? 'active' : ''}`} style={{color: "black"}}
                                onClick={() => setActiveTab3('studyList')}>{t('profile.스터디')}</button>
                    </li>
                </ul>
        
                {renderTabContent3()}
            </div>

            {/* 전체 사용, 학습 언어 보기 모달창 */}
            {showAllLanguage && (
                <ShowAllLanguage  canLanguages={canLanguages} wantLanguages={wantLanguages} showAllLanguage={()=>setShowAllLanguage(false)}/>
            )}
        </div>
    );
};
