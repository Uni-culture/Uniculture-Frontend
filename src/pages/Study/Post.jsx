import React, { useState } from 'react'
import styles from './Post.module.css'
import { useNavigate } from 'react-router-dom';

export const Post = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = (e) =>{
    //전송 로직
    console.log({title, tags: tags.split(',').map(tag => tag.trim()), content});
  }
  return (
    <div className={styles.root}>
      <div></div>
      <div>스터디 모집 예시를 참고해 작성해주세요. 꼼꼼히 작성하면 멋진 스터디 팀원을 만날 수 있을거예요.</div>
      <div>
        <input type="text" id='title' value={title} placeholder='제목에 핵심 내용을 요약해보세요.'/>
      </div>
      <div>
        <input type="text" name="tags" id="tags" value={tags} />
      </div>
      <div>
        
      </div>
      <div>
        <button type='button' onClick={() => navigate(-1)}>취소</button>
        <button type='submit'>글 작성</button>
      </div>
    </div>
  )
}
