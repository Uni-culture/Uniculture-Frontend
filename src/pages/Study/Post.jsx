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

  const postOptions = [{value: 'DAILY', label: t('post.DAILY')}, {value: 'HELP', label: t('post.HELP')}];
  const studyOptions = [{value: 'LANGUAGE', label: t('post.LANGUAGE')},{value: 'HOBBY', label: t('post.HOBBY')}]

  const [preset, setPreset] = useState(type);

  const [postType, setPostType] = useState('');

  const [imgUrl, setImgUrl] = useState('');
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
      setContent(t('post.studyRecruitmentExample'));
      setInputs(inputs =>({
        ...inputs,
        category: studyOptions[0].value,
      }));
      setPostType(t('post.createStudy'));
    }
    else{
      setPreset('post');
      setContent("");
      setInputs(inputs =>({
        ...inputs,
        category: postOptions[0].value,
      }));
      setPostType(t('post.createPost'));
    }
    handleTagChange(null);
  },[type, t])

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

    // 이미지 처리를 하는 핸들러
const imageHandler = () => {
  console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

  // 1. 이미지를 저장할 input type=file DOM을 만든다.
  const input = document.createElement('input');
  // 속성 써주기
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
  // input이 클릭되면 파일 선택창이 나타난다.

  // input에 변화가 생긴다면 = 이미지를 선택
  input.addEventListener('change', async () => {
    console.log('온체인지');
    const file = input.files[0];
    // multer에 맞는 형식으로 데이터 만들어준다.
    const formData = new FormData();
    formData.append('files', file); // formData는 키-밸류 구조
    // 백엔드 multer라우터에 이미지를 보낸다.
    try {
      const result = await axios.post('/api/file', formData);
      console.log('성공 시, 백엔드가 보내주는 데이터');
      console.log(result.data);
      const IMG_URL = result.data;
      if(imgUrl===''){ 
        setImgUrl(result.data);
        console.log("첫번째 이미지 저장~");
      }
      // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
      // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
      // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.

      // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
      const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
      // 1. 에디터 root의 innerHTML을 수정해주기
      // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
      // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
      // editor.root.innerHTML =
      //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

      // 2. 현재 에디터 커서 위치값을 가져온다
      const range = editor.getSelection();
      // 가져온 위치에 이미지를 삽입한다
      editor.insertEmbed(range.index, 'image', IMG_URL);
    } catch (error) {
      console.log('실패했어요ㅠ');
    }
  });
};

  const  modules = useMemo(() =>{
    return {
      toolbar: {
        container: [
          [{size: ["small", false, "large", "huge"]}],
          ["bold", "italic", "underline","strike"],
          ["blockquote"],
          [{list:"ordered"},{list:"bullet"}],
          [{color:[]},{background:[]}],
          [{align:[]},"link","image"],
        ],
        handlers:{
          image: imageHandler,
        }
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
      tag: tags,
      imgUrl: imgUrl},{
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
        <h2>{t(postType)}</h2>
        {/* <div className={styles.example}>스터디 모집 예시를 참고해 작성해주세요. 꼼꼼히 작성하면 멋진 스터디 팀원을 만날 수 있을거예요.</div> */}
        <div>
          {/* <button onClick={() => handlePresetChange("post")} className={preset === "post" ? styles.active : ""}>게시글</button>
          <button onClick={() => handlePresetChange("study")} className={preset === "study" ? styles.active : ""}>스터디</button>   */}
          <Button onClick={() => navigate("/post/new?type=post")} type={type==="post" ? 'primary' : 'default'}>{t('post.postButton')}</Button>
          <Button onClick={() => navigate("/post/new?type=study")} type={type==="study" ? 'primary' : 'default'} >{t('post.studyButton')}</Button>
          {/* <button onClick={() => navigate("/post/new?type=post")} className={preset === "post" ? styles.active : ""}>게시글</button>
          <button onClick={() => navigate("/post/new?type=study")} className={preset === "study" ? styles.active : ""}>스터디</button>   */}
        </div>
      </div>
      
      <form action="post" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.post_content}>
        <div className={styles.left}>
          <div className={styles.title}>
            <label htmlFor="title">
              <span>{t('post.title')}</span>
            </label>
            <div className={styles.title_box}>
              <input type="text" name='title' id='title' value={title} onChange={onChange} placeholder={t('post.titlePlaceholder')} className={styles.title_input}/>
            </div>
            
          </div>
          <div className={styles.content_body}>
            <span>{t('post.content')}</span>
            <ReactQuill
              style={{ width:"100%", height: "500px" }}
              placeholder={t('post.contentPlaceholder')}
              theme="snow"
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.catNTags}>
            <div className={styles.category}>
              <label htmlFor="category"><span>{t('post.categoryLabel')}</span></label>
              <Select          
                  value={category}
                  onChange={handleCategoryChange}
                  style={{
                    width: "100%",
                  }}
                  options={type==="post" ? postOptions : studyOptions}
                />
            </div>
            <div className={styles.tags}>
              <label htmlFor="tags"><span>{t('post.tagsLabel')}</span></label>
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
          </div>
          <div className={styles.btns}>
            <Button className={styles.btn} onClick={handleCancel}>{t('post.cancelButton')}</Button>
            <Button type="primary" onClick={handleSubmit} className={styles.btn} disabled={!title || !content || content==="<p><br></p>"}>{t('post.submitButton')}</Button>
          </div>
        </div>
      </div>
      </form>
    </div>
    </Layout>
  )
}
