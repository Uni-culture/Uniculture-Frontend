import "./card.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

export const Card = ({board_id, title, content, username, date, likeCount, style}) => {
    const navigate = useNavigate();

    //해당 게시물의 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${username}`);
    }

    return (
        <div className="card-wrapper" style={style}>
            <div className="card-body-img">
                <img src={"default_image.jpg"} alt="Card Image" onClick={() => {navigate(`/board/${board_id}`)}}/>
            </div>
            <div className="card-body-text" onClick={() => {navigate(`/board/${board_id}`)}}>
                <div className="card-body-text-title">{title}</div>
                <div className="card-body-text-content">{content.replace(/(<([^>]+)>)/gi, '')}</div>
                <div className="card-body-text-bottom">
                    <span>{date}</span>
                    <span> · 0개의 댓글</span>
                </div>
            </div>

            <div className="card-footer">
                <div className="username" onClick={handleProfile}>
                    <img src={"default_profile_image.jpg"} alt="User Image" />by {username}
                </div>
                <div className="likeCount">
                    <IoMdHeart style={{marginRight: '5px', marginBottom: '3px'}}/>
                    {likeCount}
                </div>
            </div>
        </div>
    );
};