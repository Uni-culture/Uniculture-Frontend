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

  const token = getToken(); // 토큰 가져오기

  useEffect(()=>{
    async function fetchData(){
    const res = await axios.get(`/api/post?size=5&sort=likeCount,DESC&ca=STUDY`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    console.log('서버 응답: ', res);
    if(res.status===200){
      console.log(res.data);
      setData(res.data.content);
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
