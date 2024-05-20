import Layout from "../../components/Layout";
import Sidebar from "../../components/ProfileSidebar/Sidebar";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";

const ProfileDelete = () => {
    const [deleteInput, setDeleteInput] = useState('');
    const [isModalOpened, setIsModalOpened] = useState(false);
    
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleModal = () => {
        loginCheck();
    };

    // 로그인 후 저장된 토큰 가져오는 함수
    const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
    };

    const removeToken = () => {
        localStorage.removeItem('accessToken'); // 로컬 스토리지에서 토큰 가져옴
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
    };

    const loginCheck = async () => {
        console.log('loginCheck');
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await axios.get('/api/auth/sec/home', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200){
                setIsModalOpened(!isModalOpened);
            }
        } catch (error) {
            errorModal(error);
        }
    };

    // 회원 삭제
    const deleteUser = async () => {
        try {
            const token = getToken(); // 토큰 가져오기

            const response = await axios.delete('/api/auth/member', {
            headers: {
                Authorization: `Bearer ${token}` // 헤더에 토큰 추가
            }
            });

            if(response.status === 200) {
                alert("회원이 삭제되었습니다.");
                removeToken();
                navigate('/');
            }
        } catch (error) {
            errorModal(error);
        }
    };

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <Sidebar />
                    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4" style={{ overflowY: "auto" }}>
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h4 className="h4">{t('profileDelete.accountDeletion')}</h4>
                        </div>
                        <div className="mb-3 row" style={{ textAlign: "center" }}>
                            {/* 탈퇴하기 버튼에 모달 열기 함수 연결 */}
                            <button type="button" className="btn btn-primary btn-sm" style={{ width: "100px" }} onClick={handleModal}>{t('profileDelete.accountDeletion')}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            {isModalOpened && (
                <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{t('profileDelete.deleteAccount')}</h5>
                            </div>
                            <div className="modal-body">
                                {t('profileDelete.modalBody')}
                                <div style={{textAlign:"center", marginTop:"20px"}}><input placeholder={t('profileDelete.modalInputPlaceholder')} onChange={(e)=>{setDeleteInput(e.target.value)}}/></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleModal}>{t('profileDelete.closeButton')}</button>
                                <button type="button" className="btn btn-primary" 
                                    onClick={()=>{
                                        if(deleteInput==="탈퇴하기"){
                                            deleteUser();
                                        }
                                        else {
                                            alert(t('profileDelete.deleteInputAlert'));
                                        }
                                    }}
                                >{t('profileDelete.deleteButton')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProfileDelete;
