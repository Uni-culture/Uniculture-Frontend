import React from 'react'
import Layout from '../../components/Layout'
import styles from './PostView.module.css'
import DOMPurify from 'dompurify'
import { CommentList } from './CommentList'

export const PostView = () => {
  const data = 
    {
      "id":"123",
      "status": "unrecruited",
      "title" : "Next-js 클론코딩",
      "body":"<p><strong>[개발 스터디 모집 내용 예시]</strong></p><ul><li>스터디 주제 :</li><li>스터디 목표 :</li><li>예상 스터디 일정(횟수) :</li><li>예상 커리큘럼 간략히 :</li><li>예상 모집인원 :</li><li>스터디 소개와 개설 이유 :</li><li>스터디 관련 주의사항 :</li><li>스터디에 지원할 수 있는 방법을 남겨주세요. (이메일, 카카오 오픈채팅방, 구글폼 등.) :</li></ul><p><br></p>",
      "writer":"박주용",
      "time" :"4분 전",
      "like" : "0",
      "viewCount":"20",
      "comments":"3"
    }

    const SafeHtml = ({html}) =>{
      const safeHtml = DOMPurify.sanitize(html);
      return <div dangerouslySetInnerHTML={{ __html: safeHtml}} />;
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
              <SafeHtml html={data.body} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.comment}>
          {/* <div className={styles.comment_info}>
            <div className={styles.comment_title}>
              댓글
              <span>{data.comments}</span>
            </div>
          </div> */}
          <div className={styles.comment_content}>
            <CommentList />
          </div>
        </div>
      </section>
    </Layout>
  )
}
