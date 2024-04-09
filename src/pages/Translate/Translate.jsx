import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout'
import styles from './Translate.module.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";

export default function Translate() {
    const [inputLanguage, setInputLanguage] = useState('한국어');
    const [outputLanguage, setOutputLanguage] = useState('영어');
    const [isInputTextAreaClicked, setIsInputTextAreaClicked] = useState(false);

    const [isInputDropDownOpen, setIsInputDropDownOpen] = useState(false); 
    const [isOutputDropDownOpen, setIsOutputDropDownOpen] = useState(false);

    const inputDropdownRef = useRef(null); // input dropdown을 위한 ref
    const inputItemRef = useRef(null); 

    const outputDropdownRef = useRef(null); // output dropdown을 위한 ref
    const outputItemRef = useRef(null); 

    const languages = [
        "한국어",
        "영어",
        "중국어",
        "일본어",
        // "스페인어",
        // "프랑스어",
        // "독일어",
        // "러시아어",
        // "포르투갈어",
        // "태국어",
        // "베트남어",
        // "아랍어",
    ]

    useEffect(() => { 
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

    const handleInputTextAreaClick = () => {
        setIsInputTextAreaClicked(true);
        setIsInputDropDownOpen(false);
        setIsOutputDropDownOpen(false);
    }

    const handleInputLanuage = (language) => {
        setInputLanguage(language);
        setIsInputDropDownOpen(false);
    }

    const handleOutputLanguage = (language) => {
        setOutputLanguage(language);
        setIsOutputDropDownOpen(false);
    }

    //input, output 언어 바꾸기
    const swapLanguages = () => {
        const temp = inputLanguage;
        setInputLanguage(outputLanguage);
        setOutputLanguage(temp);
    }

    return (
        <Layout>
            <div className={styles.translateContainer}>
                <div className={`${styles.textAreaContainer} ${isInputTextAreaClicked ? styles.clicked : ''}`} >
                    <div className={styles.dropdown} >
                        <div  onClick={() => {setIsOutputDropDownOpen(false); setIsInputDropDownOpen(!isInputDropDownOpen)}} ref={inputDropdownRef}>
                            {inputLanguage} <RiArrowDropDownLine size={30} />
                        </div>
                        <div onClick={swapLanguages}><FaExchangeAlt /></div>
                    </div>
                    

                    {isInputDropDownOpen && (
                        <div className={styles.dropdownMenu} ref={inputItemRef}>
                            {languages.map(((language)=>(
                                <div className={styles.menuItem} onClick={()=>handleInputLanuage(language)}>{language}</div>
                            )))}
                        </div>
                    )}
                    
                    <textarea className={styles.textarea} onFocus={handleInputTextAreaClick} onBlur={()=>setIsInputTextAreaClicked(false)}/>
                </div>

                <div className={styles.textAreaContainer}>
                    <div className={styles.dropdown}>
                        <div onClick={() => {setIsInputDropDownOpen(false); setIsOutputDropDownOpen(!isOutputDropDownOpen);}} ref={outputDropdownRef}>
                            {outputLanguage} <RiArrowDropDownLine size={30} />
                        </div>
                    </div>

                    {isOutputDropDownOpen && (
                        <div className={styles.dropdownMenu} ref={outputItemRef}>
                            {languages.map(((language)=>(
                                <div className={styles.menuItem} onClick={()=> handleOutputLanguage(language)}>{language}</div>
                            )))}
                        </div>
                    )}

                    <div className={styles.textarea} onClick={()=>setIsOutputDropDownOpen(false)}/>
                </div>
            </div>
        </Layout>
    )
}
