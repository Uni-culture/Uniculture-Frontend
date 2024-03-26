import React from 'react'
import Layout from '../../components/Layout'
import styles from './PostView.module.css'

export const PostView = () => {
  const data = 
    {
      "id":"123",
      "status": "unrecruited",
      "title" : "Next-js 클론코딩",
      "body":"안녕하세요 저는 누구누구고 뭐하는 중 ㅋㅋ 야호~ 신난다 글 길게 쓰기",
      "writer":"박주용",
      "time" :"4분 전",
      "like" : "0",
      "viewCount":"20",
      "comments":"3"
    }
  return (
    <Layout>
      <section>
        <div className={styles.side}>
          <div className={styles.sideLeft}></div>
          <div className={styles.sideSpace}></div>
          <div className={styles.sideRight}></div>
        </div>
        <div className={styles.content}>
          <div className={styles.content_header}>
            <div className={styles.header_title}>
              <h1>{data.title}</h1>
            </div>
            <div className={styles.subtitle}>
              <h6>{data.writer}</h6>
              <div className={styles.content_date}>
                <span>
                  <span>작성일</span>
                  <span>{data.time}</span>
                </span>
                <span>
                  <span>조회수</span>
                  <span>{data.viewCount}</span>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body_markdown}>
              {data.body}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.comment}>
          <div className={styles.comment_info}>
            <div className={styles.comment_title}>
              댓글
              <span>{data.comments}</span>
            </div>
          </div>
          <div className={styles.comment_content}>
            
          </div>
        </div>
      </section>
    </Layout>
  )
}
