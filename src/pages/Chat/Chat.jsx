import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import ChatList from "../../components/Chat/ChatList";
import ChatMain from "../../components/Chat/ChatMain";
import Swal from "sweetalert2";
import "../../components/PageLayout/PageLayout.css"
import { useNavigate} from "react-router-dom";
import axios from "axios";
import styles from './Chat.module.css';
import { LuMessageSquarePlus } from "react-icons/lu";
import { BiMessageRoundedDots } from "react-icons/bi";
import CreateChat from "../../components/Chat/CreateChat";

const Chat = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [userInfo, setUserInfo] = useState(null);
    const [selectedChatRoom, setSelectedChatRoom] = useState();
    const [createChatModal, setCreateChatModal] = useState(false);



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
                console.log(JSON.stringify(response.data));
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

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 채팅방 선택 핸들러
    const handleSelectChatRoom = (room) => {
        setSelectedChatRoom(room);
        navigate(`/chat/${room.id}`);
        // 필요한 경우 채팅방 상세 페이지로 이동하는 코드 추가
        // 예: navigate(`/chat/rooms/${roomId}`);
    };

    const handleCreateChatModal = () => {
        setCreateChatModal(!createChatModal);
    }

    const createChat = async (userInfo) => {
        try {
            const token = getToken(); // 토큰 가져오기
            if (!token) {
                // 토큰이 없으면 로그인 페이지로 이동
                navigate('/sign-in');
                return;
            }

            const response = await axios.post('/api/auth/room', {
                memberId: userInfo[0].id
            },  {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            if (response.status === 200) {
                setSelectedChatRoom(response.data); // 서버에서 받은 chatRoomId 저장
                // console.log(JSON.stringify(response.data));
                console.log(response.data);
                navigate(`/chat/${response.data.chatRoomId}`)
            } else {
                console.log('서버 응답 오류:', response.status);
            }
        } catch (error) {
            if(error.response.status === 500) {
                console.log('500 start');
                // logInWarning();
                // navigate("/sign-in", {}) // 로그인하지 않은 사용자가 프로필 조회 시 로그인 페이지로 이동
                console.log('500 end');
            }
            console.error('사용자 정보를 가져오는 도중 오류 발생:', error);
        }
    }

    return (
        <div style={{backgroundColor: '#FBFBF3', height:'100vh'}}>
            <Header />
            <div className={styles.page_layout}>
                <aside className={styles.aside}>
                    <div className={styles.asideTitle}> <h3>채팅</h3> <div onClick={handleCreateChatModal}><LuMessageSquarePlus size={25}/></div></div>
                    <ChatList onSelectedChatRoom={handleSelectChatRoom} user={userInfo}/>
                </aside>
                <div className={styles.chatmain}>
                    {selectedChatRoom== null ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <BiMessageRoundedDots size={100}/>
                            <span style={{fontSize: "20px", padding: "5px 0px"}}>내 메시지</span>
                            <span style={{fontSize: "14px", padding: "5px 0px 10px 0px", color: "#737373"}}>친구나 그룹에 비공개 사진과 메시지를 보내보세요.</span>
                            <button className= {styles.chatmainB} onClick={handleCreateChatModal}>메시지 보내기</button>
                        </div>
                    ): userInfo ? (
                        <ChatMain selectedChatRoom={selectedChatRoom} userInfo={userInfo}/>
                    ): (<div>Loading</div>)}
                </div>
            </div>
            {createChatModal && <CreateChat modal={handleCreateChatModal} createChat={createChat}/>}
        </div>
    );
};

export default Chat;