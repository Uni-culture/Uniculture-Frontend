import React from 'react'
import styles from '../Study.module.css'
import {  FaRegHeart, FaRegEye, FaRegComment} from "react-icons/fa";
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');

export const StudyListCard = ({data}) => {
  return (
    <li className={styles.study_container}>
                  <a href={`/board/${data.postId}`} className={styles.click_post}>
                    <div className={styles.question}>
                      <div className={styles.question_info}>
                        <div className={styles.question_title}>
                          <div>{data.postStatus==="START" ? <span className='badge rounded-pill bg-primary'>모집중</span>: <span >모집완료</span>}</div>
                          <h3 className={styles.title_text}>{data.title}</h3>
                        </div>
                        <p className={styles.question_body}>{data.content.replace(/(<([^>]+)>)/gi, '')}</p>
                        <div className={styles.question_info_footer}>
                          <div className={styles.question_info_detail}>
                            <span className={styles.writer}>{data.writerName}</span>
                            <span>&nbsp;·&nbsp;</span>
                            <span>{moment(data.createDate).fromNow()}</span>
                          </div>
                          <div className={styles.question_info_data}>
                            <dl>
                              <dt>좋아요</dt>
                              <dd>
                                <FaRegHeart/>
                                <span>{data.likeCount}</span>
                              </dd>
                              <dt>조회수</dt>
                              <dd>
                                <FaRegEye />
                                <span>{data.viewCount}</span>
                              </dd>
                              <dt>댓글</dt>
                              <dd>
                                <FaRegComment />
                                <span>{data.commentCount}</span>
                              </dd>
                            </dl>
                          </div>
                        </div>
                  </div>
        </div>
      
      </a>
    </li>
  )
}
