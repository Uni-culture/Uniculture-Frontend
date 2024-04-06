import React, { useState } from 'react';
import PercentBar from '../../../components/PercentBar/PercentBar';

export default function ShowAllLanguage({ canLanguages, wantLanguages, showAllLanguage }) {
    const [activeTab, setActiveTab] = useState('can');

    // 언어 모달창 : 선택된 탭에 따라 해당 목록을 표시하는 함수
    const renderTabContent = () => {
        switch (activeTab) {
            case 'can':
                return (
                    <div>
                        {canLanguages && canLanguages.map((language, index) => (
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', padding: '10px' }}>
                                <PercentBar key={index} language={language.language} level={language.level} color={"blue"}/>
                            </div>
                        ))}
                    </div>
                );
            case 'want':
                return (
                    <div>
                        {wantLanguages && wantLanguages.map((language, index) => (
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', padding: '10px' }}>
                                <PercentBar key={index} language={language.language} level={language.level} color={"red"}/>
                            </div>
                        ))}
                    </div>
                );
            default:
                return ;
        }
    };

    return (
        <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{ height: "450px" }}>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'can' ? 'active' : ''}`}
                                style={{ width: "150px", backgroundColor: activeTab === 'can' ? '#B7DAA1' : 'white', color: "black" }}
                                onClick={() => setActiveTab('can')}
                            >사용 언어</button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'want' ? 'active' : ''}`}
                                style={{ width: "150px", backgroundColor: activeTab === 'want' ? '#B7DAA1' : 'white', color: "black" }}
                                onClick={() => setActiveTab('want')}
                            >학습 언어</button>
                        </li>
                    </ul>

                    <div className="modal-body">
                        {renderTabContent()}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { showAllLanguage();}}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
