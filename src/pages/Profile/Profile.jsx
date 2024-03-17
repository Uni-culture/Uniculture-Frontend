import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";

const Profile = () => {
    const { nickname } = useParams();
    const [myProfile, setMyProfile] = useState(false);
    const [myInfo, setMyInfo] = useState(null);
    const [otherInfo, setOtherInfo] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const navigate = useNavigate();

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        try {
            const token = getToken(); // 토큰 가져오기

            if(token){ //로그인 O
                const response = await axios.get('/api/auth/member/myPage', {
                    headers: {
                        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                    }
                });
    
                const response2 = await axios.get(`/api/member/otherPage/${nickname}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                    }
                });

                if (response.status === 200) {
                    if(nickname === response.data.nickname){
                        setMyInfo(response.data);
                        setMyProfile(true); //내 프로필 보여주기
                    }
                    else if (nickname !== response.data.nickname){
                        setMyInfo(response.data);
                        setOtherInfo(response2.data);
                        setMyProfile(false); //다른 사람 프로필 보여주기

                        setFriendStatus(response2.data.friendstatus);
                    }
                }
            }
            else { //로그인 X
                const response = await axios.get(`/api/member/otherPage/${nickname}`);

                if (response.status === 200) {
                    setOtherInfo(response.data);
                    setMyProfile(false); //다른 사람 프로필 보여주기

                    setFriendStatus(response.data.friendstatus);
                }
            }
            
        } catch (error) {
            navigate("/");
            console.error('사용자 정보를 가져오는 도중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    },[nickname]);

    const handleInfo = () => {
        fetchUserInfo();
    }

    return (
        <>
            {myProfile ? <MyProfile myInformation={myInfo} handleInfo={handleInfo} /> : (otherInfo && <OtherProfile myInformation={myInfo} otherInformation={otherInfo} handleInfo={handleInfo} friendstatus={friendStatus} />)}
        </>
    );
};

export default Profile;
