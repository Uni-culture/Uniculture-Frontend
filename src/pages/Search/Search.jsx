import React, {useEffect, useState, useRef, useCallback} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "../Search/search.css";
import { IoSearch, IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { SearchCard } from "../../components/SearchCard/SearchCard";
import moment from "moment";

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(""); // 사용자 입력 검색어
    const [debouncedSearch, setDebouncedSearch] = useState(""); // API 호출에 사용될 검색어
    const [boardList, setBoardList] = useState([]);
    const [totalElements, setTotalElenets] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
    const [hasMore, setHasMore] = useState(true); // 데이터가 더 있는지 여부
    const observer = useRef();
    const pageSize = 2; // 페이지 당 항목 수

    // 사용자 입력 처리
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // IoArrowBack 클릭 시 이전 경로로 이동
    const goBackToPreviousPath = () => {
        const previousPath = location.state?.from || "/";
        navigate(previousPath);
    };

    const fetchSearchData = async (page) => {
        setIsLoading(true); // 데이터 로딩 시작
        try {
            const response = await axios.get(`/api/post/search?title=${search}&page=${page}&size=${pageSize}`);
            if (response.status === 200) {
                console.log("받아온 게시물: ", response.data.content);
                setBoardList(prevBoardList => [...prevBoardList, ...response.data.content]); // 기존 목록에 추가
                setTotalElenets(response.data.totalElements);
                setIsLoading(false); // 데이터 로딩 완료
                setHasMore((page * pageSize) < response.data.totalElements);
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
            setTotalElenets(0);
            fetchSearchData(0);
        } else {
            // debouncedSearch가 비어있을 경우, 목록과 총 항목 수 초기화
            setBoardList([]);
            setTotalElenets(0);
        }
    }, [debouncedSearch]);

    // currentPage가 변경될 때마다 추가 데이터 로딩
    useEffect(() => {
        if (currentPage > 0) {
            fetchSearchData(currentPage);
        }
    }, [currentPage]);

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
                <div className="searchWrap">
                    <IoSearch className="input-icon" />
                    <input className="search-bar" type="text" value={search} onChange={handleSearchChange} placeholder="검색어를 입력하세요"/>
                </div>
                <div className="total-elements">총 <b>{totalElements}개</b>의 포스트를 찾았습니다.</div>

                <div className="boardList-wrapper">
                    <div className="boardList-body">
                        {boardList.map((post, index) => {
                            const key = `${post.postId}-${index}`; // 고유한 key 생성
                            if (boardList.length === index + 1) {
                                return <div ref={lastBoardElementRef} key={post.postId}> {/* 마지막 요소에 ref 할당 */}
                                    <SearchCard
                                        board_id={post.postId}
                                        title={post.title}
                                        content={post.content}
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
