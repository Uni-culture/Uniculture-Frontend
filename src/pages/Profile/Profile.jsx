import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";
import Layout from "../../components/Layout";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../api";

const Profile = () => {
    const { t } = useTranslation();
    const { nickname } = useParams(); // 타인 조회를 위한 url param
    const [myProfile, setMyProfile] = useState(false); // 내 프로필인지 확인해주는 State (True, False)
    const [myInfo, setMyInfo] = useState(null); // 나의 정보가 들어가는 State
    const [otherInfo, setOtherInfo] = useState(null); // 상대의 정보가 들어가는 State
    const navigate = useNavigate(); // 함수안에서 조건에따라 화면이동이 필요한경우 사용(Link 와 차이점을 알필요 있음)

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

    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        try {
            const token = getToken(); // 토큰 가져오기

            if(token){ //로그인 O

                console.log("로그인 O일때 조회하는 경우");
                console.log(nickname);

                if(!nickname){
                    console.log("닉네임 매개변수 없음 -> 자신조회");
                    const response = await api.get('/api/auth/member/myPage', {
                        headers: {
                            Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                        }
                    })
                    console.log(response);
                    if(response.status === 200){ // 자기 프로필 조회가 성공했을경우
                        setMyInfo(response.data);
                        setMyProfile(true);
                    }
                }
                else{
                    console.log("닉네임 매개변수 있음 -> 상대조회");
                    const response = await api.get(`/api/member/otherPage/${nickname}`,{
                        headers: {
                            Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                        }
                    });
                    console.log(response);
                    if(response.status === 200){ // 상대 프로필 조회한것
                        setOtherInfo(response.data);
                        setMyProfile(false);
                    }
                    else if(response.status === 202){
                        setMyInfo(response.data);
                        setMyProfile(true);
                    }
                }
            }
            else { //로그인 X
                console.log("로그인 X일때 조회하는 경우");

                const response = await api.get(`/api/member/otherPage/${nickname}`);

                if (response.status === 200) {
                    setOtherInfo(response.data);
                    setMyProfile(false); //다른 사람 프로필 보여주기
                }
            }

        } catch (error) {
            errorModal(error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    },[nickname]);

    return (
        <Layout>
           {myProfile ? <MyProfile myInfo={myInfo} /> : (otherInfo && <OtherProfile myInformation={myInfo} otherInformation={otherInfo} />)} 
        </Layout>
    );
};

export default Profile;
