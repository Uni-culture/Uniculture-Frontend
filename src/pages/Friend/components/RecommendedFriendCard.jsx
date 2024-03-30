import React, { useEffect, useState } from 'react'
import { Card } from "antd";
import { useNavigate } from 'react-router-dom';
import { GiMale, GiFemale } from "react-icons/gi";
import PercentBar from '../../../components/PercentBar/PercentBar';

export default function RecommendedFriendCard({userInfo}) {
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
        const sortedCanLanguagesArray = [...canLanguagesArray].sort((a, b) => b.level - a.level);
        setMaxCanLanguage(sortedCanLanguagesArray[0]);

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 가장 높은 언어 구하기
        const wantLanguagesArray = Object.entries(userInfo.wantLanguages).map(([language, level]) => ({ language, level }));
        const sortedWantLanguagesArray = [...wantLanguagesArray].sort((a, b) => b.level - a.level);
        setMaxWantLanguage(sortedWantLanguagesArray[0]);
    }, [userInfo]);

    return (
        <Card style={{display: "block", justifyContent: "space-between", marginBottom: "50px"}}>
            {/* 왼쪽 */}
            <div style={{float: "left", width:"30%", alignItems: "center", justifyContent:"center"}} onClick={handleProfile}>
                {/* 프로필 사진 */}
                <img
                    src={userInfo?.profileImage ? userInfo.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    alt="profile"
                    style={{width:"100px", height: "100px", borderRadius: "50%"}}
                />
            </div>
            {/* 오른쪽 */}
            <div style={{ float: "right", width:"60%", marginLeft: "30px" }}>
                <div style={{ marginLeft: "30px" }}> 
                    {/* 닉네임 */}
                    <label style={{fontWeight: "bold", fontSize: "20px"}} onClick={handleProfile}>{userInfo.nickname}</label>

                    {/* 성별, 나이 */}
                    <label style={{fontWeight:"normal", marginLeft:"10px", paddingTop: "3px"}}>
                        {userInfo?.gender === "MAN" ? (
                                <GiMale color='blue' size={20} />
                        ):(
                            <GiFemale color='red' size={20}/>
                        )}
                        <label style={{fontSize:"13px", marginLeft:"3px"}}>{userInfo.age}</label>
                    </label>
                </div>

                {/* 소개 */}
            <div style={{textAlign: "left"}}>{userInfo?.introduce}</div>

{/* 사용언어, 학습언어 */}
{maxCanLanguage && <div style={{margin:"15px 0px 15px 0px"}}><PercentBar language={maxCanLanguage.language} level={maxCanLanguage.level} color={"blue"}/></div>}
{maxWantLanguage && <div style={{margin:"15px 0px 15px 0px"}}><PercentBar language={maxWantLanguage.language} level={maxWantLanguage.level} color={"red"}/></div>}
    
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
            <div onClick={()=> setShowAllHobbies(false)} style={{ cursor: "pointer", marginTop: "10px", color: "blue" }}>
                - 간략하게
            </div>
        </div>
    ) : (
        //취미 간략하게 보기(3개)
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                {userInfo.hobbies && userInfo.hobbies.slice(0, 2).map((hobby, index) => (
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
            </div>
        </Card>
    )
}
