import React, { useEffect, useState } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import {useTranslation} from "react-i18next";

const PercentBar = ({ language, level, color, onDelete}) => {
    const [percentage, setPercentage] = useState();
    const [bg, setBg] = useState();
    const { t } = useTranslation();

    useEffect(()=>{
        setBg(color);
    },[color]);


    useEffect(()=>{
        setPercentage(level);
    },[level])

    // 삭제 버튼을 클릭할 때 언어를 삭제
    const handleDelete = () => {
        onDelete(language);
    };

    return (
        <>
            <div className="d-flex align-items-center" style={{display: "flex"}}>
                {language && (<label style={{textAlign: "left", minWidth: "50px", marginRight: "10px"}}>{t(`languageSelect.${language}`)}</label>)}
                <div style={{ position: 'relative' }}>
                    <div className="progress" style={{ width: '150px'}}>
                        <div
                            className={ bg==="red" ? "progress-bar bg-danger" : "progress-bar"}
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                        <div style={{ position: 'absolute', top: 0, left: '20%', height: '100%', borderLeft: '1px solid #FFFFFF' }} />
                        <div style={{ position: 'absolute', top: 0, left: '40%', height: '100%', borderLeft: '1px solid #FFFFFF' }} />
                        <div style={{ position: 'absolute', top: 0, left: '60%', height: '100%', borderLeft: '1px solid #FFFFFF' }} />
                        <div style={{ position: 'absolute', top: 0, left: '80%', height: '100%', borderLeft: '1px solid #FFFFFF' }} />

                        </div>
                    </div>
                </div>
                {onDelete && (<div  style={{marginLeft: "15px"}} onClick={handleDelete}><RiDeleteBinLine/></div>)}
            </div>     

        </>
    );
};
export default PercentBar;