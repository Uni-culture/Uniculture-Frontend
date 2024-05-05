import React, { useEffect, useState } from "react";
import "./ChatList.css";
// import "./ChatMain.css"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import 'moment/locale/ko'
import * as StompJs from "@stomp/stompjs";


const ChatList = ({onSelectedChatRoom, user}) => {
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    const [stompClient, setStompClient] = useState(null);

    const {chatId} = useParams();


    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
      return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };

  

  const updateChatRooms = (receivedMessage) =>{
    setChatRooms(prev => {
      const roomIndex = prev.findIndex(room => room.id === receivedMessage.roomId);

      let updatedRooms = [];
      console.log(roomIndex);
      if (roomIndex !== -1) {
        updatedRooms = [...prev];
        updatedRooms[roomIndex] = {
          ...updatedRooms[roomIndex],
          latestMessage: receivedMessage.message,
          latestMessageTime: receivedMessage.createdDate,
        };
        // return updatedRooms;
      } else {
        updatedRooms = [{id:receivedMessage.roomId,username: receivedMessage.sender, latestMessage: receivedMessage.message, latestMessageTime: receivedMessage.createdTime},...prev, ];
        
      } 
      return updatedRooms.sort((a,b) => new Date(b.latestMessageTime) - new Date(a.latestMessageTime));
    })
  }

    // 채팅 목록 조회
    useEffect(() => {
      const token = getToken();
      if (!token) {// 토큰이 없으면 로그인 페이지로 이동
          alert("로그인 해주세요.")
          navigate('/sign-in');
          return;
      }
      const fetchChatRooms = async () => {
        try {
          const response = await axios.get('/api/auth/room', {
            headers: {
            Authorization: `Bearer ${token}` // 헤더에 토큰 추가
            }
          });
          console.log('서버응답:', response);
          if(response.status===200) { 
            const sortedRooms = response.data.sort((a,b) => new Date(b.latestMessageTime) - new Date(a.latestMessageTime));
            setChatRooms(sortedRooms);
            if(chatId){
              const selectedRoom = response.data.find(room => room.id.toString() === chatId);
              console.log(selectedRoom);
              if(selectedRoom){
                onSelectedChatRoom(selectedRoom);
              }
            }
          }
          else {console.log("서버 응답 오류");}

        } catch (error) {
          console.error("Error fetching chat rooms:", error);
        }
      };
      fetchChatRooms();

      const clientdata = new StompJs.Client({
        brokerURL:"ws://localhost:8080/ws",
        debug: function (str) {
          console.log('STOMP' + str);
        },
        reconnectDelay: 5000,       //자동 재연결 ? 
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect:(frame) =>{
          console.log("채팅방 연결 확인", frame);
          clientdata.subscribe(`/sub/chat/user/${user.id}`, (message)=>{
            const receivedMessage = JSON.parse(message.body);
            console.log(receivedMessage);
            updateChatRooms(receivedMessage);
          })
        },
        connectHeaders: {
          Authorization: getToken(),
        },
        onStompError:(frame)=>{
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame.headers['message'], 'Details:', frame.body);
        },
        onWebSocketError: (evt) => {
          console.error('WebSocket Error:', evt);
        },
        onDisconnect: () => {
          console.log("Disconnected");
        },
      })
      clientdata.activate();
      setStompClient(clientdata);

      return ()=>{
          clientdata.deactivate();
        }

      // navigate('/chat');
    }, [navigate]);
    


    return (
        <div className="chat-list">
            {chatRooms.map((room) => (
              <div key={room.id} className="chat-room" onClick={() => onSelectedChatRoom(room)}>
                <div>{room.username}</div>
                {room.latestMessage ? (<div>{room.latestMessage}</div>) : (<div>채팅 없음</div>)}
                {room.latestMessageTime ? (<div>{moment(room.latestMessageTime).fromNow() }</div>) : (<div>채팅 없음</div>)}
              </div>
            ))}

        </div>
    );
};

export default ChatList;