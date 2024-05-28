import {TextField} from "@mui/material";
import React, {useState} from "react";
import "./replyInput.scss";
import { RxCornerBottomLeft } from "react-icons/rx";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../pages/api";

const ReplyInput = ({ parent_id, board_id, onReplySuccess}) => {
    const [replyContent, setReplyContent] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getToken = () => {
        return localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
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
    };

    const replyComment = async () => { // 대댓글 등록
        console.log('replyComment start');
        try {
            const response = await api.post(`/api/auth/comment?postId=${board_id}`,
                {
                    postId: board_id,
                    parentId: parent_id,
                    content: replyContent
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                    }
                });
            if (response.status === 200) {
                const responseData = response.data;
                console.log(`responseData : `, responseData);
                setReplyContent(""); // 댓글 입력창 초기화
                onReplySuccess();
            }
        } catch (error) { // 실패 시
            errorModal(error);
        }
    };

    return (
        <div className="replyComments-wrapper">
            <div className="header-with-icon">
                <div className="reply-style">
                    <div className="replyIcon"></div>
                </div>
                <div className="replyComments-header">
                    <TextField
                        className="replyComments-header-textarea"
                        maxRows={3}
                        onChange={(e) => {
                            setReplyContent(e.target.value)
                        }}
                        value={replyContent}
                        multiline placeholder="답글을 입력해주세요"
                    />
                    {replyContent !== "" ? (
                        <button onClick={replyComment} className="replyComment-submit-Button">등록하기</button>
                    ) : (
                        <button disabled={true} className="replyComment-submit-Button">
                            등록하기
                        </button>
                    )}
                </div>
            </div>
            <hr className="hr-style"/>
        </div>
    );
};

export default ReplyInput;