import React, { useEffect, useState } from 'react'
import styles from './PopTag.module.css'
import {useTranslation} from "react-i18next";
import { Api } from '../../../components/Api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const PopTag = () => {
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
        const res = await Api.GET_API('/api/post/tag');
        setData(res);
      } catch(error) {
        errorModal(error);
      }
    }
    fetchData();
  },[])

  return (
    <div className={styles.pop_container}>
      <div className={styles.title}>{t('popTag.popularTags')}</div>
      <ul className={styles.tag_list}>
        {data.map((i, index)=>(
          <li className={styles.tag_item} key={index}>
            <button className={styles.tag_btn}><span className={styles.tag_name}>{i}</span></button>
          </li>
        ))}

      </ul>
      
    </div>
  )
}
