import React, {useEffect, useState, useRef, useCallback} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "../Search/search.css";
import { IoSearch, IoArrowBack } from "react-icons/io5";
import { HiOutlineHashtag } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import axios from "axios";
import { SearchCard } from "../../components/SearchCard/SearchCard";
import moment from "moment";

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(""); // 사용자 입력 검색어
    const [debouncedSearch, setDebouncedSearch] = useState(""); // API 호출에 사용될 검색어
    const [tag, setTag] = useState(""); // 사용자 입력 태그
    const [tags, setTags] = useState([]); // 입력된 태그들을 저장할 배열
    const [boardList, setBoardList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
    const [hasMore, setHasMore] = useState(true); // 데이터가 더 있는지 여부
    const observer = useRef();
    const pageSize = 3; // 페이지 당 항목 수

    // 사용자 입력 처리
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // 사용자 태그 처리
    const handleTagChange = (e) => {
        const noSpaces = e.target.value.replace(/\s+/g, '');
        console.log('Updated tags:', noSpaces);
        setTag(noSpaces);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 엔터키 기본 동작 방지
            const trimmedTag = tag.trim();
            console.log("trimmedTag: ", trimmedTag);

            if (trimmedTag !== "" && !tags.includes(trimmedTag)) {
                const newTags = [...tags, trimmedTag]; // 태그 배열에 현재 태그 추가
                setTags(newTags); // 상태 업데이트
                searchData(0, newTags); // 업데이트된 태그 배열을 searchData에 전달
            }
            setTag(""); // 입력 필드 초기화
        } else if (e.key === 'Backspace' && tag === "") {
            // 아무것도 입력하지 않은 상태에서 backspace를 누를 경우 가장 최근에 추가된 태그 삭제
            const newTags = tags.slice(0, tags.length - 1);
            setTags(newTags);
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleReset = () => {
        setSearch(""); // 검색어 초기화
        setTag(""); // 현재 입력 중인 태그 초기화
        setTags([]); // 태그 배열 초기화
    };

    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/";
        navigate(previousPath);
    };

    // 게시물 검색 요청
    const searchData = async (page, newTags = tags) => {
        setIsLoading(true); // 데이터 로딩 시작
        let url = `/api/post/search?page=${page}&size=${pageSize}&category=NORMAL`;

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

        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                console.log("태그 배열 내용: ", newTags);
                console.log("tags.length: ", newTags.length);
                console.log("url: ", url);
                console.log("받아온 게시물: ", response.data);
                // setBoardList(prevBoardList => [...prevBoardList, ...response.data.content]); // 기존 목록에 추가
                setBoardList(response.data.content);
                setTotalElements(response.data.totalElements);
                console.log("총 게시물 개수: ", totalElements);
                setIsLoading(false); // 데이터 로딩 완료
                setHasMore(((page+1) * pageSize) < response.data.totalElements);
                console.log("api 요청하였습니다.");
            }
        } catch (error) {
            if(error.response.status === 401) {
                console.log("401 오류");
                setIsLoading(false); // 에러 발생 시 로딩 상태 해제
            }
            else {
                console.log("서버 오류 입니다.");
                setIsLoading(false); // 에러 발생 시 로딩 상태 해제
            }
        }
    };

    // debounce를 위한 useEffect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000); // 사용자 입력이 멈춘 후 1초 뒤에 실행

        return () => {
            clearTimeout(handler); // timeout 취소
        };
    }, [search]);

    // debouncedSearch가 변경될 때마다 검색 실행
    useEffect(() => {
        if (debouncedSearch) { // debouncedSearch가 비어있지 않다면
            setCurrentPage(0); // 페이지 처음부터 시작
            setBoardList([]); // 검색 결과 목록을 초기화
            setTotalElements(0);
            searchData(0);
        } else {
            // debouncedSearch가 비어있을 경우, 목록과 총 항목 수 초기화
            setBoardList([]);
            setTotalElements(0);
        }
    }, [debouncedSearch]);

    /*useEffect(() => {
        console.log(currentPage);
        console.log(isLoading);
        console.log(hasMore);

        if (currentPage > 0 && !isLoading && hasMore) {
            searchData(currentPage);
        }
    }, [currentPage, isLoading, hasMore]);*/
    useEffect(() => {
        console.log(currentPage);
        console.log(isLoading);
        console.log(hasMore);

        if (currentPage > 0 && hasMore) {
            searchData(currentPage);
        }
    }, [currentPage, hasMore]);

    // 마지막 요소를 관찰할 대상으로 설정
    const lastBoardElementRef = useCallback(node => {
        if (isLoading || !hasMore) return; // 로딩 중이거나 데이터가 더 없으면 관찰하지 않음
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setCurrentPage(prevPageNumber => prevPageNumber + 1); // 현재 페이지 번호 업데이트
            }
        });
        if (node) observer.current.observe(node); // 관찰 대상 설정
    }, [isLoading, hasMore]);

    return (
        <div style={{ backgroundColor: '#FBFBF3', minHeight: '100vh' }}>
            <Header />
            <IoArrowBack style={{ fontSize: '25px', marginTop: '20px', marginLeft: '20px'}} onClick={goBackToPreviousPath}/>
            <div className="search-layout">
                <div className="search-container">
                    <div className="searchWrap">
                        <IoSearch className="input-icon" />
                        <input className="search-input" type="text" value={search} onChange={handleSearchChange} placeholder="검색어를 입력하세요"/>
                    </div>
                    <button className="search-button" onClick={() => searchData(0)}>검색</button>
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
                        <input className="tag-input" type="text" value={tag} onChange={handleTagChange} onKeyDown={handleKeyDown} placeholder="태그로 검색해보세요!"/>
                    </div>
                    <button className="reset-button" onClick={handleReset}><GrPowerReset className="reset-icon"/>초기화</button>
                </div>
                <div className="total-elements">총 <b>{totalElements}개</b>의 포스트를 찾았습니다.</div>

                <div className="boardList-wrapper">
                    <div className="boardList-body">
                        {boardList && boardList.map((post, index) => {
                            const key = `${post.postId}-${index}`; // 고유한 key 생성
                            if (boardList.length === index + 1) { //현재 요소가 배열의 마지막 요소임을 의미
                                return <div ref={lastBoardElementRef} key={post.postId}> {/* 마지막 요소에 ref 할당 */}
                                    <SearchCard
                                        board_id={post.postId}
                                        title={post.title}
                                        content={post.content}
                                        hashtag={post.tags}
                                        username={post.writerName}
                                        date={moment(post.createDate).add(9, "hours").format('YYYY년 MM월 DD일')}
                                        likeCount={post.likeCount}
                                    />
                                </div>
                            } else {
                                return <SearchCard key={key}
                                    board_id={post.postId}
                                    title={post.title}
                                    content={post.content}
                                    hashtag={post.tags}
                                    username={post.writerName}
                                    date={moment(post.createDate).add(9, "hours").format('YYYY년 MM월 DD일')}
                                    likeCount={post.likeCount}
                                />
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
