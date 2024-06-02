import React, { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import "./ChatMain.css";
import {Link, useNavigate} from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import { ChatMessage } from "./ChatMessage";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import api from "../../pages/api";
import { ConstructionOutlined } from "@mui/icons-material";

const ChatMain = ({selectedChatRoom, userInfo}) => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [stompClient, setStompClient] = useState(null);

    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    const errorModal = (error) => {
        if(error.response.status === 401) {
            Swal.fire({
                icon: "warning",
                title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('loginWarning.title')}</div>`,
                confirmButtonColor: "#8BC765",
                confirmButtonText: t('loginWarning.confirmButton'),
            }).then(() => {
                navigate("/sign-in");
            })
        }
        else {
            Swal.fire({
                icon: "warning",
                title: `<div style='font-size: 21px; margin-bottom: 10px;'>${t('serverError.title')}</div>`,
                confirmButtonColor: "#8BC765",
                confirmButtonText: t('serverError.confirmButton'),
            })
        }
    };

    useEffect(()=>{
        const token = getToken();

        const loadChatHistory = async () => {
            try {
                const token = getToken(); // 토큰 가져오기
                const response = await api.get(`/api/auth/room/${selectedChatRoom.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    console.log(response.data);
                    setChats(response.data);
                }
            } catch (error) {
                errorModal(error);
            }
        };

        loadChatHistory();

        const clientdata = new StompJs.Client({
            // brokerURL: "ws://13.209.41.67:8080/ws",          //웹소켓 주소.
            brokerURL:"ws://localhost:8080/ws",
            debug: function (str) {
                console.log('STOMP' + str);
            },
            reconnectDelay: 5000,       //자동 재연결 ? 
            onConnect: (frame) => {
                console.log('채팅내역 연결', frame);
                clientdata.subscribe(`/sub/chat/room/${selectedChatRoom.id}`, (message) => {
                    //수신 처리
                    const receivedMessage = JSON.parse(message.body);
                    console.log(receivedMessage);
                    setChats(prevChats => [...prevChats, receivedMessage]); // 수신 메시지 추가
                });
            },
            connectHeaders: {
                Authorization: getToken(),
            },
            onStompError:(frame)=>{
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        
        clientdata.activate();
        setStompClient(clientdata);

        return ()=>{
            clientdata.deactivate();
        }
    },[selectedChatRoom]);
    


    const handleSendChat = () =>{
        if(stompClient && stompClient.connected && currentChat){
            const message = {               //메시지 포멧 DTO 참조
                type: "TALK",
                roomId: selectedChatRoom.id,
                message: currentChat,
            };
            console.log(message);
            stompClient.publish({
                destination: `/pub/chat/${selectedChatRoom.id}`,
                body: JSON.stringify(message),
            });
            setCurrentChat("");
        }
        
    }

    const modify = (current, modifyMessage) =>{
        console.log("수정 요청 드가자~");
        if(stompClient && stompClient.connected && current && modifyMessage){
            const message = {               //메시지 포멧 DTO 참조
                type: "ENTER",
                roomId: selectedChatRoom.id,
                message: current+"*#%"+modifyMessage,
            };
            console.log(message);
            stompClient.publish({
                destination: `/pub/chat/${selectedChatRoom.id}`,
                body: JSON.stringify(message),
            });
            setCurrentChat("");
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const formData = new FormData();
            console.log(formData);
            formData.append('files', file);

            try {
                const response = await api.post('/api/file', formData);

                if (response.status === 200) {
                    if(stompClient && stompClient.connected){
                    const fileUrl = response.data;
                    const message = {
                        type:"IMAGE",
                        roomId: selectedChatRoom.id,
                        message: fileUrl,
                    };
                    console.log(message);
                    stompClient.publish({
                        destination: `/pub/chat/${selectedChatRoom.id}`,
                        body: JSON.stringify(message)
                    });
                    setCurrentChat('');
                }}
            } catch (error) {
                errorModal(error);
            }
            // 파일 입력 요소 초기화
            fileInputRef.current.value = null;
        }
    };

    const handlePlusIconClick = () => {
        fileInputRef.current.click();
    };

    
    //채팅 맨 아래로 이동
    useEffect(() => { 
        messageEndRef.current.scrollIntoView({});
    }, [chats]); 
    
    return (
        <div className="chat-main">
        {selectedChatRoom ? (
                <>
                    <div className="chat-name">
                        <h4>{t('chat.with', { username: selectedChatRoom.username })}</h4>
                    </div>
                    <div className="chats">
                        {chats.map(chat =>(
                            <ChatMessage chat={chat} userInfo={userInfo} key={chat.id} chatroom={selectedChatRoom} modify={modify}/>
                        ))}
                        <div ref={messageEndRef}></div>
                    </div>
                    <div className="chat-input">
                        <FiPlusCircle onClick={handlePlusIconClick} style={{alignSelf:"center", marginRight:"5px"}} />
                        <input 
                            type="file"
                            ref={fileInputRef}
                            className="file-input"
                            onChange={handleFileUpload}
                        />
                        <input 
                            type="text"
                            value={currentChat}
                            onChange={(e) => setCurrentChat(e.target.value)}
                            onKeyDown={(e) =>{
                                if (e.key === 'Enter'&& e.nativeEvent.isComposing===false) {
                                    handleSendChat();
                                }
                            }}
                        />
                            <button onClick={handleSendChat}>{t('chat.sendButton')}</button>
                    </div>
                </>
            ):(
                <div>{t('chat.selectPrompt')}</div>
            )}
            
        </div>
        
    );
};

export default ChatMain;