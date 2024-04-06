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
import { GrClose } from "react-icons/gr";
import RecommendFriendCard from './components/RecommendFriendCard';

export default function Friend() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myFriends'); //컴포넌트 선택
    const [friendList, setFriendList] = useState([]); //친구 목록
    const [recommendFriendList, setRecommendFriendList] = useState([]); //추천 친구 목록

    //검색
    const [searchInput, setSearchInput] = useState(null); // 검색창 값

    //필터
    const { Option } = Select;
    const [showFilter, setShowFilter] = useState(false); //필터 div 보이기
    
    //select
    const [selectGender, setSelectGender] = useState("ge"); //선택 성별
    const [selectMina, setSelectMina] = useState('0'); //선택 최소나이
    const [selectMaxa, setSelectMaxa] = useState('100'); //선택 최대나이
    const [selectCL, setSelectCL] = useState("cl"); //선택 사용언어
    const [selectWL, setSelectWL] = useState("wl"); //선택 학습언어
    const [selectHb, setSelectHb] = useState("hb"); //선택 취미

    //pagination
    const [pageCount, setPageCount] = useState(0); //전체 페이지 수
    const [currentPage, setCurrentPage] = useState(0); //현재 페이지
    const [pageCount2, setPageCount2] = useState(0); //추천 친구 전체 페이지 수

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
            console.log("친구 목록 불러오기");
            const token = getToken();

            const response = await axios.get(`/api/auth/friend/recommend`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if(response.status === 200){
                setRecommendFriendList(response.data);
                setPageCount2(Math.ceil(response.data.length / 4)); //전체 페이지 수 
                console.log("추천 친구 : " + JSON.stringify(response.data));
            }
            else if(response.status === 400){
                console.log("친구 목록 불러오기 클라이언트 오류");
            }
            else if(response.status === 500){
                console.log("친구 목록 불러오기 서버 오류");
            }
            
        } catch (error) {
            Swal.fire({
                title: "로그인 해주세요.",
                text: "로그인 창으로 이동합니다.",
                icon: "warning",
                confirmButtonColor: "#dc3545",
                confirmButtonText: "확인"
            }).then(() => {
                navigate("/sign-in");
            });
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
            const timerId = setTimeout(() => {
                setCurrentPage(0);
                fetchFriendList(0);
            }, 1000);
    
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
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" }}>
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

    //Gender 선택
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

            const response = await axios.get(`/api/auth/friend/search?${Query}page=${page}&size=6`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
                
            if(response.status === 200){
                console.log("성공");
                setFriendList(response.data.content);
                setPageCount(response.data.totalPages);
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
        setCurrentPage(0);
        if(selectGender !== 'ge' || selectMina !=='0' || selectMaxa !== '100' || selectCL !== "cl" || selectWL !== "wl" || selectHb !== "hb") fetchFriendFilter(0);
    }, [selectGender, selectMina, selectMaxa, selectCL, selectWL, selectHb]);

    //필터 없애기
    const resetFriend = () => {
        setSelectGender("ge");
        setSelectMina('0');
        setSelectMaxa('100');
        setSelectCL("cl");
        setSelectWL("wl");
        setSelectHb("hb");

        setShowFilter(false);
        setCurrentPage(0);
        fetchFriendList(0);
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
                                onClick={() => setActiveTab('myFriends')}>
                                내 친구
                            </li>
                            <li 
                                className="nav-item"
                                style={{ width:"70px", fontWeight: activeTab === 'recommend' ? 'bold' : 'normal' }}
                                onClick={() => {setActiveTab('recommend'); setSearchInput(''); setShowFilter(false)}}>
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
                            />
                        </div>
                    )}

                    { activeTab==='myFriends' && <div style={{fontSize: "25px", marginLeft: "20px", paddingBottom: "5px"}} onClick={()=>{setShowFilter(!showFilter); }}><TbAdjustmentsHorizontal /></div>}
                
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
                        style={{ width: 120 }} 
                        onChange={(value) => handleSelect(value, "gender")}
                    >
                        <Option value="ge" disabled>Gender</Option>
                        <Option value="MAN">Man</Option>
                        <Option value="WOMAN">Woman</Option>
                    </Select>

                    <input style={{width: "100px"}} placeholder={selectMina} value={selectMina} onChange={(e) => handleSelect(e.target.value, "mina")}/>
                    <input style={{width: "100px"}} placeholder={selectMaxa} value={selectMaxa} onChange={(e) => handleSelect(e.target.value, "maxa")}/>

                    <Select
                        defaultValue="cl"
                        value={selectCL} 
                        style={{ width: 150 }} 
                        onChange={(value) => handleSelect(value, "cl")}
                    >
                        <Option value="cl" disabled>Can Language</Option>
                        <Option value="한국어">한국어</Option>
                        <Option value="일본어">일본어</Option>
                        <Option value="중국어">중국어</Option>
                    </Select>

                    <Select
                        defaultValue="wl"
                        value={selectWL} 
                        style={{ width: 150 }} 
                        onChange={(value) => handleSelect(value, "wl")}
                    >
                        <Option value="wl" disabled>Want Language</Option>
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
                        <Option value="hb" disabled>Hobby</Option>
                        <Option value="요리">요리</Option>
                        <Option value="산책">산책</Option>
                        <Option value="쇼핑">쇼핑</Option>
                        <Option value="여행">여행</Option>
                        <Option value="드라이브">드라이브</Option>
                    </Select>

                    <div style={{marginLeft: "10px"}} onClick={()=> {resetFriend();}}><GrClose/></div>
                </div>
            )}

            <div style={{alignItems:"center"}}>{renderTabContent()}</div>
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
