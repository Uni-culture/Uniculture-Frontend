import "./searchCard.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

export const SearchCard = ({post}) => {
    const [date, setDate] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    //해당 게시물의 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${post.writerName}`);
    }

    useEffect(()=>{
        setDate(moment(post.createDate).add(9, "hours").format(t('board.dateFormat')));
    }, [])

    return (
        <div className="search-card-wrapper" >
            <div className="search-card-header">
                <div className='imageWrapper' onClick={handleProfile}>
                    <div className='profileImageWrapper'>
                        <img
                            src={post?.profileurl ? post.profileurl : "/default_profile_image.png"}
                            alt="profile"
                            className='image'
                        />
                    </div>

                    <div className='countryImageWrapper'>
                        <img className='country' alt='country' src={`/${post.country}.png`} />
                    </div>
                </div>
                <b style={{marginLeft: '5px'}} onClick={handleProfile}>{post.writerName}</b>
            </div>
            <div className="search-card-body-img" onClick={() => {navigate(`/board/${post.postId}`)}}>
                <img src={post?.imageurl ? post.imageurl : "default_image.jpg"} alt="Card Image" />
            </div>
            <div className="search-card-body-text" onClick={() => {navigate(`/board/${post.postId}`)}}>
                <div className="search-card-body-text-title">{post.title}</div>
                <div className="search-card-body-text-content">{post.content.replace(/(<([^>]+)>)/gi, '')}</div>
                <div className="search-card-hashtag-wrap">{post.tags.map((tag, index) => (
                    <span key={index} className="search-card-hashtag"># {tag}</span>
                ))}</div>
                <div className="search-card-body-text-bottom">
                    <span>{date}</span>
                    <span> · {post.commentCount}개의 댓글</span>
                    <span> · <IoMdHeart style={{marginRight: '5px', marginBottom: '3px'}}/>{post.likeCount}</span>
                </div>
            </div>
        </div>
    );
};