import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function FriendList({action, userInfo, deleteFriend, cancelSentFriendRequest, acceptReceivedRequest, rejectReceivedRequest, onUserSelect}) {
    const navigate = useNavigate();

    //친구 삭제
    const handleDeleteFriend = () => {
        Swal.fire({
            title: "정말 이 친구를 삭제하시겠어요?",
            text: "삭제 시 해당 친구가 친구 목록에서 사라집니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                // 친구 삭제하는 함수 호출
                deleteFriend(userInfo);
            }
        });
    }

    //친구 신청 취소
    const handleCancelRequest = () => {
        cancelSentFriendRequest(userInfo);
    };

    //친구 신청 수락
    const handleAcceptRequest = () => {
        acceptReceivedRequest(userInfo);
    }

    //친구 신청 거절
    const handleRejectRequest = () => {
        rejectReceivedRequest(userInfo);
    }

    //친구 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${userInfo.nickname}`);
    }

    // FriendList 클릭 시 선택된 사용자 정보 전달
    const handleCheck = () => {
        if (onUserSelect) {
            onUserSelect(userInfo.nickname);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', padding: '10px 0', alignItems:"center" }}>
            <div style={{ display: 'flex', alignItems:"center"}}>
                <div style={{marginRight:"10px"}} onClick={handleProfile}>
                    <img
                    src={userInfo?.profileImage ? userInfo.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    alt="profile"
                    style={{width:"40px", borderRadius: "50%"}}
                    />
                </div>
                <div onClick={handleProfile}>
                    {userInfo?.nickname}
                </div>
            </div>

            {/* 친구 목록 */}
            {action === 'friends' && 
                <div>
                    <button 
                        onClick={handleDeleteFriend}
                        style={{ 
                            backgroundColor: 'white', 
                            color: 'black', 
                            border: 'none', 
                            borderRadius:"15px",
                            padding: '5px 10px', 
                            marginRight: '10px', 
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B7DAA1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >❌</button>

                    <button 
                        style={{ 
                            backgroundColor: 'white', 
                            color: 'black', 
                            border: 'none', 
                            borderRadius:"15px",
                            padding: '5px 10px', 
                            marginRight: '10px', 
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B7DAA1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >💌</button>
                </div>
            }

            {/* 보낸 친구 신청 */}
            {action === 'sentRequests' && 
                <div>
                    <button 
                        onClick= {handleCancelRequest}
                        style={{ 
                            backgroundColor: 'white', 
                            color: 'black', 
                            border: 'none', 
                            borderRadius:"15px",
                            padding: '5px 10px', 
                            marginRight: '10px', 
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B7DAA1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >❌</button>
                </div>
            }

            {/* 받은 친구 신청 */}
            {action === 'receivedRequests' && 
                <div>
                    <button 
                        onClick={handleRejectRequest}
                        style={{ 
                            backgroundColor: 'white', 
                            color: 'black', 
                            border: 'none', 
                            borderRadius:"15px",
                            padding: '5px 10px', 
                            marginRight: '10px', 
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B7DAA1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >❌</button>

                    <button 
                        onClick={handleAcceptRequest}
                        style={{ 
                            backgroundColor: 'white', 
                            color: 'black', 
                            border: 'none',
                            borderRadius:"15px",
                            padding: '5px 10px', 
                            cursor: 'pointer' 
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B7DAA1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                    >⭕️</button>
                </div>
            }

            {/* 받은 친구 신청 */}
            {action === 'createChat' && 
                <input
                type="checkbox"
                onChange={handleCheck}
              />
            }

        </div>
    );
};
