//회원 가입 페이지
import React, {useEffect, useState} from "react"
import axios from 'axios';
import {Link, useLocation, useNavigate} from "react-router-dom";
import './Auth.css';
import Swal from "sweetalert2";
import { IoArrowBack } from "react-icons/io5";

const SignUp = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const [nickName, setNickName] = useState('');

    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 비밀번호를 텍스트 형태로 보여줄지 여부 결정
    const [showPassword2, setShowPassword2] = useState(false); // 비밀번호2를 텍스트 형태로 보여줄지 여부 결정
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [nickNameValid, setNickNameValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);
    const [gender, setGender] = useState('');

    const [isYearOptionExisted, setIsYearOptionExisted] = useState(false);
    const [isMonthOptionExisted, setIsMonthOptionExisted] = useState(false);
    const [isDayOptionExisted, setIsDayOptionExisted] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [age, setAge] = useState(null); // 선택한 생년월일 계산한 나이

    const resetInput = () => {
        setEmail('');
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
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay,
            age: age,
        };
        console.log('req_data: ', request_data);
        try{
            let response = await axios({
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
                alert(err.response.data);
                resetInput();
            }
        }
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

    // 닉네임 중복 검사
    const handleNickName = async (e) => {
        console.log(`handleNickName: ${nickName}`);
        try {
            let response = await axios({
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
                alert(err.response.data);
                resetInput();
            }
        }
    };

    const changeNickName = (e) => {
        setNickName(e.target.value);
        console.log(`e.tartget.value: ${e.target.value}`);
        console.log(`nickName: ${nickName}`);

        // 사용자가 입력한 닉네임이 변경되면
        if (e.target.value !== nickName) {
            setNickNameValid(false);
        }
    };

    // 이메일 정규표현식 검사
    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
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
        if(emailValid && pwValid && nickNameValid && gender && selectedYear && selectedMonth && selectedDay) {
            setNotAllow(false); // 버튼 비활성화 해제
            return;
        }
        setNotAllow(true); // 기본적인 상황: 비활성화

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
    }, [emailValid, pwValid, nickNameValid, gender, selectedYear, selectedMonth, selectedDay]); // 이메일, 비밀번호 등 state 값이 변경될 때마다 useEffect 실행

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
                <div className="sub-title">나의 성장을 돕는 언어교류 플랫폼</div>

                <div className="inputTitle">이메일</div>
                <div className="inputWrap">
                    <input className="input" type="email" placeholder="test@example.com" value={email} onChange={handleEmail} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!emailValid && email.length > 0 && (
                        <div>이메일 형식이 올바르지 않습니다.</div>
                    )}
                </div>

                <div className="inputTitle">비밀번호</div>
                <div className="inputWrap">
                    <input className="input" type={showPassword ? "text" : "password"} placeholder="영문, 숫자, 특수문자 포함 8자 이상" value={pw} onChange={handlePw} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!pwValid && pw.length > 0 && (
                        <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                    )}
                </div>
                <label className="checkbox-hover">
                    <input type="checkbox" onChange={toggleShowPassword} />
                    <span className="pwCheck">비밀번호 보기</span>
                </label>

                <div className="inputTitle">비밀번호 확인</div>
                <div className="inputWrap">
                    <input className="input" type={showPassword2 ? "text" : "password"} placeholder="영문, 숫자, 특수문자 포함 8자 이상" value={pw2} onChange={handlePw2} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!passwordsMatch && pw2.length > 0 && (
                        <div>비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
                <label className="checkbox-hover">
                    <input type="checkbox" onChange={toggleShowPassword2} />
                    <span className="pwCheck">비밀번호 보기</span>
                </label>

                <div className="inputTitle">성별</div>
                <label className="radio-style">
                    <input
                        type="radio"
                        value="MAN"
                        checked={gender === 'MAN'}
                        onChange={handleGenderChange}
                    />
                    <span className="radio-text">남성</span>
                </label>
                <label className="radio-style">
                    <input
                        type="radio"
                        value="WOMAN"
                        checked={gender === 'WOMAN'}
                        onChange={handleGenderChange}
                    />
                    <span className="radio-text">여성</span>
                </label>
                <div>{gender}</div>

                <div className="inputTitle">생년월일</div>
                <div className="info" id="info__birth">
                    <select className="box" id="birth-year" onFocus={handleFocusYear} onChange={handleYearChange}>
                        <option disabled selected>출생 연도</option>
                        {isYearOptionExisted && (
                            Array.from({ length: 2023 - 1940 }, (_, index) => {
                                const year = 1940 + index;
                                return <option key={year} value={year}>{year}</option>;
                            })
                        )}
                    </select>
                    <select className="box" id="birth-month" onFocus={handleFocusMonth} onChange={handleMonthChange}>
                        <option disabled selected>월</option>
                        {isMonthOptionExisted && (
                            Array.from({ length: 12 }, (_, index) => {
                                const month = index + 1;
                                return <option key={month} value={month}>{month}</option>;
                            })
                        )}
                    </select>
                    <select className="box" id="birth-day" onFocus={handleFocusDay} onChange={handleDayChange}>
                        <option disabled selected>일</option>
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

                <div className="inputTitle">닉네임</div>
                <div className="inputWrap" style={{padding: '10px'}}>
                    <input className="input" type="text" placeholder="닉네임을 입력하세요" style={{width: '80%', marginTop: '9px'}} value={nickName} onChange={changeNickName} onKeyDown={handleKeyDown}/>
                    <button className='nickNameButton' onClick={handleNickName}>중복확인</button>
                </div>
                <div className="nickNameMessageWrap">
                    {nickNameValid && nickName.length > 0 && (
                        <div>사용 가능한 닉네임입니다.</div>
                    )}
                </div>
                <button disabled={notAllow} className="authButton" onClick={handleInputClick}>가입하기</button>
                <button onClick={testClick}>test</button>
            </div>
        </div>
    )
}

export default SignUp;