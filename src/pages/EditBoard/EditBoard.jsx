import {useNavigate, useParams, useLocation} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import ImageUploader from "../../components/Board/ImageUploader";
import TextArea from "../../components/Board/TextArea";
import "../AddBoard/addBoard.scss";
import Header from "../../components/Header/Header";
import {IoArrowBack} from "react-icons/io5";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import api from "../api";

const EditBoard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {board_id} = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState("");
    const [image, setImage] = useState({
        image_file: "",
        preview_URL: "default_image.jpg",
    });
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

    useEffect(() => {
        console.log(`Edit 게시글 아이디: ${board_id}`);
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
                    setTitle(boardData.title);
                    setContent(boardData.content);
                    setPostType(boardData.postType);
                    console.log("200 성공~~~~");
                }
            } catch (error) { // 실패 시
                errorModal(error);
            }
        };
        getBoard();

    }, [])

    const canSubmit = useCallback(() => {
        return content !== "" && title !== "";
    }, [title, content]); // 제목, 내용이 비어있지 않다면 true를 반환

    const handleSubmit = async () => {
        try {
            console.log(`title: ${title}`);
            console.log(`contents: ${content}`);
            console.log(`posttype: ${postType}`);
            if(token) {
                console.log("토큰 확인: ", token);
                const response = await api.patch(`/api/auth/post/${board_id}`, {
                    title: title,
                    contents: content,
                    posttype: postType
                    // image: image.image_file
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                console.log('서버 응답: ', response);
                console.log('response.status: ', response.status);
                // 등록 성공
                if (response.status === 200) {
                    const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
                    navigate(previousPath, {}); // 성공 후 이전 페이지로 이동
                }
            }
        } catch (error) { // 실패 시
            errorModal(error);
        }
    };


    const dailyButtonClick = () => {
        setPostType("DAILY");
    };
    const helpButtonClick = () => {
        setPostType("HELP");
    };

    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/"; // 이전 경로가 없으면 기본 경로는 "/"
        navigate(previousPath, {}); // 이전 페이지로 이동
    };

    return (
        <div className="addBoard-wrapper">
            <Header/>
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={goBackToPreviousPath}/>
            <div className="addBoard-header">
                게시물 수정하기
            </div>
            <div className="submitButton">
                {canSubmit() ? (
                    <button
                        onClick={handleSubmit}
                        className="success-button"
                    >
                        수정하기
                    </button>
                ) : (
                    <button
                        className="disable-button"
                    >
                        제목과 내용을 모두 입력하세요
                    </button>
                )}
            </div>
            <div className="postType-layout">
                {postType && (
                    <div>
                        <span className="postType">{postType}</span>
                        <span>를 선택하였습니다.</span>
                    </div>
                )}
            </div>
            <div className="addBoard-body">
                <ImageUploader setImage={setImage} preview_URL={image.preview_URL}/>
                <TextArea setTitle={setTitle} setContent={setContent} title={title} content={content}/>
            </div>
            <div className="submitButton">
                <button style={{marginRight: "30px"}} onClick={dailyButtonClick}>일상</button>
                <button onClick={helpButtonClick}>도움</button>
            </div>
        </div>
    );

}

export default EditBoard;