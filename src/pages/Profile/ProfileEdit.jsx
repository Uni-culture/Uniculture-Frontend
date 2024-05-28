import Layout from "../../components/Layout";
import Sidebar from "../../components/ProfileSidebar/Sidebar";
import { useState, useEffect, useRef } from 'react';
import AddLanuageModal from "./Modal/AddLanuageModal";
import { useNavigate } from "react-router-dom";
import PercentBar from "../../components/PercentBar/PercentBar";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import styles from './ProfileEdit.module.css';
import api from "../api";

const ProfileEdit = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    // 프로필 사진
    const [profileImg, setProfileImg] = useState(null);
    const selectFile = useRef(null);

    const [inputCount, setInputCount] = useState(0); // 소개
    const purposeTag = [ // 가입 목적 태그
        "언어 교류",
        "친목",
        "문화 교류"
    ];
    const [isOverSelectedIntTags, setIsOverSelectedIntTags] = useState(false); //관심사 10개 넘는지
    const interestTag = [ // 관심사 태그
        "요리",
        "여행",
        "영화",
        "드라마",
        "애니메이션",
        "유튜브",
        "넷플릭스",
        "웹툰",
        "게임",
        "음악",
        "미술",
        "공예",
        "독서",
        "축구",
        "야구",
        "농구",
        "테니스",
        "배드민턴",
        "볼링",
        "탁구",
        "서핑",
        "스노우보드",
        "헬스",
        "명상",
        "요가",
        "필라테스",
        "과학",
        "패션",
        "메이크업",
        "헤어",
        "사진",
        "자연",
        "탐험",
        "캠핑",
        "등산",
        "재태크",
        "k-pop",
        "자원봉사",
        "사회공헌"
    ];

    const [isModalOpened1, setIsModalOpened1] = useState(false); //사용 언어 추가 모달창
    const [isModalOpened2, setIsModalOpened2] = useState(false); //학습 언어 추가 모달창

    useEffect(() => {
        fetchUserInfo();
    }, [])

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    const getUsername = () => {
        return localStorage.getItem('username'); // 로컬 스토리지에서 닉네임 가져옴
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

    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        console.log('profileEdit');
        try {
            const token = getToken(); // 토큰 가져오기
            const response = await api.get('/api/auth/member/editProfile', {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if(response.status === 200) {
                setUserInfo(response.data); // 서버에서 받은 사용자 정보 반환
                if(response.data.introduce) setInputCount(response.data.introduce.length);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    //회원정보 수정
    const changeInfo = async () => {
        console.log('changeInfo');
        if(isOverSelectedIntTags===true) {
            Swal.fire({
                title: t('changeInfo.title'),
                text: t('changeInfo.text'),
                icon: "warning",
                confirmButtonColor: "#dc3545",
                confirmButtonText: t('changeInfo.confirmButton')
            }).then(() => {
                return;
            });
        }
        else{
            try {
                const token = getToken(); // 토큰 가져오기
                const nickname = getUsername();
                const response = await api.patch(
                    '/api/auth/member/editProfile',
                    {
                        introduce: userInfo.introduce,
                        purpose: userInfo.purpose,
                        mainPurpose: userInfo.mainPurpose,
                        myHobbyList : userInfo.myHobbyList,
                        myLanguages : userInfo.myLanguages,
                        wantLanguage : userInfo.wantLanguage
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json', // JSON 형식임을 명시
                            'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                        }
                    }
                );
                alert(JSON.stringify(userInfo));
                if (response.status === 200) {
                    alert("수정완료");
                    navigate(`/profile/${nickname}`)
                }
            } catch (error) { 
                errorModal(error);
            }
        }
    };

    // 프로필 사진 변경
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        const formData = new FormData();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setProfileImg(reader.result);
            const token = getToken();
            formData.append('profileImg', file)
            event.target.value = ''; //같은 파일 올릴 수 있도록 초기화 해줌

            api.patch('/api/auth/member/editProfileImage', formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
        };
    };

    //소개 변경
    const changeIntroduce = (e) => {
        setUserInfo({...userInfo, introduce : e.target.value});
        setInputCount(e.target.value.length);
    };

    //주 가입목적
    useEffect(() => {
        if (userInfo?.purpose.length === 1) {
            setUserInfo({ ...userInfo, mainPurpose: userInfo?.purpose[0] });
        }
    }, [userInfo?.purpose]);

    const purposeTagClick = (purpose) => {
        let updatedPurpose = userInfo?.purpose || [];

        if (updatedPurpose.includes(purpose)) { // 목적이 이미 존재하는 경우 : 해당 목적 제거
            updatedPurpose = updatedPurpose.filter(item => item !== purpose);
        } else { // 선택된 목적이 포함되어 있지 않은 경우 :  해당 목적 추가
            updatedPurpose = [...updatedPurpose, purpose];
        }

        setUserInfo({ ...userInfo, purpose: updatedPurpose });
    };

    // 최종 주 목적 태그 선택 함수
    const selectFinalPurpose = (tag) => {
        setUserInfo({ ...userInfo, mainPurpose: tag });
    };

    // 관심사 변경
    const handleHobbyChange = (hobby) => {
        // updatedHobbies를 userInfo?.myHobbyList로 초기화
        let updatedHobbies = userInfo?.myHobbyList || [];

        if (updatedHobbies.includes(hobby)) {
            // 선택된 취미가 이미 존재하는 경우 : 해당 취미를 제거
            updatedHobbies = updatedHobbies.filter(item => item !== hobby);
        } else {
            // 선택된 취미가 포함되어 있지 않은 경우 :  해당 취미를 추가
            if(updatedHobbies.length <= 10) updatedHobbies = [...updatedHobbies, hobby];
        }
        // 선택된 관심사 태그 개수가 10개를 초과하는지 확인
        setIsOverSelectedIntTags(updatedHobbies.length > 10); // 10개를 넘으면 true
        // userInfo를 업데이트
        setUserInfo({ ...userInfo, myHobbyList: updatedHobbies });
    };

    // userInfo.myLanguages 업데이트
    const handleMyLanguages = (language, level) => {
        console.log(language + level);
        // userInfo 업데이트
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            myLanguages: {
                ...prevUserInfo.myLanguages,
                [language]: level
            }
        }));
    };

    // 사용 언어 삭제 함수
    const deleteMyLanguage = (language) => {
        // 삭제할 언어를 userInfo에서 제거합니다.
        const updatedMyLanguages = { ...userInfo.myLanguages };
        delete updatedMyLanguages[language];
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            myLanguages: updatedMyLanguages
        }));
    };

    // userInfo.wantLanguage 업데이트
    const handleWantLanguage = (language, level) => {
        // 언어와 퍼센트 값을 사용하여 userInfo 업데이트
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            wantLanguage: {
                ...prevUserInfo.wantLanguage,
                [language]: level
            }
        }));
    };

    // 학습 언어 삭제 함수
    const deleteWantLanguage = (language) => {
        // 삭제할 언어를 userInfo에서 제거합니다.
        const updatedWantLanguage = { ...userInfo.wantLanguage };
        delete updatedWantLanguage[language];
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            wantLanguage: updatedWantLanguage
        }));
    };

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4" style={{ overflowY: "auto" }}>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h4 className="h4">{t('profileEdit.editProfile')}</h4>
                        </div>
                        <div className="mb-3 row justify-content-center">
                            <div
                                className={styles.imageWrapper}
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                    padding: "0"
                                }}
                            >
                                <img
                                    src={profileImg ? profileImg : (userInfo?.profileurl ? userInfo.profileurl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")}
                                    className={styles.profileImage}
                                    alt="profile"
                                />

                            </div>
                        </div>
                        
                        <div className={`mb-5 ${styles.imgButton}`}>
                            <button type="button" className={styles.imgDelete} onClick={()=>{setProfileImg(null); setUserInfo({...userInfo, profileurl: null})}}>{t('profileEdit.delete')}</button>
                            <button type="file" className={styles.imgChange} accept='image/*' onClick={() => selectFile.current.click()} >{t('profileEdit.change')}</button>
                            <input
                                type="file"
                                accept='image/*'
                                style={{ display: "none" }}
                                ref={selectFile} //input에 접근 하기위해 useRef사용
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* 소개 */}
                        <div className="mb-5 row">
                            <label className={`col-sm-2 col-form-label ${styles.label}`}>{t('profileEdit.introduction')}</label>
                            <div className="col-sm-8">
                                <textarea
                                    className={`form-control ${styles.introduceTextarea}`}
                                    placeholder={t('profileEdit.enterIntroduction')}
                                    value={userInfo?.introduce || ''}
                                    onChange={changeIntroduce}
                                    maxLength="100" 
                                />
                                <div className={styles.inputCount}>
                                    <span>{inputCount}</span>
                                    <span>/100 {t('profileEdit.charLimit')}</span>
                                </div>
                            </div>
                        </div>

                        {/* 가입 목적 */}
                        <div className="mb-5 row">
                            <label className={`col-sm-2 col-form-label ${styles.label}`}>가입 목적</label>
                            <div className="col-sm-8">
                                {purposeTag.map((tag) => (
                                    <button
                                        key={tag}
                                        className={`purpose-tag ${userInfo?.purpose.includes(tag) ? 'selectedPurTag' : ''}`}
                                        onClick={() => purposeTagClick(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {userInfo?.purpose.length > 1 && (
                                    <div>
                                        <div className={styles.finalPurpose}>주 목적은 어떤 것인가요?</div>
                                        {userInfo?.purpose.map((tag) => (
                                            <button
                                                key={tag}
                                                className={`purpose-tag ${userInfo?.mainPurpose.includes(tag) ? 'selectedPurTag' : ''}`}
                                                onClick={() => selectFinalPurpose(tag)} // 선택된 태그를 다시 클릭하면 제거됨
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 관심사 */}
                        <div className="mb-5 row">
                            <label className={`col-sm-2 col-form-label ${styles.label}`}>{t('profileEdit.interests')}</label>
                            <div className="col-sm-8">
                                {interestTag.map((tag) => (
                                    <button
                                        key={tag}
                                        className={`interest-tag ${userInfo?.myHobbyList.includes(tag) ? 'selectedIntTag' : ''}`}
                                        onClick={() => handleHobbyChange(tag)}
                                    >
                                        {t(`interestTag.${tag}`)}
                                    </button>
                                ))}
                                {isOverSelectedIntTags && (
                                    <div className="interest-tag-warning">
                                        {t('profileEdit.interestsLimitWarning')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 사용 언어 */}
                        <div className="mb-2 row">
                            <label className={`col-sm-2 col-form-label ${styles.label}`}>{t('profileEdit.usedLanguages')}</label>
                            <div className="col-sm-7 col-form-label">
                                <button className={styles.languageAdd} onClick={()=>{setIsModalOpened1(true)}}>Add Language</button>
                                {isModalOpened1&&<AddLanuageModal handleModal={()=>{setIsModalOpened1(false)}} addLanguage={handleMyLanguages}/>}
                            </div>

                        </div>

                        <div className="mb-5 row">
                            {Object.entries(userInfo?.myLanguages || {}).map(([language, level]) => (
                                <div key={language} className="mb-2 row">
                                    <label className="col-sm-2"style={{minWidth: "100px"}}/>
                                    <div className="col-sm-8">
                                        <PercentBar language={language} level={level} onDelete={deleteMyLanguage} color={"blue"}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mb-2 row">
                            <label className={`col-sm-2 col-form-label ${styles.label}`}>{t('profileEdit.learningLanguages')}</label>
                            <div className="col-sm-7 col-form-label">
                                <button className={styles.languageAdd} onClick={()=>{setIsModalOpened2(true)}}>Add Language</button>
                                {isModalOpened2&&<AddLanuageModal handleModal={()=>{setIsModalOpened2(false)}} addLanguage={handleWantLanguage}/>}
                            </div>

                        </div>

                        <div className="mb-5 row">
                            {Object.entries(userInfo?.wantLanguage || {}).map(([language, level]) => (
                                <div key={language} className="mb-2 row">
                                    <label className="col-sm-2"style={{minWidth: "100px"}}/>
                                    <div className="col-sm-8">
                                        <PercentBar language={language} level={level} onDelete={deleteWantLanguage} color={"red"}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.changeButton}
                                onClick={changeInfo}
                            >
                                {t('profileEdit.editButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default ProfileEdit;