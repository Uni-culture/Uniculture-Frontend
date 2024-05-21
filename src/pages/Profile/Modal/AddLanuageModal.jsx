import React, { useState } from 'react'
import {useTranslation} from "react-i18next";

export default function AddLanuageModal({handleModal, addLanguage}) {
    const [language, setLanguage] = useState('language');
    const [level, setLevel] = useState('level');
    const { t } = useTranslation();

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleLevelChange = (event) => {
        setLevel(parseInt(event.target.value));
    };
    const handleAddLanguage = () => {
        if (language !== 'language' && level !== 'level') {
            addLanguage(language, level);
            handleModal(); // 모달 닫기
        } else if (language === 'language') {
            alert(t("languageSelect.languageSelection"));
        } else if (level === 'level') {
            alert(t("languageSelect.proficiencySelection"));
        } else {
            alert(t("languageSelect.selectionPrompt"));
        }
    };
    return (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{ minHeight: '400px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{t('languageSelect.modalTitle')}</h5>
                    </div>
                    <div className="modal-body" style={{marginTop:"20px"}}>
                        {t('languageSelect.modalBody')}
                        <div style={{textAlign:"center", marginTop:"20px"}}>
                            <select className="form-select" defaultValue="language" value={language} onChange={handleLanguageChange} aria-label="Default select example" style={{marginTop:"30px", marginBottom:"20px"}}>
                                <option value="language" disabled>{t('languageSelect.languageSelection')}</option>
                                <option value="한국어">한국어</option>
                                <option value="영어">English</option>
                                <option value="중국어">中文</option>
                                <option value="일본어">日本語</option>
                                {/* {t('languageSelect.한국어')} */}
                                {/* {t('languageSelect.한국어')} */}
                                {/* {t('languageSelect.한국어')} */}
                                {/* {t('languageSelect.한국어')} */}
                            </select>

                            <select className="form-select" defaultValue="level" value={level} onChange={handleLevelChange} aria-label="Default select example" style={{marginTop:"30px", marginBottom:"20px"}}>
                                <option value='level' disabled>{t('languageSelect.proficiencySelection')}</option>
                                <option value="100">{t('languageSelect.최상')}</option>
                                <option value="80">{t('languageSelect.상')}</option>
                                <option value="60">{t('languageSelect.중')}</option>
                                <option value="40">{t('languageSelect.하')}</option>
                                <option value="20">{t('languageSelect.최하')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleModal}>{t('languageSelect.closeButton')}</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddLanguage}>{t('languageSelect.addButton')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}