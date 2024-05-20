import React, { useEffect, useState } from "react";
import "./ChatList.css";
// import "./ChatMain.css"
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineBell } from "react-icons/ai";
import { Badge} from "antd";
import axios from "axios";
import moment from "moment";
import 'moment/locale/ko'
import * as StompJs from "@stomp/stompjs";
import {GiFemale, GiMale} from "react-icons/gi";
import styles from './ChatList.module.css';
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const ChatList = ({onSelectedChatRoom, user}) => {
  const { t } = useTranslation();
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    const [stompClient, setStompClient] = useState(null);

    const {chatId} = useParams();

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

  const updateChatRooms = (receivedMessage) =>{
    setChatRooms(prev => {
      const roomIndex = prev.findIndex(room => room.id === receivedMessage.roomId);

      let updatedRooms = [];
      console.log(roomIndex);
      if (roomIndex !== -1) {
        updatedRooms = [...prev];
        updatedRooms[roomIndex] = {
          ...updatedRooms[roomIndex],
          //latestMessage : receivedMessage.message,
          latestMessage : receivedMessage.type === "TALK" ? receivedMessage.message : '[수정됨]',
          latestMessageTime: receivedMessage.createdDate,
          unreadCount: receivedMessage.roomId.toString() === chatId? 0: prev[roomIndex].unreadCount+1,
        };
        // return updatedRooms;
      } else {
        updatedRooms = [{
          id:receivedMessage.roomId,
          username: receivedMessage.sender,
          //latestMessage : receivedMessage.message,
          latestMessage : receivedMessage.type === "TALK" ? receivedMessage.message : '[수정됨]',
          latestMessageTime: receivedMessage.createdTime,
          unreadCount: receivedMessage.roomId.toString() === chatId? 0 : 1},...prev, ];
        
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
              console.log("선택한 방 정보"+ selectedRoom);
              selectedRoom.unreadCount = 0;
              if(selectedRoom){
                onSelectedChatRoom(selectedRoom);
              }
            }
          }
        } catch (error) {
            errorModal(error);
        }
      };
      fetchChatRooms();

      const clientdata = new StompJs.Client({
        brokerURL:"ws://localhost:8080/ws",
        //brokerURL:"ws://54.180.29.40:8080/ws",
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
                <div className={styles.cardWrapper} key={room.id} onClick={() => onSelectedChatRoom(room)}>
                  <div className={styles.profileImage}>
                    <img className={styles.image}
                        alt="profileimg"
                        src={room?.profileImage ? room.profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    />
                    <div className={styles.countryImageWrapper}>
                      <img className={styles.country} alt='country' src={`/${room.country}.png`} />
                    </div>
                  </div>
                  <div className={styles.profileText}>
                    <div className={styles.userInfo}>
                      <span className={styles.nicknameText}>{room.username}</span>
                      <span className={styles.genderText}>
                        {room?.gender === "MAN" ? (<GiMale color='blue' size={20} />):(<GiFemale color='red' size={20}/>)}
                    </span>
                      <span className={styles.ageText}>{room?.age}</span>
                    </div>
                  </div>
                  <div className={styles.badge}><Badge count={room.unreadCount} size="large" overflowCount={99}/></div>
                  <div className={styles.introduce}>{room.latestMessage ? room.latestMessage : "채팅 없음" }</div>
                  <div className={styles.time}> {room.latestMessageTime ? moment(room.latestMessageTime).fromNow() : " " }</div>
                </div>
              /*
              <div key={room.id} className="chat-room" onClick={() => onSelectedChatRoom(room)}>
                <div className="room-top">
                  <div className="room-title">{room.username}</div>
                  <Badge count={room.unreadCount} size="large" overflowCount={99}/>
                </div>
                <div className="room-bot">
                  {room.latestMessage ? (<div className="last_message">{room.latestMessage}</div>) : (<div>채팅 없음</div>)}
                  <span>&nbsp;·&nbsp;</span>
                  {room.latestMessageTime ? (<div className="last_time">{moment(room.latestMessageTime).fromNow() }</div>) : (<div>채팅 없음</div>)}
                </div>
                
              </div>
               */
            ))}

        </div>


    );
};

export default ChatList;