import React, { useState } from 'react'
import PercentBar from '../../../components/PercentBar/editPercentBar'

export default function AddLanuageModal({handleModal, addLanguage}) {
    const [language, setLanguage] = useState("");
    const [percentage, setPercentage] = useState(50);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handlePercentChange = (percentage) => {
       setPercentage(percentage)
    };

    const handleAddLanguage = () => {
        if (language !== null && percentage > 0) {
            addLanguage(language, percentage);
            handleModal(); // 모달 닫기
        } else if (percentage === 0) {
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
                            <select className="form-select" onChange={handleLanguageChange} aria-label="Default select example" style={{marginTop:"30px", marginBottom:"20px"}} defaultValue="">
                                <option value="" disabled>언어를 선택하세요.</option>
                                <option value="한국어">한국어</option>
                                <option value="중국어">중국어</option>
                                <option value="일본어">일본어</option>
                            </select>
                            <PercentBar percentage={50} onChange={handlePercentChange}></PercentBar>
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
