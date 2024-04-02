import React from 'react'
import styles from './Comment.module.css'
import DOMPurify from 'dompurify'
import { FaRegHeart} from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";

export const Comment = () => {

  const data = {
    writer: "Me",
    time: "2024.04.12 오전 1:25",
    body: "<p>좋은 스터디 만들어주셔서 감사합니다. 그런데 지금 참여할려니까 입장 조건에 해당하지 않아 참여할 수 없다고 합니다. 조건이 일단 저 자신은 부합한데 제가 좀 바로 설명하기 어려운 부분이 있어 따로 이메일로 이야기 나누고 싶은데 연락 주시면 감사하겠습니다!</p><br>",
    heart: 0,
  }

  const SafeHtml = ({html}) =>{
    const safeHtml = DOMPurify.sanitize(html);
    return <div dangerouslySetInnerHTML={{ __html: safeHtml}} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div>프로필 이미지</div>
          <div>
            <a href={`/profile/${data.writer}`}>{data.writer}</a>
            <span>{data.time}</span>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <SafeHtml html={data.body} />
      </div>

      <div className={styles.footer}>
        <div className={styles.like}>
          <FaRegHeart />
          <button>{data.heart}</button>
        </div>
        <button>
          <FaShareNodes />
          <span>공유</span>
        </button>
      </div>
    </div>
  )
}
