import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './Post.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';

import { style } from '@mui/system';
import { BsThreeDots, BsHash } from "react-icons/bs";
import axios from 'axios';


export const Post = () => {
  const location = useLocation();
  console.log(location);
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };
  const token = getToken();

  const [preset, setPreset] = useState('post');


  const [inputs, setInputs] = useState({
    title:'',
    tags:'',
    category:'',
  })
  const {title, tags, category} = inputs;
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const quillRef = useRef();

  useEffect(()=>{
    if(type ==='study'){
      setPreset('study');
      setContent("<p><strong>[개발 스터디 모집 내용 예시]</strong></p><ul><li>스터디 주제 :</li><li>스터디 목표 :</li><li>예상 스터디 일정(횟수) :</li><li>예상 커리큘럼 간략히 :</li><li>예상 모집인원 :</li><li>스터디 소개와 개설 이유 :</li><li>스터디 관련 주의사항 :</li><li>스터디에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방, 구글폼 등.) :</li></ul><p><br></p>")
    }
    else{
      setPreset('post');
      setContent("");
    }
  },[type])


  const  modules = useMemo(() =>{
    return {
      toolbar: {
        container: [
          [{header: [1,2,3, false]}],
          ["bold", "italic", "underline","strike"],
          ["blockquote"],
          [{list:"ordered"},{list:"bullet"}],
          [{color:[]},{background:[]}],
          [{align:[]},"link","image"],
        ]
      }
    }
  },[])

  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);

    if(newPreset === "post"){
      setContent("");
    } else if(newPreset ==="study"){
      setContent("")
    }
  }

  const onChange = (e) =>{
    const {value, name} = e.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    console.log({ title, tags: tags.split(',').map(tag => tag.trim()), content, category });
    // 실제 전송 로직 추가 예정
    const apiUrl = preset === "study" ? '/api/auth/post/study' : '/api/auth/post';
    const res = await axios.post(apiUrl,{
      title: title,
      contents: content,
      posttype: category},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    console.log('서버 응답:', res);
    console.log('response.status:', res.status);
    if(res.status === 200) {
      alert("글 작성 완료");
      navigate("/",{});
    }
    else {alert("글 작성 실패")}

  }

  return (
    <div className={styles.root}>
      <div className={styles.post_name}>
        <h2>{preset} 작성</h2>
        {/* <div className={styles.example}>스터디 모집 예시를 참고해 작성해주세요. 꼼꼼히 작성하면 멋진 스터디 팀원을 만날 수 있을거예요.</div> */}
        <div>
          {/* <button onClick={() => handlePresetChange("post")} className={preset === "post" ? styles.active : ""}>게시글</button>
          <button onClick={() => handlePresetChange("study")} className={preset === "study" ? styles.active : ""}>스터디</button>   */}
          <button onClick={() => navigate("/post/new?type=post")} className={preset === "post" ? styles.active : ""}>게시글</button>
          <button onClick={() => navigate("/post/new?type=study")} className={preset === "study" ? styles.active : ""}>스터디</button>  
        </div>
      </div>
      
      <form action="post" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.post_content}>
        <div className={styles.left}>
          <div className={styles.title}>
            <label htmlFor="title">
              <span>제목</span>
            </label>
            <div className={styles.title_box}>
              <input type="text" name='title' id='title' value={title} onChange={onChange} placeholder='제목에 핵심 내용을 요약해보세요.' className={styles.title_input}/>
            </div>
            
          </div>
          <div className={styles.content_body}>
            <span>내용</span>
            <ReactQuill
              style={{ width: "800px", height: "600px" }}
              placeholder="내용 작성 바랍니다~ 야호~"
              theme="snow"
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.category}>
            <label htmlFor="category"><span>카테고리 설정</span></label>
            <div className={styles.category_box}>
              <div className={styles.category_wrapper}>
                <input type="text" name="category" id="category" onChange={onChange} value={category} className={styles.category} />
              </div>
              <button className={styles.category_btn}><BsThreeDots /></button>
            </div>
          </div>
          <div className={styles.tags}>
            <label htmlFor="tags"><span>태그 설정 (최대 ? 개)</span></label>
            <div className={styles.tag_box}>
              <BsHash />
              <input type="text" name="tags" id="tags" value={tags} onChange={onChange} className={styles.tagInput}/>
            </div>
          </div>
          <div className={styles.btns}>
            <button type='button' onClick={() => navigate(-1)} className={styles.btn}>취소</button>
            <button type='submit' className={styles.btn} disabled={!title || !content || content==="<p><br></p>"}>글 작성</button>
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}
