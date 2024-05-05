import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RankingPost.module.css'

export const RankingPost = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };


  useEffect(()=>{
    const token = getToken(); // 토큰 가져오기
    async function fetchData(){
    const res = await axios.get(`/api/post/hot`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    console.log('인기글 서버 응답: ', res);
    if(res.status===200){
      console.log(res.data);
      setData(res.data);
    }}
    fetchData();
  },[])

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>주간 인기글</h4>
        <ul className={styles.ul}>
          {data.map((i)=>(
            <li className={styles.list} onClick={() => navigate(`/board/${i.postId}`)} key={i.postId}>
              
                <p>{i.title}</p>
                <span>{i.writerName}</span>
              
            </li>
          ))}
          
        </ul>
    </div>
  )
}
