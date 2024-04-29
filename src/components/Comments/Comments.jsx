import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from 'moment';
import {Pagination, TextField} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import "./comments.scss";
import Swal from "sweetalert2";
import ReplyComments from "./replyComments";
import "./replyComments.scss";
import {RxCornerBottomLeft} from "react-icons/rx";

const Comments = ({board_id}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [commentList, setCommentList] = useState([]);
    const [content, setContent] = useState(""); // 입력한 댓글 내용
    const [page, setPage] = useState(0); // 현재 페이지
    const [pageCount, setPageCount] = useState(0); // 총 페이지 갯수
    const [replyToCommentId, setReplyToCommentId] = useState(null); // 답글 대상 댓글의 ID를 저장할 상태
    const [isReplyVisible, setIsReplyVisible] = useState(true); // 대댓글 입력창 상태

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };
    const token = getToken();

    // 댓글 추가하기
    const submitComment = async () => {
        console.log('submitComment start');
        try {
            const response = await axios.post(`/api/auth/comment?postId=${board_id}`,
                {
                    postId: board_id,
                    content: content
                }, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);

            if (response.status === 200) {
                const responseData = response.data;
                console.log(`responseData : `, responseData);
                setContent(""); // 댓글 입력창 초기화
                updateTotalCommentsAndPage(); // 새로운 댓글이 추가되면 총 댓글 수를 업데이트하고, 해당하는 페이지로 로드
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

    // 새 댓글이 추가된 마지막 페이지로 설정
    const updateTotalCommentsAndPage = async () => {
        try {
            const response = await axios.get(`/api/comment/count?postId=${board_id}`);
            const totalComments = response.data; // 새로운 총 댓글 수
            const calculatedPageCount = Math.ceil(totalComments / 5);
            setPageCount(calculatedPageCount);
            setPage(calculatedPageCount - 1); // 새 댓글이 추가된 마지막 페이지로 설정
            getCommentList(); // 변경된 페이지로 댓글 목록 갱신
        } catch (error) {
            if(error.response.status === 401) {
                console.log("401 오류");
            }
            else {
                console.log("서버 오류 입니다.");
                alert(error.response.data);
            }
        }
    };

    // 댓글 조회
    const getCommentList = async () => {
        console.log("board_id: ", board_id);
        console.log("token: ", token);
        try {
            const response = await axios.get(`/api/comment?page=${page}&size=5&postId=${board_id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);

            if (response.status === 200) {
                const commentList = response.data;
                console.log(`data : `, commentList);
                setCommentList(commentList.content);
                console.log("200 성공~~~~");
            }
        } catch (error) { // 실패 시
            if (error.response) { // error.response가 존재하는지 확인
                if (error.response.status === 401) {
                    console.log("401 오류");
                } else {
                    console.log("서버 오류 입니다.");
                    alert(error.response.data);
                }
            } else {
                // error.response가 존재하지 않는 경우의 처리
                console.log("응답을 받을 수 없습니다.");
            }
        }
    };

    // 페이지 카운트는 컴포넌트가 마운트되고 딱 한번만 가져옴
    useEffect(() => {
        // 댓글 전체 갯수 구하기
        const getTotalBoard = async () => {
            return await axios.get(`/api/comment/count?postId=${board_id}`);
        }
        // 페이지 카운트 구하기: (전체 comment 갯수) / (한 페이지 갯수) 결과 올림
        getTotalBoard().then((response) => {
            const totalComments = response.data;
            const calculatedPageCount = Math.ceil(totalComments / 5);
            setPageCount(calculatedPageCount);

            // 마지막 페이지를 기본 페이지로 설정
            setPage(calculatedPageCount - 1); // 페이지는 0부터 시작하므로
        });
    }, [board_id, token]);

    // 페이지에 해당하는 댓글 목록은 page 상태가 변경될 때마다 가져옴
    useEffect(() => {
        getCommentList();
    }, [page]);


    const LoginWarning = () => {
        Swal.fire({
            icon: "warning",
            title: "<div style='font-size: 21px; margin-bottom: 10px;'>로그인 후 이용해 주세요.</div>",
            confirmButtonColor: "#8BC765",
            confirmButtonText: "확인",
        });
    };

    // 로그인을 하지 않은 상태에서 댓글 입력 창을 클릭하면 경고창이 열리고 로그인 페이지로 이동
    const isLogin = () => {
        if (!token) {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}}); // 현재 경로를 저장하고 로그인 페이지로 이동
        }
    }

    const changePage = (value) => {
        setPage(value);
    }

    const replyComponent = (commentId) => {
        if(!token) {
            LoginWarning();
            navigate("/sign-in", {state: {from: location.pathname}});
        } else {
            setReplyToCommentId(commentId); // 부모 id 업데이트
            setIsReplyVisible(!isReplyVisible);
        }
    };

    const handleReplySuccess = () => {
        setIsReplyVisible(!isReplyVisible); // 대댓글 등록 성공 시 ReplyComments 컴포넌트를 숨김
    };

    return (
        <div className="comments-wrapper">
            <div className="comments-header">
                <TextField
                    className="comments-header-textarea"
                    maxRows={3}
                    onClick={isLogin}
                    onChange={(e) => {
                        setContent(e.target.value)
                    }}
                    value={content}
                    multiline placeholder="댓글을 입력해주세요"
                />
                {content !== "" ? (
                    <button onClick={submitComment}>등록하기</button>
                ) : (
                    <button disabled={true}>
                        등록하기
                    </button>
                )}
            </div>
            <div className="comments-body">
                {commentList.map((item, index) => (
                    <div key={index} className="comments-comment">
                        <div className="comment-username-wrap">
                            <div className="comment-username">{item.commentWriterName}</div>
                        </div>
                        <div className="comment-content">{item.content}</div>
                        <div className="comment-bottom">
                            <button className="reply-button" onClick={() => replyComponent(item.id)}>답글</button>
                            <div className="comment-date">
                                {moment(item.createDate).add(9, "hour").format('YYYY-MM-DD HH:mm')}
                            </div>
                        </div>
                        <hr className="hr-style"/>
                        {replyToCommentId === item.id && isReplyVisible && <ReplyComments parent_id={item.id} board_id={board_id} getCommentList={getCommentList} onReplySuccess={handleReplySuccess}/>}

                        {item.children && item.children.length > 0 && (
                            <div className="replyComments-wrapper">
                                {item.children.map((childItem, childIndex) => (
                                    <div>
                                        <div className="header-with-icon">
                                            <div className="reply-style">
                                                <RxCornerBottomLeft />
                                            </div>
                                            <div className="replyWrapper">
                                                <div key={childIndex} className="comment-username-wrap">
                                                    <div className="comment-username">{childItem.commentWriterName}</div>
                                                </div>
                                                <div className="comment-content">{childItem.content}</div>
                                                <div className="comment-bottom">
                                                    <button className="reply-button" onClick={() => replyComponent(item.id)}>답글</button>
                                                    <div className="comment-date">
                                                        {moment(childItem.createDate).add(9, "hour").format('YYYY-MM-DD HH:mm')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr/>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="comments-footer">
                <Pagination
                    page={page+1}
                    count={pageCount} size="large"
                    onChange={(e, value) => {
                        changePage(value-1);
                    }}
                    showFirstButton showLastButton
                />
            </div>
        </div>
    );
}
export default Comments;