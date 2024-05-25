import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './RankingPost.module.css'
import {useTranslation} from "react-i18next";
import api from "../../api";
import Swal from 'sweetalert2';

export const RankingPost = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  };

  useEffect(()=>{
    const token = getToken(); // 토큰 가져오기
    async function fetchData(){
      try{
        const res = await api.get(`/api/post/hot`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        console.log('인기글 서버 응답: ', res);
        if(res.status===200){
          console.log(res.data);
          setData(res.data);
        }
      } catch (error) {
        errorModal(error);
      }
    }
    fetchData();
  },[])

  return (
    <div className={styles.container}>
      <div className={styles.header}>{t('rankingPost.weeklyPopularPosts')}</div>
        <ul className={styles.ul}>
          {data.map((i)=>(
            <li className={styles.list} onClick={() => navigate(`/board/${i.postId}`)} key={i.postId}>
              
                <div className={styles.postTitle}>{i.title}</div>
                <div className={styles.writerInfo}>
                  <div className={styles.profileImageWrapper}>
                      <img
                          src={i?.profileurl ? i.profileurl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                          alt="profile"
                          className={styles.image}
                      />
                  </div>
                  <span>{i.writerName}</span>
                </div>
              
            </li>
          ))}
          
        </ul>
    </div>
  )
}
