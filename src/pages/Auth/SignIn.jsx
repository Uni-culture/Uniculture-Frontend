//회원 가입 페이지
import React, {useEffect, useState} from "react"
import axios from 'axios';
import {Link, useNavigate, useLocation} from "react-router-dom";
import './Auth.css';
import { IoArrowBack } from "react-icons/io5";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";

const SignIn = () => {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 비밀번호를 텍스트 형태로 보여줄지 여부 결정
    const [notAllow, setNotAllow] = useState(true);
    const { t } = useTranslation();

    const resetInput = () => {
        setEmail('');
        setPw('');
        setEmailValid(false);
        setPwValid(false);
    }
    const handleLogin = async () => {
        console.log('Login start');
        try {
            const response = await axios.post(
                'api/sec/login',
                {
                    email: email,
                    password: pw,
                },
            );
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);
            // 로그인 성공
            if (response.status === 200) {
                if(response.data.accessToken){ // null인 경우 실행되지 않음
                    localStorage.setItem('accessToken', response.data.accessToken);
                }
                if(response.data.username){ // null인 경우 실행되지 않음
                    localStorage.setItem('username', response.data.username);
                }
                const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
                console.log(`이전 경로: ${previousPath}`);
                navigate(previousPath, {}); // 로그인 성공 후 이전 페이지로 이동
            }
        } catch (error) { // 로그인 실패 시
            if(error.response.status === 401) {
                console.log("올바른 이메일과 비밀번호를 입력해주세요.");
                signInWarning(); // 로그인 에러 메시지 창
                resetInput();
            }
            else {
                console.log("서버 오류 입니다.");
                alert(error.response.data);
                resetInput();
            }
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

    useEffect(() => {
        if(emailValid && pwValid) {
            setNotAllow(false); // 버튼 비활성화 해제
            return;
        }
        setNotAllow(true); // 기본적인 상황: 비활성화
    }, [emailValid, pwValid]); // 이메일, 비밀번호 state 값이 변경될 때마다 useEffect 실행
    // 비밀번호 토글 함수

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
        navigate(previousPath, {}); // 이전 페이지로 이동
    };

    const signInWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "로그인 실패",
            html: "올바른 이메일과 비밀번호를 입력해주세요.",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !notAllow) {
            await handleLogin();
        }
    };

    return (
        <div style={{ backgroundColor: '#FBFBF3', minHeight: '100vh' }}>
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={goBackToPreviousPath}/>
            <div className="auth-layout">
                <div className="title"><Link to={"/"} style={{ color: "#04B404", textDecoration: "none"}}>UniCulture</Link></div>
                <div className="sub-title">{t(`signIn.subTitle`)}</div>
                <div className="inputTitle">{t(`signIn.emailInput`)}</div>
                <div className="inputWrap">
                    <input className="input" type="email" placeholder="test@example.com" value={email} onChange={handleEmail} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!emailValid && email.length > 0 && (
                        <div>{t(`signIn.emailError`)}</div>
                    )}
                </div>
                <div className="inputTitle">{t(`signIn.passwordInput`)}</div>
                <div className="inputWrap">
                    <input className="input" type={showPassword ? "text" : "password"} placeholder={t('signIn.passwordPlaceholder')} value={pw} onChange={handlePw} onKeyDown={handleKeyDown}/>
                </div>
                <div className="errorMessageWrap">
                    {!pwValid && pw.length > 0 && (
                        <div>{t('signIn.passwordError')}</div>
                    )}
                </div>
                <label>
                    <input type='checkbox' className="custom-checkbox" onChange={toggleShowPassword} />
                    <span className="pwCheck">{t('signIn.passwordVisibility')}</span>
                </label>
                <button disabled={notAllow} className="authButton" onClick={handleLogin} style={{marginBottom: '7px', marginTop: '35px'}}>{t('signIn.loginButton')}</button>
                <div className="signUpText">
                    <Link to={"/sign-up"}>
                        <div style={{color: "dimgrey"}}>{t('signIn.Register')}</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default SignIn;