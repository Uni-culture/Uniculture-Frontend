import "./searchCard.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import React from "react";

export const SearchCard = ({board_id, title, content, hashtag, username, date, likeCount, style}) => {
    const navigate = useNavigate();

    //해당 게시물의 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${username}`);
    }

    return (
        <div className="search-card-wrapper" style={style} >
            <div className="search-card-header">
                <img src={"default_profile_image.jpg"} alt="User Image" onClick={handleProfile}/>
                <b style={{marginLeft: '5px'}} onClick={handleProfile}>{username}</b>
            </div>
            <div className="search-card-body-img" onClick={() => {navigate(`/board/${board_id}`)}}>
                <img src={"default_image.jpg"} alt="Card Image" />
            </div>
            <div className="search-card-body-text" onClick={() => {navigate(`/board/${board_id}`)}}>
                <div className="search-card-body-text-title">{title}</div>
                <div className="search-card-body-text-content">{content.replace(/(<([^>]+)>)/gi, '')}</div>
                <div className="search-card-hashtag-wrap">{hashtag.map((tag, index) => (
                    <span key={index} className="search-card-hashtag"># {tag}</span>
                ))}</div>
                <div className="search-card-body-text-bottom">
                    <span>{date}</span>
                    <span> · 0개의 댓글</span>
                    <span> · <IoMdHeart style={{marginRight: '5px', marginBottom: '3px'}}/>{likeCount}</span>
                </div>
            </div>
        </div>
    );
};