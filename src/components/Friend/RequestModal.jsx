import React, { useEffect, useState } from 'react'
import FriendList from '../../pages/Profile/components/FriendList';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../pages/api";

export default function RequestModal({ modal, handleReceivedRequestsNum, handleFriendNum, type }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('receivedRequests');
    const [friendList, setFriendList] = useState([]); //친구 목록
    const [sentRequests, setSentRequests] = useState([]); //보낸 친구 신청
    const [receivedRequests, setReceivedRequests] = useState([]); //받은 친구 신청

    const handleModal = () => {
        setActiveTab('receivedRequests'); //다시 모달창 켰을때 가장 먼저 받은 친구신청이 보이도록 설정
        modal(false); //모달창 닫기
    }

    const errorModal = (error) => {
        if(error.response.status === 401) {
            Swal.fire({
                icon: "warning",
                title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
                confirmButtonColor: "#8BC765",
                confirmButtonText: t('loginWarning.confirmButton'),
            }).then(() => {
                navigate("/sign-in");
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
    
    useEffect(() => {
        if(type === "includeFriendList") { fetchFriendList(); setActiveTab('receivedRequests'); }
        else if (type == "showFriendList") { fetchFriendList(); setActiveTab('friends'); }
        fetchSentRequests();
        fetchReceivedRequests();

        // 모달이 열렸을 때 body에 overflow: hidden 스타일을 적용하여 스크롤을 막음
        document.body.style.overflow = 'hidden';

        // 모달이 닫힐 때 body에 적용한 스타일을 제거하여 스크롤을 복원
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // 선택된 탭에 따라 해당 목록을 표시
    const renderTabContent = () => {
        switch (activeTab) {
            case 'friends':
                return (
                    <div>
                        {friendList && friendList.map((friend) => (
                            <FriendList key={friend.id} action= {activeTab} userInfo={friend} deleteFriend={deleteFriend} />
                        ))}
                    </div>
                );
            case 'sentRequests':
                return (
                    <div>
                        {sentRequests && sentRequests.map((request) => (
                            <FriendList key={request.id} action={activeTab} userInfo={request} cancelSentFriendRequest={cancelSentFriendRequest} />
                        ))}
                    </div>
                );
            case 'receivedRequests':
                return (
                    <div>
                        {receivedRequests && receivedRequests.map((request) => (
                            <FriendList key={request.id} action= {activeTab} userInfo={request} acceptReceivedRequest={acceptReceivedRequest} rejectReceivedRequest={rejectReceivedRequest} />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };
        
    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    // 친구 목록 불러오기
    const fetchFriendList = async () => {
        try {
            const token = getToken();

            const response = await api.get('/api/auth/friend', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setFriendList(response.data);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 보낸 친구 신청 목록 불러오기
    const fetchSentRequests = async () => {
        try {
            const token = getToken();

            const response = await api.get('/api/auth/friend-requests/sent', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setSentRequests(response.data);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 받은 친구 신청 목록 불러오기
    const fetchReceivedRequests = async () => {
        try {
            const token = getToken();

            const response = await api.get('/api/auth/friend-requests/receive', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setReceivedRequests(response.data);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 보낸 친구 신청 취소
    const  cancelSentFriendRequest = async (userInfo) => {
        try {
            const token = getToken();

            const response = await api.delete('/api/auth/friend-requests', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    targetId: userInfo.id
                }
            });
            
            if(response.status === 200){
                setSentRequests(sentRequests.filter(request => request.id !== userInfo.id)); //보낸 친구 신청 목록에서 삭제
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 친구 신청 받기
    const acceptReceivedRequest = async (userInfo) => {
        try {
            const token = getToken();

            const response = await api.put(`/api/auth/friend-requests/${userInfo.id}`, {
                status: 'accepted'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                console.log(userInfo.nickname + "님의 친구 요청을 수락했습니다.");
                setReceivedRequests(receivedRequests.filter(request => request.id !== userInfo.id)); //받은 친구 신청 목록에서 삭제
                if( type === 'includeFriendList' || type === 'showFriendList' ) {
                    setFriendList([...friendList, userInfo]); //친구 목록에 추가
                    handleReceivedRequestsNum("subtract");
                    handleFriendNum("add") //친구 수 + 1
                }
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 친구 신청 거절
    const  rejectReceivedRequest = async (userInfo) => {
        try {
            const token = getToken();

            const response = await api.put(`/api/auth/friend-requests/${userInfo.id}`, {
                status: 'rejected'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                console.log(userInfo.nickname + "님의 친구 요청을 거절했습니다.");
                setReceivedRequests(receivedRequests.filter(request => request.id !== userInfo.id)); //받은 친구 신청 목록에서 삭제
                if( type === 'includeFriendList' || type === 'showFriendList' ) handleReceivedRequestsNum("subtract");
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 친구 삭제
    const  deleteFriend = async (userInfo) => {
        try {
            const token = getToken();

            const response = await api.delete('/api/auth/friend', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    targetId: userInfo.id
                }
            });
            
            if(response.status === 200){
                console.log("친구 삭제 : " + userInfo.nickname);
                setFriendList(friendList.filter(request => request.id !== userInfo.id)); //친구 목록에서 삭제
                handleFriendNum("subtract") //친구 수 -1
            }
        } catch (error) {
            errorModal(error);
        }
    };

    return (
        <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content" style={{height:"450px"}}>
                        <ul className="nav nav-tabs">
                            {( type === 'includeFriendList' || type === 'showFriendList' ) &&
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
