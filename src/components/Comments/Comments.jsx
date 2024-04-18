import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import moment from 'moment';
import {TextField} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./comments.scss";
import Swal from "sweetalert2";

const Comments = ({board_id}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [commentList, setCommentList] = useState([]);
    const [content, setContent] = useState(""); // 입력한 댓글 내용
    const [page, setPage] = useState(0); // 현재 페이지
    const [pageCount, setPageCount] = useState(0); // 총 페이지 갯수
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };
    const token = getToken();

    // 댓글 추가하기
    const submitComment = async () => {
        console.log('getBoard start');
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
                alert("댓글 등록 완료");
                window.location.reload();
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

    const getCommentList = async () => {
        console.log("board_id: ", board_id);
        console.log("token: ", token);
        try {
            const response = await axios.get(`/api/comment/${board_id}?page=${page}&size=5`, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);

            if (response.status === 200) {
                const commentList = response.data;
                console.log(`data : `, commentList);
                console.log("data.totalPages: ", commentList.totalPages);
                setPageCount(commentList.totalPages);
                setCommentList(prevCommentList => [...prevCommentList, ...commentList.content]);
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
                        <div className="comment-date">{moment(item.createDate).add(9, "hour").format('YYYY-MM-DD HH:mm')}</div>
                        <hr className="hr-style"/>
                    </div>
                ))}
            </div>
            {
                page < (pageCount - 1) && (
                    <div className="comments-footer"
                         onClick={() => {
                             setPage(page + 1);
                         }}
                    >
                        댓글 더보기
                        <KeyboardArrowDownIcon/>
                    </div>
                )
            }
        </div>
    );
}
export default Comments;