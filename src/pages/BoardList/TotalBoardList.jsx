import {Pagination} from "@mui/material";
import {Card} from "../../components/Card/Card";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import "./boardList.scss";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const TotalBoardList = ({activeTab}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [boardList, setBoardList] = useState([]);

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

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

    const fetchBoardData = async (page) => {
        console.log('fetchBoardData start');
        try {
            const token = getToken(); // 토큰 가져오기
            // const page_number = searchParams.get("page");
            let apiUrl = `/api/post?ca=NORMAL&page=${page}&size=8&sort=likeCount,DESC`;
            console.log(activeTab);
            if(activeTab==="live") apiUrl = `/api/post?ca=NORMAL&page=${page}&size=8&sort=likeCount,DESC`;
            else if(activeTab==="new") apiUrl = `/api/post?ca=NORMAL&page=${page}&size=8`;
            else if(activeTab==="daily") apiUrl = `/api/post?ca=NORMAL&pt=DAILY&page=${page}&size=8`;
            else if(activeTab==="help") apiUrl = `/api/post?ca=NORMAL&pt=HELP&page=${page}&size=8`;
            else if(activeTab==="friend") apiUrl = `/api/auth/post/friend?page=${page}&size=8`;
            console.log(apiUrl);
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);
            // 게시물 등록 성공
            if (response.status === 200) {
                console.log(response.data);
                console.log(response.data.content);
                setBoardList(response.data.content);
                console.log(`totalElements : ${response.data.totalElements}`);
                setPageCount(Math.ceil( response.data.totalElements / 8));
                console.log("200 성공");
            }

        } catch (error) { // 실패 시
            errorModal(error);
        }
    };

    useEffect(() => {
        fetchBoardData(currentPage);
    }, [currentPage, activeTab])

    const changePage = (value) => {
        setCurrentPage(value);
    }


    return (
        <div className="boardList-wrapper">
            <div className="boardList-body">
                {boardList.map(post => (
                    <Card key={post.postId} board_id={post.postId} img={post.imageUrl} title={post.title} content={post.content} username={post.writerName}
                          date={moment(post.createDate).add(9, "hour").format(t('board.dateFormat'))} commentCount={post.commentCount} likeCount={post.likeCount}></Card>
                ))}
            </div>
            <div className="boardList-footer">
                <Pagination
                    page={currentPage+1}
                    count={pageCount} size="large"
                    onChange={(e, value) => {
                         // window.location.href = `/?page=${value-1}`;
                        changePage(value-1);
                    }}
                    showFirstButton showLastButton
                />
            </div>
        </div>
    )
}
export default TotalBoardList;