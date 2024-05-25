//회원 가입 페이지
import React, {useEffect, useState} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom";
import './Auth.css';
import Swal from "sweetalert2";
import { IoArrowBack } from "react-icons/io5";
import {useTranslation} from "react-i18next";
import axios from "axios";
import api from "../api";

const SignUp = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [emailNum, setEmailNum] = useState('');
    const [emailAuth, setEmailAuth] = useState(false);
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const [nickName, setNickName] = useState('');

    const [emailValid, setEmailValid] = useState(false);
    const [emailAuthValid, setEmailAuthValid] = useState(false);
    const [isAuthSuccess, setIsAuthSuccess] = useState(false); // 인증 성공 상태 관리
    const [authMessage, setAuthMessage] = useState(''); // 인증 메시지 상태
    const [pwValid, setPwValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 비밀번호를 텍스트 형태로 보여줄지 여부 결정
    const [showPassword2, setShowPassword2] = useState(false); // 비밀번호2를 텍스트 형태로 보여줄지 여부 결정
    const [passwordsMatch, setPasswordsMatch] = useState(false); // 비밀번호1과 비밀번호2가 일치해야 true
    const [nickNameValid, setNickNameValid] = useState(false);
    const [isTooLong, setIsTooLong] = useState(false); // 닉네임 길이 초과 상태
    const [notAllow, setNotAllow] = useState(true);
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState(""); // 국적 상태 설정

    const [isYearOptionExisted, setIsYearOptionExisted] = useState(false);
    const [isMonthOptionExisted, setIsMonthOptionExisted] = useState(false);
    const [isDayOptionExisted, setIsDayOptionExisted] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [age, setAge] = useState(null); // 선택한 생년월일 계산한 나이
    const { t } = useTranslation();

    const resetInput = () => {
        setEmail('');
        setEmailValid('');
        setPw('');
        setPw2('');
        setNickName('');
        setGender('');
        setIsYearOptionExisted(false);
        setIsMonthOptionExisted(false);
        setIsDayOptionExisted(false);
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        setAge(null);

        // 생년월일 select 박스 초기화
        const yearSelect = document.getElementById('birth-year');
        const monthSelect = document.getElementById('birth-month');
        const daySelect = document.getElementById('birth-day');
        if (yearSelect) yearSelect.selectedIndex = 0;
        if (monthSelect) monthSelect.selectedIndex = 0;
        if (daySelect) daySelect.selectedIndex = 0;
    }

    const handleNationalityChange = (e) => {
        setNationality(e.target.value);
        console.log("nationality: ", nationality);
    };

    const emailResetInput = () => { // 이메일만 초기화
        setEmail('');
        setEmailValid(false);
    }

    const handleInputClick = async (e) => {
        console.log('sing-up');
        const request_data = {
            email: email,
            password: pw,
            nickname: nickName,
            gender: gender,
            country: nationality,
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay,
            age: age,
        };
        console.log('req_data: ', request_data);
        try{
            let response = await api({
                method: 'post',
                url: '/api/sec/signup',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(request_data)
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);
            if(response.status === 200) {
                navigate("/setup", { state: { id: response.data.id} });
            }
            else {
                alert("회원가입에 실패하였습니다.");
                resetInput();
            }
        } catch (err) {
            if(err.response.status === 409) {
                console.log("이메일 중복 오류입니다.");
                emailWarning();
                //alert(err.response.data); // 실패했습니다
                emailResetInput();
            }
            else {
                console.log("서버 오류 입니다.");
                serverError();
                resetInput();
            }
        }
    }

    const serverError = () => {
        Swal.fire({
            icon: "warning",
            title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('serverError.title')}</div>`,
            confirmButtonColor: "#8BC765",
            confirmButtonText: t('serverError.confirmButton'),
        })
    }

    const emailWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "이메일 중복",
            html: "이미 사용 중인 이메일입니다. <br>다른 이메일을 사용해주세요.",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    const nickNameWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "닉네임 중복",
            html: "이미 사용 중인 닉네임입니다. <br>다른 닉네임을 사용해주세요.",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    const emailAuthFun = async (e) => {
        console.log("이메일 인증을 시작합니다");
        setEmailAuthValid(true);
        try {
            const request_data = {
                email: email
            };
            let response = await api({
                method: 'post',
                url: '/api/mailSend',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(request_data)
            });
            if (response.status === 200) {
                console.log(`이메일 인증 성공`)
                console.log(response.data);
                setEmailAuth(response.data.number);
            }
        } catch (err) {
            serverError();
        }
    };

    const emailAuthFun2 = () => {
        // emailNum과 emailAuth를 비교하여 일치할 경우에만 인증에 성공하였다는 메시지를 표시
        if (emailNum === emailAuth) {
            setIsAuthSuccess(true);
            setAuthMessage(t('signUp.emailSuccess'));
        } else {
            setIsAuthSuccess(false);
            setAuthMessage(t('signUp.emailFailure'));
        }
    };

    // 닉네임 중복 검사
    const handleNickName = async (e) => {
        console.log(`handleNickName: ${nickName}`);
        console.log("isTooLong: ", isTooLong);
        if (nickName.length <= 15 && !isTooLong) {
            try {
                let response = await api({
                    method: 'get',
                    url: `/api/sec/check?nickname=${nickName}`,
                    headers: {'Content-Type': 'application/json'},
                });
                if (response.status === 200) {
                    console.log(`api 요청 후: ${nickName}`);
                    setNickNameValid(true); // 닉네임이 유효하다는 것을 나타냄
                }
            } catch (err) { // 서버 오류
                if(err.response.status === 409) {
                    console.log("닉네임 중복 오류입니다.");
                    setNickNameValid(false); // 닉네임이 유효하지 않다는 것을 나타냄
                    nickNameWarning();
                }
                else {
                    console.log("서버 오류 입니다.");
                    // alert(err.response.data);
                    serverError();
                    resetInput();
                }
            }
        } else {
            setIsTooLong(true); // 길이 초과 메시지 표시
        }
    };

    const changeNickName = (e) => {
        const inputValue = e.target.value;
        console.log(`e.target.value: ${inputValue}`);
        console.log(`nickName: ${nickName}`);

        // 입력된 닉네임의 길이가 15글자 이하인 경우에만 상태 업데이트
        if (inputValue.length <= 15) {
            setNickName(inputValue);
            setIsTooLong(false); // 길이 초과 메시지 숨김
        } else {
            setIsTooLong(true); // 길이 초과 메시지 표시
        }

        // 닉네임이 변경되었는지 확인
        if (inputValue !== nickName) {
            setNickNameValid(false);
        }
    };

    // 이메일 정규표현식 검사
    const handleEmail = (e) => {
        setEmail(e.target.value);
        console.log(email);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@hansung\.ac\.kr$/i;
        if (regex.test(e.target.value)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    };

    // 비밀번호 정규표현식 검사
    const handlePw = (e) => {
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (regex.test(e.target.value)) {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    };
    const handlePw2 = (e) => {
        setPw2(e.target.value);
        if (e.target.value === pw) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    };

    // 성별 상태 설정
    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    // 생년월일 드롭다운 처음 포커스 할 때 드롭다운 옵션 동적으로 생성
    const handleFocusYear = () => {
        if (!isYearOptionExisted) {
            setIsYearOptionExisted(true);
        }
    };
    const handleFocusMonth = () => {
        if (!isMonthOptionExisted) {
            setIsMonthOptionExisted(true);
        }
    };
    const handleFocusDay = () => {
        if (!isDayOptionExisted) {
            setIsDayOptionExisted(true);
        }
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

    useEffect(() => {
        if(emailValid && isAuthSuccess && pwValid && passwordsMatch && nickNameValid && gender && nationality && selectedYear && selectedMonth && selectedDay) {
            setNotAllow(false); // 버튼 비활성화 해제
            return;
        }
        setNotAllow(true); // 기본적인 상황: 비활성화

    }, [emailValid, isAuthSuccess, pwValid, passwordsMatch, nickNameValid, gender, nationality, selectedYear, selectedMonth, selectedDay]); // 이메일, 비밀번호 등 state 값이 변경될 때마다 useEffect 실행

    //나이 계산
    useEffect(()=> {
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
    },[selectedYear, selectedMonth, selectedDay])

    // 비밀번호 토글 함수
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
        navigate(previousPath, {}); // 이전 페이지로 이동
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !notAllow) {
            await handleInputClick();
        }
    };

    const testClick = () => {
        navigate("/setup", {state : {from : location.pathname}});
    }

    return (
        <div style={{ backgroundColor: '#FBFBF3', minHeight: '100vh' }}>
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={goBackToPreviousPath}/>
            <div className="auth-layout">
                <div className="title"><Link to={"/"} style={{ color: "#04B404", textDecoration: "none"}}>UniCulture</Link></div>
                <div className="sub-title">{t('signUp.subTitle')}</div>

                <div className="inputTitle">{t('signUp.email')}</div>
                <div className="inputWrap" style={{padding: '11px 13px 11px 17px'}}>
                    <input className="input" type="email" placeholder="email@hansung.ac.kr" value={email} onChange={handleEmail} onKeyDown={handleKeyDown} style={{marginTop: '9px'}}/>
                    <button className='nickNameButton' onClick={emailAuthFun} disabled={!emailValid} style={{width: '80px'}}>{t('signUp.requestAuth')}</button>
                </div>
                <div className="errorMessageWrap">
                    {!emailValid && email.length > 0 && (
                        <div>{t('signUp.emailError')}</div>
                    )}
                </div>
                {emailAuthValid && (
                    <div className="inputWrap" style={{padding: '11px 13px 11px 17px', marginTop: '10px'}}>
                        <input className="input" type="text" placeholder={t('signUp.enterAuthCode')} style={{marginTop: '9px'}} value={emailNum} onChange={(e) => setEmailNum(e.target.value)} />
                        <button className='nickNameButton' onClick={emailAuthFun2} disabled={emailNum.length !== 6} style={{width: '80px'}}>{t('signUp.confirmAuth')}</button>
                    </div>
                )}
                <div className="nickNameMessageWrap">
                    <div style={{color: isAuthSuccess ? '#469536' : 'red'}}>{authMessage}</div>
                </div>

                <div className="inputTitle">{t('signUp.password')}</div>
                <div className="inputWrap">
                    <input className="input" type={showPassword ? "text" : "password"} placeholder={t('signUp.passwordPlaceholder')} value={pw} onChange={handlePw} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!pwValid && pw.length > 0 && (
                        <div>{t('signUp.passwordError')}</div>
                    )}
                </div>
                <label className="checkbox-hover">
                    <input type="checkbox" onChange={toggleShowPassword} />
                    <span className="pwCheck">{t('signUp.showPassword')}</span>
                </label>

                <div className="inputTitle">{t('signUp.confirmPassword')}</div>
                <div className="inputWrap">
                    <input className="input" type={showPassword2 ? "text" : "password"} placeholder={t('signUp.passwordPlaceholder')} value={pw2} onChange={handlePw2} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!passwordsMatch && pw2.length > 0 && (
                        <div>{t('signUp.passwordsNotMatching')}</div>
                    )}
                </div>
                <label className="checkbox-hover">
                    <input type="checkbox" onChange={toggleShowPassword2} />
                    <span className="pwCheck">{t('signUp.confirmPassword')}</span>
                </label>

                <div className="inputTitle">{t('signUp.gender')}</div>
                <label className="radio-style">
                    <input
                        type="radio"
                        value="MAN"
                        checked={gender === 'MAN'}
                        onChange={handleGenderChange}
                    />
                    <span className="radio-text">{t('signUp.male')}</span>
                </label>
                <label className="radio-style">
                    <input
                        type="radio"
                        value="WOMAN"
                        checked={gender === 'WOMAN'}
                        onChange={handleGenderChange}
                    />
                    <span className="radio-text">{t('signUp.female')}</span>
                </label>

                <div className="inputTitle">{t('signUpOption.nationality')}</div>
                <select className="box" id="birth-year" onChange={handleNationalityChange} defaultValue="">
                    <option value="" disabled>{t('signUpOption.selectNationality')}</option>
                    <option value="Korea">Republic of Korea</option>
                    <option value="USA">United States of America(USA)</option>
                    <option value="China">People's Republic of China</option>
                    <option value="Japan">Japan</option>
                    <option value="Vietnam">Socialist Republic of Vietnam</option>
                    <option value="Thailand">Kingdom of Thailand</option>
                    <option value="Singapore">Republic of Singapore</option>
                    <option value="Spain">Kingdom of Spain</option>
                    <option value="Portuguese">Portuguese Republic</option>
                </select>

                <div className="inputTitle">{t('signUp.birthdateTitle')}</div>
                <div className="info" id="info__birth">
                    <select className="box" id="birth-year" onFocus={handleFocusYear} onChange={handleYearChange}>
                        <option disabled selected>{t('signUp.yearPlaceholder')}</option>
                        {isYearOptionExisted && (
                            Array.from({ length: 2023 - 1940 }, (_, index) => {
                                const year = 1940 + index;
                                return <option key={year} value={year}>{year}</option>;
                            })
                        )}
                    </select>
                    <select className="box" id="birth-month" onFocus={handleFocusMonth} onChange={handleMonthChange}>
                        <option disabled selected>{t('signUp.monthPlaceholder')}</option>
                        {isMonthOptionExisted && (
                            Array.from({ length: 12 }, (_, index) => {
                                const month = index + 1;
                                return <option key={month} value={month}>{month}</option>;
                            })
                        )}
                    </select>
                    <select className="box" id="birth-day" onFocus={handleFocusDay} onChange={handleDayChange}>
                        <option disabled selected>{t('signUp.dayPlaceholder')}</option>
                        {isDayOptionExisted && (
                            Array.from({ length: 31 }, (_, index) => {
                                const day = index + 1;
                                return <option key={day} value={day}>{day}</option>;
                            })
                        )}
                    </select>
                </div>
                {/*<div>
                    선택한 생년월일: {selectedYear && selectedMonth && selectedDay ? `${selectedYear}년 ${selectedMonth}월 ${selectedDay}일` : '생년월일을 선택해주세요'}
                </div>
                <div><div> 나이: {age}세</div></div>*/}

                <div className="inputTitle">{t('signUp.nicknameTitle')}</div>
                <div className="inputWrap" style={{padding: '11px 13px 11px 17px'}}>
                    <input className="input" type="text" placeholder={t('signUp.nicknamePlaceholder')} style={{width: '80%', marginTop: '9px'}} value={nickName} onChange={changeNickName} onKeyDown={handleKeyDown}/>
                    <button className='nickNameButton' onClick={handleNickName}>{t('signUp.nicknameButton')}</button>
                </div>
                <div className="nickNameMessageWrap">
                    {isTooLong && (
                        <div style={{color: 'red'}}>{t('signUp.nicknameTooLong')}</div>
                    )}
                    {nickNameValid && nickName.length > 0 && !isTooLong && (
                        <div>{t('signUp.nicknameValid')}</div>
                    )}
                </div>
                <button disabled={notAllow} className="authButton" onClick={handleInputClick}>{t('signUp.signupButton')}</button>
                <button onClick={testClick}>test</button>
            </div>
        </div>
    )
}

export default SignUp;