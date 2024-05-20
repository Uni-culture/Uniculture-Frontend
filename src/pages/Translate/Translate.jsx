import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout'
import styles from './Translate.module.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {useTranslation} from "react-i18next";

export default function Translate() {
    const navigate = useNavigate(); // 다른 component 로 이동할 때 사용
    const location = useLocation();
    const { t } = useTranslation();

    const [inputLanguage, setInputLanguage] = useState({ name: t('translate.KO'), code: "KO" }); //input 언어
    const [inputText, setInputText] = useState(''); //input 값
    const [outputLanguage, setOutputLanguage] = useState( { name: t('translate.EN'), code: "EN" }); //output 언어
    const [outputText, setOutputText] = useState(''); //output 값

    //textareaContainer border 색 변경을 위한 변수들
    const [isInputTextareaClicked, setIsInputTextareaClicked] = useState(false); 
    const inputDropdownRef = useRef(null); // input dropdown을 위한 ref
    const inputItemRef = useRef(null); 
    const outputDropdownRef = useRef(null); // output dropdown을 위한 ref
    const outputItemRef = useRef(null); 

    //드롭다운
    const [isInputDropDownOpen, setIsInputDropDownOpen] = useState(false);
    const [isOutputDropDownOpen, setIsOutputDropDownOpen] = useState(false);
    const languages = [ 
        { name: t('translate.KO'), code: "KO" },
        { name: t('translate.EN'), code: "EN" },
        { name: t('translate.ZH'), code: "ZH" },
        { name: t('translate.JA'), code: "JA" },
        { name: t('translate.DE'), code: "DE" },
        { name: t('translate.ES'), code: "ES" },
        { name: t('translate.FR'), code: "FR" },
        { name: t('translate.IT'), code: "IT" },
    ]

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
                navigate("/sign-in", {state: {from: location.pathname}});
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

    // 번역 함수 
    const performTranslation = async () => {
        try {
            const token = getToken();

            console.log("text : " + inputText + "\n" + "target_lang : " + outputLanguage.code + "\n");

            const response = await axios.post(`/api/auth/translate`, 
            {
                text: inputText,
                target_lang: outputLanguage.code
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setOutputText(response.data.text);
                console.log(response.data.text);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    useEffect(() => { // textareaContainer border 색 변경을 위한 함수
        function handleClickOutside(event) {
            if (inputItemRef.current && inputItemRef.current.contains(event.target)) {
                return; 
            }
            if (outputItemRef.current && outputItemRef.current.contains(event.target)) {
                return; 
            }
            if (inputDropdownRef.current && !inputDropdownRef.current.contains(event.target)) {
                setIsInputDropDownOpen(false);
            }
            if (outputDropdownRef.current && !outputDropdownRef.current.contains(event.target)) {
                setIsOutputDropDownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inputDropdownRef, outputDropdownRef, inputItemRef, outputItemRef]);

    const handleInputTextareaClick = () => { //inputTextarea 클릭시
        setIsInputTextareaClicked(true);

        //드롭다운 닫기
        setIsInputDropDownOpen(false); 
        setIsOutputDropDownOpen(false);
    }

    const handleInputLanuage = (language) => { //input 언어 설정
        setInputLanguage(language);
        setIsInputDropDownOpen(false);
    }

    const handleOutputLanguage = (language) => { //output 언어 설정
        setOutputLanguage(language);
        setIsOutputDropDownOpen(false);
    }

    
    const swapLanguages = () => { //input, output 바꾸기
        const tempLanguage = inputLanguage;
        setInputLanguage(outputLanguage);
        setOutputLanguage(tempLanguage);

        const tempText = inputText;
        setInputText(outputText);
        setOutputText(tempText);
    }

    const handleInputTextarea = (value) => {
        setInputText(value);
    }

    return (
        <Layout>
            <div className={styles.translateContainer}>
                <div className={`${styles.textareaContainer} ${isInputTextareaClicked ? styles.clicked : ''}`} >
                    <div className={styles.dropdown} >
                        <div  onClick={() => {setIsOutputDropDownOpen(false); setIsInputDropDownOpen(!isInputDropDownOpen)}} ref={inputDropdownRef}>
                            {inputLanguage.name} <RiArrowDropDownLine size={30} />
                        </div>
                        <div onClick={swapLanguages}><FaExchangeAlt /></div>
                    </div>
                    

                    {isInputDropDownOpen && (
                        <div className={styles.dropdownMenu} ref={inputItemRef}>
                            {languages.map((language, index) => (
                                <div key={index} className={styles.menuItem} onClick={() => handleInputLanuage(language)}>
                                    {language.name}
                                </div>
                            ))}
                        </div>
                    )}

                    <textarea className={styles.textarea} value={inputText} onChange={(e) => handleInputTextarea(e.target.value)} onFocus={handleInputTextareaClick} onBlur={()=>setIsInputTextareaClicked(false)}/>

                    <div className={styles.translateBtnDiv}>
                        <button className={styles.translateBtn} onClick={performTranslation}>{t('translate.Translate')}</button>
                    </div>
                </div>

                <div className={styles.textareaContainer}>
                    <div className={styles.dropdown}>
                        <div onClick={() => {setIsInputDropDownOpen(false); setIsOutputDropDownOpen(!isOutputDropDownOpen);}} ref={outputDropdownRef}>
                            {outputLanguage.name} <RiArrowDropDownLine size={30} />
                        </div>
                    </div>

                    {isOutputDropDownOpen && (
                        <div className={styles.dropdownMenu} ref={outputItemRef}>
                            {languages.map(((language)=>(
                                <div className={styles.menuItem} onClick={()=> handleOutputLanguage(language)}>{language.name}</div>
                            )))}
                        </div>
                    )}

                    <div className={styles.textarea}>{outputText}</div>
                </div>
            </div>
        </Layout>
    )
}
