import "./searchCard.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

export const SearchCard = ({board_id, title, content, username, date, likeCount, style}) => {
    const navigate = useNavigate();

    return (
        <div className="search-card-wrapper" style={style} onClick={() => {
            navigate(`/board/${board_id}`)
        }}>
            <div className="search-card-header">
                <img src={"default_profile_image.jpg"} alt="User Image" />
                <b style={{marginLeft: '5px'}}>{username}</b>
            </div>
            <div className="search-card-body-img">
                <img src={"default_image.jpg"} alt="Card Image" />
            </div>
            <div className="search-card-body-text">
                <div className="search-card-body-text-title">{title}</div>
                <div className="search-card-body-text-content">{content.replace(/(<([^>]+)>)/gi, '')}</div>
                <div className="search-card-body-text-bottom">
                    <span>{date}</span>
                    <span> · 0개의 댓글</span>
                    <span> · <IoMdHeart style={{marginRight: '5px', marginBottom: '3px'}}/>{likeCount}</span>
                </div>
            </div>
        </div>
    );
};