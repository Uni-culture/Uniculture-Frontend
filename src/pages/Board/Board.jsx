import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import Header from "../../components/Header/Header";
import "./board.css";
import {HeartOutlined, HeartFilled} from '@ant-design/icons';

const Board = () => {
    const {board_id} = useParams();
    const [board, setBoard] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false); // 좋아요 상태 관리
    // modal이 보이는 여부 상태(아직 사용x)
    const [show, setShow] = useState(false);

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };
    const token = getToken();

    useEffect(() => {
        console.log(`게시글 아이디: ${board_id}`);
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
        getBoard();
    }, [])


    const handleLike = async () => {
        if (!token) {
            console.log("로그인이 필요합니다");
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

    return (
        <div className="board-layout">
            <Header/>
            {isLoaded && (
                <div className="board-wrapper">
                    <div className="board-title">{board.title}</div>
                    <div className="board-header">
                        <div className="board-header-username">{board.writerName}</div>
                        <div className="board-header-dot">·</div>
                        <div className="board-header-date">{moment(board.createDate).add(9,"hour").format('YYYY-MM-DD')}</div>
                        <div className="like" style={{marginLeft: "30px"}}>
                            {liked ? (
                                <HeartFilled style={{color: 'red'}} onClick={handleLike} />
                            ) : (
                                <HeartOutlined onClick={handleLike} />
                            )}
                        </div>
                    </div>
                    <hr/>
                    <div className="board-body">
                        <div className="board-image">
                            {/*<img src={`/api/image/view/${board_id}`}/>*/}
                        </div>
                        <div className="board-title-content">
                            <div className="board-content">{board.content}</div>
                        </div>
                    </div>
                    <div className="board-footer"></div>

                    {
                        board.isMine && // 자신의 게시물이면 활성화
                        <div className="edit-delete-button">
                            <button className="delete-button" onClick={() => {setShow(true)}}>
                                삭제
                            </button>
                            <button onClick={() => {navigate(`/edit-board/${board_id}`)}}>
                                수정
                            </button>
                        </div>
                    }
                </div>
            )}
        </div>
    );
}
export default Board;