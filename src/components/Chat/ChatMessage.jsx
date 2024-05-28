import React, { useState } from 'react'
import { ChatOption } from './ChatOption';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import api from "../../pages/api";
import styles from './ChatMessage.module.css';
import { TrySharp } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export const ChatMessage = ({chat, userInfo, modify, chatroom}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [originalMessage, modifiedMessage] = chat.message.split("*#%");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(chat.message);
  
  const [transStatus, setTransStatus] = useState(false);
  const [translation, setTranslation] = useState();

  const isSender = userInfo.nickname === chat.sender;

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
  };

  const handleEdit = () =>{
    setIsEditing(true);
    setIsMenuVisible(false)
  }
  
  const handleModify = (msg) =>{
    modify(chat.message, msg);
    setIsEditing(false);
  }

  const handleCancelEdit = () =>{
    setIsEditing(false);
    setNewMessage(chat.message);
  }

  const clickProfile = (nickname) =>{
    navigate(`/profile/${nickname}`);
  }

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

  const translateComment = async (content) =>{
    try{
      const token = getToken();

      const response = await api.post(`/api/auth/translate`, {
        text: chat.messageType === 'TALK' ? chat.message : modifiedMessage,
        },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status ===200){
        console.log(response);
        setTranslation(response.data.text);
        setTransStatus(true);
      }
    } catch(error){
      errorModal(error);
    }

  }
  //번역했을때 번역문 숨기거나 나오게 할려고 만든거  
  // const ChangeTransStatus = () =>{
  //   setTransStatus(!transStatus);
  // }

  return (
    <div 
      key={chat.id} 
      className="chat-message"
      style={{ 
        alignItems: isSender ? ("flex-end") : ("flex-start"),
        flexDirection: isSender ? ('row-reverse') : ('row'),
        // flexWrap:'wrap',
        justifyItems: 'center',
      }}
      onMouseEnter={() => isEditing ? '' : setIsMenuVisible(true)} 
      onMouseLeave={() =>  isEditing ? '' : setIsMenuVisible(false)}
    >
      {userInfo.nickname === chat.sender? '' :  
      <div className={styles.profileImage}>
        <img src={chatroom.profileurl ? chatroom.profileurl:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="profileImg" className={styles.image} onClick={() => clickProfile(chat.sender)} />
        <div className={styles.countryImageWrapper}>
          <img className={styles.country} alt='country' src={`/${chatroom.country}.png`} />
        </div>
      </div>}
      
      <div style={{width:"100%"}}>
      {userInfo.nickname === chat.sender? '' :  <div className="chat-sender" style={{width:"100%", paddingLeft:"5px" ,fontSize:"12px",cursor:"pointer"}} onClick={() => clickProfile(chat.sender)}>{chat.sender}</div>}
      <div style={{display:"flex",flexDirection: isSender ? ('row-reverse') : ('row')}}>
        <div className="chat-text" style={{backgroundColor: isSender ? ("#E7F3FF") : ("FFFFFF")}}> 
          {/* {chat.sender} : */}
          {chat.messageType==='TALK'? originalMessage : chat.messageType==="IMAGE"?<img src={chat.message} alt="image" className={styles.imageMessage}/> : ''}
          
          {modifiedMessage && (
            <>
              <br/><hr/>
              <span>[수정됨] : {modifiedMessage}</span>
            </>
          )}
          {translation && (
            <>
            {/* <div className="hr-sect"/> */}
            <hr/>
              {/* {transStatus ? (<><FaArrowUp onClick={ChangeTransStatus} /><span>[번역] : {translation}</span></>) : (<><FaArrowDown onClick={ChangeTransStatus} /></>)} */}
              <span>[번역] {translation}</span>
            </>
          )}
          
        </div>
        {isMenuVisible ? (<ChatOption chat={chat} userInfo={userInfo} option={[handleEdit, translateComment]}/>) : ('')}

        {isEditing ? (
          <div className='modify-message'>
            <input type="text" value={newMessage} onChange={(e)=> setNewMessage(e.target.value)}/>
            <button onClick={() => handleModify(newMessage)}>저장</button>
            <button onClick={handleCancelEdit}>취소</button>
          </div>
        ): ''}
        </div>
      </div>
    </div>
  )
}
