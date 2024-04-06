import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import Header from "../../components/Header/Header";
import "./board.scss";
import {HeartOutlined, HeartFilled} from '@ant-design/icons';
import {IoArrowBack} from "react-icons/io5";
import Swal from "sweetalert2";
import Comments from "../../components/Comments/Comments"
import DOMPurify from "dompurify";

const Board = () => {
    const location = useLocation();
    const {board_id} = useParams();
    const [board, setBoard] = useState({});
    const [content, setContent] = useState(null);
    const [isTranslated, setIsTranslated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false); // 좋아요 상태 관리

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };
    const token = getToken();

    const getBoard = async () => {
        console.log('getBoard start');
        try {
            const response = await axios.get(`/api/post/${board_id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);

            if (response.status === 200) {
                const boardData = response.data;
                console.log(`data : `, boardData);
                setBoard(boardData);
                setContent(boardData.content);
                setIsLoaded(true);
                console.log("200 성공~~~~");
            }
        } catch (error) { // 실패 시
            if(error.response.status === 401) {
                console.log("401 오류");
            }
            else {
                console.log("서버 오류 입니다.");
                alert(error.response.data);
            }
        }
    };

    useEffect(() => {
        getBoard();
    }, [liked])

    // 번역 기능
    async function translate(content) {
        if (!token) {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}}); // 현재 경로를 저장하고 로그인 페이지로 이동
            return;
        }

        try {
            const response = await axios.post('/api/auth/translate', {
                text : content,
                target_lang : "KO"
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }// 헤더에 토큰 추가
                });
            if (response.status === 200) {
                console.log(response);
                setIsTranslated(true);
                setContent(response.data.text);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleLike = async () => {
        if (!token) {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}}); // 현재 경로를 저장하고 로그인 페이지로 이동
            return;
        }

        try {
            if (!liked) {
                const response = await axios.post(`/api/auth/post/${board_id}/like`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (response.status === 200) {
                    setLiked(true);
                }
                console.log("좋아요 누름");
            } else {
                const response = await axios.delete(`/api/auth/post/${board_id}/like`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setLiked(false);
                }
                console.log("좋아요 취소");
            }
        } catch (error) {
            if(error.response.status === 401) {
                console.log("토큰이 만료되었습니다.");
            }
            else {
                console.log("서버 오류 입니다.");
                alert(error.response.data);
            }
        }
    };

    useEffect(() => {
        if (board.isLike !== undefined) {
            setLiked(board.isLike);
        }
    }, [board.isLike]); // board.isLike가 변경될 때 liked 상태를 업데이트

    const boardDelete = () => {
        Swal.fire({
            title: "<span style='font-size: 17px;'>정말 삭제하시겠습니까?</span>",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오",
            confirmButtonColor: "#8BC765",
            customClass: {
                popup: 'custom-popup',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/auth/post/${board_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                    }
                })
                    .then(() => {
                        Swal.fire({
                            title: "<span style='font-size: 17px;'>게시물이 삭제되었습니다.</span>",
                            icon: "success",
                            confirmButtonColor: "#8BC765",
                            customClass: {
                                popup: 'custom-ok-popup',
                                confirmButton: 'custom-ok-button',
                                title: 'custom-title'
                            }
                        });
                        navigate("/", {});
                    })
                    .catch((error) => {
                        if(error.response.status === 401) {
                            console.log("401 오류");
                        }
                        else {
                            console.log("서버 오류 입니다.");
                            alert(error.response.data);
                        }
                    });
            }
        });
    };

    const LoginWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "<div style='font-size: 21px; margin-bottom: 10px;'>로그인 후 이용해 주세요.</div>",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    const SafeHtml = ({html}) =>{
        const safeHtml = DOMPurify.sanitize(html);
        return <div dangerouslySetInnerHTML={{ __html: safeHtml}} />;
    }

    return (
        <div className="board-layout">
            <Header/>
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={()=>navigate(-1)}/>
            {isLoaded && (
                <div className="board-wrapper">
                    <div className="board-title">{board.title}</div>
                    <div className="board-header">
                        <div className="header-container">
                            <div className="left-container">
                                <div className="board-header-username">{board.writerName}</div>
                                <div className="board-header-dot">·</div>
                                <div className="board-header-date">{moment(board.createDate).add(9,"hour").format('YYYY년 MM월 DD일')}</div>
                                <div className="like" style={{marginLeft: "30px"}}>
                                    {liked ? (
                                        <HeartFilled style={{color: 'red'}} onClick={handleLike} />
                                    ) : (
                                        <HeartOutlined onClick={handleLike} />
                                    )}
                                </div>
                                <div className="board-likeCount">{board.likeCount}</div>
                            </div>
                            <div className="board-postType">{board.postType}</div>
                        </div>
                        <div className="hashtag-wrapper">
                            {board.tags.map((tag, index) => (
                                <span key={index} className="hashtag"># {tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="board-body">
                        <div className="board-image">
                            {/*<img src={`/api/image/view/${board_id}`}/>*/}
                        </div>
                        <div className="board-content">
                            <SafeHtml html={content} />
                        </div>
                        <div className="board-buttons-wrap">
                            <span className="translation-buttons">
                                {isTranslated ? (
                                    <button className="board-buttons" onClick={()=>{setContent(board.content); setIsTranslated(false);}}> 되돌리기 </button>
                                ) : (
                                    <button className="board-buttons" onClick={()=>{translate(content)}}> 번역 </button>
                                )}
                            </span>
                            {board.isMine && // 자신의 게시물이면 활성화
                                <span className="edit-delete-button">
                                    <button className="board-buttons" onClick={boardDelete}> 삭제 </button>
                                    <button className="board-buttons" onClick={() => {navigate(`/${board_id}`, {state : {from : location.pathname}});}}> 수정 </button>
                                </span>
                            }
                        </div>
                    </div>

                    <div className="board-footer">
                        <Comments board_id={board_id}/>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Board;