import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import ChatList from "../../components/Chat/ChatList";
import ChatMain from "../../components/Chat/ChatMain";
import Swal from "sweetalert2";
import "../../components/PageLayout/PageLayout.css"
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import style from './Chat.module.css';

const Chat = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [chatRoomList, setChatRoomList] = useState([]);
    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    const logInWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "주의",
            text: "로그인 후 이용해주세요!",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    // 서버에 정보를 요청하는 함수
    const fetchUserInfo = async () => {
        try {
            const token = getToken(); // 토큰 가져오기
            if (!token) {
                // 토큰이 없으면 로그인 페이지로 이동
                navigate('/sign-in');
                return;
            }
            const response = await axios.get('/api/auth/member/myPage', {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if (response.status === 200) {
                setUserInfo(response.data); // 서버에서 받은 사용자 정보 저장
            } else {
                console.log('서버 응답 오류:', response.status);
            }
        } catch (error) {
            if(error.response.status === 500) {
                console.log('500 start');
                logInWarning();
                navigate("/sign-in", {}) // 로그인하지 않은 사용자가 프로필 조회 시 로그인 페이지로 이동
                console.log('500 end');
            }
            console.error('사용자 정보를 가져오는 도중 오류 발생:', error);
        }
    };

    const loadChatRoomHistory = async () =>{
        try{
            const token = getToken(); // 토큰 가져오기
            const response = await axios.get('/api/auth/room',{
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if(response.status === 200){
                console.log(response.data);
                console.log(response.data.content);
                setChatRoomList(response.data); // 리스트로 들어가게된다
            }
        } catch(error){
            console.log("에러 발생");
        }
    };

    useEffect(() => {
        loadChatRoomHistory();
        setLoading(false);
    }, []);

    // 채팅방 선택 핸들러
    const handleSelectChatRoom = (room) => {
        setSelectedChatRoom(room);
        // 필요한 경우 채팅방 상세 페이지로 이동하는 코드 추가
        // 예: navigate(`/chat/rooms/${roomId}`);
    };

    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <>
            <div style={{backgroundColor: '#FBFBF3', height:'100vh'}}>
                <Header />
                <ul className="chatRoomList">
                    {chatRoomList.map((chatRoom) =>(
                        <div>
                            <li>
                                <Link to={`/chat/${chatRoom.id}`}>{chatRoom.id} 번 채팅방</Link>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Chat;