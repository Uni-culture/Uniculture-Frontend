import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './Post.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"
import axios from 'axios';
import { Select, Button} from 'antd';
import Layout from '../../components/Layout';
import {useTranslation} from "react-i18next";

export const Post = () => {
  const location = useLocation();
  console.log(location);
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const { t } = useTranslation();
  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };
  const token = getToken();

  const postOptions = [{value: 'DAILY', label: t('Post.DAILY')}, {value: 'HELP', label: t('Post.HELP')}];
  const studyOptions = [{value: 'LANGUAGE', label: t('Post.LANGUAGE')},{value: 'HOBBY', label: t('Post.HOBBY')}]

  const [preset, setPreset] = useState(type);


  const [inputs, setInputs] = useState({
    title:'',
    tags:null,
    category:'',
  })
  const {title, tags, category} = inputs;
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const quillRef = useRef();

  useEffect(()=>{
    if(type ==='study'){
      setPreset('study');
      setContent(t('Post.studyRecruitmentExample'));
      setInputs(inputs =>({
        ...inputs,
        category: studyOptions[0].value,
      }));
    }
    else{
      setPreset('post');
      setContent("");
      setInputs(inputs =>({
        ...inputs,
        category: postOptions[0].value,
      }));
    }
    handleTagChange(null);
  },[type])

  const handleCategoryChange = (value) => {
    console.log(`Selected: ${value}`);
    setInputs(inputs => ({
      ...inputs,
      category: value,
    }))
  };

    const handleTagChange = (value) => {
      console.log(`Selected: ${value}`);
      setInputs(inputs => ({
        ...inputs,
        tags: value,
      }))  
    };

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
    console.log({ title, tags, content, category });
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    // console.log({ title, tags: tags.split(',').map(tag => tag.trim()), content, category });
    // 실제 전송 로직 추가 예정
    // const apiUrl = preset === "study" ? '/api/auth/post/study' : '/api/auth/post';
    const res = await axios.post('/api/auth/post',{
      title: title,
      contents: content,
      posttype: category,
      postCategory: type==='post' ? 'NORMAL' : 'STUDY',
      tag: tags},{
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

  const handleCancel = () =>{
    if(type==="post") navigate("/",{});
    else navigate("/study",{});
  }

  return (
    <Layout>
    <div className={styles.root}>
      <div className={styles.post_name}>
        <h2>{t('Post.create', { preset: t(`Post.${preset}`) })}</h2>
        {/* <div className={styles.example}>스터디 모집 예시를 참고해 작성해주세요. 꼼꼼히 작성하면 멋진 스터디 팀원을 만날 수 있을거예요.</div> */}
        <div>
          {/* <button onClick={() => handlePresetChange("post")} className={preset === "post" ? styles.active : ""}>게시글</button>
          <button onClick={() => handlePresetChange("study")} className={preset === "study" ? styles.active : ""}>스터디</button>   */}
          <Button onClick={() => navigate("/post/new?type=post")} type={type==="post" ? 'primary' : 'default'}>{t('Post.postButton')}</Button>
          <Button onClick={() => navigate("/post/new?type=study")} type={type==="study" ? 'primary' : 'default'} >{t('Post.studyButton')}</Button>
          {/* <button onClick={() => navigate("/post/new?type=post")} className={preset === "post" ? styles.active : ""}>게시글</button>
          <button onClick={() => navigate("/post/new?type=study")} className={preset === "study" ? styles.active : ""}>스터디</button>   */}
        </div>
      </div>
      
      <form action="post" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.post_content}>
        <div className={styles.left}>
          <div className={styles.title}>
            <label htmlFor="title">
              <span>{t('Post.title')}</span>
            </label>
            <div className={styles.title_box}>
              <input type="text" name='title' id='title' value={title} onChange={onChange} placeholder={t('Post.titlePlaceholder')} className={styles.title_input}/>
            </div>
            
          </div>
          <div className={styles.content_body}>
            <span>{t('Post.content')}</span>
            <ReactQuill
              style={{ width: "800px", height: "500px" }}
              placeholder={t('Post.contentPlaceholder')}
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
            <label htmlFor="category"><span>{t('Post.categoryLabel')}</span></label>
            <Select          
                value={category}
                onChange={handleCategoryChange}
                style={{
                  width: 200,
                }}
                options={type==="post" ? postOptions : studyOptions}
              />
          </div>
          <div className={styles.tags}>
            <label htmlFor="tags"><span>{t('Post.tagsLabel')}</span></label>
            <Select
              mode="tags"              
              placeholder="Please select"
              value={tags}
              onChange={handleTagChange}
              maxCount={5}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className={styles.btns}>
            <Button className={styles.btn} onClick={handleCancel}>{t('Post.cancelButton')}</Button>
            <Button type="primary" onClick={handleSubmit} className={styles.btn} disabled={!title || !content || content==="<p><br></p>"}>{t('Post.submitButton')}</Button>
          </div>
        </div>
      </div>
      </form>
    </div>
    </Layout>
  )
}
