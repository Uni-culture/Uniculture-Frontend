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
import { GrCheckmark, GrPowerReset } from "react-icons/gr";

export default function Friend() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myFriends'); //컴포넌트 선택
    const [friendList, setFriendList] = useState([]); //친구 목록

    //검색
    const [searchInput, setSearchInput] = useState(''); // 검색창 값
    const [searchResult, setSearchResult] = useState(null); // 검색 결과

    //필터
    const { Option } = Select;
    const [showFilter, setShowFilter] = useState(false); //필터 div 보이기
    const [friendFilter, setFrinedFilter] = useState(false); //필터링 한 친구 목록인지
    const [filterContent, setFilterContent] = useState(null); //필터 성별
    
    //select
    const [selectGender, setSelectGender] = useState("GENDER"); //선택 성별

    //pagination
    const [pageCount, setPageCount] = useState(0); //전체 페이지 수
    const [resultPage, setResultPage] = useState(0); //검색결과 전체 페이지 수
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

    // 친구 목록 불러오기
    const fetchFriendList = async (page) => {
        try {
            console.log("친구 목록 불러오기");
            const token = getToken();

            const response = await axios.get(`/api/auth/friend/detail?page=${page}&size=3`, {
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

    useEffect(() => {
        if(filterContent) fetchFriendFilter(currentPage);
        else fetchFriendList(currentPage);
    }, [currentPage]);

    // 페이지 변경 시 해당 상태를 업데이트하는 함수
    const changePage = (event) => {
        setCurrentPage(event.target.outerText - 1); //현재 페이지
    }
    
    //내 친구/추천 친구 선택
    const renderTabContent = () => {
        switch (activeTab) {
            case 'myFriends':
                return (
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "50px", marginTop:"30px"}}>
                        {friendList && friendList.map((friend) => (
                            <FriendCard key={friend.id} userInfo={friend} deleteFriend={deleteFriend}/>
                        ))}
                    </div>
                );
            case 'recommended':
                return (
                    <div style={{marginTop:"30px"}}>추천 친구</div>
                );
            default:
                return null;
        }
    };

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
                fetchFriendList(currentPage); //현재 페이지 친구 목록 다시 불러오기
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
    const handleGenderFilter = (value) => {
        console.log(`selected Gender : ${value}`);
        setSelectGender(value);
    }

    //친구 필터링
    const fetchFriendFilter = async (page) => {
        try {
            console.log("친구 필터링");
            const token = getToken();

            let Query= '' 
            console.log(filterContent.ge);
            Query= filterContent.ge ? `ge=${filterContent.ge}` : '';

            const response = await axios.get(`/api/auth/friend/serach?${Query}&page=${page}&size=3`, {
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

    //filterContent 수정
    const handleFilter = async () => {
        setFilterContent({ ge: selectGender });
    }

    //필터내용 바뀌면 실행
    useEffect(() => {
        if(filterContent) fetchFriendFilter(0);
    }, [filterContent]);

    //필터 재설정
    const resetFilter = () => {
        setSelectGender("GENDER");
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
                                style={{ width:"70px", fontWeight: activeTab === 'recommended' ? 'bold' : 'normal' }}
                                onClick={() => {setActiveTab('recommended'); setSearchResult(null); setSearchInput(null)}}>
                                추천 친구
                            </li>
                        </ul>
                    </div>
                    
                    {activeTab === 'myFriends' && (
                        <div style={{marginLeft: "20px"}}>
                            <Input
                                placeholder="Search for friends"
                                prefix={<TbSearch style={{ color: 'rgba(0,0,0,.25)' }} />}
                                style={{width: 300}}
                                // onChange={(e) => searchFriend(e.target.value)}
                            />
                        </div>
                    )}

                    <div style={{fontSize: "25px", marginLeft: "20px", paddingBottom: "5px"}} onClick={()=>{setShowFilter(!showFilter); resetFilter();}}><TbAdjustmentsHorizontal /></div>
                
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
                        defaultValue="GENDER"
                        value={selectGender} 
                        style={{ width: 120 }} 
                        onChange={handleGenderFilter}
                    >
                        <Option value="GENDER" disabled>Gender</Option>
                        <Option value="MAN">Man</Option>
                        <Option value="WOMAN">Woman</Option>
                    </Select>

                    <div style={{marginLeft: "10px"}} onClick={() => {setFrinedFilter(true); handleFilter(0)}}><GrCheckmark /></div>
                    <div style={{marginLeft: "10px"}} onClick={()=> {resetFilter();}}><GrPowerReset /></div>
                </div>
            )}

            <div style={{float:"left", textAlign:"center"}}>
                {renderTabContent()}
                {activeTab === 'myFriends' && (
                    <div style={{display: "flex", justifyContent: "center", marginTop: "50px"}}>
                        <Pagination page={currentPage + 1} count={pageCount}  defaultPage={1} onChange={changePage} showFirstButton showLastButton />
                    </div>
                )}
            </div>

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
