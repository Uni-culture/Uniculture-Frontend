import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Layout from '../../components/Layout'
import { TbAdjustmentsHorizontal, TbSearch } from "react-icons/tb";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FriendCard from './components/FriendCard';
import FriendList from '../Profile/components/FriendList';
import { Badge, Input, Select} from "antd";
import { AiOutlineBell } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';
import { GrClose, GrPowerReset } from "react-icons/gr";
import RecommendFriendCard from './components/RecommendFriendCard';

export default function Friend() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myFriends'); //컴포넌트 선택
    const [friendList, setFriendList] = useState([]); //친구 목록
    const [recommendFriendList, setRecommendFriendList] = useState([]); //추천 친구 목록
    const interestTag = [ // 관심사 태그
        "요리",
        "여행",
        "영화",
        "드라마",
        "애니메이션",
        "유튜브",
        "넷플릭스",
        "웹툰",
        "게임",
        "음악",
        "미술",
        "공예",
        "독서",
        "축구",
        "야구",
        "농구",
        "테니스",
        "배드민턴",
        "볼링",
        "탁구",
        "서핑",
        "스노우보드",
        "헬스",
        "명상",
        "요가",
        "필라테스",
        "과학",
        "패션",
        "메이크업",
        "헤어",
        "사진",
        "자연",
        "탐험",
        "캠핑",
        "등산",
        "재태크",
        "k-pop",
        "자원봉사",
        "사회공헌"
    ];

    //검색
    const [searchInput, setSearchInput] = useState(null); // 검색창 값
    const [isLoading, setIsLoading] = useState(false); //검색 로딩 상태

    //필터
    const { Option } = Select;
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
    const [activeTab2, setActiveTab2] = useState('receivedRequests');
    const [sentRequests, setSentRequests] = useState([]); //보낸 친구 신청
    const [receivedRequests, setReceivedRequests] = useState([]); //받은 친구 신청

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

    //검색 내용 바뀌면 실행
    useEffect(() => {
        if(activeTab==='myFriends') fetchFriendList(0);
        else fetchRecommendFriend(0);
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
                    // <div style={{marginTop: "30px", display: "flex", justifyContent: "center" }}>
                    <div style={{display: "flex", justifyContent: "center", marginTop: "30px", width: "100%", paddingLeft: "50px"}}>
                        {friendList.length > 0 ? (
                            // <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "30px"}}>
                                {friendList.map((friend) => (
                                    <div key={friend.id} style={{ flexBasis: "350px", minWidth: "350px", marginBottom: "20px" }}>
                                        <FriendCard key={friend.id} userInfo={friend} deleteFriend={deleteFriend} cl={selectCL} wl={selectWL} hb={selectHb}/>
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
                        {recommendFriendList.length > 0 ? (
                            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "40px" }}>
                                {recommendFriendList.map((friend) => (
                                    <div key={friend.id} style={{ flexBasis: "550px", minWidth: "550px", marginBottom: "20px" }}>
                                        <RecommendFriendCard key={friend.id} userInfo={friend} sendFriendRequest={sendFriendRequest}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>아쉽게도, 현재 시스템에서 추천할 친구를 찾지 못했습니다.</p>
                                <p>사용자의 활동이나 관심사를 더 많이 입력해주시면 보다 정확한 추천을 제공할 수 있습니다.</p>
                            </div>
                        )}
                        {/* {friendList.length > 0 && (
                            <div style={{display: "flex", justifyContent: "center", marginTop: "30px", width: "100%" }}>
                                <Pagination page={currentPage + 1} count={pageCount}  defaultPage={1} onChange={changePage} showFirstButton showLastButton />
                            </div>
                        )} */}
                    </div>
                );
            default:
                return null;
        }
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
                fetchFriendList(currentPage); //현재 페이지 친구 목록 다시 불러오기
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
        fetchSentRequests();
        fetchReceivedRequests();
    }, [showRequests]);

    // 친구 모달창 : 선택된 탭에 따라 해당 목록을 표시하는 함수
    const renderTabContent2 = () => {
        switch (activeTab2) {
            case 'sentRequests':
                return (
                    <div>
                        {sentRequests && sentRequests.map((request) => (
                            <FriendList key={request.id} action={activeTab2} userInfo={request} cancelSentFriendRequest={cancelSentFriendRequest} />))}
                    </div>
                );
            case 'receivedRequests':
                return (
                    <div>
                        {receivedRequests && receivedRequests.map((request) => (
                            <FriendList key={request.id} action= {activeTab2} userInfo={request} acceptReceivedRequest={acceptReceivedRequest} rejectReceivedRequest={rejectReceivedRequest} />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

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
            else if(activeTab==="recommend"){
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
        
        // if(selectGender !== 'ge' || selectMina !=='0' || selectMaxa !== '100' || selectCL !== "cl" || selectWL !== "wl" || selectHb !== "hb") {
        if(showFilter){
            setCurrentPage(0);
            fetchFriendFilter(0);
        }
        
        // }
    }, [selectGender, selectMina, selectMaxa, selectCL, selectWL, selectHb]);

    //필터 없애기
    const resetFriend = (bool) => {
        setSelectGender("ge");
        setSelectMina('0');
        setSelectMaxa('100');
        setSelectCL("cl");
        setSelectWL("wl");
        setSelectHb("hb");

        if(bool==="false") setShowFilter(false);

        setCurrentPage(0);
        // if(activeTab==="myFriends") fetchFriendList(0);
        // else fetchRecommendFriend(0);
    }

    return (
        <Layout>
            <div style={{display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{display:"flex", alignItems: "center"}}>
                    <div>
                        <ul className="nav">
                            <li 
                                className="nav-item"
                                style={{ width:"50px", fontWeight: activeTab === 'myFriends' ? 'bold' : 'normal', marginRight: "20px"}}
                                onClick={() => {setActiveTab('myFriends'); resetFriend("false");}}>
                                내 친구
                            </li>
                            <li 
                                className="nav-item"
                                style={{ width:"70px", fontWeight: activeTab === 'recommend' ? 'bold' : 'normal' }}
                                onClick={() => {setActiveTab('recommend'); setSearchInput(null); resetFriend("false"); }}>
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

                    <div style={{fontSize: "25px", marginLeft: "20px", paddingBottom: "5px"}} onClick={()=>{setShowFilter(!showFilter); }}><TbAdjustmentsHorizontal /></div>
                
                </div>

                <div>
                    <Badge count={receivedRequests.length} size="small" overflowCount={10}>
                        <AiOutlineBell size={25} onClick={() => {
                            setShowRequests(true);
                            setActiveTab2('receivedRequests');
                        }}/>
                    </Badge>              
                </div>
            </div>

            {/* 친구 필터 */}
            {showFilter && (
                <div style={{display:"flex", marginTop:"10px"}}>
                    <Select
                        defaultValue="ge"
                        value={selectGender} 
                        style={{ width: 120, marginRight: "5px" }} 
                        onChange={(value) => handleSelect(value, "gender")}
                    >
                        <Option value="ge" >Gender</Option>
                        <Option value="MAN">Man</Option>
                        <Option value="WOMAN">Woman</Option>
                    </Select>

                    <input 
                        style={{width: "80px", marginRight: "5px", padding: "0 11px", borderRadius: "6px", border: "1px solid #d9d9d9", boxSizing: "border-box", fontSize: "14px"}} 
                        placeholder={selectMina} 
                        value={selectMina} 
                        onChange={(e) => handleSelect(e.target.value, "mina")}
                    />
                    <input 
                        style={{width: "80px", marginRight: "5px", padding: "0 11px", borderRadius: "6px", border: "1px solid #d9d9d9", boxSizing: "border-box", fontSize: "14px"}} 
                        placeholder={selectMaxa} 
                        value={selectMaxa} 
                        onChange={(e) => handleSelect(e.target.value, "maxa")}
                    />

                    <Select
                        defaultValue="cl"
                        value={selectCL} 
                        style={{ width: 150, marginRight: "5px" }} 
                        onChange={(value) => handleSelect(value, "cl")}
                    >
                        <Option value="cl" >Can Language</Option>
                        <Option value="한국어">한국어</Option>
                        <Option value="일본어">일본어</Option>
                        <Option value="중국어">중국어</Option>
                    </Select>

                    <Select
                        defaultValue="wl"
                        value={selectWL} 
                        style={{ width: 150, marginRight: "5px" }} 
                        onChange={(value) => handleSelect(value, "wl")}
                    >
                        <Option value="wl" >Want Language</Option>
                        <Option value="한국어">한국어</Option>
                        <Option value="일본어">일본어</Option>
                        <Option value="중국어">중국어</Option>
                    </Select>

                    <Select
                        defaultValue="hb"
                        value={selectHb} 
                        style={{ width: 150 }} 
                        onChange={(value) => handleSelect(value, "hobby")}
                    >
                        <Option value="hb" >Interest</Option>
                        {interestTag.map((hobby)=>(
                            <Option value={hobby}>{hobby}</Option>
                        ))}
                    </Select>

                    <div style={{marginLeft: "10px"}} onClick={()=> {resetFriend();}}><GrPowerReset /></div>
                    <div style={{marginLeft: "10px"}} onClick={()=> {resetFriend("false");}}><GrClose/></div>
                </div>
            )}

            {renderTabContent()}
            {friendList.length > 0 && activeTab === 'myFriends' && (
                <div style={{display: "flex", justifyContent: "center", marginTop: "30px", width: "100%" }}>
                    <Pagination page={currentPage + 1} count={pageCount}  defaultPage={1} onChange={changePage} showFirstButton showLastButton />
                </div>
            )}

            {/* 친구 신청 모달창 */}
            {showRequests && (
                <div className="modal fade show" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content" style={{height:"450px"}}>
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab2 === 'sentRequests' ? 'active' : ''}`} 
                                            style={{ backgroundColor: activeTab2 === 'sentRequests' ? '#B7DAA1' : 'white', color: "black"}}
                                            onClick={() => setActiveTab2('sentRequests')}
                                        >보낸 친구 신청</button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab2 === 'receivedRequests' ? 'active' : ''}`} 
                                            style={{ backgroundColor: activeTab2 === 'receivedRequests' ? '#B7DAA1' : 'white', color: "black"}}
                                            onClick={() => setActiveTab2('receivedRequests')}
                                        >받은 친구 신청</button>
                                    </li>
                                </ul>

                            <div className="modal-body">
                                {renderTabContent2()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {setShowRequests(false); setActiveTab2('receivedRequests')}}>닫기</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    )
}
