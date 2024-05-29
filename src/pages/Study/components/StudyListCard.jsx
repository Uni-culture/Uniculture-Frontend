import React from 'react'
import styles from '../Study.module.css'
import {  FaRegHeart, FaRegEye, FaRegComment} from "react-icons/fa";
import moment from 'moment';
import 'moment/locale/ko';
import { useTranslation } from 'react-i18next';

moment.locale('ko');

export const StudyListCard = ({data}) => {
  const { t } = useTranslation();
  return (
    <li className={styles.study_container}>
      <a href={`/board/${data.postId}`} className={styles.click_post}>
        <div className={styles.question}>
          <div className={styles.question_info}>
            <div className={styles.question_title}>
              <div>{data.postStatus==="START" ? <span className='badge rounded-pill bg-success'>{t('study.모집중')}</span>: <span className='badge rounded-pill bg-secondary'>{t('study.모집완료')}</span>}</div>
              <div className={styles.title_text}>{data.title}</div>
            </div>
            <p className={styles.question_body}>{data.content.replace(/(<([^>]+)>)/gi, '')}</p>
            <div className={styles.question_info_footer}>
              <div className={styles.question_info_detail}>
                <div className={styles.profileImageWrapper}>
                    <img
                        src={data?.profileurl ? data.profileurl : "/default_profile_image.png"}
                        alt="profile"
                        className={styles.image}
                    />
                </div>
                <span className={styles.writer}>{data.writerName}</span>
                <span>&nbsp;·&nbsp;</span>
                <span>{moment(data.createDate).fromNow()}</span>
              </div>
              <div className={styles.question_info_data}>
              <dl>
                <dt className={styles.question_dt}>{t('study.좋아요')}</dt>
                  <dd>
                    <FaRegHeart/>
                    <span className={styles.question_span}>{data.likeCount}</span>
                  </dd>
                <dt className={styles.question_dt}>{t('study.조회수')}</dt>
                  <dd>
                    <FaRegEye />
                    <span className={styles.question_span}>{data.viewCount}</span>
                  </dd>
                <dt className={styles.question_dt}>{t('study.댓글')}</dt>
                <dd>
                  <FaRegComment />
                  <span className={styles.question_span}>{data.commentCount}</span>
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
