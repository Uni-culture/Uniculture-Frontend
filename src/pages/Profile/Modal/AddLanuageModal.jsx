import React, { useState } from 'react'

export default function AddLanuageModal({handleModal, addLanguage}) {
    const [language, setLanguage] = useState('language');
    const [level, setLevel] = useState('level');

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
            alert("언어를 선택하세요.");
        } else if (level === 'level') {
            alert("능숙도를 선택하세요.");
        } else {
            alert("언어 혹은 능숙도를 선택해주세요.");
        }
    };
    return (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{ minHeight: '400px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">언어 추가하기</h5>
                    </div>
                    <div className="modal-body" style={{marginTop:"20px"}}>
                        추가할 언어와 해당 언어의 능숙도를 선택하세요.
                        <div style={{textAlign:"center", marginTop:"20px"}}>
                            <select className="form-select" defaultValue="language" value={language} onChange={handleLanguageChange} aria-label="Default select example" style={{marginTop:"30px", marginBottom:"20px"}}>
                                <option value="language" disabled>언어를 선택하세요.</option>
                                <option value="한국어">한국어</option>
                                <option value="중국어">중국어</option>
                                <option value="일본어">일본어</option>
                            </select>

                            <select className="form-select" defaultValue="level" value={level} onChange={handleLevelChange} aria-label="Default select example" style={{marginTop:"30px", marginBottom:"20px"}}>
                                <option value='level' disabled>능숙도를 선택하세요.</option>
                                <option value="100">최상</option>
                                <option value="80">상</option>
                                <option value="60">중</option>
                                <option value="40">하</option>
                                <option value="20">최하</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleModal}>닫기</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddLanguage}>추가</button>
                    </div>
                </div>
            </div>
        </div>
    )
}