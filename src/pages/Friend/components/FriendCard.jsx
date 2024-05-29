import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PercentBar from '../../../components/PercentBar/PercentBar';
import Swal from 'sweetalert2';
import { Card } from "antd";
import { SlBubbles, SlClose } from "react-icons/sl";
import { GiMale, GiFemale } from "react-icons/gi";
import styles from './FriendCard.module.css'
import {useTranslation} from "react-i18next";

export default function FriendCard({userInfo, deleteFriend, cl, wl, hb, sendMessage}) {
    const navigate = useNavigate();
    const [canLanguage, setCanLanguage] = useState(); // Card에 보이는 cl
    const [CLList, setCLList] = useState(); // 사용 언어 능숙도 높은순
    const [wantLanguage, setWantLanguage] = useState(); // Card에 보이는 wl
    const [WLList, setWLList] = useState(); // 학습 언어 능숙도 높은순

    const [showAllInfo, setShowAllInfo] = useState(false); // 모든 정보 보기 여부
    const [showAllLanguage, setShowAllLanguage] = useState(false);
    const [activeTab2, setActiveTab2] = useState('can');

    const { t } = useTranslation();

    //친구 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${userInfo.nickname}`);
    }

    //채팅 보내기
    const handleSendMessage = () => {
        sendMessage(userInfo);
    }

    useEffect(() => {
        // 사용 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 언어 구하기
        const canLanguagesArray = Object.entries(userInfo.canLanguages).map(([language, level]) => ({ language, level }));
        const sortedCanLanguagesArray = [...canLanguagesArray].sort((a, b) => b.level - a.level);
        setCLList(sortedCanLanguagesArray);

        //cl 값이 있으면 cl이 Card에 보이도록 설정
        if (sortedCanLanguagesArray.some(lang => lang.language === cl)) {
            const languageInfo = sortedCanLanguagesArray.find(lang => lang.language === cl);
            setCanLanguage(languageInfo);
        }
        else setCanLanguage(sortedCanLanguagesArray[0]);

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 가장 높은 언어 구하기
        const wantLanguagesArray = Object.entries(userInfo.wantLanguages).map(([language, level]) => ({ language, level }));
        const sortedWantLanguagesArray = [...wantLanguagesArray].sort((a, b) => b.level - a.level);
        setWLList(sortedWantLanguagesArray);
        
        //wl 값이 있으면 wl이 Card에 보이도록 설정
        if (sortedWantLanguagesArray.some(lang => lang.language === wl)) {
            const languageInfo = sortedWantLanguagesArray.find(lang => lang.language === wl);
            setWantLanguage(languageInfo);
        }
        else setWantLanguage(sortedWantLanguagesArray[0]);

       // 취미 중에서 hb와 동일한 항목을 맨 앞으로 이동
        if (hb && userInfo.hobbies && userInfo.hobbies.includes(hb)) {
            const updatedHobbies = [hb, ...userInfo.hobbies.filter(hobby => hobby !== hb)];
            userInfo.hobbies = updatedHobbies;
        }
    }, [userInfo, cl, wl, hb]);

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

    //친구 삭제
    const handleDeleteFriend = () => {
        Swal.fire({
            title: t('friendDelete.title'),
            text: t('friendDelete.text'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: t('friendDelete.deleteButton'),
            cancelButtonText: t('friendDelete.cancelButton')
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
                <div style={{ display: 'flex', alignItems:"center", justifyContent: "space-between"}}>
                    <div style={{ display: 'flex', alignItems:"center"}}>
                        {/* 프로필 사진 */}
                        <div className={styles.imageWrapper} onClick={handleProfile}>
                            <div className={styles.profileImageWrapper}>
                                <img
                                    src={userInfo?.profileurl ? userInfo.profileurl : "/default_profile_image.png"}
                                    alt="profile"
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.countryImageWrapper}>
                                <img className={styles.country} alt='country' src={`/${userInfo.country}.png`} />
                            </div>
                        </div>

                        {/* 닉네임 */}
                        <div className={styles.nickname} onClick={handleProfile}>{userInfo.nickname}</div>

                        {/* 성별, 나이 */}
                        <div style={{fontWeight:"normal", display:"flex", marginLeft:"5px"}}>
                            {userInfo?.gender === "MAN" ? (
                                    <GiMale color='blue' size={20} />
                            ):(
                                <GiFemale color='red' size={20}/>
                            )}
                            <div style={{fontSize:"13px", marginLeft:"3px"}}>{userInfo.age}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems:"center"}}>
                        {/* 채팅 보내기 */}
                        <div style={{marginLeft: "15px"}} onClick={handleSendMessage}><SlBubbles size={20}/></div>
                        {/* 친구 삭제 */}
                        {deleteFriend && <div style={{marginLeft: "15px"}} onClick={handleDeleteFriend}><SlClose size={20}/></div>}
                    </div>
                </div>
            }
        >   
        
            {/* 더보기 true/false */}
            {showAllInfo ? (
                <div>
                    {userInfo?.introduce && 
                        <div style={{textAlign: "left", marginBottom: "15px"}}>
                            {userInfo?.introduce}
                        </div>
                    }

                    {CLList && 
                        <div style={{marginBottom: "15px"}}>
                            <div style={{fontWeight: "bold"}}>🌎 사용 언어</div>
                            {CLList && CLList.map((language, index) => (
                                <div style={{ padding: '8px' }}>
                                    <PercentBar key={index} language={language.language} level={language.level} color={"blue"}/>
                                </div>
                            ))}
                        </div>
                    }
                    
                    {WLList && 
                        <div style={{marginBottom: "15px"}}>
                            <div style={{fontWeight: "bold"}}>🌎 학습 언어</div>
                            {WLList.map((language, index) => (
                                <div style={{ padding: '8px' }}>
                                    <PercentBar key={index} language={language.language} level={language.level} color={"red"}/>
                                </div>
                            ))}
                        </div>
                    }

                    {userInfo.hobbies && 
                        <div style={{marginBottom: "20px"}}>
                            <div style={{fontWeight: "bold", marginBottom: "5px"}}>❤️ 관심사</div>
                            {userInfo.hobbies.map((hobby, index) => (
                                <div
                                    key={index} 
                                    style={{ 
                                        display: "inline-block",
                                        borderRadius: "9px", 
                                        backgroundColor: hb === hobby ? "#C8DCA0" : "#e9ecef", 
                                        padding: "5px 10px",
                                        marginRight: "3px",
                                        marginTop: "5px"
                                    }}
                                >
                                    # {hobby}
                                </div>
                            ))}
                        </div>
                    }

                    <div onClick={()=> setShowAllInfo(false)} style={{ height: "20px",cursor: "pointer", color: "blue" }}>
                        - 간략하게
                    </div>
                </div>
            ) : (
                //간략하게 보기
                <div>
                    {userInfo?.introduce ? (
                        <div style={{height: "20px", textAlign: "left", marginBottom: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                            {userInfo?.introduce}
                        </div>
                    ) : (
                        <div style={{height: "20px", textAlign: "left", marginBottom: "15px", color: "#A6A3A3"}}>친구가 설정한 소개가 없습니다.</div>
                    )}

                    {/* 사용언어, 학습언어 */}
                    {canLanguage ? (
                        <div style={{height: "22px", marginBottom: "15px"}}><PercentBar language={canLanguage.language} level={canLanguage.level} color={"blue"}/></div>
                    ) : (
                        <div style={{height: "22px", marginBottom: "15px", color: "#A6A3A3"}}>친구가 설정한 사용 언어가 없습니다.</div>
                    )}
                    {wantLanguage ? (
                        <div style={{height: "22px", marginBottom: "15px"}}><PercentBar language={wantLanguage.language} level={wantLanguage.level} color={"red"}/></div>
                    ) : (
                        <div style={{height: "22px", marginBottom: "15px", color: "#A6A3A3"}}>친구가 설정한 학습 언어가 없습니다.</div>
                    )}

                    {/* 관심사 */}
                    {userInfo?.hobbies.length > 0 ? (
                        <div style={{marginBottom: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                            {userInfo.hobbies.map((hobby, index) => (
                                <div
                                    key={index} 
                                    style={{ 
                                        display: "inline-block",
                                        height: "30px",
                                        borderRadius: "9px", 
                                        backgroundColor: hb === hobby ? "#C8DCA0" : "#e9ecef", 
                                        padding: "5px 10px",
                                        marginRight: "3px",
                                        // marginTop: "5px",
                                    }}
                                >
                                    # {hobby}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{height: "30px",marginBottom: "10px", color: "#A6A3A3"}}>친구가 설정한 관심사가 없습니다.</div>
                    )}

                    {( (CLList && CLList.length > 1) || (WLList && WLList.length > 1) || userInfo.hobbies.length > 4 ) ? (
                        <div onClick={()=> setShowAllInfo(true)} style={{ height: "20px",cursor: "pointer", color: "blue" }}>
                            + 더 보기
                        </div>
                    ) : (
                        <div style={{ height: "20px"}}/>
                    )}
                </div>
            )}

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
    );
}
