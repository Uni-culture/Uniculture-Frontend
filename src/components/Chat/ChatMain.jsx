import React from "react";
import "./ChatMain.css";

const ChatMain = ({selectedChatRoom}) => {

    

    return (
        <div className="chat-main">
            {selectedChatRoom ? (
                <div>
                    <h3>{selectedChatRoom.name}</h3>
                </div>
            ):(
                <div>채팅방을 선택해주세요.</div>
            )}
        </div>
    );
};

export default ChatMain;