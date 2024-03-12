import React, { useEffect, useState } from "react";
import "./ChatList.css";
import "./ChatMain.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ChatList = ({onSelectedChatRoom}) => {
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
      return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };

    // 채팅 목록 조회
    useEffect(() => {
      const token = getToken(); // 토큰 가져오기
            if (!token) {
            // 토큰이 없으면 로그인 페이지로 이동
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
          if(response.status===200) { setChatRooms(response.data);}
          else {console.log("서버 응답 오류");}

        } catch (error) {
          console.error("Error fetching chat rooms:", error);
        }
      };

      fetchChatRooms();
    }, [navigate]);
    

    


    return (
        <div className="chat-list">
            {chatRooms.map((room) => (
              <div key={room.id} className="chat-room" onClick={() => onSelectedChatRoom(room)}>
                {room.name}
              </div>
            ))}

        </div>
    );
};

export default ChatList;