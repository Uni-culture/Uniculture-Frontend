import React, { useMemo, useState } from 'react'
import styles from './Comment.module.css'
import ReactQuill from 'react-quill';
import { Comment } from './components/Comment';

export const Comments = () => {
  
  const [content,setContent] = useState();

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };
  const token = getToken();

  // 서버로 부터 데이터 가져오기. ( 게시글 id 전송하면 그 댓글들 가져오기. 작성자, 좋아요, 내용 등등)
  const data = {
    count: 2,

  }

  //서버로 댓글 보내기 부분도 필요.
  const handleSubmit = async (e) =>{
    e.preventDefault();
    
  }

  const modules = useMemo(()=>{
    return {
      toolbar:{
        container:[
          [{header:[1,2,3,false]}],
          ["bold", "italic", "underline","strike"],
          [{list:"ordered"},{list:"bullet"}],
          [{color:[]},{background:[]}],
          [{align:[]},"link"],
        ]
      }
    }
  },[])


  return (
    <div className={styles.content}>
      <div className={styles.content_header}>
        <div className={styles.content_info}>댓글 <span>{data.count}</span></div>
        <div className={styles.content_sort_item}>
          <div className={styles.sort_item}>
            <input type="radio" name="commentSort" id="RECENT" checked className={styles.sort_item_I} />
            <label htmlFor="RECENT">최신순</label>
          </div>
          <span>&nbsp;·&nbsp;</span>
          <div className={styles.sort_item}>
            <input type="radio" name="commentSort" id="RECOMMEND" className={styles.sort_item_I}/>
            <label htmlFor="RECOMMEND">좋아요순</label>
          </div>
        </div>
      </div>

      <div className={styles.comment_write_container}>
        <div className={styles.comment_write}>
          <div className={styles.writer_profile}>프로필 사진</div>
          <div className={styles.comment_input}>
            <input type="text" placeholder='ㅇㅇ님 댓글을 작성해보세요' className={styles.input_box} />
          </div>
        </div>
        <div className={styles.comment_editor}>
          <div className={styles.markdown_body}>
            <ReactQuill
              style={{width:"800px", height:"100%"}}
              theme='snow'
              value={content}
              onChange={setContent}
              modules={modules} />
          </div>
          <div className={styles.editor_footer}>
            <button>취소</button>
            <button>등록</button>
          </div>
        </div>
      </div>

      <div className={styles.comment_list}>
        <Comment />
      </div>
    </div>
  )
}
