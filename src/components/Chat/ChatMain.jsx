import React, { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import "./ChatMain.css";
import axios from "axios";
import {Link} from "react-router-dom";

const ChatMain = ({selectedChatRoom, userInfo}) => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const messageEndRef = useRef(null);

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    useEffect(()=>{
        const token = getToken();

        const loadChatHistory = async () => {
            try {
                const token = getToken(); // 토큰 가져오기
                const response = await axios.get(`/api/auth/chat/${selectedChatRoom.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    console.log(response.data);
                    setChats(response.data);
                }
            } catch (error) {
                console.error("채팅 내역 로드 실패", error);
            }
        };

        loadChatHistory();

        const clientdata = new StompJs.Client({
            brokerURL: "ws://localhost:8080/ws",          //웹소켓 주소.
            debug: function (str) {
                console.log('STOMP' + str);
            },
            reconnectDelay: 5000,       //자동 재연결 ? 
            onConnect: (frame) => {
                console.log('Connected' + frame);
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
            stompClient.publish({
                destination: `/pub/chat/${selectedChatRoom.id}`,
                body: JSON.stringify(message),
            });
            setCurrentChat("");
        }
        
    }
    
    //채팅 맨 아래로 이동
    useEffect(() => { 
        messageEndRef.current.scrollIntoView({});
    }, [chats]); 
    
    return (
        <div className="chat-main">
        {selectedChatRoom ? (
                <>
                    <div className="chat-name">
                        <h3>{selectedChatRoom.name}</h3>
                    </div>
                    <div className="chats">
                        {chats.map(chat =>(
                            <div 
                                key={chat.id} 
                                className="chat-message"
                                style={{ 
                                    alignItems: (userInfo.nickname === chat.sender) ? ("flex-end") : ("flex-start"),
                                    
                                }}
                            >
                                <div className="chat-text" style={{backgroundColor: (userInfo.nickname === chat.sender) ? ("#E7F3FF") : ("FFFFFF")}}> 
                                    {/* {chat.sender} : */}
                                    {chat.message} 
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef}></div>
                    </div>
                    <div className="chat-input">
                        <input 
                            type="text"
                            value={currentChat}
                            onChange={(e) => setCurrentChat(e.target.value)}
                            onKeyDown={(e) =>{
                                if (e.key === 'Enter') {
                                    handleSendChat();
                                }
                            }}
                        />
                            <button onClick={handleSendChat}>전송</button>
                    </div>
                </>
            ):(
                <div>채팅방을 선택해주세요.</div>
            )}
            
        </div>
        
    );
};

export default ChatMain;