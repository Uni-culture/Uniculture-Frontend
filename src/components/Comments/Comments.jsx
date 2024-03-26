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
    // 현재 페이지, 전체 페이지 갯수
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
    };
    const token = getToken();

    // 페이지에 해당하는 댓글 목록은 page 상태가 변경될 때마다 가져옴
    useEffect(() => {
        /*const getCommentList = async () => {
            const {data} = await axios.get(`/api/comment/list?board_id=${board_id}&page_number=${page}&page_size=${5}`);
            return data;
        }
        // 기존 commentList에 데이터를 덧붙임
        getCommentList().then((result) => setCommentList([...commentList, ...result]));*/
    }, [page])

    // 페이지 카운트는 컴포넌트가 마운트되고 딱 한번만 가져오면됨
    useEffect(() => {
        // 댓글 전체 갯수 구하기
        /*const getTotalBoard = async () => {
            const {data} = await axios.get(`/api/comment/count?board_id=${board_id}`);
            return data.total;
        }
        // 페이지 카운트 구하기: (전체 comment 갯수) / (한 페이지 갯수) 결과 올림
        getTotalBoard().then((result) => setPageCount(Math.ceil(result / 5)));*/
    }, []);

    // 댓글 추가하기
    const submit = useCallback(async () => {
        const comment = {
            board_id: board_id,
            // DB에 엔터가 먹힌 상태로 들어가므로 제대로 화면에 띄우기 위해 <br>로 치환
            content: content,
            // user_id: jwtUtils.getId(token)
        }
        // axios interceptor 사용 : 로그인한 사용자만 쓸 수 있다!
        // await api.post('/api/comment', comment);
        alert("댓글 등록 완료");
        window.location.reload();
    }, [content]);
    console.log(commentList)

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
                    <button onClick={submit}>등록하기</button>
                ) : (
                    <button disabled={true}>
                        등록하기
                    </button>
                )}
            </div>
            <div className="comments-body">
                {commentList.map((item, index) => (
                    <div key={index} className="comments-comment">
                        <div className="comment-username-date">
                            <div className="comment-date">{moment(item.created).add(9, "hour").format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                        <div className="comment-content">{item.content}</div>
                        <div className="comment-username">{item.user.username}</div>
                        <hr/>
                    </div>
                ))}
            </div>
            {
                page < pageCount && (
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