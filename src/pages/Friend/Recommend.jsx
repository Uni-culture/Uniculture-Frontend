import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdAlert } from "react-icons/io";
import styles from './Recommend.module.css';
import RecommendFriendCard from './components/RecommendFriendCard';
import presentImg from '../../assets/presentImg.png';
import openImg from '../../assets/openimg.png'
import {useTranslation} from "react-i18next";

export default function Recommend({recommendFriendList, sendMessage}) {
    const { t } = useTranslation();
    const [showPresent, setShowpresent] = useState(null); //모든 추천친구 isOpen === false인지 아닌지
    const [presentOpen, setPresentOpen] = useState(false); //선물상자를 열었는지 아닌지
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 여부를 저장하는 상태

    useEffect(() => {
        setPresentOpen(false);
        // 모든 추천 친구의 isOpen 속성이 false인지 확인
        const allClosed = recommendFriendList.every(friend => !friend.isOpen);
        if (allClosed) {
            setShowpresent(false);
            setPresentOpen(false);
            console.log("showPresent === false");
        }
        else { 
            setShowpresent(true); 
            console.log("showPresent === true");
        }
    }, [recommendFriendList])

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    //친구 신청
    const sendFriendRequest = async (userInfo) => {
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await axios.post('/api/auth/friend-requests', {
                targetId: userInfo.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });

            if(response.status === 200){
                alert("친구 신청 성공");
                console.log(userInfo.nickname + "님에게 친구 신청");
            }
            else if(response.status === 400){
                console.log("친구 신청 클라이언트 에러");
            }
            else if(response.status === 500){
                console.log("친구 신청 서버 에러");
            }
        } catch (error) {
            console.error('친구 걸기 오류 발생:', error);
        }
    }

    const handlePresentImg = () => { // presentImg를 클릭하면 2초 후에 openImg 이미지로 변경
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            setPresentOpen(true);
            setTimeout(() => {
                setShowpresent(true);
            }, 500);
        }, 1000);
    };
    
    return (
        <>
            <div style={{marginBottom: "30px", fontSize: "14px", fontWeight: "bold"}}> <IoMdAlert size={20}/> 다음은 회원 정보를 바탕으로 추출된 빅데이터 기반 추천 친구 목록입니다.</div>
            {showPresent ? (
                <div>
                    {recommendFriendList.length > 0 ? (
                        <div className={styles.recommend}>
                            {recommendFriendList.map((friend) => (
                                <div key={friend.id} style={{ marginBottom: "20px" }}>
                                    <RecommendFriendCard key={friend.id} userInfo={friend} sendFriendRequest={sendFriendRequest} sendMessage={sendMessage}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p>{t('friend.noRecommendedFriends')}</p>
                            <p>{t('friend.moreInputPrompt')}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.presentImg}>
                    {presentOpen ? (
                        <img
                            className={styles.img}
                            alt='openimg'
                            src={openImg}
                        />
                    ) : (
                        <img
                            className={isAnimating ? `${styles.img} ${styles.vibration}` : `${styles.img}`}
                            alt='presentimg'
                            src={presentImg}
                            onClick={handlePresentImg}
                        />
                    )}
                </div>
            )}
            
        </>
    )
}
