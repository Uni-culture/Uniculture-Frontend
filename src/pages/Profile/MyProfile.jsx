import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { AiOutlineBell } from "react-icons/ai";
import { Badge} from "antd";
import axios from 'axios';
import styles from './Profile.module.css';
import Layout from "../../components/Layout";
import PercentBar from "../../components/PercentBar/PercentBar";
import FriendList from "./components/FriendList";
import { PiPlusCircleBold, PiPlusCircleFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { FaExchangeAlt } from "react-icons/fa";
import LanguageList from './components/LanguageList';
import MyBoardList from "./MyBoardList";
import TotalBoardList from "../BoardList/TotalBoardList";

export default function MyProfile({myInformation}) {
    const [myInfo, setMyInfo] = useState(myInformation); // 매개변수로 받은것을 가지고 다시 상태유지
    const [friendNum, setFriendNum] = useState(myInformation.friendnum) // 친구수락, 삭제시 친구수 관리를 위해

    const [maxCanLanguage, setMaxCanLanguage] = useState(); // 능숙도가 가장 높은 사용 언어
    const [maxWantLanguage, setMaxWantLanguage] = useState(); // 능숙도가 가장 높은 학습 언어

    //친구 모달창
    const [showFriend, setShowFriend] = useState(false);
    const [activeTab, setActiveTab] = useState('friends');
    const [friendList, setFriendList] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    //언어 모달창
    const [onMouseSpan, setOnMouseSpan] = useState(false);
    const [showAllLanguage, setShowAllLanguage] = useState(false);
    const [activeTab2, setActiveTab2] = useState('can');
    const [canLanguages, setCanLanguages] = useState([]); //사용 언어 능숙도가 높은 순
    const [wantLanguages, setWantLanguages] = useState([]); //학습 언어 능숙도가 높은 순

    useEffect(() => {
        setMyInfo(myInformation); // myInformation을 props로 받아서 업데이트
    }, [myInformation]);

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    // 친구 목록 불러오기
    const fetchFriendList = async () => {
        try {
            const token = getToken();

            const response = await axios.get('/api/auth/friend', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setFriendList(response.data);
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
            
        } catch (error) {
            console.error('친구 목록을 불러오는 중 에러 발생:', error);
        }
    };

    // 보낸 친구 신청 목록 불러오기
    const fetchSentRequests = async () => {
        try {
            const token = getToken();

            const response = await axios.get('/api/auth/friend/checkMyRequest', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setSentRequests(response.data);
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
            
        } catch (error) {
            console.error('친구 신청 보낸 목록을 불러오는 중 에러 발생:', error);
        }
    };

    // 받은 친구 신청 목록 불러오기
    const fetchReceivedRequests = async () => {
        try {
            const token = getToken();

            const response = await axios.get('/api/auth/friend/checkRequest', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setReceivedRequests(response.data);
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
        
        } catch (error) {
            console.error('친구 신청 받은 목록을 불러오는 중 에러 발생:', error);
        }
    };

    // 친구 삭제
    const  deleteFriend = async (userInfo) => {
        try {
            const token = getToken();

            const response = await axios.delete('/api/auth/friend/deleteFriend', {
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
                setFriendNum(friendNum - 1); //친구 수 수정
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
            
        } catch (error) {
            console.error('친구 삭제 중 에러 발생:', error);
        }
    };

    // 보낸 친구 신청 취소
    const  cancelSentFriendRequest = async (userInfo) => {
        try {
            const token = getToken();

            const response = await axios.delete('/api/auth/friend', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    targetId: userInfo.id
                }
            });
            
            if(response.status === 200){
                console.log(userInfo.nickname + "님에게 보낸 친구 신청을 취소합니다.");
                setSentRequests(sentRequests.filter(request => request.id !== userInfo.id)); //보낸 친구 신청 목록에서 삭제
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
            
        } catch (error) {
            console.error('보낸 친구 신청 취소 중 에러 발생:', error);
        }
    };

    // 친구 신청 받기
    const acceptReceivedRequest = async (userInfo) => {
        try {
            const token = getToken();

            const response = await axios.post('/api/auth/friend/accept', {
                targetId: userInfo.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                console.log(userInfo.nickname + "님의 친구 요청을 수락했습니다.");
                setReceivedRequests(receivedRequests.filter(request => request.id !== userInfo.id)); //받은 친구 신청 목록에서 삭제
                setFriendList([...friendList, userInfo]); //친구 목록에 추가
                setFriendNum(friendNum + 1); //친구 수 수정
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
            
        } catch (error) {
            console.error('친구 신청 수락 중 에러 발생:', error);
        }
    };

    // 친구 신청 거절
    const  rejectReceivedRequest = async (userInfo) => {
        try {
            const token = getToken();

            const response = await axios.post('/api/auth/friend/reject', {
                targetId: userInfo.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                console.log(userInfo.nickname + "님의 친구 요청을 거절했습니다.");
                setReceivedRequests(receivedRequests.filter(request => request.id !== userInfo.id)); //받은 친구 신청 목록에서 삭제
            }
            else if(response.status === 400){
                console.log("클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("서버 오류");
            }
            
        } catch (error) {
            console.error('친구 신청 거절 중 에러 발생:', error);
        }
    };

    // 모달이 표시될 때 친구 목록을 불러옴
    useEffect(() => {
        fetchFriendList();
        fetchSentRequests();
        fetchReceivedRequests();
    }, [showFriend]);

    // 친구 모달창 : 선택된 탭에 따라 해당 목록을 표시하는 함수
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
                            <FriendList key={request.id} action={activeTab} userInfo={request} cancelSentFriendRequest={cancelSentFriendRequest} />))}
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
                return ;
        }
    };

    useEffect(() => {
        // 사용 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 순으로 정렬
        const canLanguagesArray = Object.entries(myInfo.canlanguages).map(([language, value]) => ({ language, value }));
        setCanLanguages(canLanguagesArray);
        setCanLanguages(prevCanLanguages => [...prevCanLanguages].sort((a, b) => b.value - a.value));

        // 학습 언어 배열로 변환하여 업데이트한 후 능숙도가 높은 순으로 정렬
        const wantLanguagesArray = Object.entries(myInfo.wantlanguages).map(([language, value]) => ({ language, value }));
        setWantLanguages(wantLanguagesArray);
        setWantLanguages(prevWantLanguages => [...prevWantLanguages].sort((a, b) => b.value - a.value));  
    }, [myInfo]);

    useEffect(() => {
        setMaxCanLanguage(canLanguages[0]);
    }, [canLanguages]);
    
    useEffect(() => {
        setMaxWantLanguage(wantLanguages[0]);
    }, [wantLanguages]);


    // 언어 모달창 : 선택된 탭에 따라 해당 목록을 표시하는 함수
    const renderTabContent2 = () => {
        switch (activeTab2) {
            case 'can':
                return (
                    <div>
                        {canLanguages && canLanguages.map((language, index) => (
                            <LanguageList key={index} language={language.language} value={language.value} color={"blue"}/>
                        ))}
                    </div>
                );
            case 'want':
                return (
                    <div>
                        {wantLanguages && wantLanguages.map((language, index) => (
                            <LanguageList key={index} language={language.language} value={language.value} color={"red"}/>
                        ))}
                    </div>
                );
            default:
                return ;
        }
    };

    return (
        <Layout>
            {/* 프로필 사진 */}
            <div className={styles.left}>
                <div className={styles.imageWrapper}>
                    <img
                        src={myInfo?.profileImage ? myInfo.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt="profile"
                        className={styles.image}
                    />
                </div>
            </div>

            <div className={styles.right}>

                {/* 닉네임 */}
                <div className={styles.name}>{myInfo?.nickname}</div>

                {/* 정보 수정 */}
                <div className={styles.edit}>
                    <Link to="/accounts/edit">
                        <IoIosSettings size={20} color="gray" />
                    </Link>
                </div>
                    
                {/* 소개 */}
                {myInfo?.introduce && <div className={styles.intro}>{myInfo.introduce}</div>}

                {/* 게시글, 친구 */}
                <div>
                    <div className={styles.post}>게시글</div>
                    <div className={styles.postNum}>{myInfo?.postnum}</div>
                    {/* 친구, 친구수중 아무거나 클릭하더라도 setShowFriend state 를 변경시켜서 모달창을띄움(useEffect 에 showfriend 가 걸려있기때문에 리렌더링) */}
                    <div className={styles.friend} onClick={()=> {setShowFriend(true)}}>친구</div>
                    <div className={styles.friendNum} onClick={()=> {setShowFriend(true)}}>{friendNum}</div>
                    <Badge count={myInfo?.receiverequestnum} size="small" overflowCount={10}>
                        <AiOutlineBell size={20} onClick={() => {
                            setShowFriend(true);
                            setActiveTab('receivedRequests');
                        }}/>
                    </Badge>
                </div>

                {/* 언어 */}
                {(maxCanLanguage || maxWantLanguage) &&
                    <div style={{ display: "flex", marginTop:"20px"}}>
                        {maxCanLanguage && <div><PercentBar language={maxCanLanguage.language} percentage={maxCanLanguage.value} color={"blue"} /></div>}
                        {maxCanLanguage && maxWantLanguage && <div style={{ marginLeft : "20px", marginRight : "20px" }}><FaExchangeAlt /></div>}
                        {maxWantLanguage && <div><PercentBar language={maxWantLanguage.language} percentage={maxWantLanguage.value} color={"red"} /></div>}
                        <span
                            style={{marginLeft: "10px"}}
                            onClick={()=> setShowAllLanguage(true)}
                            onMouseEnter={()=> setOnMouseSpan(true)}                                onMouseLeave={()=> setOnMouseSpan(false)}
                        >
                            {onMouseSpan ? <PiPlusCircleFill size={20}/> : <PiPlusCircleBold size={20}/>}
                        </span>
                    </div>
                }

                {/* 취미 */}
                {myInfo.hobbies && 
                    <div style={{ display: "flex", marginTop:"20px"}}>
                        {myInfo.hobbies && myInfo.hobbies.map((hobby, index) => (
                            <div key={index} style={{ borderRadius:"15px", backgroundColor:"#C6CAC3", padding:"2px 15px", marginRight: "10px" }}>
                                #{hobby}
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className={styles.boardStyle}>
                <MyBoardList />
            </div>



            {/* 친구리스트 모달창 */}
            {showFriend && (
                <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content" style={{height:"450px"}}>
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'friends' ? 'active' : ''}`} 
                                            style={{ backgroundColor: activeTab === 'friends' ? '#B7DAA1' : 'white', color: "black"}}
                                            onClick={() => setActiveTab('friends')}
                                        >친구 리스트</button>
                                    </li>
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

                            <div className="modal-body">
                                {renderTabContent()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {setShowFriend(false); setActiveTab('friends')}}>닫기</button>
                            </div>
                        </div>
                    </div>
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

        </Layout>
    );
};
