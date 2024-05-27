import React, {useEffect, useState} from 'react';
import ReplyInput from "./replyInput";
import moment from "moment/moment";
import {RxCornerBottomLeft} from "react-icons/rx";
import "./comments.scss";
import "./comment.scss";
import Swal from "sweetalert2";
import {useLocation, useNavigate} from "react-router-dom";
import 'moment/locale/ko'
import { HiOutlineDotsVertical } from "react-icons/hi";
import {TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import api from "../../pages/api";

moment.locale('ko');
const Comment = ({ board_id, comment, getCommentList, updateTotalCommentsAndPage}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false); // 대댓글 입력창 상태
    const [commentMenuVisible, setCommentMenuVisible] = useState(false);
    const [replyMenuVisible, setReplyMenuVisible] = useState({});
    const [commentEditMode, setCommentEditMode] = useState(false); // 댓글 수정 상태
    const [replyEditMode, setReplyEditMode] = useState({}); // 대댓글 수정 상태
    const [content, setContent] = useState(""); // 입력한 댓글 내용
    const [replyContent, setReplyContent] = useState({}); // 대댓글 내용 상태 추가
    const [isTranslated, setIsTranslated] = useState(false); // 번역 상태
    const [translatedContent, setTranslatedContent] = useState(""); // 번역된 댓글 내용
    const [replyIsTranslated, setReplyIsTranslated] = useState({}); // 대댓글 번역 상태
    const [replyTranslations, setReplyTranslations] = useState({}); // 대댓글 번역된 내용
    const { t } = useTranslation();

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
    };

    useEffect(() => {
        setIsTranslated(false);
    }, [comment]);

    // 댓글 또는 대댓글 번역 기능
    async function translateComment(id, content, isReply=false) {
        if (!token) {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}});
            return;
        }
        try {
            const response = await api.post('/api/auth/translate', {
                text: content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                console.log(response);
                if (!isReply) {
                    // 댓글 번역
                    setTranslatedContent(response.data.text);
                    setIsTranslated(true);
                } else {
                    // 대댓글 번역
                    setReplyTranslations(prev => ({
                        ...prev,
                        [id]: response.data.text
                    }));
                    setReplyIsTranslated(prev => ({
                        ...prev,
                        [id]: true
                    }));
                }
            }
        } catch (e) {
            errorModal(e);
        }
    }

    // 댓글 번역 토글 기능
    const toggleTranslate = async () => {
        // 이미 번역된 상태라면 번역 해제
        if (isTranslated) {
            setIsTranslated(false);
        } else {
            // 번역되지 않은 상태라면 번역 진행
            await translateComment(comment.id, comment.content, false);
        }
    };

    // 대댓글 번역 토글 기능
    const toggleReplyTranslate = async (id, content) => {
        // 이미 번역된 상태라면 번역 해제
        if (replyIsTranslated[id]) {
            setReplyIsTranslated(prev => ({
                ...prev,
                [id]: false
            }));
        } else {
            // 번역되지 않은 상태라면 번역 진행
            await translateComment(id, content, true);
        }
    };

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };
    const token = getToken();

    const LoginWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "<div style='font-size: 21px; margin-bottom: 10px;'>로그인 후 이용해 주세요.</div>",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    const replyComponent = () => {
        if(!token) {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}});
        } else {
            setIsReplyFormVisible(!isReplyFormVisible);
        }
    };

    const handleReplySuccess = () => {
        setIsReplyFormVisible(!isReplyFormVisible); // 대댓글 등록 성공 시 ReplyInput 컴포넌트를 숨김
        getCommentList();
    };

    // 댓글 수정 설정
    const commentEdit = () => {
        setContent(comment.content); // 현재 댓글의 내용으로 텍스트 필드 값 설정
        setCommentEditMode(true); // 수정 입력창 보이게
        setCommentMenuVisible(false); // 메뉴를 닫음
    }

    // 대댓글 수정 설정
    const replyEdit = (childId, childContent) => {
        setReplyContent(prevState => ({ // 대댓글 내용 업데이트
            ...prevState,
            [childId]: childContent
        }));
        setReplyEditMode(prevState => ({ // 수정 입력창 보이게
            ...prevState,
            [childId]: !prevState[childId]
        }));
        setReplyMenuVisible(false); // 대댓글 메뉴를 닫음
    }

    // 댓글 또는 대댓글 수정 요청
    const modifyComment = async (commentId, isReply = false) => {
        console.log('modifyComment start');
        const contentToSubmit = isReply ? replyContent[commentId] : content;
        console.log('content: ', contentToSubmit);
        try {
            const response = await api.patch(`/api/auth/comment?commentId=${commentId}`,{
                    content: contentToSubmit
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                    }
                });
            if (response.status === 200) {
                const responseData = response.data;
                console.log(`responseData : `, responseData);
                if (isReply) {
                    setReplyEditMode(prevState => ({ // 대댓글 수정 입력창 숨기기
                        ...prevState,
                        [commentId]: false
                    }));
                } else {
                    setCommentEditMode(false); // 수정 입력창 숨기기
                }
                getCommentList();
            }
        } catch (error) { // 실패 시
            errorModal(error);
        }
    };

    // 댓글 또는 대댓글 삭제
    const deleteComment = async (commentId) => {
        const isConfirmed = window.confirm(t('comments.ConfirmDelete'));
        if (!isConfirmed) {
            return; // 사용자가 취소를 선택하면 여기서 함수 종료
        }

        console.log('deleteComment start');
        try {
            const response = await api.delete(`/api/auth/comment?commentId=${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                    }
                });

            if (response.status === 200) {
                const responseData = response.data;
                console.log(`responseData : `, responseData);
                updateTotalCommentsAndPage(); // 새로운 댓글이 추가되면 총 댓글 수를 업데이트하고, 해당하는 페이지로 로드
            }
        } catch (error) { // 실패 시
            errorModal(error);
        }
    };

    // 대댓글 메뉴 표시 상태를 토글하는 함수
    const toggleReplyMenu = (id) => {
        setReplyMenuVisible(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    // 바깥 클릭을 감지하기 위한 함수
    useEffect(() => {
        const handleOutsideClick = (event) => {
        if (!event.target.closest('.replyComment-options') && !event.target.closest('.HiOutlineDotsVertical')) {
            setReplyMenuVisible({}); 
        } 
        if(!event.target.closest('.comment-options') && !event.target.closest('.HiOutlineDotsVertical')){
            setCommentMenuVisible(false);
        }
        };

        // 문서 전체에 이벤트 리스너를 추가
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    //해당 게시물의 프로필로 이동
    const handleProfile = (username) => {
        navigate(`/profile/${username}`);
    }

    return (
        <div style={{ width: '100%' }}>
            <div className="comments-comment">
                <div className="comment-username-wrap">
                    <div className="postMine-wrap">
                        <div className="comment-username" onClick={() => handleProfile(comment.commentWriterName)}>
                            <img src={comment.profileurl? comment.profileurl : "/default_profile_image.jpg"} alt="User Image" className="comment-img"/>
                            {comment.commentWriterName}
                        </div>
                        {comment.postMine && (
                            <div className="postMine-style">{t('comments.Author')}</div>
                        )}
                    </div>
                    {comment.isMine && (
                        <>
                            <HiOutlineDotsVertical className="HiOutlineDotsVertical" onClick={() => setCommentMenuVisible(!commentMenuVisible)} />
                            {commentMenuVisible && (
                                <div className="comment-options">
                                    <button className="option-button" onClick={() => commentEdit()}>{t('comments.Edit')}</button>
                                    <button className="option-button" onClick={() => deleteComment(comment.id)}>{t('comments.Delete')}</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {commentEditMode ? (
                    <div className="edit-comments-header">
                        <div className="cancel-button-container">
                            <button className="cancel" onClick={() => setCommentEditMode(false)}>{t('comments.Cancel')}</button>
                        </div>
                        <div className="edit-comments-content">
                            <TextField
                                className="edit-comments-header-textarea"
                                maxRows={3}
                                onChange={(e) => {
                                    setContent(e.target.value)
                                }}
                                value={content}
                                multiline placeholder={t('comments.EnterComment')}
                            />
                            {content !== "" ? (
                                <button onClick={() => modifyComment(comment.id)}>{t('comments.Modify')}</button>
                            ) : (
                                <button disabled={true}>
                                    {t('comments.Modify')}
                                </button>
                            )}
                        </div>
                    </div>
                ):(
                    <div>
                        <div className={`comment-content ${comment.isDeleted ? 'comment-deleted' : ''}`}>
                            {comment.isDeleted ? t('comments.CommentDeleted') : (isTranslated ? translatedContent : comment.content)}
                        </div>
                        <div className="ComentTranslate" onClick={toggleTranslate}>
                            {isTranslated ? t('comments.Revert') : t('comments.Translate')}
                        </div>
                        <div className="comment-bottom">
                            <button className="reply-button" onClick={replyComponent}>{t('comments.Reply')}</button>
                            <div className="comment-date">
                                {moment(comment.createdDate).fromNow()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <hr style={{marginTop: '7px', marginBottom: '10px'}}/>
            {isReplyFormVisible && <ReplyInput parent_id={comment.id} board_id={board_id} onReplySuccess={handleReplySuccess}/>}
            {comment.children && (
                <div>
                    {comment.children.map((child) => (
                        <div key={child.id}>
                            <div className="replyWrap">
                                <div  className="iconWrap">
                                    <RxCornerBottomLeft />
                                </div>
                                <div className="comments-replyComment">
                                    <div className="replyComment-username-wrap">
                                        <div className="postMine-wrap">
                                            <div className="replyComment-username" onClick={() => handleProfile(child.commentWriterName)}>
                                                <img src={child.profileurl ? child.profileurl : "/default_profile_image.jpg"} alt="User Image" className="comment-img"/>
                                                {child.commentWriterName}
                                            </div>
                                            {child.postMine && (
                                                <div className="postMine-style">{t('comments.Author')}</div>
                                            )}
                                        </div>
                                        {child.isMine && (
                                            <>
                                                <HiOutlineDotsVertical className="HiOutlineDotsVertical" onClick={() => {toggleReplyMenu(child.id); console.log(this)}} />
                                                {replyMenuVisible[child.id] && (
                                                    <div className="replyComment-options">
                                                        <button className="option-button" onClick={() => replyEdit(child.id, child.content)}>{t('comments.Edit')}</button>
                                                        <button className="option-button" onClick={() => deleteComment(child.id)}>{t('comments.Delete')}</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {replyEditMode[child.id] ? (
                                        <div className="edit-comments-header">
                                            <div className="cancel-button-container">
                                                <button className="cancel" onClick={() => replyEdit(child.id)}>{t('comments.Cancel')}</button>
                                            </div>
                                            <div className="edit-comments-content">
                                                <TextField
                                                    className="edit-comments-header-textarea"
                                                    maxRows={3}
                                                    onChange={(e) => {
                                                        setReplyContent(prevState => ({
                                                            ...prevState,
                                                            [child.id]: e.target.value
                                                        }));
                                                    }}
                                                    value={replyContent[child.id] || ''}
                                                    multiline placeholder={t('comments.EnterComment')}
                                                />
                                                {replyContent !== "" ? (
                                                    <button onClick={() => modifyComment(child.id, true)}>{t('comments.Modify')}</button>
                                                ) : (
                                                    <button disabled={true}>
                                                        {t('comments.Modify')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ):(
                                        <div>
                                            <div className="replyComment-content">
                                                {replyIsTranslated[child.id] ? replyTranslations[child.id] : child.content}
                                            </div>
                                            <div className="ComentTranslate" onClick={() => toggleReplyTranslate(child.id, child.content)}>
                                                {replyIsTranslated[child.id] ? t('comments.Revert') : t('comments.Translate')}
                                            </div>
                                            <div className="replyComment-bottom">
                                                <div className="replyComment-date">
                                                    {moment(child.createdDate).fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <hr style={{marginTop: '5px', marginBottom: '12px'}}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
