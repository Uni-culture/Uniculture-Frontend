import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styles from './Study.module.css'
import {Pagination} from "@mui/material";
import '../Search/search.css'
// import { StudyCard } from './components/StudyCard'
import { FaSearch,FaPencilAlt} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StudyListCard } from './components/StudyListCard';
import { PopTag } from './components/PopTag';
import { RankingPost } from './components/RankingPost';
import { IoSearch, IoArrowBack } from "react-icons/io5";
import { HiOutlineHashtag } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import {useTranslation} from "react-i18next";
import { Api } from '../../components/Api';

export const Study = () => {
  const navigate = useNavigate();
  const [status, setstatus] = useState('전체');

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [boardList, setBoardList] = useState([]);
  const [sort, setSort] = useState('recent');

  const [debouncedSearch, setDebouncedSearch] = useState(""); // API 호출에 사용될 검색어
  const [search, setSearch] = useState(""); // 사용자 입력 검색어
  const [tag, setTag] = useState(""); // 사용자 입력 태그
  const [tags, setTags] = useState([]); // 입력된 태그들을 저장할 배열
  const { t } = useTranslation();


  const getToken = () => {
    return localStorage.getItem('accessToken'); // 쿠키 또는 로컬 스토리지에서 토큰을 가져옴
  };

  const token = getToken(); // 토큰 가져오기

  const fetchBoardData = async (page) => {
    console.log('fetchBoardData start');
        let url = `/api/post?page=${page}&size=10&ca=STUDY`; // 기본 URL
        if (status === '모집중') {
          url += '&ps=START';
        } else if (status === '모집완료') {
          url += '&ps=FINISH';
        }
        
        if(sort!=='recent'){
          url+= `&sort=${sort},DESC`;
        }
          
        const response = await Api.GET_API(url,navigate,t);
        setBoardList(response.content);
        setPageCount(Math.ceil( response.totalElements / 10));
  };

  useEffect(() => {
    if(!search && tags.length===0){
    fetchBoardData(currentPage);
    } else{
      searchData();
    }
  }, [currentPage,status, sort, debouncedSearch, tags])


  const changePage = (value) => {
    setCurrentPage(value);
  }

  // 사용자 입력 처리
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleReset = () => {
    setSearch(""); // 검색어 초기화
    setTag(""); // 현재 입력 중인 태그 초기화
    setTags([]); // 태그 배열 초기화
  };

  // 사용자 태그 처리
  const handleTagChange = (e) => {
    const noSpaces = e.target.value.replace(/\s+/g, '');
    console.log('Updated tags:', noSpaces);
    setTag(noSpaces);
};
// debounce를 위한 useEffect
useEffect(() => {
  setDebouncedSearch(search);
}, [search]);

  // 게시물 검색 요청
  const searchData = async (page=currentPage, newTags = tags) => {
    let url = `/api/post/search?page=${page}&size=10&category=STUDY`;

    if (status === '모집중') {
          url += '&ps=START';
        } else if (status === '모집완료') {
          url += '&ps=FINISH';
        }

    // 검색어가 존재하는 경우
    if (debouncedSearch) {
      url += `&content=${debouncedSearch}`;
  }

    // 태그가 존재하는 경우
    if (newTags.length > 0) {
        const tagsQuery = newTags.map(tag => `tag=${(tag)}`).join('&');
        console.log("tagsQuery:", tagsQuery);
        url += `&${tagsQuery}`;
    }

    const response = await Api.GET_API(url, navigate, t);
    setBoardList(response.content);
  };

  const handleSortChange = (value) =>{
    setSort(value);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // 엔터키 기본 동작 방지
        const trimmedTag = tag.trim();
        console.log("trimmedTag: ", trimmedTag);

        if (trimmedTag !== "" && !tags.includes(trimmedTag)) {
            const newTags = [...tags, trimmedTag]; // 태그 배열에 현재 태그 추가
            setTags(newTags); // 상태 업데이트
        }
        searchData(); // 업데이트된 태그 배열을 searchData에 전달
        setTag(""); // 입력 필드 초기화
    } else if (e.key === 'Backspace' && tag === "") {
        // 아무것도 입력하지 않은 상태에서 backspace를 누를 경우 가장 최근에 추가된 태그 삭제
        const newTags = tags.slice(0, tags.length - 1);
        setTags(newTags);
    }
};
  
  //선택하면 그거에 맞는 서버 요청 시도 코드 추가해야함
  const handleMenuClick = (selected) =>{
    return () => setstatus(selected);
  }

  return (
    <Layout>
      <div className={styles.background}>
        <div className={styles.body_content}>
          <div className={styles.menu}>
            <ul className="nav nav-underline nav-tab">
              <li className="nav-item">
                  <button className={`nav-link ${status==='전체' ? 'active' : ''}`} style={{color: "black"}}
                    onClick={handleMenuClick('전체')}>
                    {t('study.전체')}
                  </button>
              </li>
              <li className="nav-item">
                  <button className={`nav-link ${status==='모집중' ? 'active' : ''}`} style={{color: "black"}}
                    onClick={handleMenuClick('모집중')}>
                    {t('study.모집중')}
                  </button>
              </li>
              <li className="nav-item">
                  <button className={`nav-link ${status==='모집완료' ? 'active' : ''}`} style={{color: "black"}}
                    onClick={handleMenuClick('모집완료')}>
                      {t('study.모집완료')}
                  </button>
              </li>
            </ul>   
          </div>
          <div className={styles.search_box}>
            <div className="search-container">
              <div className="searchWrap">
                <IoSearch className="input-icon" />
                <input className="search-input" type="text" value={search} onChange={handleSearchChange} placeholder={t('study.searchPlaceholder')}/>
                </div>
                <button className="search-button" onClick={() => searchData(0)}>{t('study.searchButton')}</button>
            </div>

            <div className="tag-container">
              <div className="tag-search-wrap">
                <HiOutlineHashtag className="tag-icon"/>
                <div className="tags-display">
                  {tags && tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <IoIosClose className="remove-tag-icon" onClick={() => removeTag(index)} />
                    </span>
                  ))}
                </div>
                <input className="tag-input" type="text" value={tag} onChange={handleTagChange} onKeyDown={handleKeyDown} placeholder={t('study.tagSearchPlaceholder')}/>
              </div>
              <button className="reset-button" onClick={handleReset}><GrPowerReset className="reset-icon"/>{t('study.resetButton')}</button>
            </div>

          </div>
          <div className={styles.study_container_header}>
            <div className={styles.sortBtn}>
              <ul className="nav nav-underline nav-tab">
                <li className="nav-item">
                    <button className={`nav-link ${sort==='recent' ? 'active' : ''}`} style={{color: "black"}}
                      onClick={() => setSort("recent")}>
                      {t('study.최신순')}
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${sort==='commentCount' ? 'active' : ''}`} style={{color: "black"}}
                      onClick={() => setSort("commentCount")}>
                      {t('study.댓글순')}
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${sort==='likeCount' ? 'active' : ''}`} style={{color: "black"}}
                      onClick={() => setSort("likeCount")}>
                        {t('study.좋아요순')}
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${sort==='모집완료' ? 'viewCount' : ''}`} style={{color: "black"}}
                      onClick={() => setSort("viewCount")}>
                        {t('study.조회수순')}
                    </button>
                </li>
              </ul>   
    
              {token && (
                <button onClick={() => navigate("/post/new?type=study")} className={styles.write}>
                  <FaPencilAlt />
                    {t('study.writePost')}
                </button>
              )}
            </div>
            <ul className={styles.study_list}>
              {
                boardList.map((i) => (
                  <StudyListCard data={i} key={i.postId}/>
                ))
              }
            </ul>
            <div className={styles.boardList_footer}>
                  <Pagination
                      page={currentPage+1}
                      count={pageCount} size="large"
                      onChange={(e, value) => {
                          // window.location.href = `/?page=${value-1}`;
                          changePage(value-1);
                      }}
                      showFirstButton showLastButton
                  />
              </div>
          </div>
        </div>

        
        <div className={styles.right_side} >
          <div className={styles.pop_tags}>
            <PopTag/>
          </div>
          <div className={styles.ranking_container}>
            <RankingPost />
          </div>
        </div>
      </div>
    </Layout>

    
  )
}