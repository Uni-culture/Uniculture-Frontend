import React, { useEffect, useState } from 'react'
import styles from './PopTag.module.css'
import {useTranslation} from "react-i18next";
import { Api } from '../../../components/Api';

export const PopTag = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };


  useEffect(()=>{
    const token = getToken(); // 토큰 가져오기
    async function fetchData(){
      const res = await Api.GET_API('/api/post/tag');
      setData(res);
    }
    fetchData();
  },[])

  return (
    <div className={styles.pop_container}>
      <h4 className={styles.title}>{t('popTag.popularTags')}</h4>
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
