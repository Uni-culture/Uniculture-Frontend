import React, { useEffect, useState } from 'react'
import styles from './PopTag.module.css'
import axios from 'axios'
import {useTranslation} from "react-i18next";

export const PopTag = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };


  useEffect(()=>{
    const token = getToken(); // 토큰 가져오기
    async function fetchData(){
      const res = await axios.get(`/api/post/tag`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log("태그 서버 응답 : ", res);
      if(res.status===200){
        console.log(res.data);
        setData(res.data);
      }
    }
    fetchData();
  },[])

  return (
    <div className={styles.pop_container}>
      <h4 className={styles.title}>{t('PopTag.popularTags')}</h4>
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
