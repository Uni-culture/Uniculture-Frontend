import "./card.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

export const Card = ({board_id, title, content, username, date, likeCount, style}) => {
    const navigate = useNavigate();

    return (
        <div className="card-wrapper" style={style} onClick={() => {
            navigate(`/board/${board_id}`)
        }}>
            <div className="card-body-img">
                <img src={"default_image.jpg"} alt="Card Image" />
            </div>
            <div className="card-body-text">
                <div className="card-body-text-title">{title}</div>
                <div className="card-body-text-content">{content}</div>
                <div className="card-body-text-bottom">
                    <span>{date}</span>
                    <span> · 0개의 댓글</span>
                </div>
            </div>

            <div className="card-footer">
                <div className="username">
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