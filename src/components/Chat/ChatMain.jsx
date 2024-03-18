import React, { useEffect, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import "./ChatMain.css";

const ChatMain = ({selectedChatRoom}) => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [stompClient, setStompClient] = useState(null);

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    useEffect(()=>{
        const token = getToken();
        const clientdata = new StompJs.Client({
            brokerURL: "ws://localhost:8080/controller/ws-stomp",          //웹소켓 주소.
            connectHeaders:{
                Authorization: `Bearer ${token}`
            },
            debug: function(str){
                console.log('STOMP' + str);
            },
            reconnectDelay: 5000,       //자동 재연결 ? 
            onConnect: (frame) =>{
                console.log('Connected' + frame);
                setStompClient(clientdata);
                clientdata.subscribe(`/api/auth/chat/${selectedChatRoom.id}`,(message) =>{
                    //수신 처리
                    const receivedMessage = JSON.parse(message.body);
                    console.log(receivedMessage);
                    setChats(prevChats => [...prevChats, receivedMessage]); // 수신 메시지 추가
                })
            },
            onStompError:(frame)=>{
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        
        clientdata.activate();
        

        return ()=>{
            clientdata.deactivate();
        }
    },[selectedChatRoom]);
    


    const handleSendChat = (msg) =>{
        if(stompClient && stompClient.connected && currentChat.trim() !== ""){
            const message = {               //메시지 포멧 DTO 참조
                type: "TALK",
                roomId: selectedChatRoom.id,
                message: msg,
            };        
            stompClient.publish({
                destination: `/api/auth/chat/${selectedChatRoom.id}`,
                body: JSON.stringify(message),
            })
            setCurrentChat("");
        }
        
    }
    

    return (
        <div className="chat-main">
        {selectedChatRoom ? (
                <>
                    <div>
                        <h3>{selectedChatRoom.name}</h3>
                    </div>
                    <div className="chat-list">
                        {chats.map(chat =>(
                            <div key={chat.id} className="chat-message" >
                                {chats.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input 
                            type="text"
                            value={currentChat}
                            onChange={(e) => setCurrentChat(e.target.value)} />
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