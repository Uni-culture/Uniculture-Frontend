import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './Post.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"
import axios from 'axios';
import { Select, Button} from 'antd';
import Layout from '../../components/Layout';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

export const CorrectPost = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  console.log(location);
  const {board_id} = useParams();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  //글 종류가 post 인지 study인지 확인하고 저장해야할듯.
  const [preset, setPreset] = useState('post');

  
  const postOptions = [{value: 'DAILY', label: '일상'}, {value: 'HELP', label: '도움'}];
  const studyOptions = [{value: '자격증', label:'자격증'},{value: '언어교류', label:'언어교류'}]

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };
  const token = getToken();

  const [inputs, setInputs] = useState({
    title:'',
    tags:[],
    category:'',
  })
  const {title, tags, category} = inputs;
  const [content, setContent] = useState("");
  const quillRef = useRef();

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

  //post 인지 study인지 확인 후 api 주소 변경 해야함.
  useEffect(() => {
    console.log(`Edit 게시글 아이디: ${board_id}`);
    const getBoard = async () => {
        console.log('getBoard start');
        try {
            const response = await axios.get(`/api/post/${board_id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // 헤더에 토큰 추가
                }
            });
            console.log('서버 응답: ', response);
            console.log('response.status: ', response.status);

            if (response.status === 200) {
                const boardData = response.data;
                console.log(`data : `, boardData);
                setInputs({
                  title: boardData.title, 
                  tags: boardData.tags, 
                  category: boardData.postType
                })
                setContent(boardData.content);
                console.log("200 성공~~~~");
            }
        } catch (error) { // 실패 시
            errorModal(error);
        }
    };
    getBoard();

}, [])

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
    // console.log({ title, tags: tags.split(',').map(tag => tag.trim()), content, category });
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    // console.log({ title, tags: tags.split(',').map(tag => tag.trim()), content, category });
    // 실제 전송 로직 추가 예정
    const apiUrl = preset === "post" ? `/api/auth/post/${board_id}` : '/api/auth/post/study' ;
    const res = await axios.patch(apiUrl,{
      title: title,
      contents: content,
      posttype: category,
      postCategory: 'NORMAL',
      tag: tags},{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    console.log('서버 응답:', res);
    console.log('response.status:', res.status);
    if(res.status === 200) {
      alert("글 수정 완료");
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
        <h2>{preset} 수정</h2>
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
              style={{ width: "800px", height: "500px" }}
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
            <label htmlFor="tags"><span>태그 설정 (최대 5 개)</span></label>
            <Select
              mode="tags"              
              placeholder="태그를 작성해주세요"
              value={tags}
              onChange={handleTagChange}
              maxCount={5}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className={styles.btns}>
            <Button className={styles.btn} onClick={()=>navigate(-1)}>취소</Button>
            <Button type="primary" onClick={handleSubmit} className={styles.btn} disabled={!title || !content || content==="<p><br></p>"}>글 수정</Button>
          </div>
        </div>
      </div>
      </form>
    </div>
    </Layout>
  )
}
