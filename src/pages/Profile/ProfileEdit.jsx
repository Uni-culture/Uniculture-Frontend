import Layout from "../../components/Layout";
import Sidebar from "../../components/ProfileSidebar/Sidebar";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import AddLanuageModal from "./Modal/AddLanuageModal";
import { useNavigate } from "react-router-dom";
import PercentBar from "../../components/PercentBar/PercentBar";
import Swal from "sweetalert2";

const ProfileEdit = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    // 프로필 사진
    const [profileImg, setProfileImg] = useState(null);
    const selectFile = useRef(null);

    // 소개
    let [inputCount, setInputCount] = useState(0);

    const [isModalOpened1, setIsModalOpened1] = useState(false); //사용 언어 추가 모달창
    const [isModalOpened2, setIsModalOpened2] = useState(false); //학습 언어 추가 모달창

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
    const [isOverSelectedIntTags, setIsOverSelectedIntTags] = useState(false);

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        console.log('profileEdit');
        try {
            const token = getToken(); // 토큰 가져오기
            const response = await axios.get('/api/auth/member/editProfile', {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if(response.status === 200) {
                setUserInfo(response.data); // 서버에서 받은 사용자 정보 반환
                if(response.data.introduce) setInputCount(response.data.introduce.length);
            }
            else if(response.status === 400) {
                console.log('클라이언트 에러(입력 형식 불량)');
            }
            else if(response.status === 500) {
                console.log('서버에러');
            }
        } catch (error) {
            navigate("/");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [])

    //회원정보 수정
    const changeInfo = async () => {
        console.log('changeInfo');
        if(isOverSelectedIntTags===true) {
            Swal.fire({
                title: "프로필 편집 오류!",
                text: "관심사를 10개 이하로 선택해주세요.",
                icon: "warning",
                confirmButtonColor: "#dc3545",
                confirmButtonText: "확인"
            }).then(() => {
                return;
            });
        }
        else{
            try {
                const token = getToken(); // 토큰 가져오기
                const response = await axios.patch(
                    '/api/auth/member/editProfile',
                    {
                        introduce: userInfo.introduce,
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
                console.log('서버 응답: ', response);
                console.log('response.status: ', response.status);
                if (response.status === 200) {
                    alert("수정 완료");
                    window.location.reload();
                }
                else if (response.status === 400) {
                    console.error("클라이언트에러");
                }
                else {
                    console.error("서버에러");
                }
            } catch (error) { // 네트워크 오류 등 예외 처리
                console.error(error);
            }
        }
    };

    //소개 변경
    const changeIntroduce = (e) => {
        setUserInfo({...userInfo, introduce : e.target.value});
        setInputCount(e.target.value.length);
    };

    // 프로필 사진 변경
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setProfileImg(reader.result);
            event.target.value = ''; //같은 파일 올릴 수 있도록 초기화 해줌
        };
    };

    // 취미 변경
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
                            <h4 className="h4">프로필 편집</h4>
                        </div>
                        <div className="mb-3 row justify-content-center">
                            <div
                                className="imageWrapper"
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
                                    alt="profile"
                                    style={{
                                        width:"100%",
                                        height: "100%",
                                        objectFit:"cover"
                                    }}
                                />

                            </div>
                        </div>
                        
                        <div className="mb-4 row justify-content-center">
                            <button type="button" style={{width:"80px", marginRight:"15px"}} onClick={()=>{setProfileImg(null); setUserInfo({...userInfo, profileurl: null})}}>삭제</button>
                            <button type="file" style={{width:"80px"}} accept='image/*' onClick={() => selectFile.current.click()} >변경</button>
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
                            <label className="col-sm-2 col-form-label" style={{minWidth: "100px"}}>소개</label>
                            <div className="col-sm-8">
                                <textarea
                                    className="form-control"
                                    placeholder="소개 입력"
                                    value={userInfo?.introduce || ''}
                                    onChange={changeIntroduce}
                                    maxLength="100" 
                                />
                                <div style={{float:"right", marginTop: "10px", marginRight: "5px"}}>
                                    <span>{inputCount}</span>
                                    <span>/100 자</span>
                                </div>
                            </div>
                        </div>

                        {/* 관심사 */}
                        <div className="mb-5 row">
                            <label className="col-sm-2 col-form-label" style={{minWidth: "100px"}}>관심사</label>
                            <div className="col-sm-8">
                                {interestTag.map((tag) => (
                                    <button
                                        key={tag}
                                        className={`interest-tag ${userInfo?.myHobbyList.includes(tag) ? 'selectedIntTag' : ''}`}
                                        onClick={() => handleHobbyChange(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {isOverSelectedIntTags && (
                                    <div className="interest-tag-warning">
                                        10개 이하로 선택해주세요.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mb-2 row">
                            <label className="col-sm-2 col-form-label" style={{minWidth: "100px"}}>사용 언어</label>
                            <div className="col-sm-7 col-form-label">
                                <button style={{borderRadius:"9px",backgroundColor:"#e9ecef", border:"0px"}} onClick={()=>{setIsModalOpened1(true)}}>Add Language</button>
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
                            <label className="col-sm-2 col-form-label" style={{minWidth: "100px"}}>학습 언어</label>
                            <div className="col-sm-7 col-form-label">
                                <button style={{borderRadius:"9px",backgroundColor:"#e9ecef", border:"0px"}} onClick={()=>{setIsModalOpened2(true)}}>Add Language</button>
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
                        <div className="row justify-content-center">
                            <button
                                type="button"
                                style={{
                                    width: "109px",
                                    height: "34px",
                                    marginBottom: "20px",
                                    borderRadius:"9px",
                                    backgroundColor:"#B7DAA1",
                                    border:"0px"
                                }}
                                onClick={changeInfo}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default ProfileEdit;