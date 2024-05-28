import "./card.scss";
import {useNavigate} from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import {useTranslation} from "react-i18next";

export const Card = ({board_id, title, content, username, date, img, likeCount,commentCount, style,profileImg}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

        // content에서 첫 번째 이미지 태그의 src 추출
        const extractFirstImageSrc = (htmlContent) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const imgTag = doc.querySelector('img');
            return imgTag ? imgTag.src : null;
        }
    
        const firstImageSrc = extractFirstImageSrc(content);

    //해당 게시물의 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${username}`);
    }
 
    return (
        <div className="card-wrapper" style={style}>
            {firstImageSrc ? 
            <div className="card-body-img"> 
                <img 
                    src={firstImageSrc ? firstImageSrc : "/default_image.jpg"} 
                    alt="Card Image" 
                    onClick={() => { navigate(`/board/${board_id}`) }} 
                />
            </div>
            : ''}
                {/* <img src={img? img:"/default_image.jpg"} alt="Card Image" onClick={() => {navigate(`/board/${board_id}`)}}/> */}
                
            <div className="card-body-text" onClick={() => {navigate(`/board/${board_id}`)}}>
                <div className="card-body-text-title">{title}</div>
                <div className={`card-body-text-content ${firstImageSrc? '':'nonImg'}`}>{content.replace(/(<([^>]+)>)/gi, '')}</div>
                <div className="card-body-text-bottom">
                    <span>{date}</span>
                    <span> · {t('comments.count', { count: commentCount })}</span>
                </div>
            </div>

            <div className="card-footer">
                <div className="username" onClick={handleProfile}>
                    <img src={profileImg ? profileImg :"/default_profile_image.jpg"} alt="User Image" />by {username}
                </div>
                <div className="likeCount">
                    <IoMdHeart style={{marginRight: '5px', marginBottom: '3px'}}/>
                    {likeCount}
                </div>
            </div>
        </div>
    );
};