import React, { useState } from 'react'
import Layout from '../../components/Layout'
import styles from './Study.module.css'
// import { StudyCard } from './components/StudyCard'
import { FaSearch, FaRegHeart, FaRegEye, FaRegComment, FaPencilAlt} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export const Study = () => {
  const navigate = useNavigate();
  const [status, setstatus] = useState('전체');

  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };
  const token = getToken();


  const data = [
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
    },
    {
      "id": "0",
      "status": "unrecruited",
      "title": "전통적인 중량감 있는 아기에 대하여",
      "body": "다른 사이트 가까이 있습니다. 모든 소스의 양을 식별하고 설명합니다. 관계는 지식, 좋은 에이전트 형태로 알려진 대로 맞습니다. 자연은 한 번에 발 근처에서 좋습니다. 우리 시리즈에 심각한 자신에 따라 지출합니다.",
      "writer": "벤자민 파웰",
      "time": "39분 전",
      "like": "37",
      "viewCount": "237",
      "comments": "42"
    },
    {
      "id": "1",
      "status": "recruited",
      "title": "큰 품질에 대해 오래간다",
      "body": "구조를 기대하면 여전히 더 나은 싸움을 벌입니다. 무거운 리치는 늦게 어려운 과학자를 계속합니다. 전략 역사에 대해 현대적인 반응 시스템. 줄이기 위해 총으로 들어가십시오.",
      "writer": "조던 리틀",
      "time": "23분 전",
      "like": "72",
      "viewCount": "405",
      "comments": "34"
    },
    {
      "id": "2",
      "status": "recruited",
      "title": "무역 성능 평화에 대한 작업",
      "body": "문 주변에서 문을 허용하는 소유자가 나타납니다. 충분한 가스 데이터 제품. 큰 청구서를 기대하면서 완전한 피부 출처를 얻으십시오. 좋아하는 도전 사인 기사 스킬. 의회 남자 패턴으로 백을 끝내십시오.",
      "writer": "사무엘 최",
      "time": "55분 전",
      "like": "68",
      "viewCount": "258",
      "comments": "35"
    },
    {
      "id": "3",
      "status": "recruited",
      "title": "그가 연설하는 가스 피부",
      "body": "양쪽에 전 범위의 양에 따른 오일. 은행 교회와 비교한 지식. 잡지는 위치 노래 플레이어 사실을 다룹니다.",
      "writer": "데브라 알렉산더",
      "time": "38분 전",
      "like": "52",
      "viewCount": "199",
      "comments": "31"
    },
    {
      "id": "4",
      "status": "unrecruited",
      "title": "왜 일반 시민을 토론하는가",
      "body": "정치 전문가 개발의 끝 정보. 인간에 대한 이자 주장을 멈추십시오. 진실력 연구 다리 조각. 차를 좋아할 수 있습니다.",
      "writer": "제레미 가르시아",
      "time": "43분 전",
      "like": "34",
      "viewCount": "488",
      "comments": "35"
    },
  ];
    
  
  //선택하면 그거에 맞는 서버 요청 시도 코드 추가해야함
  const handleMenuClick = (selected) =>{
    return () => setstatus(selected);
  }

  return (
    <Layout>
      <div className={styles.background}>
        <div className={styles.menu}>
          <button className={status==='전체' ? styles.statusbtn_selected : styles.statusbtn} onClick={handleMenuClick('전체')}>전체</button>
          <button className={status==='모집중' ? styles.statusbtn_selected : styles.statusbtn} onClick={handleMenuClick('모집중')}>모집중</button>
          <button className={status==='모집완료' ? styles.statusbtn_selected : styles.statusbtn} onClick={handleMenuClick('모집완료')}>모집완료</button>
        </div>
        <div className={styles.opt}>
          <div className={styles.optbtn}>인기순</div>
          <div className={styles.optbtn}>분야</div>
          <div className={styles.searchBar}>
            <FaSearch/>
            <input className={styles.search} placeholder='제목, 글 내용을 검색해보세요'></input>
          </div>

        </div>
        <div className={styles.study_container_header}>
          <div className={styles.sortBtn}>
            <select name="sort" id="sort">
              <option value="recent">최신순</option>
              <option value="score">정확도순</option>
              <option value="comment">댓글많은순</option>
              <option value="recommend">좋아요순</option>
            </select>
  
              {/* <button onClick={() => navigate("/post/new", {state: {type: "study"}})}> */}
              <button onClick={() => navigate("/post/new?type=study")}>
              <FaPencilAlt />
              글쓰기
              </button>

              
            
          </div>
          <ul className={styles.study_list}>
            {
              data.map((i) => (
                <li className={styles.study_container}>
                  <a href={`/post/${i.id}`} className={styles.click_post}>
                    <div className={styles.question}>
                      <div className={styles.question_info}>
                        <div className={styles.question_title}>
                          <div>{i.status==="unrecruited" ? <span className='badge rounded-pill bg-primary'>모집중</span>: <span >모집완료</span>}</div>
                          <h3 className={styles.title_text}>{i.title}</h3>
                        </div>
                        <p className={styles.question_body}>{i.body}</p>
                        <div className={styles.question_info_footer}>
                          <div className={styles.question_info_detail}>
                            <span className={styles.writer}>{i.writer}</span>
                            <span>&nbsp;·&nbsp;</span>
                            <span>{i.time}</span>
                          </div>
                          <div className={styles.question_info_data}>
                            <dl>
                              <dt>좋아요</dt>
                              <dd>
                                <FaRegHeart/>
                                <span>{i.like}</span>
                              </dd>
                              <dt>조회수</dt>
                              <dd>
                                <FaRegEye />
                                <span>{i.viewCount}</span>
                              </dd>
                              <dt>댓글</dt>
                              <dd>
                                <FaRegComment />
                                <span>{i.comments}</span>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </Layout>

    
  )
}
