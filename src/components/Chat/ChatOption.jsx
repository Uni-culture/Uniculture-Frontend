import React, { useState } from 'react'
import { HiDotsHorizontal } from "react-icons/hi";
import './ChatOption.css';
import {useTranslation} from "react-i18next";

export const ChatOption = ({chat,userInfo , option}) => {
  const [visibleMenu, setVisibleMenu] = useState(null);
  const { t } = useTranslation();
  
  const toggleMenuVisibility = (chatId) => {
    // setVisibleMenu(prev => (prev === chatId ? null : chatId));
    setVisibleMenu(chat.sender);
  };

  const handleEdit = () =>{
    setVisibleMenu(null);
    option[0]();
  }

  const handleTranslation = () =>{
    setVisibleMenu(null);
    option[1]();
  }

  return (
    <div className='chat-option'>
        <>
        {visibleMenu ? (
          <div className={`message-options ${userInfo.nickname === chat.sender ? 'left' : 'right'}`} key={chat.id}>
              {userInfo.nickname === chat.sender ? (
                <button button className="option-button btn btn-danger">{t('chatOption.deleteButton')}</button>
              ) :  (chat.messageType ==='TALK' &&
                <button className="option-button btn btn-success btn-sm" onClick={handleEdit}>{t('chatOption.editButton')}</button>
              )}
              <button className="option-button btn btn-primary btn-sm" onClick={handleTranslation}>{t('chatOption.TranslateButton')}</button>
            </div>
        ) : (
          <HiDotsHorizontal 
            className="menu-icon" 
            onClick={() => toggleMenuVisibility(chat.id)}
            // style={{ marginLeft: userInfo.nickname === chat.sender ? "10px" : "0px", marginRight: userInfo.nickname !== chat.sender ? "10px" : "0px"}}
          />
        )}
          
          {/* {visibleMenu === chat.id && (
            
          )} */}
        </>
    </div>
  )
}
