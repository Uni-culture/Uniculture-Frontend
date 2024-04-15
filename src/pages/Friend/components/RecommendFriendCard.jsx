import React, { useEffect, useState } from 'react'
import { Card } from "antd";
import { useNavigate } from 'react-router-dom';
import PercentBar from '../../../components/PercentBar/PercentBar';
import { GiMale, GiFemale } from "react-icons/gi";
import { BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";

export default function RecommendedFriendCard({userInfo, sendFriendRequest}) {
    const navigate = useNavigate();
    const [canLanguage, setCanLanguage] = useState(); // Card에 보이는 cl
    const [CLList, setCLList] = useState(); // 사용 언어 능숙도 높은순
    const [wantLanguage, setWantLanguage] = useState(); // Card에 보이는 wl
    const [WLList, setWLList] = useState(); // 학습 언어 능숙도 높은순

    const [showAllInfo, setShowAllInfo] = useState(false); // 모든 취미 표시 여부 상태
    const [showAllLanguage, setShowAllLanguage] = useState(false);
    const [activeTab2, setActiveTab2] = useState('can');

    //친구 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${userInfo.nickname}`);
    }

    useEffect(() => {
        // 사용 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 언어 구하기
        const canLanguagesArray = Object.entries(userInfo.canLanguages).map(([language, level]) => ({ language, level }));
        const sortedCanLanguagesArray = [...canLanguagesArray].sort((a, b) => b.level - a.level);
        setCLList(sortedCanLanguagesArray);
        setCanLanguage(sortedCanLanguagesArray[0]);

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 가장 높은 언어 구하기
        const wantLanguagesArray = Object.entries(userInfo.wantLanguages).map(([language, level]) => ({ language, level }));
        const sortedWantLanguagesArray = [...wantLanguagesArray].sort((a, b) => b.level - a.level);
        setWLList(sortedWantLanguagesArray);
        setWantLanguage(sortedWantLanguagesArray[0]);

    }, [userInfo]);

    // 취미 배열을 맨 앞에 hobby.same === true 인 항목이 오도록 재정렬하는 함수
    const sortHobbies = (hobbies) => {
        const sortedHobbies = [...hobbies];
        sortedHobbies.sort((a, b) => {
            if (a.same === true && b.same !== true) return -1; // a가 same === true이고 b가 same !== true인 경우 a를 더 앞에 위치시킵니다.
            if (a.same !== true && b.same === true) return 1; // b가 same === true이고 a가 same !== true인 경우 b를 더 앞에 위치시킵니다.
            return 0; // 같은 경우 순서를 유지합니다.
        });
        return sortedHobbies;
    };

    // 언어 모달창 : 선택된 탭에 따라 해당 목록을 표시하는 함수
    const renderTabContent2 = () => {
        switch (activeTab2) {
            case 'can':
                return (
                    <div>
                        {CLList && CLList.map((language, index) => (
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E0E0E0', padding: '10px' }}>
                                <PercentBar key={index} language={language.language} level={language.level} color={"blue"}/>
                            </div>
                        ))}
                    </div>
                );
            case 'want':
                return (
                    <div>
                        {WLList && WLList.map((language, index) => (
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

    const handleSendFriendRequest = () => {
        sendFriendRequest(userInfo);
    }

    return (
        <Card>
            <div style={{ display: 'flex', alignItems:"center", justifyContent: "space-between"}}>
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
                    <div onClick={handleProfile} style={{fontWeight : "bold", fontSize: "15px"}}>{userInfo.nickname}</div>

                    {/* 성별, 나이 */}
                    <div style={{fontWeight:"normal", display:"flex", marginLeft:"10px"}}>
                        {userInfo?.gender === "MAN" ? (
                                <GiMale color='blue' size={20} />
                        ):(
                            <GiFemale color='red' size={20}/>
                        )}
                        <div style={{fontSize:"13px", marginLeft:"3px"}}>{userInfo.age}</div>
                    </div>

                    <button
                        type="button"
                        style={{
                            width: "100px",
                            height: "25px",
                            marginLeft: "15px",
                            borderRadius:"25px",
                            backgroundColor:"#B7DAA1",
                            border:"0px"
                        }}
                        onClick={handleSendFriendRequest}
                    >
                        친구 신청
                    </button>

                    <button
                        type="button"
                        style={{
                            width: "100px",
                            height: "25px",
                            marginLeft: "15px",
                            borderRadius:"25px",
                            backgroundColor:"#B7DAA1",
                            border:"0px"
                        }}
                    >
                        채팅 보내기
                    </button>
                </div>
            </div>
         
            {/* 소개 */}
            {userInfo?.introduce && <div style={{textAlign: "left",  marginTop: "15px", marginBottom: "15px"}}>{userInfo?.introduce}</div>}

            {/* 더보기 true/false */}
            <div style={{ marginTop: "15px"}}>
                {showAllInfo ? ( 
                    <div>
                        {/* 언어 */}
                        <div style={{display: "flex", marginTop: "15px"}}>
                            {CLList && 
                                <div style={{marginBottom: "15px"}}>
                                    {CLList.map((language, index) => (
                                        <div key={index} style={{ padding: '8px' }}>
                                            <PercentBar language={language.language} level={language.level} color={"blue"}/>
                                        </div>
                                    ))}
                                </div>
                            }

                            {CLList && WLList && <div style={{ marginLeft : "10px", marginRight : "10px" , padding: "8px 0px"}}><FaExchangeAlt /></div>}

                            {WLList && 
                                <div style={{marginBottom: "15px"}}>
                                    {WLList.map((language, index) => (
                                        <div key={index} style={{ padding: '8px' }}>
                                            <PercentBar language={language.language} level={language.level} color={"red"}/>
                                        </div>
                                    ))}
                                </div>
                            }

                        </div>

                        {/* 관심사 */}
                        {sortHobbies(userInfo?.hobbies).map((hobby, index) => (
                            <div
                                key={`hobby_${index}`} 
                                style={{ 
                                    display: "inline-block",
                                    borderRadius: "9px", 
                                    backgroundColor: hobby.same == 1 ? "#C8DCA0" : "#e9ecef",
                                    padding: "5px 10px",
                                    marginRight: "3px",
                                    marginBottom: "5px"
                                }}
                            >
                                # {hobby.hobby}
                            </div>
                        ))}

                        <div onClick={()=> setShowAllInfo(false)} style={{ cursor: "pointer", marginTop: "10px", padding: "0px 8px", color: "blue" }}>
                            - 간략하게
                        </div>
                    </div>
                ) : (
                    // 간략하게 보기
                    <div>
                        {/* 사용언어, 학습언어 */}
                        <div style={{display:"flex", marginTop: "15px"}}>
                            {canLanguage && <div style={{marginBottom: "15px", padding: "8px"}}><PercentBar language={canLanguage.language} level={canLanguage.level} color={"blue"}/></div>}
                            {canLanguage && wantLanguage && <div style={{ marginLeft : "10px", marginRight : "10px" , padding: "8px 0px"}}><FaExchangeAlt /></div>}
                            {wantLanguage && <div style={{marginBottom: "15px", padding: "8px"}}><PercentBar language={wantLanguage.language} level={wantLanguage.level} color={"red"}/></div>}
                        </div>

                        {/* 취미 간략하게 보기(5개) */}
                        {sortHobbies(userInfo?.hobbies).slice(0, 5).map((hobby, index) => (
                            <div
                                key={`${userInfo.id}_${hobby.hobby}_${index}`} 
                                style={{ 
                                    display: "inline-block",
                                    borderRadius: "9px", 
                                    backgroundColor: hobby.same == 1 ? "#C8DCA0" : "#e9ecef",
                                    padding: "5px 10px",
                                    marginRight: "3px",
                                    marginBottom: "5px"
                                }}
                            >
                                # {hobby.hobby}
                            </div>
                        ))}

                        {( (CLList && CLList.length > 1) || (WLList && WLList.length > 1) || userInfo.hobbies.length > 5 ) && (
                            <div onClick={()=> setShowAllInfo(true)} style={{ cursor: "pointer", marginTop: "10px", padding: "0px 8px", color: "blue" }}>
                                + 더 보기
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 전체 사용, 학습 언어 보기 모달창 */}
            {showAllLanguage && (
                <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content" style={{height:"450px"}}>
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab2 === 'can' ? 'active' : ''}`} 
                                            style={{ width:"150px", backgroundColor: activeTab2 === 'can' ? '#B7DAA1' : 'white', color: "black"}}
                                            onClick={() => setActiveTab2('can')}
                                        >사용 언어</button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab2 === 'want' ? 'active' : ''}`} 
                                            style={{ width:"150px", backgroundColor: activeTab2 === 'want' ? '#B7DAA1' : 'white', color: "black"}}
                                            onClick={() => setActiveTab2('want')}
                                        >학습 언어</button>
                                    </li>
                                </ul>

                            <div className="modal-body">
                                {renderTabContent2()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {setShowAllLanguage(false); setActiveTab2('can')}}>닫기</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}
