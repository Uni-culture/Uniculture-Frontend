import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PercentBar from '../../../components/PercentBar/PercentBar';
import Swal from 'sweetalert2';
import { Card } from "antd";
import { SlBubbles, SlClose } from "react-icons/sl";

export default function FriendCard({userInfo, deleteFriend}) {
    const navigate = useNavigate();
    const [maxCanLanguage, setMaxCanLanguage] = useState(); // 능숙도가 가장 높은 사용 언어
    const [maxWantLanguage, setMaxWantLanguage] = useState(); // 능숙도가 가장 높은 학습 언어
    const [showAllHobbies, setShowAllHobbies] = useState(false); // 모든 취미 표시 여부 상태

    //친구 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${userInfo.nickname}`);
    }

    useEffect(() => {
        // 사용 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 언어 구하기
        const canLanguagesArray = Object.entries(userInfo.canLanguages).map(([language, level]) => ({ language, level }));
        const sortedCanLanguagesArray = [...canLanguagesArray].sort((a, b) => b.value - a.level);
        setMaxCanLanguage(sortedCanLanguagesArray[0]);

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 가장 높은 언어 구하기
        const wantLanguagesArray = Object.entries(userInfo.wantLanguages).map(([language, level]) => ({ language, level }));
        const sortedWantLanguagesArray = [...wantLanguagesArray].sort((a, b) => b.value - a.level);
        setMaxWantLanguage(sortedWantLanguagesArray[0]);
    }, [userInfo]);

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
    
    return (
        <Card 
            title={
                <div style={{ display: 'flex', alignItems:"center"}}>
                    {/* 프로필 사진 */}
                    <div style={{marginRight:"10px"}} onClick={handleProfile}>
                        <img
                            src={userInfo?.profileImage ? userInfo.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                            alt="profile"
                            style={{width:"40px", borderRadius: "50%"}}
                        />
                    </div>

                    {/* 닉네임 */}
                    <div onClick={handleProfile}>{userInfo.nickname}</div>

                    {/* 채팅 보내기 */}
                    <div style={{marginLeft: "15px"}}><SlBubbles size={20}/></div>
                </div>
            } 
        >
                {/* 친구 삭제 */}
                <div style={{ position: "absolute", top: "15px", right: "20px"}} onClick={handleDeleteFriend}><SlClose size={20}/></div>

                {/* 성별, 나이 */}
                <p>{userInfo.age} {userInfo.gender} </p>

                {/* 사용언어, 학습언어 */}
                {maxCanLanguage && <p><PercentBar language={maxCanLanguage.language} percentage={maxCanLanguage.level} color={"blue"}/></p>}
                {maxWantLanguage && <p><PercentBar language={maxWantLanguage.language} percentage={maxWantLanguage.level} color={"red"}/></p>}
                
                {/* 취미 */}
                <div style={{ marginTop: "30px" }}>
                {/* 취미 더보기 true/false */}
                {showAllHobbies ? ( 
                    //취미 더 보기
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "15px" }}>
                            {userInfo.hobbies && userInfo.hobbies.map((hobby, index) => (
                                <span key={index} style={{ borderRadius: "15px", backgroundColor: "#C6CAC3", padding: "2px 15px" }}>
                                    # {hobby}
                                </span>
                            ))}
                        </div>
                        {userInfo.hobbies && userInfo.hobbies.length > 3 && (
                            <div onClick={()=> setShowAllHobbies(false)} style={{ cursor: "pointer", marginTop: "10px", color: "blue" }}>
                                - 간략하게
                            </div>
                        )}
                    </div>
                ) : (
                    //취미 간략하게 보기(3개)
                    <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "15px" }}>
                            {userInfo.hobbies && userInfo.hobbies.slice(0, 3).map((hobby, index) => (
                                    <span key={index} style={{ borderRadius: "15px", backgroundColor: "#C6CAC3", padding: "2px 15px" }}>
                                        # {hobby}
                                    </span>
                            ))}
                        </div>
                        {userInfo.hobbies && userInfo.hobbies.length > 3 && (
                            <div onClick={()=> setShowAllHobbies(true)} style={{ cursor: "pointer", marginTop: "10px", color: "blue" }}>
                                + 더 보기
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
