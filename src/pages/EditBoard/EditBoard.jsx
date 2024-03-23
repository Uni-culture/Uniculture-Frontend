import {useNavigate, useParams, useLocation} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import ImageUploader from "../../components/Board/ImageUploader";
import TextArea from "../../components/Board/TextArea";
import "../AddBoard/addBoard.scss";
import axios from "axios";
import Header from "../../components/Header/Header";
import {IoArrowBack} from "react-icons/io5";

const EditBoard = () => {
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

    useEffect(() => {
        console.log(`Edit 게시글 아이디: ${board_id}`);
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
                    setTitle(boardData.title);
                    setContent(boardData.content);
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

    const canSubmit = useCallback(() => {
        return content !== "" && title !== "";
    }, [title, content]);

    const handleSubmit = async () => {
        try {
            console.log(`title: ${title}`);
            console.log(`contents: ${content}`);
            console.log(`posttype: ${postType}`);
            if(token) {
                console.log("토큰 확인: ", token);
                const response = await axios.patch(`/api/auth/post/${board_id}`, {
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
        alert("일상이 선택되었습니다.");
    };
    const helpButtonClick = () => {
        setPostType("HELP");
        alert("도움이 선택되었습니다.");
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