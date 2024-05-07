import React from 'react'

export default function RequestModal({renderTabContent, activeTab, setActiveTab, setShowRequests, type}) {
    const handleModal = () => {
        setActiveTab('receivedRequests'); //다시 모달창 켰을때 가장 먼저 받은 친구신청이 보이도록 설정
        setShowRequests(false); //모달창 닫기
    }

    return (
        <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{height:"450px"}}>
                        <ul className="nav nav-tabs">
                            {type === 'includeFriendList' &&
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'friends' ? 'active' : ''}`} 
                                        style={{ backgroundColor: activeTab === 'friends' ? '#B7DAA1' : 'white', color: "black"}}
                                        onClick={() => setActiveTab('friends')}
                                    >친구 리스트</button>
                                </li>
                            }
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'sentRequests' ? 'active' : ''}`} 
                                    style={{ backgroundColor: activeTab === 'sentRequests' ? '#B7DAA1' : 'white', color: "black"}}
                                    onClick={() => setActiveTab('sentRequests')}
                                >보낸 친구 신청</button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'receivedRequests' ? 'active' : ''}`} 
                                    style={{ backgroundColor: activeTab === 'receivedRequests' ? '#B7DAA1' : 'white', color: "black"}}
                                    onClick={() => setActiveTab('receivedRequests')}
                                >받은 친구 신청</button>
                            </li>
                        </ul>

                    <div className="modal-body" style={{width:"80%"}}>
                        {renderTabContent()}
                    </div>
                    <div className="modal-footer" style={{width: "100%"}}>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{width: "100%"}} onClick={handleModal}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
