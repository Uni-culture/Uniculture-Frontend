import Swal from "sweetalert2";
import Layout from "../../components/Layout";
import Sidebar from "../../components/ProfileSidebar/Sidebar";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import api from "../api";

const ProfileInfo = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [userInfo, setUserInfo] = useState(null);
    const [originalNickname, setOriginalNickname] = useState(null);

    const [nickNameValid, setNickNameValid] = useState(null);
    const [pwValid, setPwValid] = useState(false);

    const [exPassword, setExPassword] = useState(''); //현재 비밀번호
    const [showExPassword, setShowExPassword] = useState(false) //현재 비밀번호 보기
    const [newPassword, setNewPassword] = useState(''); //새 비밀번호
    const [showNewPassword, setShowNewPassword] = useState(false) //새 비밀번호 보기
    const [checkPassword, setCheckPassword] = useState(''); //확인 비밀번호
    const [showCheckPassword, setShowCheckPassword] = useState(false) //확인 비밀번호 보기

    const [country, setCountry] = useState(""); // 국적

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [age, setAge] = useState(null); // 선택한 생년월일 계산한 나이

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
    };

    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        console.log('myPage');
        try {
            const token = getToken(); // 토큰 가져오기
            const response = await api.get('/api/auth/member/editInformation', {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if(response.status === 200) {
                setUserInfo(response.data); // 서버에서 받은 사용자 정보 반환
                setOriginalNickname(response.data.nickname);
                setAge(response.data.age);
                setCountry(response.data.country);
                setSelectedYear(response.data.year);
                setSelectedMonth(response.data.month);
                setSelectedDay(response.data.day);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    },[]);

    //정보 수정
    const changeInfo = async () => {
        console.log('changeInfo');
        try {
            // 수정할 데이터를 담을 객체 생성
            const requestData = {
                gender: userInfo.gender,
                year: selectedYear,
                month: selectedMonth,
                day: selectedDay,
                age : age
            };

            // 닉네임이 변경되었을 경우에만 requestData에 추가
            if (userInfo.nickname !== originalNickname) {
                if(nickNameValid==null){
                    alert("닉네임 중복 확인을 해주세요.")
                    return;
                }
                else if(!nickNameValid){
                    alert("닉네임이 유효하지 않습니다.")
                    return;
                }
                alert(userInfo.nickname + ", " + originalNickname);
                requestData.nickname = userInfo.nickname;
            }

            // 새 비밀번호가 비어있지 않을 경우에만 requestData에 추가
            if (newPassword) {
                //새 비밀번호와 확인 비밀번호가 다르면 경고 후 함수 종료
                if(newPassword !== checkPassword) {
                    alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
                    return;
                }
                requestData.newPassword = newPassword;
                requestData.exPassword = exPassword;
            }

            const token = getToken(); // 토큰 가져오기
            const response = await api.patch(
                '/api/auth/member/editInformation',
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json', // JSON 형식임을 명시
                        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                    }
                }
            );
            if (response.status === 200) {
                alert("수정 완료");
                localStorage.setItem('username', requestData.nickname);
                window.location.reload();
            }
        } catch (err) {
            if (err.response.status === 400) {
                alert("죄송합니다, 입력하신 현재 비밀번호가 일치하지 않습니다.\n올바른 비밀번호를 입력해주세요.")
            }
            else {
                errorModal(err);
            }
        }
    };

    // 닉네임 중복 검사
    const handleNickName = async (e) => {
        console.log(`handleNickName: ${userInfo.nickname}`);

        try {
            let response = await api({
                method: 'get',
                url: `/api/sec/check?nickname=${userInfo.nickname}`,
                headers: {'Content-Type': 'application/json'},
            });
            if (response.status === 200) {
                console.log(`api 요청 후: ${userInfo.nickname}`);
                setNickNameValid(true); // 닉네임이 유효하다는 것을 나타냄
            }
        } catch (err) {
            if(err.response.status === 409){
                if(userInfo.nickname !== originalNickname){
                    setNickNameValid(false); // 닉네임이 유효하지 않다는 것을 나타냄
                }
                else {
                    setNickNameValid(null);
                }
            }
        }
        console.log('끝');
    };

    const changeNickName = (e) => {
        setUserInfo({...userInfo, nickname : e.target.value});
    };

    // 토글 함수
    const toggleShowPassword = (type) => {
        switch(type) {
            case 'ex': //현재 비밀번호
                setShowExPassword(!showExPassword);
                break;
            case 'new': //새 비밀번호
                setShowNewPassword(!showNewPassword);
                break;
            case 'check': //확인 비밀번호
                setShowCheckPassword(!showCheckPassword);
                break;
            default:
                break;
        }
    };

    // 비밀번호 정규표현식 검사
    const handlePw = (pw) => {
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (regex.test(pw)) {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    };

    //국적
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };

    // 생년월일 선택한 값으로 상태 설정
    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };
    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };
    const handleDayChange = (e) => {
        setSelectedDay(parseInt(e.target.value));
    };

    //birth 선택하기 전 나이 계산
    useEffect(() => {
        if (userInfo && userInfo.year && userInfo.month && userInfo.day) {
            const currentDate = new Date(); // 현재 날짜 가져오기
            const birthDate = new Date(userInfo.year, userInfo.month - 1, userInfo.day); // 선택한 생년월일로 날짜 설정

            // 나이 계산
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = currentDate.getMonth() - birthDate.getMonth();

            // 만약 현재 날짜의 월이 생일 월보다 전이거나 같지만 일자가 아직 지나지 않았을 경우 나이에서 1을 빼줌
            if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                age--;
            }
            setAge(age);
        }
    }, [userInfo]);

    //birth 선택한 후 나이 계산
    useEffect(() => {
        if (selectedYear && selectedMonth && selectedDay) {
            const currentDate = new Date(); // 현재 날짜 가져오기
            const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay); // 선택한 생년월일로 날짜 설정

            // 나이 계산
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = currentDate.getMonth() - birthDate.getMonth();

            // 만약 현재 날짜의 월이 생일 월보다 전이거나 같지만 일자가 아직 지나지 않았을 경우 나이에서 1을 빼줌
            if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                age--;
            }
            setAge(age);
        }
    }, [selectedYear, selectedMonth, selectedDay]);

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4" style={{ overflowY: "auto" }}>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h4 className="h4">{t('profileInfo.editPersonalInfo')}</h4>
                        </div>
                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label">Email</label>
                            <label className="col-sm-3 col-form-label">{userInfo?.email}</label>
                        </div>

                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label">NickName</label>
                            <input
                                style={{display:"flex", width:"150px", height:"40px"}}
                                type="text"
                                name="nickname"
                                placeholder={t('profileInfo.enterNickName')}
                                value={userInfo?.nickname}
                                onChange={changeNickName}
                            />
                            <button
                                style={{
                                    width: "80px",
                                    height: "34px",
                                    marginLeft: "25px",
                                    marginBottom: "20px",
                                    borderRadius:"25px",
                                    backgroundColor:"#C6CAC3",
                                    border:"0px"
                                }}
                                onClick={handleNickName}
                            >{t('profileInfo.checkDuplicate')}</button>

                            {nickNameValid!== null && (
                                <div className="mt-2 row">
                                    <label className="col-sm-3 col-form-label"></label>
                                    <div className="col-sm-6" style={{fontWeight: "550", fontSize: "13px"}}>
                                        {nickNameValid && (
                                            <div style={{color: "green"}}>{t('profileInfo.nickNameAvailable')}</div>
                                        )}
                                        {!nickNameValid && userInfo?.nickname.length > 0 && (
                                            <div style={{color: "red"}}>{t('profileInfo.nickNameUnavailable')}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mb-2 row">
                            <label className="col-sm-3 col-form-label">Password</label>
                            <input
                                style={{display:"flex", width:"150px", height:"40px"}}
                                type={showExPassword ? "text" : "password"}
                                placeholder={t('profileInfo.enterCurrentPassword')}
                                onChange={(e) => {setExPassword(e.target.value)}}
                            />
                            <label className="col-sm-3">
                                <input type='checkbox' className="custom-checkbox" onChange={() => toggleShowPassword('ex')} />
                                <span className="pwCheck">{t('profileInfo.showPassword')}</span>
                            </label>
                        </div>

                        <div className="mb-2 row">
                            <label className="col-sm-3 col-form-label"></label>
                            <input
                                style={{display:"flex", width:"150px", height:"40px"}}
                                type={showNewPassword ? "text" : "password"}
                                placeholder={t('profileInfo.enterNewPassword')}
                                onChange={(e) => {setNewPassword(e.target.value); handlePw(e.target.value);}}
                            />
                            <label className="col-sm-3">
                                <input type='checkbox' className="custom-checkbox" onChange={() => toggleShowPassword('new')} />
                                <span className="pwCheck">{t('profileInfo.showPassword')}</span>
                            </label>
                        </div>

                        {!pwValid && newPassword.length > 0 && (
                            <div className="mb-2 row">
                                <label className="col-sm-3 col-form-label"></label>
                                <div className="col-sm-6" style={{fontWeight: "550", fontSize: "13px"}}>
                                    <div style={{color:"red"}}>{t('profileInfo.passwordRequirement')}</div>
                                </div>
                            </div>
                        )}

                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label"></label>
                            <input
                                style={{display:"flex", width:"150px", height:"40px"}}
                                type={showCheckPassword ? "text" : "password"}
                                placeholder={t('profileInfo.confirmNewPassword')}
                                onChange={(e) => {setCheckPassword(e.target.value)}}
                            />
                            <label className="col-sm-3">
                                <input type='checkbox' className="custom-checkbox" onChange={() => toggleShowPassword('check')} />
                                <span className="pwCheck">{t('profileInfo.showPassword')}</span>
                            </label>
                        </div>

                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label">Gender</label>
                            <div className="col-sm-5 col-form-label btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="radio1"
                                    checked={userInfo?.gender === "MAN"}
                                    onChange={() => setUserInfo({...userInfo, gender: "MAN"})}
                                />
                                <label htmlFor="btnradio1" style={{marginLeft: "5px", marginRight: "20px"}}>MAN</label>

                                <input
                                    type="radio"
                                    name="gender"
                                    id="radio2"
                                    checked={userInfo?.gender === "WOMAN"}
                                    onChange={() => setUserInfo({...userInfo, gender: "WOMAN"})}
                                />
                                <label htmlFor="btnradio2" style={{marginLeft: "5px"}}>WOMAN</label>
                            </div>
                        </div>

                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label">Country</label>
                            <div className="col-sm-8">{country}</div>
                        </div>

                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label">Birth</label>
                            <div style={{display:"flex", width:"300px", padding:"0px"}}>
                                <select className="box" id="birth-year" onChange={handleYearChange} >
                                    <option disabled selected>{t('profileInfo.birthYear')}</option>
                                    {userInfo && userInfo.year && (
                                        Array.from({ length: 2023 - 1940 }, (_, index) => {
                                            const year = 1940 + index;
                                            if(year===userInfo.year){
                                                return <option key={year} value={year} selected>{year}</option>;}
                                            else return <option key={year} value={year}>{year}</option>;
                                        })
                                    )}
                                </select>
                                <select className="box" id="birth-month" onChange={handleMonthChange}>
                                    <option disabled selected>{t('profileInfo.birthMonth')}</option>
                                    { userInfo && userInfo.month && (
                                        Array.from({ length: 12 }, (_, index) => {
                                            const month = index + 1;
                                            if(month===userInfo.month){
                                                return <option key={month} value={month} selected>{month}</option>;}
                                            else return <option key={month} value={month}>{month}</option>;
                                        })
                                    )}
                                </select>
                                <select className="box" id="birth-day" onChange={handleDayChange}>
                                    <option disabled selected>{t('profileInfo.birthDay')}</option>
                                    {userInfo && userInfo.day && (
                                        Array.from({ length: 31 }, (_, index) => {
                                            const day = index + 1;
                                            if(day===userInfo.day){
                                                return <option key={day} value={day} selected>{day}</option>;}
                                            else return <option key={day} value={day}>{day}</option>;
                                        })
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4 row">
                            <label className="col-sm-3 col-form-label">Age</label>
                            <label className="col-sm-3 col-form-label">{age}</label>
                        </div>

                        <div className="row justify-content-center">
                            <button type="button"
                                    style={{
                                        width: "109px",
                                        height: "34px",
                                        marginRight: "25px",
                                        marginBottom: "20px",
                                        borderRadius:"25px",
                                        backgroundColor:"#C6CAC3",
                                        border:"0px"
                                    }}
                                    onClick={() => { window.location.reload(); }}
                            >
                                {t('profileInfo.resetButton')}
                            </button>
                            <button
                                type="button"
                                style={{
                                    width: "109px",
                                    height: "34px",
                                    marginBottom: "20px",
                                    borderRadius:"25px",
                                    backgroundColor:"#B7DAA1",
                                    border:"0px"
                                }}
                                onClick={changeInfo}
                            >
                                {t('profileInfo.editButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileInfo;
