import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";

const Board = () => {
    const {board_id} = useParams();
    const [board, setBoard] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    // modal이 보이는 여부 상태(아직 사용x)
    const [show, setShow] = useState(false);
    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };
    const token = getToken();

    useEffect(() => {
        const getBoard = async () => {
            const response = await axios.get(`/api/auth/post/${board_id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);

            if (response.status === 200) {
                const {data} = response.data;
                setBoard(data);
                setIsLoaded(true)
                console.log("200 성공");
            }
        };
        getBoard();
    }, [])

    return (
        <React.Fragment>
            {isLoaded && (
                <div className="board-wrapper">
                    {
                        // jwtUtils.isAuth(token) && jwtUtils.getId(token) === board.user.id &&
                        <div className="edit-delete-button">
                            <button
                                className="delete-button"
                                onClick={() => {
                                    setShow(true)
                                }}
                            >
                                삭제
                            </button>
                            <button
                                onClick={() => {
                                    navigate(`/edit-board/${board_id}`)
                                }}
                            >
                                수정
                            </button>
                        </div>
                    }
                    <div className="board-header">
                        <div className="board-header-username">{board.writerName}</div>
                        <div className="board-header-date">{moment(board.createDate).add(9,"hour").format('YYYY-MM-DD')}</div>
                    </div>
                    <hr/>
                    <div className="board-body">
                        <div className="board-image">
                            {/*<img src={`/api/image/view/${board_id}`}/>*/}
                        </div>
                        <div className="board-title-content">
                            <div className="board-title">{board.title}</div>
                            <div className="board-content">{board.content}</div>
                        </div>
                    </div>
                    <hr/>
                    <div className="board-footer"></div>
                </div>
            )}
        </React.Fragment>
    );
}
export default Board;