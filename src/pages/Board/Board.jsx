import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import Header from "../../components/Header/Header";
import "./board.scss";
import {HeartOutlined, HeartFilled} from '@ant-design/icons';
import {IoArrowBack} from "react-icons/io5";
import Swal from "sweetalert2";
import Comments from "../../components/Comments/Comments"
import DOMPurify from "dompurify";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import api from "../api";

const Board = () => {
    const location = useLocation();
    const {board_id} = useParams();
    const [board, setBoard] = useState({});
    const [content, setContent] = useState(null);
    const [isTranslated, setIsTranslated] = useState(false); // 번역 여부
    const [showTranslate, setShowTranslate] = useState(""); // 번역한 내용
    const [translatedTitle, setTranslatedTitle] = useState(""); // 번역된 제목
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false); // 좋아요 상태 관리
    const { t } = useTranslation();
    // 현재 언어 설정에 따라 moment의 로케일 설정
    moment.locale(i18n.language);

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };
    const token = getToken();

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
    }

    const getBoard = async () => {
        console.log('getBoard start');
        try {
            const response = await api.get(`/api/post/${board_id}`, {
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
            errorModal(error);
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
            // 내용 번역
            const response = await api.post('/api/auth/translate', {
                text : content
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }// 헤더에 토큰 추가
            });

            // 제목 변역
            let titleResponse = await api.post('/api/auth/translate', {
                text: "Translated Content" // 여기서 "번역된 내용"이라는 문자열을 영어로 설정했습니다. 필요에 따라 수정하세요.
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                } // 헤더에 토큰 추가
            });

            if (response.status === 200 && titleResponse.status === 200) {
                setIsTranslated(true);
                setShowTranslate(response.data.text); // 번역된 내용
                setTranslatedTitle(titleResponse.data.text); // 번역된 제목
            }
        } catch (e) {
            errorModal(e);
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
                const response = await api.post(`/api/auth/post/${board_id}/like`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (response.status === 200) {
                    setLiked(true);
                }
                console.log("좋아요 누름");
            } else {
                const response = await api.delete(`/api/auth/post/${board_id}/like`, {
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
            errorModal(error);
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
                api.delete(`/api/auth/post/${board_id}`, {
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
                        errorModal(error);
                    });
            }
        });
    };

    const recruitedComplete = async () =>{
        if (!token) {
            LoginWarning();
            return;
        }

        try {
            if (board.postStatus === 'START') {
                const response = await api.post(`/api/auth/post/${board_id}/status`, {
                    status: 'FINISH'
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (response.status === 200) {
                    window.location.reload();
                }
                console.log("모집완료!!");
            } else {
                const response = await api.post(`/api/auth/post/${board_id}/status`, {
                    status:'START'
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    window.location.reload();
                }
                console.log("모집중~");
            }
        } catch (error) {
            errorModal(error);
        }
    }

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

    //해당 게시물의 프로필로 이동
    const handleProfile = () => {
        navigate(`/profile/${board.writerName}`);
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
                                <div className="board-header-username" onClick={handleProfile}>{board.writerName}</div>
                                <div className="board-header-dot">·</div>
                                <div className="board-header-date">{moment(board.createDate).add(9,"hour").format(t('board.dateFormat'))}</div>
                                <div className="like" style={{marginLeft: "30px"}}>
                                    {liked ? (
                                        <HeartFilled style={{color: 'red'}} onClick={handleLike} />
                                    ) : (
                                        <HeartOutlined onClick={handleLike} />
                                    )}
                                </div>
                                <div className="board-likeCount">{board.likeCount}</div>
                                { board.isMine &&(board.postType === 'HOBBY' || board.postType === 'LANGUAGE') ? (<button className="board-buttons" onClick={recruitedComplete}>{board.postStatus === 'START' ? ('모집종료') : ('다시모집')}</button>): ''}
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
                        {isTranslated && (
                            <div className="board-translate-content">
                                <div className="board-translate-title">{`[${translatedTitle}]`}</div>
                                <SafeHtml html={showTranslate} />
                            </div>
                        )}
                        <div className="board-buttons-wrap">
                            <span className="translation-buttons">
                                {isTranslated ? (
                                    <button className="board-buttons" onClick={()=>{setContent(board.content); setIsTranslated(false);}}> {t('board.RevertButton')} </button>
                                ) : (
                                    <button className="board-buttons" onClick={()=>{translate(content)}}> {t('board.TranslateButton')} </button>
                                )}
                            </span>
                            {board.isMine && // 자신의 게시물이면 활성화
                                <span className="edit-delete-button">
                                    <button className="board-buttons" onClick={boardDelete}> {t('board.DeleteButton')} </button>
                                    <button className="board-buttons" onClick={() => {navigate(`/${board_id}?type=post`, {state : {from : location.pathname}});}}> {t('board.EditButton')} </button>
                                </span>
                            }
                        </div>
                    </div>

                    <div className="board-footer">
                        <Comments board_id={board.postId}/>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Board;