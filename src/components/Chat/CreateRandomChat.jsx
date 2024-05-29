import React, { useEffect, useState } from 'react'
import FriendList from '../../pages/Profile/components/FriendList';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import api from "../../pages/api";

export default function CreateRandomChat({modal, searchUser}) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [language, setLanguage] = useState(null);
    const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true); // 검색 버튼 비활성화 여부

    const handleLanguageChange = (event) => {
        if(event.target.value !== null) setIsSearchButtonDisabled(false);
        else setIsSearchButtonDisabled(true);
        console.log(event.target.value);
        setLanguage(event.target.value);
    };

    return (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{ minHeight: '400px' }}>
                    <div className="modal-header" style={{width: "100%", justifyContent: "normal"}}>
                        <div className="modal-title" style={{fontWeight: "bold"}}>랜덤 채팅</div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={modal}></button>
                    </div>
                    <div className="modal-body" style={{marginTop:"20px", alignContent: "center"}}>
                        어떤 언어로 상대와 채팅하고 싶은가요?
                        <div style={{textAlign:"center", marginTop:"20px"}}>
                            <select className="form-select" defaultValue="language" value={language} onChange={handleLanguageChange} aria-label="Default select example" style={{marginTop:"30px", marginBottom:"20px"}}>
                                <option value="language" disabled>언어를 선택해주세요.</option>
                                <option value="한국어">한국어</option>
                                <option value="영어">English</option>
                                <option value="중국어">中文</option>
                                <option value="일본어">日本語</option>
                                <option value="스페인어">Español</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer" style={{width: "100%"}}>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{width: "100%"}} disabled={isSearchButtonDisabled}  onClick={()=>{searchUser(language); modal();}}>검색</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
