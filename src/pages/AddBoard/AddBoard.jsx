// import {useSelector} from "react-redux";
import {useNavigate, useLocation} from "react-router-dom";
import React, {useCallback, useState} from "react";
import ImageUploader from "../../components/Board/ImageUploader";
import TextArea from "../../components/Board/TextArea";
import "./addBoard.scss";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Header from "../../components/Header/Header";
import {IoArrowBack} from "react-icons/io5";


const AddBoard = () => {
    // const token = useSelector(state => state.Auth.token);
    const navigate = useNavigate();
    const location = useLocation();

    // 게시판 제목, 내용, 사진
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

    const canSubmit = useCallback(() => {
        return content !== "" && title !== "" && postType !== "";
    }, [title, content, postType]); // 제목, 내용이 비어있지 않다면 true를 반환

    const handleSubmit = async () => {
        console.log('handleSubmit start');
        try {
            const token = getToken(); // 토큰 가져오기
            if(token) {
                const response = await axios.post('api/auth/post', {
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
                    navigate("/", {});
                }
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
                게시물 등록하기
            </div>
            <div className="submitButton">
                {canSubmit() ? (
                    <button
                        onClick={handleSubmit}
                        className="success-button"
                        // variant="outlined"
                    >
                        등록하기
                    </button>

                ) : (
                    <button
                        className="disable-button"
                        // variant="outlined"
                        // size="large"
                    >
                        사진과 내용을 모두 입력하세요
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

export default AddBoard;