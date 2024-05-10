import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout'
import { TbAdjustmentsHorizontal, TbSearch } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import FriendCard from './components/FriendCard';
import { Badge, Input } from "antd";
import { AiOutlineBell } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';
import { TbReload } from "react-icons/tb";
import RecommendFriendCard from './components/RecommendFriendCard';
import presentImg from '../../assets/presentImg.png';
import openImg from '../../assets/openimg.png'
import styles from './Friend.module.css';
import RequestModal from '../../components/Friend/RequestModal';
import Filter from './components/Filter';

export default function Friend() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myFriends'); //컴포넌트 선택
    const [friendList, setFriendList] = useState([]); //친구 목록
    const [receivedRequestsNum, setReceivedRequestsNum] = useState(0); // 받은 요청 수

    const [recommendFriendList, setRecommendFriendList] = useState([]); //추천 친구 목록
    const [recommendCount, setRecommendCount] = useState(null); //추천 친구 새로고침 잔여 횟수
    const [showPresent, setShowpresent] = useState(null); //모든 추천친구 isOpen === false인지 아닌지
    const [presentOpen, setPresentOpen] = useState(false); //선물상자를 열었는지 아닌지
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 여부를 저장하는 상태

    //검색
    const [searchInput, setSearchInput] = useState(null); // 검색창 값
    const [isLoading, setIsLoading] = useState(false); //검색 로딩 상태

    //필터
    const [showFilter, setShowFilter] = useState(false); //필터 div 보이기
    
    //select
    const [selectGender, setSelectGender] = useState("ge"); //선택 성별
    const [selectMina, setSelectMina] = useState('0'); //선택 최소나이
    const [selectMaxa, setSelectMaxa] = useState('100'); //선택 최대나이
    const [selectCL, setSelectCL] = useState("cl"); //선택 사용언어
    const [selectWL, setSelectWL] = useState("wl"); //선택 학습언어
    const [selectHb, setSelectHb] = useState("hb"); //선택 관심사

    //pagination
    const [pageCount, setPageCount] = useState(0); //전체 페이지 수
    const [currentPage, setCurrentPage] = useState(0); //현재 페이지

    //친구 신청 모달창
    const [showRequests, setShowRequests] = useState(false);

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    // 친구 목록 불러오기, 검색
    const fetchFriendList = async (page) => {
        try {
            console.log("친구 목록 불러오기");
            const token = getToken();

            let Query= searchInput ? `name=${searchInput}&` : '';

            const response = await axios.get(`/api/auth/friend/detail?${Query}page=${page}&size=6`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setFriendList(response.data.content);
                setPageCount(response.data.totalPages);
            }
            else if(response.status === 400){
                console.log("친구 목록 불러오기 클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("친구 목록 불러오기 서버 오류");
            }
            
        } catch (error) {
            navigate("/");
        }
    };

    // 추천 친구 목록 불러오기
    const fetchRecommendFriend = async () => {
        try {
            console.log("추천 친구 목록 불러오기");
            const token = getToken();

            const response = await axios.get(`/api/auth/friend/recommend`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setRecommendFriendList(response.data);
                console.log("추천 친구 : " + JSON.stringify(response.data));
                console.log("추천 친구 수: " + response.data.length);

                // 모든 추천 친구의 isOpen 속성이 false인지 확인
                const allClosed = response.data.every(friend => !friend.isOpen);
                if (allClosed) {
                    setShowpresent(false);
                    setPresentOpen(false);
                    console.log("showPresent === false");
                }
                else { 
                    setShowpresent(true); 
                    console.log("showPresent === true");
                }
            }
            else if(response.status === 400){
                console.log("친구 목록 불러오기 클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("친구 목록 불러오기 서버 오류");
            }
            
        } catch (error) {
            console.log(error);
        }
    };

    // 추천 친구 목록 다시 불러오기
    const recommendFriendReload = async () => {
        try {
            console.log("추천 친구 목록 다시 불러오기");
            const token = getToken();

            const response = await axios.get(`/api/auth/friend/recommend/reload`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setPresentOpen(false);
                setRecommendFriendList(response.data);
                recommendFriendCount();
                console.log("추천 친구 : " + JSON.stringify(response.data));
                console.log("추천 친구 수: " + response.data.length);

                // 모든 추천 친구의 isOpen 속성이 false인지 확인
                const allClosed = response.data.every(friend => !friend.isOpen);
                if (allClosed) {
                    setShowpresent(false);
                    console.log("showPresent === false");
                }
                else { 
                    setShowpresent(true); 
                    console.log("showPresent === true");
                }
            }
            else if(response.status === 400){
                console.log("친구 목록 다시 불러오기 클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("친구 목록 다시 불러오기 서버 오류");
            }
            
        } catch (error) {
            console.log(error);
        }
    };

    // 추천 친구 새로고침 잔여 횟수
    const recommendFriendCount = async () => {
        try {
            console.log("추천 친구 목록 새로고침 잔여 횟수");
            const token = getToken();

            const response = await axios.get(`/api/auth/friend/recommend/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setRecommendCount(response.data);
                console.log("추천 친구 목록 새로고침 잔여 횟수" + response.data);

            }
            else if(response.status === 400){
                console.log("추천 친구 목록 새로고침 잔여 횟수 클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("추천 친구 목록 새로고침 잔여 횟수 서버 오류");
            }
            
        } catch (error) {
            console.log(error);
        }
    };

    //검색 내용 바뀌면 실행
    useEffect(() => {
        if(activeTab==='myFriends') {
            fetchFriendList(0); //친구목록(페이지1) 불러오기
            fetchReceivedRequests(); //받은 친구 요청 수 불러오기
        }
        else fetchRecommendFriend(0); //추천친구(페이지1) 불러오기
    }, [activeTab]);

    //검색 내용 바뀌면 실행
    useEffect(() => {
        if(searchInput !== null){
            setIsLoading(true); // 로딩 상태를 활성화합니다.
            const timerId = setTimeout(() => {
                setCurrentPage(0);
                fetchFriendList(0).then(() => {
                    setIsLoading(false); // fetchFriendList가 완료되면 로딩 상태를 비활성화합니다.
                });
            }, 800);
    
            return () => {
                clearTimeout(timerId);
            };
        }
    }, [searchInput]);

    // 페이지 변경 시 해당 상태를 업데이트하는 함수
    const changePage = (event) => {
        const page = event.target.outerText - 1;
        setCurrentPage(page); //현재 페이지

        if(selectGender === 'ge' && selectMina ==='0' && selectMaxa === '100' && selectCL === "cl" && selectWL === "wl" && selectHb === "hb") fetchFriendList(page);
        else fetchFriendFilter(page);
    }
    
    //내 친구/추천 친구 선택
    const renderTabContent = () => {
        switch (activeTab) {
            case 'myFriends':
                return (
                    <div style={{marginTop: "30px"}}>
                        {friendList.length > 0 ? (
                            <div className={styles.myfrineds}>
                                {friendList.map((friend) => (
                                    <div key={friend.id} style={{ width: "350px", marginBottom: "20px"}}>
                                        <FriendCard key={friend.id} userInfo={friend} deleteFriend={deleteFriend} cl={selectCL} wl={selectWL} hb={selectHb} sendMessage={sendMessage}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                {selectGender === 'ge' && selectMina ==='0' && selectMaxa === '100' && selectCL === "cl" && selectWL === "wl" && selectHb === "hb" ? (
                                    <p>친구를 추가해주세요.</p>
                                ) : (
                                    <p>죄송합니다, 해당 조건에 맞는 결과가 없습니다.</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 'recommend':
                return (
                    <div style={{marginTop:"30px"}}>
                        {showPresent ? (
                            <>
                                {recommendFriendList.length > 0 ? (
                                    <div className={styles.recommend}>
                                        {recommendFriendList.map((friend) => (
                                            <div key={friend.id} style={{ marginBottom: "20px" }}>
                                                <RecommendFriendCard key={friend.id} userInfo={friend} sendFriendRequest={sendFriendRequest} sendMessage={sendMessage}/>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <p>아쉽게도, 현재 시스템에서 추천할 친구를 찾지 못했습니다.</p>
                                        <p>사용자의 활동이나 관심사를 더 많이 입력해주시면 보다 정확한 추천을 제공할 수 있습니다.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{textAlign: "center", width: "100%", paddingTop: "50px"}}>
                                {presentOpen ? (
                                    <img
                                        style={{width: "200px"}}
                                        alt='openimg'
                                        src={openImg}
                                    />
                                ) : (
                                    <img
                                        className={isAnimating ? `${styles.vibration}` : ""} // 애니메이션이 실행 중일 때 클래스 추가
                                        style={{width: "200px"}}
                                        alt='presentimg'
                                        src={presentImg}
                                        onClick={handlePresentImg}
                                    />
                                )}
                            </div>
                        )}
                        
                    </div>
                );
            default:
                return null;
        }
    };

    const handlePresentImg = () => { // presentImg를 클릭하면 2초 후에 openImg 이미지로 변경
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            setPresentOpen(true);
            setTimeout(() => {
                setShowpresent(true);
            }, 500);
        }, 1000);
    };

    //친구 신청
    const sendFriendRequest = async (userInfo) => {
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await axios.post('/api/auth/friend', {
                targetId: userInfo.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });

            if(response.status === 200){
                alert("친구 신청 성공");
                console.log(userInfo.nickname + "님에게 친구 신청");
            }
            else if(response.status === 400){
                console.log("친구 신청 클라이언트 에러");
            }
            else if(response.status === 500){
                console.log("친구 신청 서버 에러");
            }
        } catch (error) {
            console.error('친구 걸기 오류 발생:', error);
        }
    }

    //채팅 보내기
    const sendMessage = async (otherInfo) => {
        try {
            const token = getToken(); // 토큰 가져오기

            if(token){ //로그인 O
                const response = await axios.get(`/api/auth/room/duo?toId=${otherInfo.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    console.log(response);
                    navigate(`/chat/${response.data.chatRoomId}`);
                }
                else if(response.status === 400){
                    console.log("채팅 보내기 클라이언트 에러");
                }
                else if(response.status ===  500){
                    console.log("채팅 보내기 서버 에러");
                }
            }
            else {
                alert("로그인 해주세요.");
                navigate("/sign-in");
            }
        } catch (error) {
            console.error('채팅 보내기 오류 발생:', error);
        }
    }

    // 친구 삭제
    const  deleteFriend = async (friendInfo) => {
        try {
            const token = getToken();

            const response = await axios.delete('/api/auth/friend/deleteFriend', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    targetId: friendInfo.id
                }
            });
            
            if(response.status === 200){
                console.log("친구 삭제 : " + friendInfo.nickname);
                setCurrentPage(0);
                fetchFriendList(0);
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
                setReceivedRequestsNum(response.data.length);
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

    // 모달이 표시될 때 친구 목록을 불러옴
    useEffect(() => {
        if(!showRequests) { //모달창 닫을 때 요청
            fetchFriendList(currentPage); 
        }
    }, [showRequests]);

    const handleReceivedRequestsNum = (type) => {
        if(type === "add") setReceivedRequestsNum(receivedRequestsNum + 1);
        else if( type === "subtract") setReceivedRequestsNum(receivedRequestsNum - 1);
    }

    //필터 선택
    const handleSelect = (value, select) => {
        if(select === "gender") setSelectGender(value);
        else if(select === "mina") setSelectMina(value);
        else if(select === "maxa") setSelectMaxa(value);
        else if(select === "cl") setSelectCL(value);
        else if(select === "wl") setSelectWL(value);
        else if(select === "hobby") setSelectHb(value);
    }

    //친구 필터링
    const fetchFriendFilter = async (page) => {
        try {
            console.log("친구 필터링");
            const token = getToken();

            let Query= ''; 
            if (selectGender !== 'ge') Query += `ge=${selectGender}&`;
            if (selectMina !=='0' || selectMaxa !== '100' ) Query += `mina=${selectMina}&maxa=${selectMaxa}&`;
            if (selectCL !== "cl") Query += `cl=${selectCL}&`;
            if (selectWL !== "wl") Query += `wl=${selectWL}&`;
            if (selectHb !== "hb") Query += `hb=${selectHb}&`;

            let response;
            if(activeTab==="myFriends"){
                response = await axios.get(`/api/auth/friend/search?${Query}page=${page}&size=6`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            else {
                response = await axios.get(`/api/auth/friend/search2?${Query}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            
            if(response.status === 200){
                console.log("성공");
                if(activeTab==="myFriends"){
                    console.log("myFriends : " + JSON.stringify(response.data.content));
                    setFriendList(response.data.content);
                    setPageCount(response.data.totalPages);
                } 
                else { console.log("전체 친구 필터링 : " + JSON.stringify(response.data.content)); setRecommendFriendList(response.data.content); }
            }
            else if(response.status === 400){
                console.log("친구 필터링 클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("친구 필터링 서버 오류");
            }
        } catch (error) {
            console.log("친구 필터링 오류 :" + error);
        }
    };

    //필터내용 바뀌면 실행
    useEffect(() => {
        if(showFilter){
            setCurrentPage(0);
            fetchFriendFilter(0);
        }
    }, [selectGender, selectMina, selectMaxa, selectCL, selectWL, selectHb]);

    //필터 없애기
    const resetFilter = (bool) => {
        setSelectGender("ge");
        setSelectMina('0');
        setSelectMaxa('100');
        setSelectCL("cl");
        setSelectWL("wl");
        setSelectHb("hb");

        if(bool==="false") setShowFilter(false);

        setCurrentPage(0);
        if(activeTab==="myFriends") fetchFriendList(0);
        else fetchRecommendFriend(0);
    }

    return (
        <Layout>
            <div style={{display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display:"flex", alignItems: "center"}}>
                    <div>
                        <ul className="nav">
                            <li 
                                className="nav-item"
                                style={{ width:"65px", fontWeight: activeTab === 'myFriends' ? 'bold' : 'normal', marginRight: "20px"}}
                                onClick={() => {setActiveTab('myFriends'); resetFilter("false");}}>
                                내 친구
                            </li>
                            <li 
                                className="nav-item"
                                style={{ width:"70px", fontWeight: activeTab === 'recommend' ? 'bold' : 'normal' }}
                                onClick={() => {setActiveTab('recommend'); setSearchInput(null); resetFilter("false"); recommendFriendCount();}}>
                                추천 친구
                            </li>
                        </ul>
                    </div>
                    
                    {activeTab === 'myFriends' && (
                        <div style={{marginLeft: "20px"}}>
                            <Input
                                placeholder="Search for friends"
                                prefix={<TbSearch style={{ color: 'rgba(0,0,0,.25)' }} />}
                                style={{width: 300, minWidth: 100}}
                                onChange={(e) => setSearchInput(e.target.value)}
                                suffix={
                                    // isLoading 상태에 따라 로딩 이미지를 표시합니다.
                                    isLoading && (
                                        <img
                                            src={require('../../assets/Spinner@2x-1.0s-200px-200px.gif')}
                                            alt="Loading..."
                                            style={{
                                                width: '30px', // 이미지의 크기를 조정할 수 있습니다.
                                                height: '30px', // 이미지의 크기를 조정할 수 있습니다.
                                            }}
                                        />
                                    )
                                }
                            /> 
                        </div>
                    )}

                    {activeTab==='myFriends' && <div style={{fontSize: "25px", marginLeft: "20px", paddingBottom: "5px"}} onClick={()=>{setShowFilter(!showFilter); }}><TbAdjustmentsHorizontal /></div>}
                
                </div>

                <div style={{display: "flex"}}>
                    {activeTab=="recommend" && 
                        <>
                            <span 
                                style={{marginRight: "2px", color: recommendCount > 0 ? "black" : "#737373"}} 
                                onClick={recommendCount > 0 ? recommendFriendReload : null}>
                                    <TbReload size={25}/>

                            </span> 
                            {recommendCount > 0 ? (
                                <span style={{marginRight: "10px", color: "#737373", fontSize: "11px", alignSelf: "flex-end"}} >( {recommendCount} / 3)</span>
                            ) : (
                                <span style={{marginRight: "10px", color: "#737373", fontSize: "11px", alignSelf: "flex-end"}} >매일 00시에 초기화됩니다.</span>
                            )}
                        </>
                    }
                    
                    <Badge count={receivedRequestsNum} size="small" overflowCount={10}>
                        <AiOutlineBell size={25} onClick={() => {
                            setShowRequests(true);
                        }}/>
                    </Badge>              
                </div>
            </div>

            {/* 친구 필터 */}
            {showFilter && (
                <Filter handleSelect={handleSelect} resetFilter={resetFilter} ge={selectGender} mina={selectMina} maxa={selectMaxa} cl={selectCL} wl={selectWL} hb={selectHb}/>
            )}

            {renderTabContent()}
            {friendList.length > 0 && activeTab === 'myFriends' && (
                <div style={{display: "flex", justifyContent: "center", marginTop: "30px", width: "100%" }}>
                    <Pagination page={currentPage + 1} count={pageCount}  defaultPage={1} onChange={changePage} showFirstButton showLastButton />
                </div>
            )}

            {/* 친구 신청 모달창 */}
            {showRequests && (
                <RequestModal modal={setShowRequests} handleReceivedRequestsNum={handleReceivedRequestsNum} />
            )}

        </Layout>
    )
}